import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyToken } from "@/lib/jwt";
import { ServiceFactory } from "@/services";

const createUserSchema = z.object({
  firstName: z.string().min(1, "firstName zorunludur"),
  lastName: z.string().min(1, "lastName zorunludur"),
  email: z.string().email("email gecersiz"),
  age: z.coerce.number().int().min(1, "age gecersiz"),
  password: z.string().min(6, "password en az 6 karakter olmali"),
});

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Gecersiz veri";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const userService = ServiceFactory.createUserService();
    const user = await userService.createUser(parsed.data);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "email zaten kayitli") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("Create user error:", error);
    return NextResponse.json({ error: "Sunucu hatasi" }, { status: 500 });
  }
}
