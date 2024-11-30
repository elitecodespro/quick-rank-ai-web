import prisma from "@/lib/prisma";
import { QuizCard } from "./quiz-card";
import { notFound } from "next/navigation";

interface ParamsProps {
  params: {
    id: string;
  };
}

export default async function QuizCardRoute(props: Readonly<ParamsProps>) {
  const params = await props?.params;

  const { id } = params;

  const quiz = await prisma.quiz.findUnique({
    where: {
      id: id,
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });

  if (!quiz) {
    return notFound();
  }

  return <QuizCard quiz={quiz} />;
}