import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { auth } from "@/auth";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "video/ogg"
];

// Increased to 100MB. Direct R2/S3 uploads via signed URLs avoid body size limits.
const MAX_FILE_SIZE = 100 * 1024 * 1024; 

export async function GET(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");
  const fileType = searchParams.get("type");

  if (!fileName || !fileType) {
    return NextResponse.json({ error: "Missing file name or type" }, { status: 400 });
  }

  if (!R2_BUCKET_NAME) {
    console.error("R2_BUCKET_NAME is missing");
    return NextResponse.json({ error: "Storage bucket not configured" }, { status: 500 });
  }

  if (!ALLOWED_MIME_TYPES.includes(fileType)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  try {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const safeExt = fileType.split("/")[1].split("+")[0];
    const key = `products/${timestamp}-${randomString}.${safeExt}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    const publicUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;

    return NextResponse.json({ uploadUrl: signedUrl, publicUrl });
  } catch (error: any) {
    console.error("Presigned URL Error:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "merchant" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Security: Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only common images and videos are allowed." }, { status: 400 });
    }

    // Security: Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Security: Sanitize filename and generate a safe key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const safeExt = file.type.split("/")[1].split("+")[0]; // Basic safe extension
    const key = `products/${timestamp}-${randomString}.${safeExt}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        uploadedBy: session.user.id || "unknown",
        originalName: file.name.substring(0, 100) // Keep some context but truncate
      }
    });

    await r2Client.send(command);

    if (!R2_PUBLIC_URL) {
      throw new Error("R2_PUBLIC_URL is not configured");
    }

    const publicUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    return NextResponse.json({ error: "Upload failed", details: error.message }, { status: 500 });
  }
}
