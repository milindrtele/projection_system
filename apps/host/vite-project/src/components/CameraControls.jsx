import { useSceneStore } from "../store/UseSceneStore";
import { getSocket } from "../sockets/socket";

export default function CameraControls() {
  const { scene, activeCameraId, updateCamera } = useSceneStore();

  const socket = getSocket();

  if (!activeCameraId) return <div>Select a camera</div>;

  const handleMove = (deltaX) => {
    // 1. Get current camera
    const cam = scene.cameras.find((c) => c.id === activeCameraId);

    console.log("Active Camera ID:", activeCameraId);
    console.log("Camera from scene:", cam);

    if (!cam) return;

    // 2. Compute new position
    const newPosition = [
      cam.position[0] + deltaX,
      cam.position[1],
      cam.position[2],
    ];

    console.log("current cam id:", cam.id);
    console.log("New position:", newPosition);

    // 3. Update store
    updateCamera(activeCameraId, {
      position: newPosition,
    });

    // 4. Send FULL updated scene
    // const updatedScene = {
    //   ...scene,
    //   cameras: scene.cameras.map((c) =>
    //     c.id === activeCameraId ? { ...c, position: newPosition } : c,
    //   ),
    // };

    // ✅ get latest state AFTER update
    const latestScene = useSceneStore.getState().scene;

    // ✅ send that
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "scene:update",
          data: latestScene,
        }),
      );
    }

    // // Only send if socket is OPEN
    // if (socket.readyState === WebSocket.OPEN) {
    //   socket.send(
    //     JSON.stringify({
    //       type: "scene:update",
    //       data: updatedScene,
    //     }),
    //   );
    // } else {
    //   console.error("Socket not ready. State:", socket.readyState);
    // }
  };

  return (
    <div>
      <h4>Camera Controls</h4>

      <button onClick={() => handleMove(-1)}>Move X -</button>
      <button onClick={() => handleMove(1)}>Move X +</button>
    </div>
  );
}
