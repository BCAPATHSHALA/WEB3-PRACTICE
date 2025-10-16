import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if wallet is unlocked (session-based check)
  const isUnlocked = request.cookies.get("wallet_unlocked")?.value === "true";
  const hasVault = request.cookies.get("wallet_vault_exists")?.value === "true";

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/onboarding"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Protected routes that require authentication
  const protectedRoutes = ["/wallet"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If accessing protected route without being unlocked
  if (isProtectedRoute && !isUnlocked) {
    // If no vault exists, redirect to onboarding
    if (!hasVault) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    // If vault exists but not unlocked, redirect to unlock
    return NextResponse.redirect(new URL("/onboarding/unlock", request.url));
  }

  // If accessing onboarding while already unlocked, redirect to wallet
  if (pathname.startsWith("/onboarding") && isUnlocked) {
    return NextResponse.redirect(new URL("/wallet", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
