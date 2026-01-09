
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { Recipe, DietaryPreference } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';

export const generateRecipe = async (
  ingredients: string, 
  dietaryPreference: DietaryPreference
): Promise<Recipe> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Act as a creative world-class chef. 
    I have these ingredients: ${ingredients}.
    Dietary Preference: ${dietaryPreference === DietaryPreference.NONE ? 'None' : dietaryPreference}.
    
    1. Suggest a creative and delicious meal name.
    2. List exact measurements for the ingredients provided and basic pantry staples (salt, oil, pepper, water) if needed.
    3. Give clear step-by-step cooking instructions.
    4. Provide one "Chef's Tip" to make the dish even better.
    5. Keep the tone fun and encouraging.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          measurements: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          chefTips: { type: Type.STRING }
        },
        required: ["title", "measurements", "instructions", "chefTips"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as Recipe;
};

export const analyzeIngredientsImage = async (base64Image: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "List all the food items and ingredients you see in this image. Return only a comma-separated list of ingredients." }
      ]
    }
  });

  return (response.text || '').split(',').map(item => item.trim());
};

export const createChefChat = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: "You are 'The Leftover Chef', a friendly and knowledgeable culinary assistant. Help users with cooking questions, ingredient substitutions, and kitchen advice. Keep your answers concise, encouraging, and focused on food.",
    }
  });
};
