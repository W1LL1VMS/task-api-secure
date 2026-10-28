import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { registerUser, loginUser } from "../services/auth.service.js";

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

    const result = await loginUser(parsed.data);
    return res.status(200).json(result);
  } catch (err) {
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    next(err);
  }
}