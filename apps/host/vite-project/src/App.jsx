import { useEffect } from "react";
import SceneCanvas from "./components/SceneCanvas";
import CameraControls from "./components/CameraControls";
import CameraList from "./components/CameraList";
import { useSceneStore } from "./store/UseSceneStore";
import { getSocket } from "./sockets/socket";

import "./App.css";

export default function App() {
  const setScene = useSceneStore((state) => state.setScene);

  useEffect(() => {
    const socket = getSocket();

    socket.onopen = () => {
      console.log("✅ Connected to server");
    };

    socket.onmessage = (msg) => {
      console.log("📩 Message received:", msg.data);
      const data = JSON.parse(msg.data);

      // ✅ Initial scene load
      if (data.type === "scene:init" && data.data) {
        console.log("Scene loaded:", data.data);
        setScene(data.data);
      }

      // ✅ Scene updates
      if (data.type === "scene:update" && data.data) {
        setScene(data.data);
      }
    };
  }, [setScene]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 3D View */}
      <div style={{ flex: 1 }}>
        <SceneCanvas />
      </div>

      {/* Side Panel */}
      <div style={{ width: "300px", padding: "10px", background: "#111", color: "#fff" }}>
        <h3>Controls</h3>
        <CameraControls />
        <CameraList />
      </div>

    </div>
  );
}