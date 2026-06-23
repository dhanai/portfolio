import { ImageResponse } from "next/og";
import { getSiteConfigFromCms } from "@/lib/content";

export const alt = "Dhanai Holtzclaw — Design Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function Image() {
  const config = await getSiteConfigFromCms();
  const fontMedium = await loadFont(500);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          background: "#030304",
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 920,
            height: 720,
            left: -220,
            bottom: -280,
            background:
              "radial-gradient(ellipse at center, rgba(48, 130, 255, 0.72) 0%, rgba(28, 90, 210, 0.4) 38%, transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 680,
            height: 560,
            left: 180,
            bottom: 40,
            background:
              "radial-gradient(ellipse at center, rgba(0, 168, 196, 0.32) 0%, rgba(20, 80, 140, 0.2) 45%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 560,
            height: 480,
            right: -60,
            top: 80,
            background:
              "radial-gradient(ellipse at center, rgba(40, 60, 120, 0.28) 0%, rgba(12, 24, 48, 0.14) 50%, transparent 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 120% 80% at 50% 0%, transparent 35%, rgba(3, 3, 4, 0.55) 100%), radial-gradient(ellipse 90% 70% at 100% 20%, rgba(3, 3, 4, 0.45) 0%, transparent 55%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 56,
              height: 3,
              background: "#FF453A",
            }}
          />
          <div
            style={{
              fontFamily: "Inter Medium",
              fontSize: 72,
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              color: "#f5f5f5",
            }}
          >
            {config.fullName}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter Medium", data: fontMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
