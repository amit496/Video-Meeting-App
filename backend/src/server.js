import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import initializeSocket from "./socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initializeSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Socket.IO server initialized");
});
