import React from "react";
import { QuizContainer } from "@/features/quiz";

export const QuizPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-6xl py-6">
        <QuizContainer />
      </main>
    </div>
  );
};

export default QuizPage;
