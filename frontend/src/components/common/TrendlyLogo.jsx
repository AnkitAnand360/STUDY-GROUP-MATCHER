import { Link } from "react-router-dom";

function TrendlyLogo({
  className = "",
  textClassName = "",
  iconSize = "w-8 h-8",
  svgSize = "w-4 h-4",
  showText = true,
  to = "/",
}) {
  const content = (
    <div className={`flex items-center gap-2.5 select-none group ${className}`}>
      {/* Minimal monochrome emblem that automatically adapts to the theme */}
      <div
        className={`${iconSize} rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center transition-all duration-200 shrink-0 group-hover:scale-105 shadow-sm`}
        title="AI Study Matcher"
      >
        <svg
          className={svgSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Minimalist modern study nodes mark */}
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h7" />
          <circle cx="16" cy="14" r="1.75" fill="currentColor" />
        </svg>
      </div>
      {showText && (
        <span
          className={`text-xl font-heading font-bold tracking-tight text-black dark:text-white transition-colors duration-200 ${textClassName}`}
        >
          AI Study Matcher
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

export default TrendlyLogo;
