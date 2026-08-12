import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BookmarkManagementPage from "@/pages/BookmarkManagementPage";
import IncorrectRetryPage from "@/pages/IncorrectRetryPage";
import LoginPage from "@/pages/LoginPage";
import QuestionExplorerPage from "@/pages/QuestionExplorerPage";
import QuizPage from "@/pages/QuizPage";
import QuizTestPage from "@/pages/QuizTestPage";
import ScenarioInterviewPage from "@/pages/ScenarioInterviewPage";
import SignupPage from "@/pages/SignupPage";
import WorkbookPage from "@/pages/WorkbookPage";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/test" element={<QuizTestPage />} />
        <Route path="/questions" element={<QuestionExplorerPage />} />
        <Route path="/bookmarks" element={<BookmarkManagementPage />} />
        <Route path="/retry" element={<IncorrectRetryPage />} />
        <Route path="/workbook" element={<WorkbookPage />} />
        <Route path="/interview" element={<ScenarioInterviewPage />} />
        <Route path="/stats" element={<QuizPage />} />
        <Route path="*" element={<Navigate to="/quiz" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
