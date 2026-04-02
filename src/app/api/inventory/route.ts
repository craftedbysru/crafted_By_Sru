import { NextResponse } from "next/server";
import * as inventoryService from "@/services/inventoryService";

export async function GET() {
  const inventory = await inventoryService.getInventory();
  return NextResponse.json(inventory);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newItem = await inventoryService.addProduct(body);
  return NextResponse.json(newItem, { status: 201 });
}
