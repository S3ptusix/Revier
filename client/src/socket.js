import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const socket = io(API_URL, {
    withCredentials: true,
    autoConnect: false // control when to connect
});