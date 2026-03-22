import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./App.css";

export default function App() {
  const canvasRef = useRef();
  const params = new URLSearchParams(window.location.search);
  const clientId = params.get("camId") || "cam1";

  console.log("Client:", clientId);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    //texture
    const loader = new THREE.TextureLoader();
    const texture = loader.load("/plan.png");

    // ground plane
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // socket
    const socket = new WebSocket("ws://localhost:3000");

    function loadScene(sceneData) {

      const cam = sceneData.cameras.find((c) => c.id === clientId);

      camera.position.set(...cam.position);
      camera.rotation.set(...cam.rotation);
      camera.fov = cam.fov;
      camera.updateProjectionMatrix();
    }
    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "scene:init" || data.type === "scene:update") {
        loadScene(data.data);
      }
    };

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  }, []);
  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
}
