import { motion } from "framer-motion";

function Card({
  children,
  className = "",
  hoverable = true,
  onClick,
  animate = true,
  glowColor = "none", // none, purple, cyan, blue
  ...props
}) {
  const CardComponent = onClick ? motion.button : motion.div;

  const glowClasses = {
    none: "",
    purple: "purple-glow-border",
    cyan: "cyan-glow-border",
    blue: "blue-glow-border",
  };

  const baseStyles =
    "glass-panel rounded-[24px] shadow-sm overflow-hidden text-left p-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full";

  const hoverStyles =
    hoverable && onClick
      ? `hover:shadow-lg cursor-pointer ${glowClasses[glowColor]}`
      : hoverable
      ? `hover:shadow-lg ${glowClasses[glowColor]}`
      : "";

  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35, ease: "easeOut" },
        whileHover: hoverable ? { y: -2 } : {},
        whileTap: onClick ? { scale: 0.99 } : {},
      }
    : {};

  return (
    <CardComponent
      onClick={onClick}
      className={`${baseStyles} ${hoverStyles} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
}

export default Card;
