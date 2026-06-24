import { getBlobReadWriteToken } from "@/lib/admin/blob-credentials";

export function requireBlobReadWriteToken(): string {
  const token = getBlobReadWriteToken();
  if (token) return token;

  throw new Error(
    "Blob read-write token missing. In Vercel → Storage → your Blob store, copy READ_WRITE_TOKEN into BLOB_READ_WRITE_TOKEN or PUBBLOB_READ_WRITE_TOKEN, then redeploy.",
  );
}
