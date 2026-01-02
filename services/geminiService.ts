
import { GoogleGenAI } from "@google/genai";

/**
 * Ask AI tutor a question about a specific subject.
 * Following strictly the Google GenAI SDK guidelines for instance initialization.
 */
export const askAiTutor = async (question: string, subject: string): Promise<string> => {
  // Always use a new GoogleGenAI instance with process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Generate content using the model name and prompt directly in generateContent
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful and encouraging school tutor for Indonesian students. 
      The student is asking about the subject: ${subject}.
      Question: ${question}
      
      Keep the answer concise, easy to understand, and encouraging. Use Bahasa Indonesia mixed with English terms where appropriate for education.`,
    });
    
    // Access the text property directly (not a method call)
    return response.text || "Sorry, I couldn't generate an answer right now.";
  } catch (error) {
    console.error("AI Error:", error);
    return "I am having trouble connecting to the knowledge base right now.";
  }
};
