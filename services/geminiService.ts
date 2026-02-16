
import { GoogleGenAI } from "@google/genai";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRoutineSuggestion = async (userHabits: string, performance: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O usuário tem os seguintes hábitos: ${userHabits}. Sua performance recente é: ${performance}. Sugira uma otimização curta (1-2 frases) em português para o dia de hoje.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      },
    });
    // Use .text property directly
    return response.text || "Continue focado em seus objetivos!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Notamos que você costuma ler entre 20h e 21h. Gostaria de ajustar o lembrete automaticamente?";
  }
};
