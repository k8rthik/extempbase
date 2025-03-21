import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req) {
  // Create a server-side Supabase client
  const supabase = await createClient();

  // Get the current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse the JSON payload
  const { title, thesis, points } = await req.json();

  const content = {
    thesis,
    points,
  };

  // Insert a new outline; store the thesis as the content
  const { data, error } = await supabase
    .from("outlines")
    .insert({
      user_id: session.user.id,
      title,
      content,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
