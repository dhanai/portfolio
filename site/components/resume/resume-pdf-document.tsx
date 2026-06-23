import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ResumeContentData } from "@/lib/content";

const accent = "#FF453A";
const ink = "#0A0A0A";
const muted = "#525252";
const light = "#737373";
const border = "#E5E5E5";

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 26,
    paddingHorizontal: 46,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: ink,
    backgroundColor: "#FFFFFF",
  },
  header: {
    borderBottomWidth: 0.5,
    borderBottomColor: border,
    paddingBottom: 10,
    marginBottom: 11,
  },
  accentBar: {
    height: 1.5,
    backgroundColor: accent,
    width: 44,
    marginBottom: 9,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  headline: {
    fontSize: 9.5,
    color: muted,
    marginBottom: 2,
  },
  subheadline: {
    fontSize: 8,
    color: light,
    marginBottom: 7,
  },
  contact: {
    fontSize: 8.5,
    color: muted,
    lineHeight: 1.45,
  },
  sectionTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: light,
    marginBottom: 5,
  },
  summary: {
    fontSize: 9.5,
    lineHeight: 1.48,
    color: "#262626",
    marginBottom: 12,
  },
  columns: {
    flexDirection: "row",
    gap: 18,
    alignItems: "flex-start",
  },
  colMain: { flex: 1.55 },
  colSide: { flex: 1 },
  jobBlock: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: border,
  },
  jobBlockLast: { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
  jobRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 2,
  },
  jobTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", flex: 1 },
  jobRole: { fontFamily: "Helvetica", color: muted, fontSize: 9 },
  jobPeriod: { fontSize: 7.5, color: light, marginLeft: 4 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 2.5 },
  bulletDash: {
    width: 10,
    height: 1,
    backgroundColor: accent,
    marginTop: 4,
    marginRight: 6,
  },
  bulletText: { flex: 1, fontSize: 8.5, lineHeight: 1.4, color: "#404040" },
  sideSection: { marginBottom: 12 },
  earlierNote: { fontSize: 8, color: light, marginBottom: 4 },
  earlierRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2.5,
    borderBottomWidth: 0.5,
    borderBottomColor: border,
  },
  earlierCompany: { fontSize: 8.5, color: ink, flex: 1 },
  earlierRole: { color: muted },
  earlierPeriod: { fontSize: 7.5, color: light },
  skillCell: {
    borderWidth: 0.5,
    borderColor: border,
    paddingVertical: 5,
    paddingHorizontal: 6,
    marginBottom: 5,
  },
  skillCategory: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: accent,
    marginBottom: 2,
  },
  skillItems: { fontSize: 8, lineHeight: 1.38, color: "#404040" },
});

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDash} />
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export function ResumePdfDocument({ data }: { data: ResumeContentData }) {
  const d = data;
  const contact = [
    d.contact.location,
    d.contact.email,
    d.contact.phone,
    d.contact.linkedin,
    d.contact.portfolio,
  ].join("  ·  ");

  const lastJobIndex = d.experience.length - 1;

  return (
    <Document title={`${d.name} — Resume`} author={d.name}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.accentBar} />
          <Text style={styles.name}>{d.name}</Text>
          <Text style={styles.headline}>{d.headline}</Text>
          <Text style={styles.subheadline}>{d.subheadline}</Text>
          <Text style={styles.contact}>{contact}</Text>
        </View>

        <SectionTitle>Summary</SectionTitle>
        <Text style={styles.summary}>{d.summary}</Text>

        <View style={styles.columns}>
          <View style={styles.colMain}>
            <SectionTitle>Experience</SectionTitle>
            {d.experience.map((job, i) => (
              <View
                key={job.company}
                style={[
                  styles.jobBlock,
                  ...(i === lastJobIndex ? [styles.jobBlockLast] : []),
                ]}
              >
                <View style={styles.jobRow}>
                  <Text style={styles.jobTitle}>
                    {job.company}
                    <Text style={styles.jobRole}> — {job.role}</Text>
                  </Text>
                  <Text style={styles.jobPeriod}>{job.period}</Text>
                </View>
                {job.bullets.map((bullet) => (
                  <Bullet key={bullet.slice(0, 36)}>{bullet}</Bullet>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.colSide}>
            <View style={styles.sideSection}>
              <SectionTitle>Earlier career</SectionTitle>
              <Text style={styles.earlierNote}>20+ years · agencies & product</Text>
              {d.earlierCareer.map((job) => (
                <View key={job.company} style={styles.earlierRow}>
                  <Text style={styles.earlierCompany}>
                    {job.company}
                    <Text style={styles.earlierRole}> — {job.role}</Text>
                  </Text>
                  <Text style={styles.earlierPeriod}>{job.period}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sideSection}>
              <SectionTitle>Skills</SectionTitle>
              {Object.entries(d.skills).map(([category, items]) => (
                <View key={category} style={styles.skillCell}>
                  <Text style={styles.skillCategory}>{category}</Text>
                  <Text style={styles.skillItems}>{items}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
