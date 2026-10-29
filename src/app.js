import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import taskRoutes from "./routes/task.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);

app.use("/tasks", taskRoutes);

app.use(errorHandler);

export default app;