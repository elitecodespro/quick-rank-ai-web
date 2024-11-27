"use server";
import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BlogSchema = z.object({
  posts: z.string(),
});

export async function generateBlogPostWithOpenAI(
    parsedTranscript: string
): Promise<string | null> {
  try {
    const response = await client.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "You are a skilled content writer that converts audio transcriptions into well-structured, engaging blog posts in Markdown format. Create a comprehensive blog post with a catchy title, introduction, main body with multiple sections, and a conclusion. Analyze the user's writing style from the posts and emulate the tone and style in the new post. Keep the tone casual and professional.",
        },
        {
          role: "user",
          content: `
            Please convert the following transcription into a well-structured blog post using Markdown formatting. Follow this structure:
                1. Start with a SEO friendly catchy title on the first line.
                2. Add two newlines after the title.
                3. Write an engaging introduction paragraph.
                4. Create multiple sections for the main content, using appropriate headings (##, ###).
                5. Include relevant subheadings within sections if needed.
                6. Use bullet points or numbered lists where appropriate.
                7. Add a conclusion paragraph at the end.
                8. Ensure the content is informative, well-organized, and easy to read.
                9. Emulate my writing style, tone, and any recurring patterns you notice from my previous posts.
            Here's the transcription to convert: ${parsedTranscript}
           `,
        },
      ],
      response_format: zodResponseFormat(BlogSchema, "BlogSchema"),
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
