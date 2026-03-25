import type { ReactNode } from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  action?: ReactNode;
}

export default function ErrorMessage({ message, onRetry, action }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <div className="text-red-600 mb-2">
        <svg
          className="w-8 h-8 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <p className="text-red-800 font-medium">{message}</p>
      {action ? (
        <div className="mt-3">{action}</div>
      ) : onRetry ? (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors hover:cursor-pointer"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
