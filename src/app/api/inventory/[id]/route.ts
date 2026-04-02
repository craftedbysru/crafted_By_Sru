import { NextResponse } from "next/server";
import * as inventoryService from "@/services/inventoryService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await inventoryService.getProductById(id);
  if (item) return NextResponse.json(item);
  return new NextResponse("Not found", { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  await inventoryService.updateProduct(id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await inventoryService.deleteProduct(id);
  return NextResponse.json({ success: true });
}
