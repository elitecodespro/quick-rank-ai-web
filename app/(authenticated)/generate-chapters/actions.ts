"use server";

import prisma from "@/lib/prisma";
import { extractYouTubeID } from "@/lib/utils";
import { generateChaptersWithOpenAI } from "@/utils/chapters/openai";
import { validateYouTubeLink } from "@/utils/chapters/validations";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { revalidatePath } from "next/cache";

type GenerateChaptersResponse = {
    success: boolean;
    error?: string;
    data?: {
      title: string;
      content: string[];
      userId: string;
      id: string;
      createdAt: Date;
    };
};

export async function generateChapters(
    formData: FormData
): Promise<GenerateChaptersResponse> {
    
    const user = await currentUser();

    const userDB = await prisma.user.findFirst({
        where: {
          email: user?.primaryEmailAddress?.emailAddress,
        },
    });
    
    if (!userDB) {
        return {
          success: false,
          error: "user_not_found",
        };
    }

    const link = formData.get("link") as string;

    if (!link) {
        return { success: false, error: "link_required" };
    }

    if (!(await validateYouTubeLink(link))) {
        return { success: false, error: "invalid_youtube_link" };
    }

    const videoId = await extractYouTubeID(link);

    if (!videoId) {
        return {
          success: false,
          error: "failed_to_get_video_id",
        };
    }

    //const url = `https://deserving-harmony-9f5ca04daf.strapiapp.com/utilai/yt-transcript/${videoId}`;

    let videoTranscript;

    try {
        const options = {
            method: 'GET',
            url: 'https://youtube-transcript3.p.rapidapi.com/api/transcript-with-url',
            params: {
              url: `https://www.youtube.com/watch?v=${videoId}`,
              flat_text: 'true',
              lang: 'en'
            },
            headers: {
              'x-rapidapi-key': process.env.RAPID_API_KEY!,
              'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com'
            }
          };

        const response = await axios.request(options);
        videoTranscript = response.data.transcript
        // const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        // videoTranscript = transcript.map((item) => item.text)
        // .join(' ')
        // .trim();

        console.log("TRANSCRIPT TEXT FOR TESTING", videoTranscript);
        // const transcript = await fetch(url);
        // videoTranscript = await transcript.text();
        // console.log("TRANSCRIPT DATA", transcript);
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            success: false,
            error: "video_issue",
        };
    }

    if (!videoTranscript) {
        return {
        success: false,
        error: "subtitles_issue",
        };
    }

    const openAiChapters = await generateChaptersWithOpenAI(videoTranscript);

    console.log("OPENAI CHAPTERS", openAiChapters);

    if (!openAiChapters) {
        return {
            success: false,
            error: "openai_issue",
        };
    }

    const saveChaptersToDatabase = await prisma.chapterSet.create({
        data: {
          title: `Chapters for video: ${videoId}`,
          content: openAiChapters,
          videoId: videoId,
          userId: userDB.id,
        },
    });
    
    revalidatePath("/chapters");
    
    return {
        success: true,
        data: saveChaptersToDatabase,
    };
}