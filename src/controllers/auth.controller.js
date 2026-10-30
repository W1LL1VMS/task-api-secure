import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { registerUser, loginUser, refreshSession } from "../services/auth.service.js";

const REFRESH_COOKIE = "refresh_token";

function cookieOptions() {
  return {
    httpOnly: true, // illisible depuis le JavaScript du navigateur
    secure: process.env.NODE_ENV === "production", // HTTPS uniquement en production
    sameSite: "lax",
    path: "/auth", // le cookie n'est envoyé qu'aux routes /auth
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours, aligné sur JWT_REFRESH_EXPIRES_IN
  };
}

export async function register(req, res, next) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
    }

    const user = await registerUser(parsed.data);
    return res.status(201).json({ user });
  } catch (err) {
    if (err.message === "REGISTRATION_FAILED") {
      return res.status(400).json({ error: "Inscription impossible avec ces informations" });
    }
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
    }

    const { user, accessToken, refreshToken } = await loginUser(parsed.data);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
    return res.status(200).json({ user, accessToken });
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      return res.status(401).json({ error: "Session expirée" });
    }

    const { user, accessToken, refreshToken } = await refreshSession(token);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
    return res.status(200).json({ user, accessToken });
  } catch (err) {
    if (err.message === "INVALID_REFRESH_TOKEN") {
      res.clearCookie(REFRESH_COOKIE, cookieOptions());
      return res.status(401).json({ error: "Session expirée" });
    }
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
  return res.status(204).send();
}