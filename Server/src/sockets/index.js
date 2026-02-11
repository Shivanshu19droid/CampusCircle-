

export const initSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Scoekt connected", socket.id);

        socket.on("disconnect", () => {
            console.log("socket disconnected", socket.id);
        });
    });
};