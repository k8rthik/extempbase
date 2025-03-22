// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Define public routes that don't require authentication
const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/auth/callback",
  // Add any other public routes
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client using the newer ssr package
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

  // Get the pathname from the URL
  const { pathname } = req.nextUrl;

  // Check if the current path is in the public routes
  const isPublicRoute = publicRoutes.some(
    (route) => pathname.startsWith(route) || pathname === route,
  );

  // If it's a public route, allow access without auth check
  if (isPublicRoute) {
    return res;
  }

  // For all other routes, check authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If not authenticated and trying to access a protected route, redirect to sign-in
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all routes except static files, api routes, and some special Next.js paths
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
