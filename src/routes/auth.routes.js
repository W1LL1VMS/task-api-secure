import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { loginLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201: { description: Utilisateur créé }
 *       400: { description: Données invalides ou email déjà utilisé }
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter et obtenir des tokens JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200: { description: Connexion réussie, renvoie accessToken et refreshToken }
 *       401: { description: Identifiants incorrects }
 */
router.post("/login", loginLimiter, login);

export default router;