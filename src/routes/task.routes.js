import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import * as taskController from "../controllers/task.controller.js";

const router = Router();

router.use(requireAuth); // toutes les routes ci-dessous exigent un token valide

router.get("/", taskController.listTasks);
router.get("/admin/all", requireAdmin, taskController.listAllTasksAdmin);
router.get("/:id", taskController.getTask);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;