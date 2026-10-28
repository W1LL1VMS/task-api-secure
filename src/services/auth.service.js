import { prisma } from "../config/db.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import { generateAccessToken, generateRefreshToken } from "./token.service.js";

export async function registerUser({ email, password }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    // Message volontairement vague : on ne confirme jamais qu'un email est déjà pris
    throw new Error("REGISTRATION_FAILED");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  return { id: user.id, email: user.email, role: user.role };
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });

  // Même message qu'il existe ou non, qu'il existe mais mauvais mot de passe
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    user: { id: user.id, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
}