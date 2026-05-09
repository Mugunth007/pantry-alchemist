import { MongoClient } from "mongodb";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const uri = process.env.MONGODB_URI;
const apiKey = process.env.GEMINI_API_KEY;

if (!uri || !apiKey) {
  console.error("Missing MONGODB_URI or GEMINI_API_KEY in .env.local");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const client = new MongoClient(uri);

const sampleRecipes = [
  {
    name: "Spicy Garlic Butter Chicken",
    description: "A quick, high-protein dinner packed with flavor. Uses chicken breast, garlic, butter, and chili flakes.",
    ingredients: ["chicken", "garlic", "butter", "chili flakes"],
    tags: ["high-protein", "spicy", "dinner"]
  },
  {
    name: "Classic Tomato Basil Pasta",
    description: "Simple and elegant pasta dish. Uses spaghetti, crushed tomatoes, fresh basil, and parmesan.",
    ingredients: ["pasta", "tomatoes", "basil", "parmesan"],
    tags: ["vegetarian", "dinner", "italian"]
  },
  {
    name: "Egg & Spinach Breakfast Bowl",
    description: "Healthy low-carb start to the day. Uses eggs, fresh spinach, and feta cheese.",
    ingredients: ["eggs", "spinach", "feta"],
    tags: ["breakfast", "low-carb", "healthy"]
  }
];

async function generateEmbedding(text: string) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });
  return response.embeddings[0].values;
}

async function run() {
  try {
    await client.connect();
    const db = client.db("pantry_alchemist");
    const collection = db.collection("recipes");

    console.log("Clearing existing recipes...");
    await collection.deleteMany({});

    console.log("Generating embeddings and inserting recipes...");
    for (const recipe of sampleRecipes) {
      // Create a rich text string to embed
      const textToEmbed = `${recipe.name}. ${recipe.description} Ingredients: ${recipe.ingredients.join(", ")}. Tags: ${recipe.tags.join(", ")}`;
      const embedding = await generateEmbedding(textToEmbed);
      
      await collection.insertOne({
        ...recipe,
        embedding
      });
      console.log(`Inserted: ${recipe.name}`);
    }

    console.log("Done! Make sure you create a Vector Search Index in MongoDB Atlas on the 'recipes' collection.");
    console.log(`
Index Definition JSON:
{
  "fields": [
    {
      "numDimensions": 3072,
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    }
  ]
}
    `);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
