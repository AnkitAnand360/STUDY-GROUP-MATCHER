import { Navigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import Navbar from "../layout/Navbar";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-x-hidden relative grid-bg">
      {/* Aurora floating gradient blobs */}
      <div className="aurora-bg">
        <div className="aurora-blob-1"></div>
        <div className="aurora-blob-2"></div>
      </div>

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 w-full lg:pl-64 pt-[57px] lg:pt-0 min-h-screen overflow-x-hidden">
          <div className="p-4 md:p-8 max-w-6xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProtectedRoute;