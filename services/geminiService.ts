
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Recipe } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const scanFoodForAllergies = async (base64Image: string, userAllergies: string[]) => {
  const ai = getAI();
  const prompt = `Analisis gambar makanan atau bahan ini. 
  1. Daftar bahan-bahan yang teridentifikasi.
  2. Pengguna memiliki alergi berikut: ${userAllergies.join(', ')}.
  3. Identifikasi jika ada bahan yang berbahaya bagi pengguna.
  Kembalikan dalam objek JSON dengan: 
  - ingredients (array string)
  - containsAllergens (boolean)
  - allergenDetails (string deskripsi bahaya jika ada)
  Gunakan Bahasa Indonesia.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          containsAllergens: { type: Type.BOOLEAN },
          allergenDetails: { type: Type.STRING }
        },
        required: ["ingredients", "containsAllergens", "allergenDetails"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const detailedFoodAnalysis = async (base64Image: string, userAllergies: string[]) => {
  const ai = getAI();
  const prompt = `Identifikasi makanan dalam gambar ini. Berikan laporan detail dalam Bahasa Indonesia.
  Prioritaskan identifikasi masakan khas Indonesia jika relevan.
  Pertimbangkan profil alergi pengguna: ${userAllergies.join(', ')}.
  Sertakan: 
  1. Nama hidangan atau bahan utama.
  2. Peringatan alergi (jika ada).
  3. Resep sehat Indonesia untuk hidangan ini (bebas dari alergi tersebut).
  4. Estimasi jumlah kalori per porsi.
  5. Tips sehat khusus untuk hidangan ini.
  Kembalikan dalam format JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishName: { type: Type.STRING },
          containsAllergens: { type: Type.BOOLEAN },
          allergenDetails: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          healthTips: { type: Type.ARRAY, items: { type: Type.STRING } },
          recipe: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
              cookingTime: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["title", "ingredients", "instructions", "cookingTime", "difficulty"]
          }
        },
        required: ["dishName", "containsAllergens", "allergenDetails", "calories", "healthTips", "recipe"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateRecipes = async (pantryItems: string[], userAllergies: string[]) => {
  const ai = getAI();
  const prompt = `Berdasarkan stok bahan dapur ini: ${pantryItems.join(', ')}. 
  Sarankan 3 resep masakan khas Indonesia yang lezat dan sehat, namun WAJIB mengecualikan bahan pemicu alergi ini: ${userAllergies.join(', ')}.
  Gunakan nama masakan populer seperti Nasi Goreng, Soto, Rendang, Gado-gado, dll jika bahan cocok.
  Kembalikan hasilnya dalam array objek JSON dalam Bahasa Indonesia.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            cookingTime: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          },
          required: ["id", "title", "description", "ingredients", "instructions", "cookingTime", "difficulty"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const askChef = async (question: string, context: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Anda adalah Chef CulinAI, asisten dapur ahli masakan Indonesia yang ramah. Gunakan konteks: ${context}. Jawab pertanyaan ini dalam Bahasa Indonesia: ${question}`,
  });
  return response.text;
};
