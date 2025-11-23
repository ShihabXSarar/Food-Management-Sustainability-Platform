import { createWorker } from 'tesseract.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const getAI = () => new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Extracts text from an image using Tesseract.js (v6 compatible)
 * @param {string} imagePath - URL or base64 string of the image
 * @returns {Promise<string>} - Extracted text
 */
export const extractTextFromImage = async (imagePath) => {
    let worker = null;
    try {
        console.log("Initializing Tesseract Worker...");
        // Tesseract.js v6: createWorker is async and takes language directly
        worker = await createWorker('eng');

        console.log("Recognizing text...");
        const ret = await worker.recognize(imagePath);
        console.log("OCR Complete. Confidence:", ret.data.confidence);

        await worker.terminate();
        return ret.data.text;
    } catch (error) {
        console.error("OCR Error Details:", error);
        if (worker) {
            try { await worker.terminate(); } catch (e) { console.error("Worker termination failed:", e); }
        }
        throw new Error("Failed to extract text from image: " + error.message);
    }
};

/**
 * Parses raw receipt text into structured inventory items using Gemini.
 * @param {string} text - Raw text from OCR
 * @returns {Promise<Array>} - Structured items
 */
export const parseReceiptText = async (text) => {
    try {
        const genAI = getAI();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Extract food items from this receipt text. Return a JSON array.
        Receipt Text:
        "${text}"
        
        For each item, extract:
        - name (string)
        - quantity (string, e.g. "1", "500g")
        - expiryDate (string, YYYY-MM-DD, estimate based on food type, default to 7 days from now if unknown)
        - category (string)
        
        Return ONLY valid JSON array.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return jsonStr ? JSON.parse(jsonStr) : [];
    } catch (error) {
        console.error("Receipt Parsing Error:", error);
        return [];
    }
};
