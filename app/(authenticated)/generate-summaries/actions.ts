"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { validateYouTubeLink } from "@/utils/chapters/validations";
import { extractYouTubeID } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { generateSummaryWithOpenAI } from "@/utils/summaries/openai";

type GenerateSummaryResponse = {
  success: boolean;
  error?: string;
  data?: {
    title: string;
    content: string;
    user_id: string;
    id: string;
    videoId: string,
    createdAt: Date;
  };
};

export async function generateSummary(
  formData: FormData
): Promise<GenerateSummaryResponse> {

  const { userId } = await auth();

  const userDB = await prisma.user.findFirst({
      where: {
        clerkId: userId,
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

  const openAiSummary = await generateSummaryWithOpenAI(videoTranscript);

  console.log("OPENAI SUMMARY", openAiSummary);
  

  if (!openAiSummary) {
    return {
      success: false,
      error: "openai_issue",
    };
  }

  const saveSummaryToDatabase = await prisma.summaries.create({
    data: {
      title: `Summary for video: ${videoId}`,
      content: openAiSummary,
      user_id: userDB.id,
      videoId: videoId,
    },
  });

  console.log("SAVED TO DATABASE", saveSummaryToDatabase);
  

  revalidatePath("/summaries/" + saveSummaryToDatabase.id);
    
  return {
    success: true,
    data: saveSummaryToDatabase,
  };

}