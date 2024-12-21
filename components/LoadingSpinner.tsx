export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      <span className="ml-3 text-gray-700 dark:text-gray-300">
        Detecting location...
      </span>
    </div>
  );
} 