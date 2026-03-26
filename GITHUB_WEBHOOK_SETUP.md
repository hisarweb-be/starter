# GitHub Webhook Setup Guide

Dit document beschrijft hoe je de GitHub webhook configureert zodat update meldingen automatisch op het dashboard verschijnen.

## Wat doet dit?

Wanneer je een nieuwe versie op GitHub released (via tags), verschijnt er automatisch een "🆕 Update beschikbaar" melding op het admin dashboard. Je kunt het changelog bekijken en naar de release gaan.

## Setup Stappen

### Stap 1: Environment Variable Instellen (Vercel)

1. Ga naar [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecteer je `starter` project
3. Ga naar **Settings → Environment Variables**
4. Voeg een nieuwe variable toe:
   - **Name:** `GITHUB_WEBHOOK_SECRET`
   - **Value:** Genereer een willekeurig sterke string (minstens 32 characters)

   Voorbeeld (gebruik een random generator):
   ```
   MySecureWebhookSecret1234567890abcdef
   ```

5. Klik **Save**
6. Redeploy je project (of wacht op volgende auto-deploy)

### Stap 2: GitHub Webhook Configureren

1. Ga naar je GitHub repo: `github.com/hisarweb-be/starter`
2. Klik op **Settings** (bovenaan)
3. Selecteer **Webhooks** (links in menu)
4. Klik op **Add webhook**

**Webhook Details invullen:**

| Veld | Waarde |
|------|--------|
| **Payload URL** | `https://starter-dusky-zeta.vercel.app/api/webhooks/github-release` |
| **Content type** | `application/json` |
| **Secret** | (Zelfde waarde als `GITHUB_WEBHOOK_SECRET` uit Stap 1) |
| **Events** | Selecteer: **Let me select individual events** → alleen **Releases** aanvinken |
| **Active** | ✅ Ja (checkbox aanvinken) |

5. Klik **Add webhook**

### Stap 3: Webhook Testen

1. Ga naar je GitHub repo
2. Klik **Releases** (rechts op de pagina)
3. Klik **Draft a new release** of **Create a new release**
4. Vul in:
   - **Tag:** `v1.0.1` (of volgende versie)
   - **Title:** `Release 1.0.1`
   - **Description:** Schrijf wat is veranderd
   - **This is a pre-release:** Kan aanvinken voor test
5. Klik **Publish release**

**Webhook controle:**
- Ga terug naar Settings → Webhooks
- Selecteer je webhook
- Scroll naar beneden → **Recent Deliveries**
- Je zou een `POST` met status `200` moeten zien
- Klik op delivery → **Response** moet `{"success":true,"tag":"v1.0.1"}` tonen

### Stap 4: Dashboard Controleren

1. Ga naar `https://starter-dusky-zeta.vercel.app/dashboard`
2. Je admin dashboard toont nu (onder de welcome pagina):
   ```
   🆕 Update beschikbaar
   Versie 1.0.1 is nu beschikbaar (je hebt momenteel 1.0.0).
   ```
3. Klik **Bekijk release** → gaat naar GitHub release page

## Automatische Updates Checken (Optional)

Als je wilt dat de app ook automatisch de GitHub API checked (mocht je geen webhook willen):

1. Voeg env var toe: `GITHUB_TOKEN` (je GitHub personal access token)
   - Ga naar GitHub → Settings → Developer settings → Personal access tokens
   - Genereer token met `public_repo` scope
   - Waarde in Vercel zetten

2. Dashboard checked dan ook GitHub elke uur (caching)

## Troubleshooting

### Webhook delivery faalt (HTTP 500)

**Oorzaken:**
- `GITHUB_WEBHOOK_SECRET` niet gelijk in GitHub en Vercel
- Payload URL is verkeerd
- Database niet bereikbaar

**Oplossing:**
1. Controleer beide secrets zijn identiek
2. Test URL in browser: `https://starter-dusky-zeta.vercel.app/api/webhooks/github-release` (mag 404 geven)
3. Check Vercel deployment logs (Settings → Function Logs)

### Update melding verschijnt niet op dashboard

**Oorzaken:**
- Webhook nog niet ontvangen
- Release was geen echte release (draft of pre-release)
- Database cache nog niet bijgewerkt

**Oplossing:**
1. Wacht 1-2 minuten na webhook delivery
2. Refresh dashboard (Ctrl+Shift+R)
3. Check Recent Deliveries in webhook settings
4. Maak nieuw release aan zonder pre-release checkbox

### "Missing X-Hub-Signature-256 header"

Dit betekent dat GitHub de webhook niet correct stuurt.
- Verifieer webhook URL is juist
- Verifieer webhook is active (checkbox)

## API Alternatief (Zonder Webhook)

Als GitHub webhook niet werkt, kan je ook handmatig checks doen:

```bash
# Handmatig latest release fetchen
curl https://api.github.com/repos/hisarweb-be/starter/releases/latest
```

Dit updatet de database en volgende dashboard load toont de melding.

## Security Notes

⚠️ **Belangrijk:**
- `GITHUB_WEBHOOK_SECRET` moet sterk en random zijn
- Nooit in code committen!
- Nooit in Slack/email delen
- Rotate elke maand (verander secret, update webhook)

## Vervolg

Zodra je releases goed lopen:
1. Maak proces voor versioning (semantic versioning: v1.0.0 → v1.0.1 → v1.1.0)
2. Automatiseer release creation (GitHub Actions)
3. Koppel deployment aan release (Vercel auto-deploy op tag)

Voorbeeldwerkflow:
```
git tag v1.0.1 && git push --tags
  ↓ (GitHub Actions)
Create release on GitHub
  ↓ (Webhook)
Dashboard toont "Update beschikbaar v1.0.1"
  ↓ (User triggered)
Deploy op Vercel (manual of auto)
```
