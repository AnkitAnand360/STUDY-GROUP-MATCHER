import { motion } from "framer-motion";
import Button from "./Button";

function EmptyState({
  icon = "🔍",
  title = "No results found",
  description = "Try adjusting your filters or search terms.",
  actionText,
  onActionClick,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 ${className}`}
    >
      <div className="text-5xl mb-4 select-none animate-bounce duration-1000">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-550 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onActionClick && (
        <Button variant="primary" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </motion.div>
  );
}

export default EmptyState;
