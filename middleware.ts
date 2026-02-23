import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Korunan rotalar
const protectedRoutes = ["/dashboard", "/api/users"];

// Public rotalar (korumasız)
const publicRoutes = ["/"];

// Auth rotaları (login, logout) - token kontrolü yapılmayan
const authRoutes = ["/api/auth/login", "/api/auth/logout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cookie'den token'ı al
  const token = request.cookies.get("token")?.value;

  // Token varsa decode et
  let isTokenValid = false;
  if (token) {
    try {
      verifyToken(token);
      isTokenValid = true;
    } catch {
      isTokenValid = false;
    }
  }

  // 1. Login sayfasında ve geçerli token varsa -> dashboard'a yönlendir
  if (pathname === "/" && isTokenValid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Login sayfasında ve token yoksa -> login'de kal (izin ver)
  if (pathname === "/" && !isTokenValid) {
    return NextResponse.next();
  }

  // 3. Korunan rotalar -> token zorunlu
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isTokenValid) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 4. Auth API rotaları -> her zaman izin ver
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 5. Diğer rotalar -> izin ver
  return NextResponse.next();
}

// Middleware'in çalışacağı rotalar
export const config = {
  matcher: [
    // Tüm rotalar hariç
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
