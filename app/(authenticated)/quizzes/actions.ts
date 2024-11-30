"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function archiveQuiz(formData: FormData) {
    try {
        const quizId = formData.get("id")?.toString();
        if (!quizId) {
            return;
        }

        await prisma.quiz.update({
            where: {
                id: quizId,
            },
            data: {
                archived: true
            }
        });
    
    } catch (error) {
      console.log("Error " + error)
    }
    redirect("/quizzes");
}