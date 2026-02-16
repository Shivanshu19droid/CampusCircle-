const onlineUsers = new Map(); // userId -> socketId

export const initSocket = (io) => {

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // 🔹 Register logged-in user
        socket.on("REGISTER_USER", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log("Registered user:", userId);
        });

        // 🔹 Join chat room
        socket.on("JOIN_CHAT", (chatId) => {
            socket.join(chatId);
        });

        // 🔹 Leave chat room
        socket.on("LEAVE_CHAT", (chatId) => {
            socket.leave(chatId);
        });

        // 🔹 Typing indicator
        socket.on("TYPING_START", (chatId) => {
            socket.to(chatId).emit("TYPING_START", { chatId });
        });

        socket.on("TYPING_STOP", (chatId) => {
            socket.to(chatId).emit("TYPING_STOP", { chatId });
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);

            // Remove user from online map
            for (const [userId, id] of onlineUsers.entries()) {
                if (id === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
        });
    });
};

export const getOnlineUsers = () => onlineUsers;

