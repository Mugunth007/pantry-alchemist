"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Package, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  
  // Hardcoded for the hackathon MVP, could be fetched from MongoDB
  const inventory = [
    { item: "Chicken Breast", quantity: "2 lbs" },
    { item: "Eggs", quantity: "1 dozen" },
    { item: "Spinach", quantity: "1 bag" },
    { item: "Pasta", quantity: "1 box" }
  ];

  const shoppingList = [
    { item: "Milk" },
    { item: "Butter" }
  ];

  const recipes = [
    {
      name: "Spicy Garlic Butter Chicken",
      image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800",
      description: "A quick, high-protein dinner packed with flavor.",
      tags: ["high-protein", "spicy", "dinner"]
    },
    {
      name: "Classic Tomato Basil Pasta",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800",
      description: "Simple and elegant pasta dish.",
      tags: ["vegetarian", "dinner", "italian"]
    },
    {
      name: "Egg & Spinach Breakfast Bowl",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800",
      description: "Healthy low-carb start to the day.",
      tags: ["breakfast", "low-carb", "healthy"]
    }
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/signin");
    }
  }, [status]);

  if (status === "loading") return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-[800px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        <h1 className="text-3xl font-bold text-white mb-8">Your Kitchen Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inventory Panel */}
          <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Current Inventory</h2>
            </div>
            <div className="space-y-3">
              {inventory.map((inv, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-neutral-950/50 border border-white/5">
                  <span className="text-neutral-200">{inv.item}</span>
                  <span className="text-neutral-400 text-sm">{inv.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shopping List Panel */}
          <div className="bg-neutral-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Shopping List</h2>
            </div>
            <div className="space-y-3">
              {shoppingList.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-neutral-950/50 border border-white/5">
                  <span className="text-neutral-200">{item.item}</span>
                  <div className="w-4 h-4 rounded border border-neutral-600" />
                </div>
              ))}
            </div>
          </div>

          {/* AI Stats Panel */}
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md border border-blue-500/20 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <Sparkles className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">3 Recipes</h3>
            <p className="text-blue-200/80">Discovered from your pantry items by Gemini 3.</p>
          </div>
        </div>

        {/* Recipe Recommendations */}
        <h2 className="text-2xl font-bold text-white mt-12 mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          Recommended for you
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe, idx) => (
            <div key={idx} className="bg-neutral-900/50 border border-white/10 rounded-2xl overflow-hidden group">
              <div className="relative h-48 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {recipe.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2">{recipe.name}</h3>
                <p className="text-neutral-400 text-sm">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
