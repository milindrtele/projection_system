import { useSceneStore } from "../store/UseSceneStore.js";

export default function CameraList() {
  const { scene, setActiveCamera, activeCameraId } = useSceneStore();

  // Guard against undefined scene or missing cameras
  if (!scene || !scene.cameras || scene.cameras.length === 0) {
    return <div><h4>Cameras</h4><p>Loading...</p></div>;
  }

  return (
    <div>
      <h4>Cameras</h4>

      {scene.cameras.map((cam) => (
        <div
          key={cam.id}
          onClick={() => setActiveCamera(cam.id)}
          style={{
            padding: "5px",
            cursor: "pointer",
            background: activeCameraId === cam.id ? "orange" : "transparent"
          }}
        >
          {cam.id}
        </div>
      ))}
      <div
          onClick={() =>{} }
          style={{
            marginTop: "10px",
            padding: "5px",
            cursor: "pointer",
            background: "green"
          }}
        >
          Add Camera
        </div>
    </div>
  );
}