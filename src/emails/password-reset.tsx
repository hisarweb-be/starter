import { Html, Head, Body, Container, Heading, Text, Button, Section, Hr } from "@react-email/components"

export function PasswordResetEmail({ resetUrl }: { resetUrl: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#fff", borderRadius: 8 }}>
          <Section style={{ backgroundColor: "#0f172a", padding: "24px", borderRadius: "8px 8px 0 0" }}>
            <Heading style={{ color: "#fff", margin: 0, fontSize: 24 }}>HisarWeb</Heading>
          </Section>
          <Section style={{ padding: "32px 24px" }}>
            <Heading as="h2" style={{ fontSize: 20 }}>Wachtwoord opnieuw instellen</Heading>
            <Text>
              Je hebt een verzoek ingediend om je wachtwoord opnieuw in te stellen. Klik op de knop
              hieronder om een nieuw wachtwoord in te stellen.
            </Text>
            <Text>
              Deze link is <strong>1 uur</strong> geldig. Als je dit verzoek niet hebt ingediend,
              kun je deze e-mail negeren.
            </Text>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: "#6d28d9",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 6,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Wachtwoord opnieuw instellen →
            </Button>
            <Hr />
            <Text style={{ fontSize: 12, color: "#666" }}>
              Als de knop niet werkt, kopieer dan deze link in je browser:{" "}
              <a href={resetUrl} style={{ color: "#6d28d9" }}>
                {resetUrl}
              </a>
            </Text>
            <Text style={{ fontSize: 12, color: "#666" }}>HisarWeb Design — Digital Architects</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default PasswordResetEmail
