import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000" : "");

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn(
    "⚠️ [Socket.io] VITE_API_URL is not set in production. Please configure VITE_API_URL in your hosting environment variables (e.g. Vercel) to point to your live backend URL."
  );
}

const socket = io(BACKEND_URL || undefined, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on("connect_error", (err) => {
  console.warn(`⚠️ [Socket.io] Connection error to ${BACKEND_URL || window.location.origin}:`, err.message);
});

export default socket;