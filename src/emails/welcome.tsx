import { Html, Head, Body, Container, Heading, Text, Button, Section, Hr } from "@react-email/components"

export function WelcomeEmail({ name, dashboardUrl }: { name: string; dashboardUrl: string }) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#fff", borderRadius: 8 }}>
          <Section style={{ backgroundColor: "#0f172a", padding: "24px", borderRadius: "8px 8px 0 0" }}>
            <Heading style={{ color: "#fff", margin: 0, fontSize: 24 }}>HisarWeb</Heading>
          </Section>
          <Section style={{ padding: "32px 24px" }}>
            <Heading as="h2" style={{ fontSize: 20 }}>Welkom, {name}! 🎉</Heading>
            <Text>Je account is aangemaakt en je website staat klaar om te bouwen.</Text>
            <Text>Ga naar je dashboard om je website in te richten:</Text>
            <Button
              href={dashboardUrl}
              style={{
                backgroundColor: "#6d28d9",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 6,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Naar dashboard →
            </Button>
            <Hr />
            <Text style={{ fontSize: 12, color: "#666" }}>HisarWeb Design — Digital Architects</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail
