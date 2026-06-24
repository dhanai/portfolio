import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/require-admin";
import { requireBlobReadWriteToken } from "@/lib/admin/require-blob-token";

const MAX_BYTES = 80 * 1024 * 1024;

const CREATIVE_CONTENT_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  let token: string;
  try {
    token = requireBlobReadWriteToken();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Blob token not configured",
      },
      { status: 503 },
    );
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("creative/")) {
          throw new Error("Invalid upload path");
        }

        return {
          allowedContentTypes: CREATIVE_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: false,
          allowOverwrite: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
