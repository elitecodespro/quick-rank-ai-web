"use server";
import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ChapterSchema = z.object({
  chapters: z.array(z.string()),
});

export async function generateChaptersWithOpenAI(
  parsedTranscript: string
): Promise<string[] | null> {
  try {
    const response = await client.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that generates chapters / timestamps for a video based on the transcript of a video.",
        },
        {
          role: "user",
          content: `Generate chapters / timestamps for a video.
                        Each timestamp / chapter should summarise a section of the video. Your job is to find the natural stopping points for the video 
                        based on the transcript. You MUST include timestamps in your response for each chapter. 
                        The timestamps should not exceed the length of the video. The timestamps should be in the following format: [00:00].
                        The transcript is as follows: ${parsedTranscript}
                    `,
        },
      ],
      response_format: zodResponseFormat(ChapterSchema, "ChapterSchema"),
    });

    if (!response.choices[0].message.parsed) {
      throw new Error("No parsed response");
    }

    return response.choices[0].message.parsed.chapters;
  } catch (error) {
    console.error(error);
    return null;
  }
}
