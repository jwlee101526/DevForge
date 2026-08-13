import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BookmarkManagementPage from "@/pages/BookmarkManagementPage";
import CustomQuestionCreatePage from "@/pages/CustomQuestionCreatePage";
import IncorrectRetryPage from "@/pages/IncorrectRetryPage";
import LandingPage from "@/pages/LandingPage";
import LearningReportPage from "@/pages/LearningReportPage";
import LoginPage from "@/pages/LoginPage";
import QuestionExplorerPage from "@/pages/QuestionExplorerPage";
import QuizPage from "@/pages/QuizPage";
import QuizTestPage from "@/pages/QuizTestPage";
import ScenarioInterviewPage from "@/pages/ScenarioInterviewPage";
import SparringPage from "@/pages/SparringPage";
import SignupPage from "@/pages/SignupPage";
import SocialAuthCallbackPage from "@/pages/SocialAuthCallbackPage";
import WorkbookPage from "@/pages/WorkbookPage";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/social/callback" element={<SocialAuthCallbackPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/test" element={<QuizTestPage />} />
        <Route path="/questions" element={<QuestionExplorerPage />} />
        <Route path="/questions/create" element={<CustomQuestionCreatePage />} />
        <Route path="/bookmarks" element={<BookmarkManagementPage />} />
        <Route path="/retry" element={<IncorrectRetryPage />} />
        <Route path="/workbook" element={<WorkbookPage />} />
        <Route path="/interview" element={<ScenarioInterviewPage />} />
        <Route path="/sparring" element={<SparringPage />} />
        <Route path="/stats" element={<LearningReportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
