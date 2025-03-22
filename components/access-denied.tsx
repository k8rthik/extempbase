import { AlertCircle } from "lucide-react";

interface AccessDeniedProps {
  message?: string;
  buttonText?: string;
  buttonHref?: string;
}

export default function AccessDenied({
  message = "You need to be signed in to access this page.",
  buttonText = "Sign In",
  buttonHref = "/sign-in",
}: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white dark:bg-black">
      <div className="w-full max-w-md p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-black dark:text-white" />
          </div>
        </div>
        <h1 className="text-xl font-semibold text-black dark:text-white mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <a
          href={buttonHref}
          className="inline-flex justify-center items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}
