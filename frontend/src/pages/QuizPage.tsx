import React from "react";
import { Header } from "@/components/common/Header";
import { QuizContainer } from "@/features/quiz";

export const QuizPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        <QuizContainer />
      </main>
    </div>
  );
};

export default QuizPage;
