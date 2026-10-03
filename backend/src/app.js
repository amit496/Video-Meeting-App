import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth/auth.routes.js";
import meetingRoutes from "./routes/meeting/meeting.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Video Meeting API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);

export default app;