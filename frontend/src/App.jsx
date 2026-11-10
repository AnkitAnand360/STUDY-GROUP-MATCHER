import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Profile from "./pages/profile";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import StuddyPlanner from "./pages/StuddyPlanner";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoutes";
import { ThemeProvider } from "./context/ThemeContext";

function MainLayout() {
  const location = useLocation();
  const isDashboardRoute = [
    "/dashboard",
    "/matches",
    "/planner",
    "/profile",
    "/settings",
  ].some((path) => location.pathname.startsWith(path)) || location.pathname.startsWith("/chat");

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-200">
      {!isDashboardRoute && <Navbar />}

      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/planner"
            element={
              <ProtectedRoute>
                <StuddyPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:groupId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isDashboardRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;