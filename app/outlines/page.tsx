import { createClient } from "@/utils/supabase/server";
import OutlinesList from "@/components/OutlinesList";
import { AlertCircle } from "lucide-react";

interface Outline {
  id: string;
  title: string;
  created_at: string;
  content: {
    thesis: string;
    points: string[];
  };
}

export default async function OutlinesPage() {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
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
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to view your outlines.
          </p>
          <a
            href="/login"
            className="inline-flex justify-center items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const { data: outlines, error } = await supabase
    .from("outlines")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-white dark:bg-black">
        <div className="w-full max-w-md p-6 bg-white dark:bg-black rounded-md border border-gray-200 dark:border-gray-800 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-black dark:text-white" />
            </div>
          </div>
          <h1 className="text-xl font-semibold text-black dark:text-white mb-2">
            Error Loading Outlines
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black">
      <OutlinesList outlines={outlines as Outline[]} />
    </div>
  );
}
