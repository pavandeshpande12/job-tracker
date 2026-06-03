import { cookies } from "next/headers";
import crypto from "crypto";

const SECRET = process.env.MONGODB_URI || "fallback-secret-change-me";
const TOKEN_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

interface TokenPayload {
  email: string;
  name: string;
}

export async function signToken(payload: TokenPayload): Promise<string> {
  const header = { exp: Date.now() + TOKEN_TTL };
  const data = Buffer.from(
    JSON.stringify({ ...payload, ...header })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string): TokenPayload | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url");

  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(data, "base64url").toString());
    if (parsed.exp < Date.now()) return null;
    return { email: parsed.email, name: parsed.name };
  } catch {
    return null;
  }
}

export async function getAuthUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("jat_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
