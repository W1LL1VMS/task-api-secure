import { prisma } from "../config/db.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./token.service.js";

function toPublicUser(user) {
  return { id: user.id, email: user.email, role: user.role };
}

export async function registerUser({ email, password }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    // Message volontairement vague : on ne confirme jamais qu'un email est déjà pris
    throw new Error("REGISTRATION_FAILED");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash } });

  return toPublicUser(user);
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Même erreur que l'email existe ou non
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    user: toPublicUser(user),
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

export async function refreshSession(refreshToken) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  // On recharge l'utilisateur en base : si le compte a été supprimé, la session s'arrête
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  return {
    user: toPublicUser(user),
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user), // rotation : nouveau refresh token à chaque renouvellement
  };
}