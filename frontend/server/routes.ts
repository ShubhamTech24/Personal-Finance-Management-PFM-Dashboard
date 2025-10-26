import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import authRoutes from "./routes/auth";
import plaidRoutes from "./routes/plaid";
import budgetsRoutes from "./routes/budgets";
import summaryRoutes from "./routes/summary";
import transactionsRoutes from "./routes/transactions";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cors());

  app.use("/api/auth", authRoutes);
  app.use("/api/plaid", plaidRoutes);
  app.use("/api/budgets", budgetsRoutes);
  app.use("/api/summary", summaryRoutes);
  app.use("/api/tx", transactionsRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'PFM API Running' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
