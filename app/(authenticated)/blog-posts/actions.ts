"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateBlogPost(formData: FormData) {
    const id = formData.get("id")?.toString();
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();

    if (!id || !title || !content) {
        return;
    }

    const updateBlogPostToDatabase = await prisma.posts.update({
        where: {
          id,
        },
        data: {
          title: title,
          content: content
        }
    });

    console.log("UPDATED DATABASE", updateBlogPostToDatabase);

    revalidatePath("/blog-posts/" + updateBlogPostToDatabase.id);
    
    return {
        success: true,
        data: updateBlogPostToDatabase,
        error: null
    };
}

export async function archiveBlogPost(formData: FormData) {
    try {
        const postId = formData.get("id")?.toString();
        if (!postId) {
            return;
        }

        await prisma.posts.update({
            where: {
                id: postId,
            },
            data: {
                archived: true
            }
        });
    
    } catch (error) {
      console.log("Error " + error)
    }
    redirect("/blog-posts");
}