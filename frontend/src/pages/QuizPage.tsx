import React from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import { QuizContainer } from "@/features/quiz";

export const QuizPage: React.FC = () => {
  return (
    <AppSidebar>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <QuizContainer />
      </div>
    </AppSidebar>
  );
};

export default QuizPage;
