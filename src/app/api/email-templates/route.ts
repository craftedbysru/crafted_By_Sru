import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "merchant") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const templates = await prisma.emailTemplate.findMany();
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "merchant") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { type, subject, body } = await request.json();
    const template = await prisma.emailTemplate.upsert({
      where: { type },
      update: { subject, body },
      create: { type, subject, body },
    });
    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save template" }, { status: 500 });
  }
}
