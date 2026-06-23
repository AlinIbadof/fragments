import "dotenv/config";

import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { startEventExpirySync } from "./services/event-expiry-sync.ts";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running",
  });
});

// Routes
import eventRoutes from "./routes/event-routes.ts";
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  await connectDB();
  startEventExpirySync();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

void startServer();
