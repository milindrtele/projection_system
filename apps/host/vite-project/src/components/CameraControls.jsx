import { useSceneStore } from "../store/UseSceneStore";
import { getSocket } from "../sockets/socket";

export default function CameraControls() {
  const { scene, activeCameraId, updateCamera } = useSceneStore();

  const socket = getSocket();

  if (!activeCameraId) return <div>Select a camera</div>;

  const handleMove = (increment, axis) => {
    // 1. Get current camera
    const cam = scene.cameras.find((c) => c.id === activeCameraId);

    console.log("Active Camera ID:", activeCameraId);
    console.log("Camera from scene:", cam);

    if (!cam) return;

    const deltaX = axis === "x" ? increment : 0;
    const deltaY = axis === "y" ? increment : 0;
    const deltaZ = axis === "z" ? increment : 0;
    // 2. Compute new position
    const newPosition = [
      cam.position[0] + deltaX,
      cam.position[1] + deltaY,
      cam.position[2] + deltaZ,
    ];

    console.log("current cam id:", cam.id);
    console.log("New position:", newPosition);

    // 3. Update store
    updateCamera(activeCameraId, {
      position: newPosition,
    });

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
  };

  const handleRotate = (increment, axis) => {
    // 1. Get current camera
    const cam = scene.cameras.find((c) => c.id === activeCameraId);

    console.log("Active Camera ID:", activeCameraId);
    console.log("Camera from scene:", cam);

    if (!cam) return;

    const deltaX = axis === "x" ? increment : 0;
    const deltaY = axis === "y" ? increment : 0;
    const deltaZ = axis === "z" ? increment : 0;
    // 2. Compute new position
    const newRotation = [
      cam.rotation[0] + deltaX,
      cam.rotation[1] + deltaY,
      cam.rotation[2] + deltaZ,
    ];

    console.log("current cam id:", cam.id);
    console.log("New rotation:", newRotation);

    // 3. Update store
    updateCamera(activeCameraId, {
      rotation: newRotation,
    });

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
  };

  const handleFov = (increment) => {
    // 1. Get current camera
    const cam = scene.cameras.find((c) => c.id === activeCameraId);

    if (!cam) return;

    // 2. Compute new FOV
    const newFov = cam.fov + increment;

    // 3. Update store
    updateCamera(activeCameraId, {
      fov: newFov,
    });

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
  };

  return (
    <div>
      <h4>Camera Controls</h4>

      <button onClick={() => handleMove(-1, "x")}>Move X -</button>
      <button onClick={() => handleMove(1, "x")}>Move X +</button>
      <br />
      <button onClick={() => handleMove(-1, "y")}>Move Y -</button>
      <button onClick={() => handleMove(1, "y")}>Move Y +</button>
      <br />
      <button onClick={() => handleMove(-1, "z")}>Move Z -</button>
      <button onClick={() => handleMove(1, "z")}>Move Z +</button>
      <br />
      <br />
      <button onClick={() => handleRotate(-0.1, "x")}>Rotate X -</button>
      <button onClick={() => handleRotate(0.1, "x")}>Rotate X +</button>
      <br />
      <button onClick={() => handleRotate(-0.1, "y")}>Rotate Y -</button>
      <button onClick={() => handleRotate(0.1, "y")}>Rotate Y +</button>
      <br />
      <button onClick={() => handleRotate(-0.1, "z")}>Rotate Z -</button>
      <button onClick={() => handleRotate(0.1, "z")}>Rotate Z +</button>
      <br />
      <br />
      <button onClick={() => handleFov(-1)}>FOV -</button>
      <button onClick={() => handleFov(1)}>FOV +</button>
    </div>
  );
}
