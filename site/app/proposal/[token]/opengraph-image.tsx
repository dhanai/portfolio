import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { formatMoney, PROPOSAL_ISSUER } from "@/lib/proposals";

export const alt = "Proposal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

type ImageProps = {
  params: Promise<{ token: string }>;
};

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

export default async function Image({ params }: ImageProps) {
  const { token } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { token } });
  const [fontMedium, fontSemi] = await Promise.all([
    loadFont(500),
    loadFont(600),
  ]);

  const number = proposal?.number ?? "Proposal";
  const title = proposal?.title ?? "Project proposal";
  const clientLabel =
    proposal?.clientCompany || proposal?.clientName || "Client";
  const amount = proposal ? formatMoney(proposal.amount) : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f4f5",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
            border: "1px solid #e4e4e7",
            padding: "56px 60px",
            height: "100%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
              <div
                style={{
                  fontFamily: "Inter Semi",
                  fontSize: 22,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#71717a",
                }}
              >
                Project proposal
              </div>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: "Inter Semi",
                  fontSize: 48,
                  letterSpacing: "-0.03em",
                  color: "#18181b",
                  lineHeight: 1.1,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontFamily: "Inter Medium",
                  fontSize: 26,
                  color: "#52525b",
                }}
              >
                {clientLabel}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: "Inter Medium",
                  fontSize: 22,
                  color: "#a1a1aa",
                }}
              >
                {number}
              </div>
            </div>
            {amount ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    fontFamily: "Inter Semi",
                    fontSize: 20,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#71717a",
                  }}
                >
                  Quote
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: "Inter Semi",
                    fontSize: 52,
                    letterSpacing: "-0.03em",
                    color: "#18181b",
                  }}
                >
                  {amount}
                </div>
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid #e4e4e7",
              paddingTop: 28,
            }}
          >
            <div
              style={{
                fontFamily: "Inter Medium",
                fontSize: 26,
                color: "#18181b",
              }}
            >
              {PROPOSAL_ISSUER.name}
            </div>
            <div
              style={{
                fontFamily: "Inter Medium",
                fontSize: 22,
                color: "#71717a",
              }}
            >
              {PROPOSAL_ISSUER.email}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter Medium", data: fontMedium, weight: 500, style: "normal" },
        { name: "Inter Semi", data: fontSemi, weight: 600, style: "normal" },
      ],
    },
  );
}
