import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import * as taskController from "../controllers/task.controller.js";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lister les tâches de l'utilisateur connecté
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des tâches }
 *       401: { description: Non authentifié }
 *   post:
 *     summary: Créer une nouvelle tâche
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Tâche créée }
 */
router.get("/", taskController.listTasks);
router.get("/admin/all", requireAdmin, taskController.listAllTasksAdmin);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Récupérer une tâche par son ID
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Détail de la tâche }
 *       404: { description: Tâche introuvable }
 *   put:
 *     summary: Modifier une tâche
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Tâche modifiée }
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204: { description: Tâche supprimée }
 */
router.get("/:id", taskController.getTask);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;