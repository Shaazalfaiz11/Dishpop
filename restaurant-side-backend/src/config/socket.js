// src/config/socket.js
const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    /**
     * Restaurant dashboard joins room with restaurantId
     * e.g. socket.emit("joinRestaurant", { restaurantId: "..." })
     */
    socket.on("joinRestaurant", ({ restaurantId }) => {
      if (!restaurantId) return;
      socket.join(String(restaurantId));
      console.log(`Socket ${socket.id} joined restaurant room: ${restaurantId}`);
    });

    /**
     * User app joins room with userId
     */
    socket.on("joinUser", ({ userId }) => {
      if (!userId) return;
      socket.join(String(userId));
      console.log(`Socket ${socket.id} joined user room: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = initSocket;
