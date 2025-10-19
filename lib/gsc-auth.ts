import { google } from "googleapis"
import { saveUserTokens, getUserTokens } from "./db"

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/callback",
)

const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

export function generateAuthUrl(): string {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  })
  return authUrl
}

export async function exchangeCodeForToken(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export async function saveTokens(tokens: any, userId = "default") {
  await saveUserTokens(userId, tokens)
}

export async function getStoredTokens(userId = "default") {
  return await getUserTokens(userId)
}

export function setCredentials(tokens: any) {
  oauth2Client.setCredentials(tokens)
}

export function getOAuth2Client() {
  return oauth2Client
}
