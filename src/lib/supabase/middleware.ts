import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Routes that require authentication
  // /org/join is intentionally excluded: it shows a "log in to accept" prompt itself
  const protectedPaths = ["/wizard", "/library", "/rate", "/profile", "/onboarding", "/org/create", "/org/admin"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  // /api/orgs routes also require auth (handled in each route handler, but middleware adds a fast path)
  // /api/org-invites/lookup is intentionally public (token-gated)
  const isProtectedApi =
    pathname.startsWith("/api/orgs") ||
    pathname === "/api/org-invites/accept";

  // If not authed and on a protected route -> /login
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // For protected API routes, return 401 early (belt-and-suspenders; route handlers also check)
  if (!user && isProtectedApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // /org/admin role enforcement is handled in the page server component
  // (src/app/org/admin/page.tsx calls getMyOrgMembership() via admin client
  // and redirects non-admins). Doing it here via the anon client is redundant
  // and unreliable due to RLS on organization_members.

  // Redirect logged-in users away from login/register
  const authPaths = ["/login", "/register"];
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (user && isAuthPage) {
    // We'll let the onboarding check below handle redirection;
    // for now just push them past auth pages. The onboarding gating
    // is handled in the layout/page via getMyProfile() to avoid
    // extra DB round-trips in every middleware call for non-auth pages.
    const url = request.nextUrl.clone();
    url.pathname = "/wizard/step-1";
    return NextResponse.redirect(url);
  }

  // Onboarding gating for authenticated users on protected (non-API) routes
  if (user && isProtected && !pathname.startsWith("/api")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subject, grade_level")
      .eq("id", user.id)
      .single();

    const onboardingComplete =
      profile &&
      typeof profile.subject === "string" &&
      profile.subject.trim().length > 0 &&
      typeof profile.grade_level === "string" &&
      profile.grade_level.trim().length > 0;

    // If onboarding is NOT complete and they aren't already on /onboarding -> redirect
    if (!onboardingComplete && !pathname.startsWith("/onboarding")) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    // If onboarding IS complete and they try to go to /onboarding -> redirect away
    if (onboardingComplete && pathname.startsWith("/onboarding")) {
      const url = request.nextUrl.clone();
      url.pathname = "/wizard/step-1";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

