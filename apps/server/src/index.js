import { WebSocketServer } from "ws";
import { getScene, updateScene } from "./state.js";

const wss = new WebSocketServer({ port: 3000 });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);

  // ✅ Send full scene on connect
  ws.send(
    JSON.stringify({
      type: "scene:init",
      data: getScene()
    })
  );

  ws.on("message", (message) => {
    let msg;
    try {
      msg = JSON.parse(message);
    } catch (err) {
      console.error("Failed to parse message:", err);
      return;
    }

    console.log("camera", msg.type === "scene:update" ? msg.data.cameras : "N/A");

    if (msg.type === "scene:update") {
      try {
        updateScene(msg.data);
      } catch (err) {
        console.error("Failed to update scene file:", err);
        // don't close the server — just log the failure
      }

      // broadcast updated scene (protect individual client sends)
      clients.forEach((client) => {
        if (client.readyState === 1) {
          try {
            client.send(JSON.stringify(msg));
          } catch (err) {
            console.error("Failed to send to client:", err);
          }
        }
      });
    }
  });

  ws.on("error", (err) => {
    console.error("WebSocket client error:", err);
  });

  ws.on("close", () => {
    clients = clients.filter((c) => c !== ws);
  });
});

console.log("WebSocket server running on ws://localhost:3000");