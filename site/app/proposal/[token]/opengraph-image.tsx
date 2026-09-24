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

async function loadFont(family: string, weight: number) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`,
      { cache: "force-cache" },
    )
  ).text();
  const match = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (!match?.[1]) throw new Error(`Failed to load font ${family}`);
  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export default async function Image({ params }: ImageProps) {
  const { token } = await params;
  const proposal = await prisma.proposal.findUnique({ where: { token } });
  const [manrope, serif] = await Promise.all([
    loadFont("Manrope", 600),
    loadFont("Instrument+Serif", 400),
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
          background: "#dfe6eb",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 480,
            height: 480,
            left: -120,
            top: -80,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(31,168,154,0.28) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            right: -140,
            bottom: -160,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(20,40,60,0.14) 0%, transparent 68%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Manrope",
            fontSize: 22,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#5a6b78",
          }}
        >
          <div style={{ display: "flex" }}>Proposal</div>
          <div style={{ display: "flex", fontFamily: "Manrope" }}>{number}</div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            maxWidth: 900,
          }}
        >
          <div
            style={{
              fontFamily: "Manrope",
              fontSize: 26,
              color: "#5a6b78",
              marginBottom: 18,
            }}
          >
            Prepared for {clientLabel}
          </div>
          <div
            style={{
              fontFamily: "Instrument Serif",
              fontSize: 64,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#12181e",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(26,34,41,0.15)",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              fontFamily: "Manrope",
              fontSize: 26,
              color: "#1a2229",
            }}
          >
            {PROPOSAL_ISSUER.name}
          </div>
          {amount ? (
            <div
              style={{
                fontFamily: "Instrument Serif",
                fontSize: 48,
                color: "#12181e",
              }}
            >
              {amount}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: manrope, weight: 600, style: "normal" },
        {
          name: "Instrument Serif",
          data: serif,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
