import { createClient } from "@/utils/supabase/server";
import Dashboard from "@/components/dashboard"; // Assuming the Dashboard component is in the components directory
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <main className="flex-1 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <Dashboard />
      </main>
    </>
  );
}
