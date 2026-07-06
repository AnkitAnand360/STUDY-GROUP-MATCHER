function Loader({ variant = "spinner", count = 3, className = "" }) {
  if (variant === "spinner") {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Skeleton variant
  const baseSkeletonClass =
    "bg-gray-200 dark:bg-gray-700/80 animate-pulse rounded-lg";

  if (variant === "card") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="p-6 border border-gray-150 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className={`${baseSkeletonClass} w-12 h-12 rounded-full`}></div>
              <div className="space-y-2 flex-1">
                <div className={`${baseSkeletonClass} h-4 w-1/2`}></div>
                <div className={`${baseSkeletonClass} h-3 w-1/3`}></div>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className={`${baseSkeletonClass} h-3.5 w-full`}></div>
              <div className={`${baseSkeletonClass} h-3.5 w-5/6`}></div>
            </div>
            <div className="flex gap-2 pt-2 justify-end">
              <div className={`${baseSkeletonClass} h-9 w-24`}></div>
              <div className={`${baseSkeletonClass} h-9 w-24`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 rounded-xl"
          >
            <div className={`${baseSkeletonClass} w-5 h-5 rounded`}></div>
            <div className="flex-1 space-y-2">
              <div className={`${baseSkeletonClass} h-4.5 w-2/3`}></div>
              <div className={`${baseSkeletonClass} h-3 w-1/4`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // default to text lines
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={`${baseSkeletonClass} h-4 w-full`}></div>
      ))}
    </div>
  );
}

export default Loader;
