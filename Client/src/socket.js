// src/socket.js
import { io } from "socket.io-client";

const backend_development_url = "http://localhost:5000";
const backend_production_url = "";

const socket = io(backend_development_url || backend_production_url, {
  withCredentials: true,
});

export default socket;
