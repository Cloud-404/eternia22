import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "eternia_journal_jwt_secret_key_2026_premium_magazine";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function signJWT(payload: { id: string; username: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secretKey);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { id: string; username: string };
  } catch (error) {
    return null;
  }
}
