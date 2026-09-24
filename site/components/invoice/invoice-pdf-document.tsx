import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  formatInvoiceDate,
  formatMoney,
  INVOICE_ISSUER,
  INVOICE_PAYMENT_OPTIONS,
  lineItemsHaveHours,
  type InvoiceLineItem,
} from "@/lib/invoices";

const ink = "#18181b";
const muted = "#52525b";
const light = "#71717a";
const border = "#e4e4e7";
const wash = "#fafafa";

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
  number: {
    marginTop: 6,
    fontSize: 16,
    fontFamily: "Courier-Bold",
  },
  date: {
    marginTop: 6,
    fontSize: 9,
    color: muted,
  },
  amountBlock: {
    alignItems: "flex-end",
  },
  amount: {
    marginTop: 4,
    fontSize: 22,
    fontFamily: "Courier-Bold",
  },
  parties: {
    flexDirection: "row",
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: border,
    paddingBottom: 16,
    marginBottom: 18,
  },
  party: {
    flex: 1,
  },
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
  table: {
    borderWidth: 1,
    borderColor: border,
    marginBottom: 18,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: wash,
    borderBottomWidth: 1,
    borderBottomColor: border,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: border,
  },
  tableFoot: {
    flexDirection: "row",
    backgroundColor: wash,
  },
  th: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: light,
  },
  td: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 9,
  },
  colDesc: { flex: 2.4 },
  colRate: { width: 72, textAlign: "right" },
  colHours: { width: 52, textAlign: "right" },
  colAmount: { width: 78, textAlign: "right" },
  mono: {
    fontFamily: "Courier",
  },
  footLabel: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: light,
    textAlign: "right",
  },
  footAmount: {
    width: 78,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 11,
    fontFamily: "Courier-Bold",
    textAlign: "right",
  },
  paymentTitle: {
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: border,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  paymentLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: light,
  },
  paymentValue: {
    fontFamily: "Courier",
    fontSize: 9,
  },
  notes: {
    marginTop: 12,
    fontSize: 9,
    color: muted,
    lineHeight: 1.45,
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

export type InvoicePdfProps = {
  number: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  lineItems: InvoiceLineItem[];
};

export function InvoicePdfDocument({
  number,
  clientName,
  clientEmail,
  amount,
  status,
  notes,
  createdAt,
  lineItems,
}: InvoicePdfProps) {
  const showHours = lineItemsHaveHours(lineItems);
  const statusLabel = status === "paid" ? "Paid" : "Amount due";

  return (
    <Document
      title={`Invoice ${number}`}
      author={INVOICE_ISSUER.name}
      subject={`Invoice for ${clientName}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.label}>Invoice</Text>
            <Text style={styles.number}>{number}</Text>
            <Text style={styles.date}>{formatInvoiceDate(createdAt)}</Text>
          </View>
          <View style={styles.amountBlock}>
            <Text style={styles.label}>{statusLabel}</Text>
            <Text style={styles.amount}>{formatMoney(amount)}</Text>
          </View>
        </View>

        <View style={styles.parties}>
          <View style={styles.party}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.partyName}>{INVOICE_ISSUER.name}</Text>
            {INVOICE_ISSUER.addressLines.map((line) => (
              <Text key={line} style={styles.partyLine}>
                {line}
              </Text>
            ))}
            <Text style={styles.partyLine}>{INVOICE_ISSUER.email}</Text>
          </View>
          <View style={styles.party}>
            <Text style={styles.label}>Bill to</Text>
            <Text style={styles.partyName}>{clientName}</Text>
            <Text style={styles.partyLine}>{clientEmail}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHead}>
            <Text style={[styles.th, styles.colDesc]}>Description</Text>
            <Text style={[styles.th, styles.colRate]}>Rate</Text>
            {showHours ? (
              <Text style={[styles.th, styles.colHours]}>Hours</Text>
            ) : null}
            <Text style={[styles.th, styles.colAmount]}>Amount</Text>
          </View>
          {lineItems.map((item) => (
            <View key={item.id} style={styles.tableRow} wrap={false}>
              <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
              <Text style={[styles.td, styles.colRate, styles.mono]}>
                {formatMoney(item.rate)}
                {item.rateType === "hourly" ? "/hr" : ""}
              </Text>
              {showHours ? (
                <Text style={[styles.td, styles.colHours, styles.mono]}>
                  {item.rateType === "hourly" ? String(item.hours ?? "") : "—"}
                </Text>
              ) : null}
              <Text style={[styles.td, styles.colAmount, styles.mono]}>
                {formatMoney(item.amount)}
              </Text>
            </View>
          ))}
          <View style={styles.tableFoot}>
            <Text style={styles.footLabel}>Total due</Text>
            <Text style={styles.footAmount}>{formatMoney(amount)}</Text>
          </View>
        </View>

        <Text style={[styles.label, styles.paymentTitle]}>Payment options</Text>
        {INVOICE_PAYMENT_OPTIONS.map((opt) => (
          <View key={opt.label} style={styles.paymentRow} wrap={false}>
            <Text style={styles.paymentLabel}>{opt.label}</Text>
            <Text style={styles.paymentValue}>{opt.value}</Text>
          </View>
        ))}

        {notes ? <Text style={styles.notes}>{notes}</Text> : null}

        <Text style={styles.footer}>
          Thank you — please include invoice {number} with your payment.
        </Text>
      </Page>
    </Document>
  );
}
