"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { validateYouTubeLink } from "@/utils/chapters/validations";
import { extractYouTubeID } from "@/lib/utils";
import { generateBlogPostWithOpenAI } from "@/utils/blogposts/openai";
import { revalidatePath } from "next/cache";
import axios from "axios";

type GenerateBlogPostResponse = {
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

export async function generateBlogPost(
  formData: FormData
): Promise<GenerateBlogPostResponse> {

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
    videoTranscript = response.data.transcript;
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

  const openAiBlogPost = await generateBlogPostWithOpenAI(videoTranscript);

  console.log("OPENAI BLOG POST", openAiBlogPost);
  

  if (!openAiBlogPost) {
    return {
      success: false,
      error: "openai_issue",
    };
  }

  const saveBlogPostToDatabase = await prisma.posts.create({
    data: {
      title: `Blog post for video: ${videoId}`,
      content: openAiBlogPost,
      user_id: userDB.id,
      videoId: videoId,
    },
  });

  console.log("SAVED TO DATABASE", saveBlogPostToDatabase);
  

  revalidatePath("/blog-posts/" + saveBlogPostToDatabase.id);
    
  return {
    success: true,
    data: saveBlogPostToDatabase,
  };

}