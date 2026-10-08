import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/prisma/client";
import { registerSchema } from "@/app/ValidationSchemas";

export async function POST(req: Request) {
  const body = await req.json();
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(result.error.format(), { status: 400 });
  }

  const { name, email, password } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    throw e;
  }
}
