import { useSceneStore } from "../store/UseSceneStore";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("Connected to server");
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === "scene:init") {
          useSceneStore.getState().setScene(msg.data);
          console.log("Scene initialized from server");
          return;
        }

        if (msg.type === "scene:update") {
          useSceneStore.getState().setScene(msg.data);
          console.log("Scene updated from server");
          return;
        }

        console.log("Unhandled WS message:", msg.type);
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("Connection closed");
      socket = null; // Allow reconnection
    };
  }

  return socket;
}
