"use server";

import prisma from "@/lib/prisma";
import { extractYouTubeID } from "@/lib/utils";
import { validateYouTubeLink } from "@/utils/chapters/validations";
import { generateQuizeWithOpenAI } from "@/utils/quizzes/openai";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generateQuiz(formData: FormData){

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

    const openAiQuize = await generateQuizeWithOpenAI(videoTranscript);

    console.log("OPENAI QUIZE", openAiQuize);

    if (!openAiQuize) {
        return {
          success: false,
          error: "openai_issue",
        };
    }

    const saveQuizeToDatabase = await prisma.quiz.create({
        data: {
          topic: `Quiz for video: ${videoId}`,
          videoId: videoId,
          questions: {
            create: openAiQuize.questions.map((q) => ({
              text: q.question,
              answers: {
                create: q.answers.map((a) => ({
                  text: a.text,
                  correct: a.correct,
                })),
              },
            })),
          },
          userId: userDB.id,
        },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
    });

    console.log("SAVED TO DATABASE", saveQuizeToDatabase);

    revalidatePath("/summaries/" + saveQuizeToDatabase.id);

    return {
        success: true,
        data: saveQuizeToDatabase,
    };
}