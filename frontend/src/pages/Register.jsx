import TrendlyAuthModal from "../components/auth/TrendlyAuthModal";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Register() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 relative z-10 font-sans">
      <div className="w-full max-w-[420px] mb-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <TrendlyAuthModal initialMode="register" />
    </div>
  );
}

export default Register;