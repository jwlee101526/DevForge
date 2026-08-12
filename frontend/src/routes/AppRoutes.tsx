import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import QuizPage from "@/pages/QuizPage";
import QuizTestPage from "@/pages/QuizTestPage";
import SignupPage from "@/pages/SignupPage";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/test" element={<QuizTestPage />} />
        <Route path="*" element={<Navigate to="/quiz" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
