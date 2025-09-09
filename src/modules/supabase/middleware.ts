import { TimeBasedCache } from "@/lib/memchache";
import { NextResponse, type NextRequest } from "next/server";
import type { Tables } from "./types";
import { createClient } from "./server";

let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let cache = new TimeBasedCache<string, Tables<"profiles">>(
  1000 * 60 * 10 /* 10 minutes */,
);

function isAdmin(role: string) {
  return role === "admin";
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  let pathname = request.nextUrl.pathname;
  let isAuthPage = pathname.startsWith("/auth");
  let skipAuthCheckPages = ["/", "/about"];

  supabaseResponse.headers.set("x-pathname", pathname);

  let skippedPages = skipAuthCheckPages.some((p) => p === pathname);
  let isNewsPage = pathname.startsWith("/news");
  let isAspirationPage =
    pathname.startsWith("/aspiration") && !pathname.endsWith("/new");

  let isPublicPage = skippedPages || isNewsPage || isAspirationPage;

  if (isPublicPage) return supabaseResponse;

  if (!supabaseAnonKey || !supabaseUrl) {
    throw new Error("Missing Supabase credentials");
  }

  let supabase = await createClient();

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: Don't remove getClaims()
  let { data } = await supabase.auth.getClaims();

  let claims = data?.claims;

  if (!claims && !isAuthPage) {
    // no user, potentially respond by redirecting the user to the login page
    let url = request.nextUrl.clone();
    let from = encodeURIComponent(request.nextUrl.pathname);
    url.pathname = "/auth/signin";
    if (from) {
      url.searchParams.set("from", from);
    }
    cache.clear();
    return NextResponse.redirect(url);
  }

  let sessionId = claims?.session_id ?? "";
  let user = cache.get(sessionId);

  if (!user) {
    let userQuery = await supabase.auth.getUser();

    if (userQuery.error) return supabaseResponse;

    let profileQuery = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userQuery.data.user.id)
      .maybeSingle();

    if (!profileQuery.data) return supabaseResponse;

    cache.set(sessionId, profileQuery.data);
    user = profileQuery.data;
    return supabaseResponse;
  }

  const isUserAdmin = isAdmin(user.role);

  if (isAuthPage) {
    let url = request.nextUrl.clone();
    let newPathname = isAdmin(user.role) ? "/admin" : "/";
    url.pathname = newPathname;
    return NextResponse.redirect(url);
  }

  let isAdminPage = pathname.startsWith("/admin");

  if (isUserAdmin) {
    if (pathname.includes("/aspiration/new")) {
      let url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  if (!isUserAdmin && isAdminPage) {
    let url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    let myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
