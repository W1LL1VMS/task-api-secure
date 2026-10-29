import { prisma } from "../config/db.js";

export async function getUserTasks(userId) {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTaskById(taskId, userId) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task || task.userId !== userId) {
    throw new Error("TASK_NOT_FOUND");
  }
  return task;
}

export async function createTask(userId, data) {
  return prisma.task.create({
    data: { ...data, userId },
  });
}

export async function updateTask(taskId, userId, data) {
  await getTaskById(taskId, userId); // vérifie l'appartenance avant de modifier

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
}

export async function deleteTask(taskId, userId) {
  await getTaskById(taskId, userId);

  return prisma.task.delete({ where: { id: taskId } });
}

export async function getAllTasksAdmin() {
  return prisma.task.findMany({
    include: { user: { select: { id: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}