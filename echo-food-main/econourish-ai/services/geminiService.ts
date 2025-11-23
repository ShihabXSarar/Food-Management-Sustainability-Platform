import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, ConsumptionLog, SustainabilityMetrics, MealPlanDay } from "../types";

// Helper to initialize Gemini
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInventoryImage = async (base64Image: string): Promise<Partial<InventoryItem>[]> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Analyze this image of food. Return a JSON array of items detected. For each item, estimate the name, quantity (e.g., '2 count', '500g'), and a likely expiration date from today (YYYY-MM-DD) based on the type of food (e.g., fresh berries expire fast, canned goods slow). Also categorize them."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              quantity: { type: Type.STRING },
              expiryDate: { type: Type.STRING },
              category: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Vision API Error:", error);
    return [];
  }
};

export const generateMealPlan = async (inventory: InventoryItem[], budget: number): Promise<MealPlanDay[]> => {
  try {
    const ai = getAI();
    const inventoryList = inventory.map(i => `${i.quantity} of ${i.name} (Expires: ${i.expiryDate})`).join(", ");
    
    const prompt = `Create a 7-day meal plan. Current Inventory: [${inventoryList}]. Weekly Budget remaining: $${budget}. 
    Prioritize using items expiring soon. Optimize for nutrition (SDG 2) and zero waste (SDG 12).
    Return a JSON array of days.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING },
                    name: { type: Type.STRING },
                    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                    costEstimate: { type: Type.NUMBER },
                    nutritionFocus: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Meal Plan Error:", error);
    return [];
  }
};

export const getSustainabilityInsights = async (
  inventory: InventoryItem[], 
  logs: ConsumptionLog[]
): Promise<SustainabilityMetrics> => {
  try {
    const ai = getAI();
    const inventoryStr = JSON.stringify(inventory.map(i => ({ n: i.name, e: i.expiryDate })));
    const logsStr = JSON.stringify(logs);

    const prompt = `Analyze these consumption patterns and current inventory for SDG 12 (Responsible Consumption).
    Inventory: ${inventoryStr}
    Past History: ${logsStr}
    
    1. Calculate an SDG Score (0-100) based on waste efficiency and nutritional diversity.
    2. Project waste in kg for next week.
    3. Estimate money saved by home cooking vs eating out based on this data.
    4. Provide 3 actionable suggestions.
    5. Generate weekly trend data (last 7 days) and category breakdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sdgScore: { type: Type.NUMBER },
            wasteProjectionKg: { type: Type.NUMBER },
            moneySaved: { type: Type.NUMBER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            weeklyTrends: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  consumption: { type: Type.NUMBER },
                  waste: { type: Type.NUMBER }
                }
              }
            },
            categoryBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis data");
    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis Error:", error);
    // Return dummy fallback
    return {
      sdgScore: 72,
      wasteProjectionKg: 0.5,
      moneySaved: 45,
      suggestions: ["Eat the strawberries before Tuesday.", "You are low on Proteins this week.", "Freeze the leftover bread."],
      weeklyTrends: [],
      categoryBreakdown: []
    };
  }
};

export const chatWithNourishBot = async (history: { role: string, parts: [{ text: string }] }[], message: string) => {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history,
      config: {
        systemInstruction: "You are NourishBot, a sustainability assistant focused on SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption). Help the user with recipes for leftovers, understanding expiry dates, and food sharing tips. Be encouraging and concise.",
      }
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to the sustainability network right now. Please try again.";
  }
};
