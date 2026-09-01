import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION = "7d";

export type AdminSessionPayload = {
  id: string;
  email: string;
};

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set (expected in .env.local).");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: AdminSessionPayload) {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.id)
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      return null;
    }
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

/** Server components / route handlers only — reads the session cookie via next/headers. */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Route-handler guard, defense-in-depth alongside middleware (which already blocks
 * unauthenticated requests to /api/admin/*). Call at the top of each handler.
 */
export async function requireAdminSession(): Promise<AdminSessionPayload | null> {
  return getAdminSession();
}
