import { createTaskSchema, updateTaskSchema } from "../validators/task.validator.js";
import * as taskService from "../services/task.service.js";

export async function listTasks(req, res, next) {
  try {
    const tasks = await taskService.getUserTasks(req.user.id);
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id);
    res.json({ task });
  } catch (err) {
    if (err.message === "TASK_NOT_FOUND") {
      return res.status(404).json({ error: "Tâche introuvable" });
    }
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
    }
    const task = await taskService.createTask(req.user.id, parsed.data);
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Données invalides", details: parsed.error.issues });
    }
    const task = await taskService.updateTask(req.params.id, req.user.id, parsed.data);
    res.json({ task });
  } catch (err) {
    if (err.message === "TASK_NOT_FOUND") {
      return res.status(404).json({ error: "Tâche introuvable" });
    }
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    if (err.message === "TASK_NOT_FOUND") {
      return res.status(404).json({ error: "Tâche introuvable" });
    }
    next(err);
  }
}

export async function listAllTasksAdmin(req, res, next) {
  try {
    const tasks = await taskService.getAllTasksAdmin();
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}