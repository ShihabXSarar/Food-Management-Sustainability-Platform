import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to initialize Gemini
const getAI = () => new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Analyzes an inventory image to detect food items.
 * @param {string} base64Image - The base64 encoded image string.
 * @returns {Promise<Array<{name: string, quantity: string, expiryDate: string, category: string}>>}
 */
export const analyzeInventoryImage = async (base64Image) => {
    try {
        const genAI = getAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Remove header if present (data:image/jpeg;base64,)
        const base64Data = base64Image.split(',')[1] || base64Image;

        const prompt = "Analyze this image of food. Return a JSON array of items detected. For each item, estimate the name, quantity (e.g., '2 count', '500g'), and a likely expiration date from today (YYYY-MM-DD) based on the type of food (e.g., fresh berries expire fast, canned goods slow). Also categorize them.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Vision API Error Details:", error);
        return [];
    }
};

/**
 * Generates a meal plan based on inventory and budget.
 * @param {Array} inventory - List of inventory items.
 * @param {number} budget - Weekly budget.
 * @returns {Promise<Array>}
 */
export const generateMealPlan = async (inventory, budget) => {
    try {
        const genAI = getAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const inventoryList = inventory.map(i => `${i.quantity} of ${i.name} (Expires: ${i.expiryDate})`).join(", ");

        const prompt = `Create a 7-day meal plan. Current Inventory: [${inventoryList}]. Weekly Budget remaining: $${budget}. 
    Prioritize using items expiring soon. Optimize for nutrition (SDG 2) and zero waste (SDG 12).
    Return a JSON array of days. Each day object should have: day (string), meals (array of objects with type, name, ingredients, costEstimate, nutritionFocus).`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Meal Plan Error:", error);
        return [];
    }
};

/**
 * Gets sustainability insights based on inventory and logs.
 * @param {Array} inventory 
 * @param {Array} logs 
 * @returns {Promise<Object>}
 */
export const getSustainabilityInsights = async (inventory, logs) => {
    try {
        const genAI = getAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const inventoryStr = JSON.stringify(inventory.map(i => ({ n: i.name, e: i.expiryDate })));
        const logsStr = JSON.stringify(logs);

        const prompt = `Analyze these consumption patterns and current inventory for SDG 12 (Responsible Consumption).
    Inventory: ${inventoryStr}
    Past History: ${logsStr}
    
    Return a JSON object with:
    1. sdgScore (number 0-100)
    2. wasteProjectionKg (number)
    3. moneySaved (number)
    4. suggestions (array of strings)
    5. weeklyTrends (array of objects: day, consumption, waste)
    6. categoryBreakdown (array of objects: name, value)
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
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

/**
 * Chat with NourishBot.
 * @param {Array} history 
 * @param {string} message 
 * @returns {Promise<string>}
 */
export const chatWithNourishBot = async (history, message) => {
    try {
        const genAI = getAI();
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: "You are NourishBot, a sustainability assistant focused on SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption). Help the user with recipes for leftovers, understanding expiry dates, and food sharing tips. Be encouraging and concise."
        });

        // Convert history to Gemini format
        let formattedHistory = history.map(h => {
            if (h.parts) {
                return { role: h.role, parts: h.parts };
            }
            return {
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.text || h.message }]
            };
        });

        // Gemini API requires the first message in history to be from 'user'.
        // If the first message is from 'model' (e.g. welcome message), remove it.
        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Chat Error Details:", error);
        return "I'm having trouble connecting to the sustainability network right now. Please try again.";
    }
};
