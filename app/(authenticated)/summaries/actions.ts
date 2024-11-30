"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSummary(formData: FormData) {
    const id = formData.get("id")?.toString();
    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();

    if (!id || !title || !content) {
        return;
    }

    const updateSummaryToDatabase = await prisma.summaries.update({
        where: {
          id,
        },
        data: {
          title: title,
          content: content
        }
    });

    console.log("UPDATED DATABASE", updateSummaryToDatabase);

    revalidatePath("/summaries/" + updateSummaryToDatabase.id);
    
    return {
        success: true,
        data: updateSummaryToDatabase,
        error: null
    };
}

export async function archiveSummary(formData: FormData) {
    try {
        const summaryId = formData.get("id")?.toString();
        if (!summaryId) {
            return;
        }

        await prisma.summaries.update({
            where: {
                id: summaryId,
            },
            data: {
                archived: true
            }
        });
    
    } catch (error) {
      console.log("Error " + error)
    }
    redirect("/summaries");
}