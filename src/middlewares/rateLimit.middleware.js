import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives maximum par fenêtre de 15 minutes
  message: { error: "Trop de tentatives de connexion, réessaie plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});