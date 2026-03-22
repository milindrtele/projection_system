import * as THREE from "three";

const cameraMap = [];

export function createCameras(scene, sceneData = { cameras: [] }) {
  console.log("Creating cameras with scene data:", sceneData);
  sceneData.cameras.forEach((camData) => {
    const cam = new THREE.PerspectiveCamera(
      camData.fov,
      1,
      0.1,
      100
    );

    cam.position.set(...camData.position);
    cam.rotation.set(...camData.rotation);

    cameraMap[camData.id] = cam;
    scene.add(cam);
  });

  return cameraMap;
}

export function getCameraById(id) {
  return cameraMap[id];
}

export function getAllCameras() {
  return cameraMap;
}