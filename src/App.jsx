import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Settings, Book } from "lucide-react";
import Sidebar from "./components/shared/Sidebar";
import SidebarItem from "./components/shared/SidebarItem";

import BooksPage from "./pages/dashboard/BooksPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import { BookDetailPage } from "./pages/dashboard/components/BookDetail";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { AuthProvider, useAuth } from "./hooks/useAuth";

// Layout Components
const AuthLayout = ({ children }) => {
  return (
    <div className="flex w-screen justify-center items-center h-screen">
      {children}
    </div>
  );
};

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-y-hidden">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar>
          <SidebarItem
            icon={<Book size={20} />}
            text="Books List"
            to="/dashboard/books"
          />
          <SidebarItem
            icon={<Settings size={20} />}
            text="Settings"
            to="/dashboard/settings"
          />
        </Sidebar>
      </div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthLayout>
                <SignupPage />
              </AuthLayout>
            }
          />

          {/* Main Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute
                element={
                  <MainLayout>
                    <Routes>
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="books" element={<BooksPage />} />
                      <Route path="books/:id" element={<BookDetailPage />} />
                    </Routes>
                  </MainLayout>
                }
              />
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
