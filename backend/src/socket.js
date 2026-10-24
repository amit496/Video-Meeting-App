
function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", ({ roomId }) => {
      if (!roomId) {
        return;
      }

      const room = io.sockets.adapter.rooms.get(roomId);
      const participantsCount = room ? room.size : 0;

      socket.join(roomId);

      socket.emit("room-joined", {
        roomId,
        socketId: socket.id,
        participantsCount,
      });

      socket.to(roomId).emit("participant-joined", {
        socketId: socket.id,
      });

      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("webrtc-offer", ({ roomId, offer }) => {
      if (!roomId || !offer) {
        return;
      }

      socket.to(roomId).emit("webrtc-offer", {
        offer,
        socketId: socket.id,
      });
    });

    socket.on("webrtc-answer", ({ roomId, answer }) => {
      if (!roomId || !answer) {
        return;
      }

      socket.to(roomId).emit("webrtc-answer", {
        answer,
        socketId: socket.id,
      });
    });

    socket.on("webrtc-ice-candidate", ({ roomId, candidate }) => {
      if (!roomId || !candidate) {
        return;
      }

      socket.to(roomId).emit("webrtc-ice-candidate", {
        candidate,
        socketId: socket.id,
      });
    });

    socket.on("leave-room", ({ roomId }) => {
      if (!roomId) {
        return;
      }

      socket.to(roomId).emit("participant-left", {
        socketId: socket.id,
      });

      socket.leave(roomId);

      console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      for (const roomId of socket.rooms) {
        if (roomId !== socket.id) {
          socket.to(roomId).emit("participant-left", {
            socketId: socket.id,
          });
        }
      }
    });
  });
}

export default initializeSocket;
