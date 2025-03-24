import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { GoogleGenerativeAI } from "@google/generative-ai";

function parseOutline(responseText: string) {
  const lines = responseText.split("\n").filter((line) => line.trim() !== "");

  let thesis = "";
  const points: string[] = [];

  lines.forEach((line, index) => {
    if (index === 0) {
      thesis = line; // Assume first line is the thesis
    } else {
      points.push(line);
    }
  });

  return { thesis, points };
}

// Main POST handler for generating the outline
export async function POST(req: Request) {
  const res = NextResponse.next();

  try {
    // Create Supabase client using createServerClient
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) =>
            req.headers
              .get("cookie")
              ?.match(new RegExp(`${name}=([^;]*)`))?.[1],
          set: (name, value, options) => {
            res.headers.append(
              "Set-Cookie",
              `${name}=${value}; Path=${options.path || "/"}; HttpOnly; Secure; SameSite=${options.sameSite || "Lax"}`,
            );
          },
          remove: (name, options) => {
            res.headers.append(
              "Set-Cookie",
              `${name}=; Path=${options.path || "/"}; HttpOnly; Secure; SameSite=${options.sameSite || "Lax"}; Max-Age=0`,
            );
          },
        },
      },
    );

    // Get user session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      console.error("Unauthorized access attempt:", sessionError?.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the incoming request body
    const { question } = await req.json();
    const prompt = `
    I need a well-structured outline for the following question: "${question}"
      Format the response as a JSON object with:
      {
        "thesis": "Your thesis statement here",
        "points": ["Main point 1", "Main point 2", "Main point 3"],
      }

      

      Only return valid JSON.
  `;

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate AI content
    const result = await model.generateContent(prompt);

    // Handle potential errors in API response
    if (!result || !result.response) {
      console.error("Error: No response from Gemini API.");
      return NextResponse.json(
        { error: "Failed to generate outline from Gemini API" },
        { status: 500 },
      );
    }

    const responseText = await result.response.text();

    // Parse AI response to extract thesis and points
    const outlineContent = parseOutline(responseText);

    if (!outlineContent.thesis || !outlineContent.points?.length) {
      console.error("Error: Invalid outline format generated by AI.");
      return NextResponse.json(
        { error: "Invalid outline generated" },
        { status: 500 },
      );
    }

    // Save outline to Supabase
    const { data, error } = await supabase
      .from("outlines")
      .insert([
        {
          user_id: session.user.id,
          title: question,
          content: outlineContent, // { thesis, points }
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting outline:", error.message);
      return NextResponse.json(
        { error: "Failed to save outline" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Error in generate-outline route:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to generate outline" },
      { status: 500 },
    );
  }
}
