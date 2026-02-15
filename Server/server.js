import app from "./app.js";
import DbConnection from "./config/DbConnection.js";
import cloudinary from "cloudinary";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

dotenv.config({quiet: true});
import { initSocket } from "./src/sockets/index.js";

const PORT = process.env.PORT || 5000;

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// app.listen(PORT, async() => {
//     try{
//          await DbConnection();
//         console.log(`app is running on port ${PORT}`);
//     } catch(error){
//         console.log(error);
//     }
// })

// create an http server using the app
const server = http.createServer(app);

//attach socket.io to server
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

export { io };

// socket based connection
initSocket(io);
app.set("io", io);

// start the server
server.listen(PORT, async () => {
  try {
    await DbConnection();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
