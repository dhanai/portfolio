import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  formatMoney,
  formatProposalDate,
  nextStepsIntro,
  PROPOSAL_ISSUER,
  proposalStatusLabel,
} from "@/lib/proposals";
import {
  richTextIsEmpty,
  richTextToBlocks,
  type RichTextSegment,
} from "@/lib/rich-text";

const ink = "#18181b";
const muted = "#52525b";
const light = "#71717a";
const border = "#e4e4e7";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: ink,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: border,
    paddingBottom: 16,
    marginBottom: 18,
  },
  label: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: light,
  },
  title: {
    marginTop: 6,
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  number: {
    marginTop: 6,
    fontSize: 9,
    fontFamily: "Courier",
    color: muted,
  },
  date: {
    marginTop: 4,
    fontSize: 9,
    color: muted,
  },
  amountBlock: {
    alignItems: "flex-end",
  },
  amount: {
    marginTop: 4,
    fontSize: 20,
    fontFamily: "Courier-Bold",
  },
  parties: {
    flexDirection: "row",
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: border,
    paddingBottom: 16,
    marginBottom: 16,
  },
  party: { flex: 1 },
  partyName: {
    marginTop: 6,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  partyLine: {
    marginTop: 2,
    fontSize: 9,
    color: muted,
  },
  section: {
    marginBottom: 16,
  },
  sectionBody: {
    marginTop: 8,
    fontSize: 9.5,
    lineHeight: 1.45,
    color: "#27272a",
  },
  goalsLine: {
    marginTop: 4,
    fontSize: 9.5,
    lineHeight: 1.45,
    color: "#27272a",
  },
  goalsMarker: {
    fontFamily: "Helvetica",
  },
  goalsBold: {
    fontFamily: "Helvetica-Bold",
  },
  goalsItalic: {
    fontFamily: "Helvetica-Oblique",
  },
  goalsBoldItalic: {
    fontFamily: "Helvetica-BoldOblique",
  },
  goalsUnderline: {
    textDecoration: "underline",
  },
  bullet: {
    marginTop: 4,
    fontSize: 9.5,
    lineHeight: 1.4,
    color: "#27272a",
    paddingLeft: 8,
  },
  twoCol: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 16,
  },
  quoteRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  quoteLabel: {
    fontSize: 9.5,
    color: "#27272a",
    flex: 1,
    paddingRight: 12,
  },
  quoteAmount: {
    fontFamily: "Courier-Bold",
    fontSize: 11,
  },
  scheduleLine: {
    marginTop: 4,
    fontSize: 9,
    color: muted,
  },
  step: {
    marginTop: 6,
    fontSize: 9.5,
    lineHeight: 1.4,
    color: "#27272a",
  },
  terms: {
    marginTop: 8,
    fontSize: 8.5,
    lineHeight: 1.45,
    color: muted,
  },
  footer: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: border,
    fontSize: 8,
    color: light,
    textAlign: "center",
  },
});

export type ProposalPdfProps = {
  number: string;
  title: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  goals: string | null;
  deliverables: string[];
  timeframe: string;
  quoteLabel: string;
  amount: number;
  paymentSchedule: string;
  nextSteps: string[];
  terms: string;
  notes: string | null;
  status: string;
  createdAt: Date;
};

function segmentStyle(segment: RichTextSegment) {
  const stylesList = [];
  if (segment.bold && segment.italic) stylesList.push(styles.goalsBoldItalic);
  else if (segment.bold) stylesList.push(styles.goalsBold);
  else if (segment.italic) stylesList.push(styles.goalsItalic);
  if (segment.underline) stylesList.push(styles.goalsUnderline);
  return stylesList;
}

function GoalsPdfBlocks({ html }: { html: string }) {
  const blocks = richTextToBlocks(html);
  return (
    <View style={{ marginTop: 4 }}>
      {blocks.map((block, index) => (
        <Text key={index} style={styles.goalsLine}>
          {block.marker ? (
            <Text style={styles.goalsMarker}>{block.marker}</Text>
          ) : null}
          {block.segments.map((segment, segIndex) => (
            <Text key={segIndex} style={segmentStyle(segment)}>
              {segment.text}
            </Text>
          ))}
        </Text>
      ))}
    </View>
  );
}

export function ProposalPdfDocument({
  number,
  title,
  clientName,
  clientCompany,
  clientEmail,
  goals,
  deliverables,
  timeframe,
  quoteLabel,
  amount,
  paymentSchedule,
  nextSteps,
  terms,
  notes,
  status,
  createdAt,
}: ProposalPdfProps) {
  const clientLabel = clientCompany || clientName;
  const paymentLines = paymentSchedule
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <Document
      title={`Proposal ${number}`}
      author={PROPOSAL_ISSUER.name}
      subject={`${title} for ${clientLabel}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.label}>Project proposal</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.number}>{number}</Text>
            <Text style={styles.date}>{formatProposalDate(createdAt)}</Text>
          </View>
          <View style={styles.amountBlock}>
            <Text style={styles.label}>{proposalStatusLabel(status)}</Text>
            <Text style={styles.amount}>{formatMoney(amount)}</Text>
          </View>
        </View>

        <View style={styles.parties}>
          <View style={styles.party}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.partyName}>{PROPOSAL_ISSUER.name}</Text>
            {PROPOSAL_ISSUER.addressLines.map((line) => (
              <Text key={line} style={styles.partyLine}>
                {line}
              </Text>
            ))}
            <Text style={styles.partyLine}>{PROPOSAL_ISSUER.email}</Text>
          </View>
          <View style={styles.party}>
            <Text style={styles.label}>Prepared for</Text>
            <Text style={styles.partyName}>{clientName}</Text>
            {clientCompany ? (
              <Text style={styles.partyLine}>{clientCompany}</Text>
            ) : null}
            <Text style={styles.partyLine}>{clientEmail}</Text>
          </View>
        </View>

        {!richTextIsEmpty(goals) ? (
          <View style={styles.section}>
            <Text style={styles.label}>Goals & objectives</Text>
            <GoalsPdfBlocks html={goals ?? ""} />
          </View>
        ) : null}

        <View style={styles.twoCol}>
          <View style={{ flex: 1.4 }}>
            <Text style={styles.label}>Deliverables</Text>
            {deliverables.map((item) => (
              <Text key={item} style={styles.bullet}>
                • {item}
              </Text>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Timeframe</Text>
            <Text style={styles.sectionBody}>{timeframe}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Quote — flat rate</Text>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>{quoteLabel}</Text>
            <Text style={styles.quoteAmount}>{formatMoney(amount)}</Text>
          </View>
          {paymentLines.map((line) => (
            <Text key={line} style={styles.scheduleLine}>
              {line}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Next steps</Text>
          <Text style={styles.sectionBody}>{nextStepsIntro(clientLabel)}</Text>
          {nextSteps.map((step, index) => (
            <Text key={step} style={styles.step}>
              {index + 1}. {step}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Terms & conditions</Text>
          <Text style={styles.terms}>{terms}</Text>
          {notes ? <Text style={styles.terms}>{notes}</Text> : null}
        </View>

        <Text style={styles.footer}>
          Prepared by {PROPOSAL_ISSUER.name} · {number}
        </Text>
      </Page>
    </Document>
  );
}
