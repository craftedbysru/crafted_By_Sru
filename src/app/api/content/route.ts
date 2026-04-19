import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { CMS_DEFAULTS } from "@/lib/cms-defaults";
import { withDbRetry } from "@/lib/db-retry";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    
    const query: any = {};
    if (page) query.page = page;

    const dbContentResult = await withDbRetry(() => prisma.websiteContent.findMany({
      where: query,
      orderBy: { displayOrder: "asc" }
    }));
    
    const dbContent = dbContentResult as any[];

  // If page is specified, merge DB content with defaults for that page
  if (page) {
    const pageDefaults = CMS_DEFAULTS[page] || [];
    const mergedContent = [...dbContent];
    
    pageDefaults.forEach(def => {
      const exists = dbContent.find(db => db.section === def.section);
      if (!exists) {
        mergedContent.push({ ...def, id: `default-${page}-${def.section}`, page });
      }
    });
    
    // Final sort by displayOrder
    mergedContent.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    
    return NextResponse.json(mergedContent);
  }

  // If no page specified, merge DB content with all defaults (DB takes priority)
  const allContent = [...dbContent];
  Object.entries(CMS_DEFAULTS).forEach(([p, sections]) => {
    sections.forEach(s => {
      const exists = dbContent.find(db => db.page === p && db.section === s.section);
      if (!exists) {
        allContent.push({ ...s, id: `default-${p}-${s.section}`, page: p });
      }
    });
  });

  allContent.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  return NextResponse.json(allContent);
  } catch (error: any) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Failed to fetch content", details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || ((session.user as any).role !== "admin" && (session.user as any).role !== "merchant")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { page, section, content, displayOrder } = await request.json();
    const userId = (session.user as any).id;
    
    // RLS-aware client
    const rlsClient = prisma.$withUser(userId);
    
    const updatedContent = await withDbRetry(() => rlsClient.websiteContent.upsert({
      where: {
        page_section: { page, section }
      },
      update: { 
        content,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined
      },
      create: { 
        page, 
        section, 
        content,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : 0
      },
    }));
    
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Failed to update content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || ((session.user as any).role !== "admin" && (session.user as any).role !== "merchant")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { page, section } = await request.json();
    const userId = (session.user as any).id;
    
    // RLS-aware client
    const rlsClient = prisma.$withUser(userId);

    await withDbRetry(() => rlsClient.websiteContent.delete({
      where: {
        page_section: { page, section }
      }
    }));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete content" }, { status: 400 });
  }
}
