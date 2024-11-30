"use server";

import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SummarySchema = z.object({
  posts: z.string(),
});

export async function generateSummaryWithOpenAI(
    parsedTranscript: string
): Promise<string | null> {
  try {
    const response = await client.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "You are a skilled content writer that converts audio transcriptions into well-structured, engaging youtube summaries in Markdown format.",
        },
        {
          role: "user",
          content: `
            For the this ${parsedTranscript} complete the following steps.
            Generate the title for based on the content provided
            Summarize the following content and include 5 key topics, writing in first person using normal tone of voice.
            
            Write a youtube video description
                - Include heading and sections.  
                - Incorporate keywords and key takeaways

            Generate bulleted list of key points and benefits

            Return possible and best recommended key words
           `,
        },
      ],
      response_format: zodResponseFormat(SummarySchema, "SummarySchema"),
    });

    if (!response.choices[0].message.parsed) {
      throw new Error("No parsed response");
    }

    return response.choices[0].message.parsed.posts;
  } catch (error) {
    console.error(error);
    return null;
  }
}
