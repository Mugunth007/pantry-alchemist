import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import clientPromise from "@/lib/mongodb";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The MongoDB tools our agent will use
const getInventoryDeclaration = {
  name: "get_inventory",
  description: "Get the current list of items in the user's pantry.",
  parameters: {
    type: "OBJECT",
    properties: {},
  },
};

const updateInventoryDeclaration = {
  name: "update_inventory",
  description: "Add, update, or remove an item in the user's pantry inventory.",
  parameters: {
    type: "OBJECT",
    properties: {
      item: { type: "STRING", description: "Name of the item (e.g., 'Eggs', 'Chicken')" },
      quantity: { type: "STRING", description: "Quantity of the item (e.g., '1 dozen', '2 lbs', '0' to remove)" },
    },
    required: ["item", "quantity"],
  },
};

const addToShoppingListDeclaration = {
  name: "add_to_shopping_list",
  description: "Add an item to the user's shopping list.",
  parameters: {
    type: "OBJECT",
    properties: {
      item: { type: "STRING", description: "Name of the item to add to the shopping list" },
    },
    required: ["item"],
  },
};

const searchRecipesDeclaration = {
  name: "search_recipes",
  description: "Search the database for recipes based on dietary preferences, available ingredients, or mood using semantic vector search.",
  parameters: {
    type: "OBJECT",
    properties: {
      query: { type: "STRING", description: "The semantic search query, e.g. 'high protein spicy chicken' or 'low carb breakfast'" },
    },
    required: ["query"],
  },
};

export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();

    const client = await clientPromise;
    const db = client.db("pantry_alchemist");

    // Initialize the chat session with tools
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are the Pantry Alchemist, an intelligent culinary assistant. You help users manage their pantry inventory and discover recipes. Use the provided tools to check inventory, update it when they buy/use things, search for recipes, and add missing ingredients to their shopping list.",
        tools: [{
          functionDeclarations: [
            getInventoryDeclaration,
            updateInventoryDeclaration,
            addToShoppingListDeclaration,
            searchRecipesDeclaration
          ]
        }]
      }
    });

    let response = await chat.sendMessage({ message });

    // Handle tool calls loop
    while (response.functionCalls && response.functionCalls.length > 0) {
      const toolResults = [];

      for (const call of response.functionCalls) {
        const args = call.args as any;
        let result;

        if (call.name === "get_inventory") {
          const inventory = await db.collection("inventory").find({}).toArray();
          result = { items: inventory.map(i => ({ item: i.item, quantity: i.quantity })) };
        } else if (call.name === "update_inventory") {
          await db.collection("inventory").updateOne(
            { item: args.item },
            { $set: { item: args.item, quantity: args.quantity } },
            { upsert: true }
          );
          if (args.quantity === "0") {
             await db.collection("inventory").deleteOne({ item: args.item });
          }
          result = { success: true, message: `Updated ${args.item} to ${args.quantity}` };
        } else if (call.name === "add_to_shopping_list") {
          await db.collection("shopping_list").updateOne(
            { item: args.item },
            { $set: { item: args.item, status: 'pending' } },
            { upsert: true }
          );
          result = { success: true, message: `Added ${args.item} to shopping list` };
        } else if (call.name === "search_recipes") {
          // 1. Generate embedding for query
          const embedRes = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: args.query,
          });
          const queryEmbedding = embedRes.embeddings[0].values;
          
          // 2. Perform Vector Search in MongoDB
          // Note: Requires a vector index named 'vector_index' on 'recipes' collection
          const recipes = await db.collection("recipes").aggregate([
            {
              "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": queryEmbedding,
                "numCandidates": 10,
                "limit": 3
              }
            },
            {
              "$project": { "embedding": 0, "_id": 0 }
            }
          ]).toArray();
          
          result = { recipes };
        }

        toolResults.push({
          name: call.name,
          response: result
        });
      }

      // Send tool results back to the model
      response = await chat.sendMessage(toolResults);
    }

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Agent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
