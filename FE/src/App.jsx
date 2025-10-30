import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuizList from "./pages/QuizList";
import QuizDetail from "./pages/QuizDetail";
import QuestionList from "./pages/QuestionList";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<QuizList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/quiz/:quizId" element={<QuizDetail />} />

          {/* User routes - CRUD Questions */}
          <Route
            path="/questions"
            element={<ProtectedRoute><QuestionList /></ProtectedRoute>}
          />

          {/* Admin routes - Manage users */}
          <Route
            path="/users"
            element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
