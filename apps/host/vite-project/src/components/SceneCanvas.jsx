import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createScene } from "../three/scene";
import { createCameras } from "../three/cameras";
import { addHelpers } from "../three/helpers";
import { useSceneStore } from "../store/UseSceneStore";
import { getCameraById } from "../three/cameras";
import { use } from "react";

export default function SceneCanvas() {
  const mountRef = useRef();
  const sceneData = useSceneStore((state) => state.scene);
  const [sceneInitialised, setSceneInitialised] = useState(false);

  useEffect(() => {
    if (!sceneData || !sceneData.cameras?.length) return;

    console.log("Initializing scene with data:", sceneData);

    const scene = createScene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 300, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const editorCamera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    editorCamera.position.set(5, 5, 5);
    editorCamera.lookAt(0, 0, 0);

    console.log(sceneData);

    const cameras = createCameras(scene, sceneData || { cameras: [] });
    addHelpers(scene, cameras);

    const controls = new OrbitControls(editorCamera, renderer.domElement);
    // controls.update() must be called after any manual changes to the camera's transform
    editorCamera.position.set(-10, 10, 10);
    controls.update();

    window.addEventListener("resize", () => {
      editorCamera.aspect = window.innerWidth / window.innerHeight;
      editorCamera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
      requestAnimationFrame(animate);

      controls.update();
      renderer.render(scene, editorCamera);
    }

    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [sceneInitialised]);

  useEffect(() => {
    if (!sceneData || !sceneData.cameras?.length) return;
    setSceneInitialised(true);
  }, [sceneData]);

  useEffect(() => {
    const unsubscribe = useSceneStore.subscribe((state) => {
      const { scene, activeCameraId } = state;

      console.log("Scene updated in subscribe:", scene);

      if (!scene || !scene.cameras) return;

      scene.cameras.forEach((camData) => {
        const cam = getCameraById(camData.id);

        console.log(
          "Updating camera in subscribe, ID:",
          camData.id,
          "Camera from map:",
          cam,
        );
        if (!cam) return;

        // ✅ Full sync
        cam.position.set(...camData.position);
        cam.rotation.set(...camData.rotation);
        cam.fov = camData.fov;
        cam.updateProjectionMatrix();
      });
    });

    return () => unsubscribe();
  }, []);

  return <div ref={mountRef} />;
}
