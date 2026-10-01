import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getCreativeShowcase, getSiteConfigFromCms } from "@/lib/content";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;
const POSTER_H = 534;
const POSTER_W = Math.round((POSTER_H * 9) / 16);

async function loadFont(weight: number) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}`,
      { cache: "force-cache" },
    )
  ).text();
  const match = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (!match?.[1]) throw new Error("Failed to load font");
  return fetch(match[1]).then((res) => res.arrayBuffer());
}

/** Satori can't decode WebP, so re-encode as a JPEG data URI. */
async function toJpegDataUri(url: string, height: number) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Poster fetch failed: ${res.status}`);
  const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize({ height, withoutEnlargement: true })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("v");
  const showcase = await getCreativeShowcase();
  const item = id ? showcase.items.find((entry) => entry.id === id) : undefined;
  const imageUrl = item?.poster ?? (item?.type === "image" ? item.src : undefined);
  if (!item || !imageUrl) {
    return new Response("Not found", { status: 404 });
  }

  const [config, poster, fontMedium, fontRegular] = await Promise.all([
    getSiteConfigFromCms(),
    toJpegDataUri(imageUrl, POSTER_H * 2),
    loadFont(500),
    loadFont(400),
  ]);
  const credits = (item.direction ?? item.caption ?? "").slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#030304",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          width={WIDTH}
          height={HEIGHT}
          style={{
            position: "absolute",
            inset: 0,
            width: WIDTH,
            height: HEIGHT,
            objectFit: "cover",
            opacity: 0.32,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(3,3,4,0.96) 0%, rgba(3,3,4,0.88) 48%, rgba(3,3,4,0.55) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: WIDTH - POSTER_W - 80 - 64,
            padding: "72px 0 72px 80px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ width: 56, height: 3, background: "#FF453A" }} />
            <div
              style={{
                fontFamily: "Inter Regular",
                fontSize: 20,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#a3a3a3",
              }}
            >
              {showcase.title}
            </div>
            <div
              style={{
                fontFamily: "Inter Medium",
                fontSize: 68,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "#f5f5f5",
              }}
            >
              {item.title}
            </div>
            {credits ? (
              <div
                style={{
                  fontFamily: "Inter Regular",
                  fontSize: 24,
                  lineHeight: 1.4,
                  color: "#a3a3a3",
                }}
              >
                {credits}
              </div>
            ) : null}
          </div>
          <div
            style={{
              fontFamily: "Inter Medium",
              fontSize: 26,
              color: "#e5e5e5",
            }}
          >
            {config.fullName}
          </div>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          width={POSTER_W}
          height={POSTER_H}
          style={{
            position: "absolute",
            right: 80,
            top: (HEIGHT - POSTER_H) / 2,
            width: POSTER_W,
            height: POSTER_H,
            objectFit: "cover",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        />
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
      fonts: [
        { name: "Inter Medium", data: fontMedium, weight: 500, style: "normal" },
        { name: "Inter Regular", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
