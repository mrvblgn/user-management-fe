import { NextRequest, NextResponse } from "next/server";
import { ServiceFactory } from "@/services";

export async function POST(request: NextRequest) {
  try {
    // Request body'den email ve password'ü al
    const body = await request.json();
    const { email, password } = body;

    // Gerekli alanları doğrula
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // AuthService'i factory'den al
    const authService = ServiceFactory.createAuthService();

    // Login işlemini gerçekleştir
    const { token, user } = await authService.login(email, password);

    // Başarılı response oluştur
    const response = NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    );

    // JWT token'ı httpOnly cookie'ye ayarla
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 saat
    });

    return response;
  } catch (error) {
    // Invalid credentials hatası
    if (error instanceof Error && error.message === "Invalid credentials") {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Diğer hatalar
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
