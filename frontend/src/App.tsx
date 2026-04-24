import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useGetProfileQuery } from "./store/api/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/slices/authSlice";
const LoginPage = lazy(() => import("./features/auth/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/RegisterPage"));
const BudgetPage = lazy(() => import("./features/budget/BudgetPage"));
const AlertsPage = lazy(() => import("./features/alerts/AlertsPage"));
const AIAssistantPage = lazy(() => import("./features/ai/AIAssistantPage"));
const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage"));
const NotFoundPage = lazy(() => import("./features/error/NotFoundPage"));
const ExpensesPage = lazy(() => import("./features/expenses/ExpensesPage"));
export const PageLoader = () => (
  <div className="flex h-full items-center justify-center">
    <div className="flex flex-col justify-center items-center h-[100vh] w-[100vw]">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);
const App = () => {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (data?.user) dispatch(setCredentials(data.user));
  }, [data, dispatch]);

  if (isLoading) return <PageLoader />;

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <ExpensesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <BudgetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <AlertsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AIAssistantPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid rgba(125, 133, 144, 0.2)",
            borderRadius: "16px",
          },
        }}
      />
    </Router>
  );
};

export default App;
