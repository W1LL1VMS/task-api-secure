import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
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
 *     summary: Se connecter (access token dans le corps, refresh token dans un cookie HttpOnly)
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
 *       200: { description: Connexion réussie }
 *       401: { description: Identifiants incorrects }
 */
router.post("/login", loginLimiter, login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renouveler la session à partir du cookie de refresh token
 *     tags: [Auth]
 *     responses:
 *       200: { description: Nouvel access token et utilisateur }
 *       401: { description: Session expirée ou invalide }
 */
router.post("/refresh", refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Se déconnecter (supprime le cookie de refresh token)
 *     tags: [Auth]
 *     responses:
 *       204: { description: Déconnecté }
 */
router.post("/logout", logout);

export default router;