"use server";

import prisma from "@/lib/prisma";
import { extractYouTubeID } from "@/lib/utils";
import { generateChaptersWithOpenAI } from "@/utils/chapters/openai";
import { parseXMLContent } from "@/utils/chapters/parsing";
import { validateYouTubeLink } from "@/utils/chapters/validations";
import { getVideoDetails, getVideoIdFromLink, getVideoTranscript } from "@/utils/chapters/youtube";
import { currentUser } from "@clerk/nextjs/server";
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

    const url = `https://deserving-harmony-9f5ca04daf.strapiapp.com/utilai/yt-transcript/${videoId}`;

    let videoTranscript;

    try {
        const transcript = await fetch(url);
        videoTranscript = await transcript.text();
        console.log("TRANSCRIPT DATA", transcript);
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