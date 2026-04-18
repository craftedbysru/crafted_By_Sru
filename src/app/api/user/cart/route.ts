import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any)?.id;
  const rlsClient = prisma.$withUser(userId);

  const user = await rlsClient.user.findUnique({
    where: { id: userId },
    select: { cart: true }
  });

  return NextResponse.json(user?.cart || []);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cart } = await request.json();
  const userId = (session.user as any).id;
  const rlsClient = prisma.$withUser(userId);

  await rlsClient.user.update({
    where: { id: userId },
    data: { cart }
  });

  return NextResponse.json({ success: true });
}
