function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function findNamedBlobToken(): string | undefined {
  for (const [key, value] of Object.entries(process.env)) {
    if (
      key.endsWith("_READ_WRITE_TOKEN") &&
      key !== "BLOB_READ_WRITE_TOKEN" &&
      value?.trim().startsWith("vercel_blob_rw_")
    ) {
      return value.trim();
    }
  }
  return undefined;
}

function findNamedBlobStoreId(): string | undefined {
  for (const [key, value] of Object.entries(process.env)) {
    if (
      key.endsWith("_STORE_ID") &&
      key !== "BLOB_STORE_ID" &&
      value?.trim().startsWith("store_")
    ) {
      return value.trim();
    }
  }
  return undefined;
}

export function getBlobReadWriteToken(): string | undefined {
  return (
    readEnv("BLOB_READ_WRITE_TOKEN") ||
    readEnv("PUBBLOB_READ_WRITE_TOKEN") ||
    findNamedBlobToken()
  );
}

export function getBlobStoreId(): string | undefined {
  return (
    readEnv("BLOB_STORE_ID") ||
    readEnv("PUBBLOB_STORE_ID") ||
    findNamedBlobStoreId()
  );
}

export function hasBlobStorage(): boolean {
  return (
    Boolean(getBlobReadWriteToken()) ||
    (process.env.VERCEL === "1" && Boolean(getBlobStoreId()))
  );
}

export function getBlobPutAuthOptions(): {
  token?: string;
  storeId?: string;
} {
  const token = getBlobReadWriteToken();
  if (token) return { token };

  const storeId = getBlobStoreId();
  if (storeId) return { storeId };

  return {};
}
