// middleware.ts
import { NextResponse } from "next/server"; // ✅ Correct import
import type { NextRequest } from "next/server"; // ✅ Correct import
import { createServerClient } from "@supabase/ssr";

// Define public routes that don't require authentication
const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/auth/callback",
];

// Middleware function
export async function middleware(req: NextRequest) {
  const res = NextResponse.next(); // ✅ No more error here!

  // Create a Supabase client using createServerClient
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set(name, value, options);
        },
        remove: (name, options) => {
          res.cookies.delete(name);
        },
      },
    },
  );

  // Get the current pathname
  const { pathname } = req.nextUrl;

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route,
  );

  // Get user session from Supabase
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If not authenticated and accessing a protected route, redirect to sign-in
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return res;
}

// Configure matcher to run middleware on appropriate routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
