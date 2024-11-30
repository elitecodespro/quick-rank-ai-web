import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import QuizWrapper from "./quiz-wrapper";

const Quizzespage = async () => {
    const user = await currentUser();

    if (!user || !user?.primaryEmailAddress?.emailAddress) {
        return redirect("/sign-in");
    }

    const quizzes = await prisma.quiz.findMany({
        where: {
          userId: user.id,
        },
        include: {
          questions: true,
        },
    });

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                <QuizWrapper quizzes={quizzes && quizzes} />
            </div>
        </div>
    )
}

export default Quizzespage