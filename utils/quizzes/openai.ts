"use server";

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
  
const quizSchema = z.object({
    questions: z.array(
      z.object({
        question: z.string(),
        answers: z.array(
          z.object({
            text: z.string(),
            correct: z.boolean(),
          })
        ),
      })
    ),
});

export async function generateQuizeWithOpenAI(parsedTranscript: string){
    try {
        const response = await client.beta.chat.completions.parse({
          model: "gpt-4o-2024-08-06",
          response_format: zodResponseFormat(quizSchema, "quiz-structure"),
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant that generates multiple choice quizzes. For each question, provide exactly 4 possible answers, with exactly one correct answer.",
            },
            {
              role: "user",
              content: `Generate a quiz using this youtube transcript: ${parsedTranscript}. Understand the context and generate question the areas where it will be most usefull and valuable. Include 10 multiple choice questions. For each question, provide 4 answers and mark which one is correct.`,
            },
          ],
        });

        if (!response.choices[0].message.parsed) {
            throw new Error("No parsed message in the response");
        }

        return response.choices[0].message.parsed;
    } catch (error) {
        console.error(error);
        return null;
    }
}