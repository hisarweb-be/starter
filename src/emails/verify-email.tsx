import { Html, Head, Body, Container, Heading, Text, Button, Section, Hr } from "@react-email/components"

export function VerifyEmailEmail({ verifyUrl, name }: { verifyUrl: string; name: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#fff", borderRadius: 8 }}>
          <Section style={{ backgroundColor: "#0f172a", padding: "24px", borderRadius: "8px 8px 0 0" }}>
            <Heading style={{ color: "#fff", margin: 0, fontSize: 24 }}>HisarWeb</Heading>
          </Section>
          <Section style={{ padding: "32px 24px" }}>
            <Heading as="h2" style={{ fontSize: 20 }}>Bevestig je e-mailadres, {name}!</Heading>
            <Text>
              Bedankt voor je registratie bij HisarWeb. Klik op de knop hieronder om je
              e-mailadres te bevestigen en je account te activeren.
            </Text>
            <Text>
              Deze link is <strong>24 uur</strong> geldig.
            </Text>
            <Button
              href={verifyUrl}
              style={{
                backgroundColor: "#6d28d9",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 6,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              E-mailadres bevestigen →
            </Button>
            <Hr />
            <Text style={{ fontSize: 12, color: "#666" }}>
              Als de knop niet werkt, kopieer dan deze link in je browser:{" "}
              <a href={verifyUrl} style={{ color: "#6d28d9" }}>
                {verifyUrl}
              </a>
            </Text>
            <Text style={{ fontSize: 12, color: "#666" }}>HisarWeb Design — Digital Architects</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default VerifyEmailEmail
