import { spawn } from "child_process";
import { mkdtemp, rm, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import ffmpegPath from "ffmpeg-static";

function runFfmpeg(args: string[], timeoutMs = 60_000): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error("ffmpeg binary unavailable"));
      return;
    }
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "pipe", "pipe"] });
    const chunks: Buffer[] = [];
    let stderr = "";
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error("ffmpeg timed out"));
    }, timeoutMs);
    proc.stdout.on("data", (chunk: Buffer) => chunks.push(chunk));
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr = (stderr + chunk.toString()).slice(-2000);
    });
    proc.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    proc.on("close", (code) => {
      clearTimeout(timer);
      const out = Buffer.concat(chunks);
      if (code === 0 && out.length > 0) resolve(out);
      else reject(new Error(`ffmpeg failed (${code}): ${stderr.trim()}`));
    });
  });
}

function frameArgs(input: string, atSeconds: number) {
  return [
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    String(atSeconds),
    "-i",
    input,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    "-f",
    "image2pipe",
    "-vcodec",
    "mjpeg",
    "pipe:1",
  ];
}

/** Grabs a JPEG frame ~1s into a remote video. */
export async function extractVideoPoster(videoUrl: string): Promise<Buffer> {
  const res = await fetch(videoUrl);
  if (!res.ok) throw new Error(`Could not fetch video (${res.status})`);

  const dir = await mkdtemp(path.join(os.tmpdir(), "poster-"));
  const input = path.join(dir, "input");
  try {
    await writeFile(input, Buffer.from(await res.arrayBuffer()));
    try {
      return await runFfmpeg(frameArgs(input, 1));
    } catch {
      // Clips shorter than the seek point produce no frame.
      return await runFfmpeg(frameArgs(input, 0));
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
