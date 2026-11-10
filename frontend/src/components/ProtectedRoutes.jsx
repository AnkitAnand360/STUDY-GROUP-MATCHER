import { Navigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white overflow-x-hidden relative select-none transition-colors duration-200">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 w-full lg:pl-64 pt-6 pb-20 lg:pb-8 min-h-screen overflow-x-hidden">
          <div className="p-4 md:p-8 max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProtectedRoute;