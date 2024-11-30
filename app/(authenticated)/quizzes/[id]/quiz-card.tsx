"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Answer, Question, Quiz as QuizType } from "@prisma/client";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useState } from "react";
import { archiveQuiz } from "../actions";

interface QuizWithRelations extends QuizType {
    questions: (Question & {
      answers: Answer[];
    })[];
}

export function QuizCard({
    quiz,
    className,
  }: {
    readonly quiz: QuizWithRelations;
    readonly className?: string;
  }) {

    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [incorrectAnswers, setIncorrectAnswers] = useState<
        { question: string; userAnswer: string; correctAnswer: string }[]
    >([]);

    const questions = quiz.questions;

    const handleAnswer = () => {
        if (selectedAnswer !== null) {
          const isCorrect =
            questions[currentQuestion].answers[selectedAnswer].correct;
          if (isCorrect) {
            setScore(score + 1);
          } else {
            const correctAnswer =
              questions[currentQuestion].answers.find((a) => a.correct)?.text || "";
            setIncorrectAnswers([
              ...incorrectAnswers,
              {
                question: questions[currentQuestion].text,
                userAnswer: questions[currentQuestion].answers[selectedAnswer].text,
                correctAnswer,
              },
            ]);
          }
    
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
          } else {
            setShowResults(true);
          }
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowResults(false);
        setSelectedAnswer(null);
        setIncorrectAnswers([]);
    };

    return (
        <Card className={cn("mb-8 relative h-auto", className)}>
            <CardHeader> 
                <CardTitle>
                    <div className="text-2xl font-bold mb-2">🎓Quiz Time</div>
                    <p className="text-gray-600">Test your knowledge!</p>
                </CardTitle>
            </CardHeader>

            <CardContent>
                <AnimatePresence mode="wait">
                    {!showResults ? (
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="py-4"
                    >
                        <h3 className="mb-4 text-xl font-medium">
                            Question {currentQuestion + 1} of {questions.length}
                        </h3>
                        <p className="mb-4">{questions[currentQuestion].text}</p>
                        <motion.div className="space-y-2">
                        {questions[currentQuestion].answers.map((answer, index) => (
                            <motion.div
                            key={index}
                            className={`p-3 px-5 rounded-lg text-gray-700 cursor-pointer transition-colors ${
                                selectedAnswer === index
                                ? "bg-blue-300 text-gray-800"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                            onClick={() => setSelectedAnswer(index)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            >
                            {answer.text}
                            </motion.div>
                        ))}
                        </motion.div>
                        <Button
                            disabled={selectedAnswer === null}
                            onClick={handleAnswer}
                            className="mt-4 w-full"
                        >
                            {currentQuestion < questions.length - 1 ? "Next ➡️" : "Finish 🏁"}
                        </Button>
                    </motion.div>
                    ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="py-4"
                    >
                        <h3 className="mb-4 text-lg font-medium">🎉 Quiz Results</h3>
                        <p className="mb-4">
                            You scored {score} out of {questions.length} questions correctly!
                        </p>
                        {incorrectAnswers.length > 0 && (
                            <div className="mt-6 space-y-4">
                                <h4 className="font-medium">Review incorrect Answers</h4>
                                {incorrectAnswers.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium text-gray-700">{item.question}</p>
                                    <p className="text-red-500">
                                        Your answer: {item.userAnswer}
                                    </p>
                                    <p className="text-green-500">
                                        Correct Answer: {item.correctAnswer}
                                    </p>
                                </div>
                                ))}
                            </div>
                        )}

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="text-center text-4xl my-4"
                        >
                        {score === questions.length
                            ? "🏆"
                            : score >= questions.length / 2
                            ? "👍"
                            : "💪"}
                        </motion.div>
                        <Button onClick={resetQuiz} className="w-full mt-4">
                            Try Again 🔄
                        </Button>
                    </motion.div>
                    )}
                </AnimatePresence>

                <form action={archiveQuiz}>
                    <input type="hidden" name="id" id='id' defaultValue={quiz.id} />
                    <DeleteButton className="absolute right-4 top-4 bg-red-700 hover:bg-red-600" />
                </form>
            </CardContent>

        </Card>
    )

}