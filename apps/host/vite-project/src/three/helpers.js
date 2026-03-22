import * as THREE from "three";

export function addHelpers(scene, cameraMap) {
  Object.values(cameraMap).forEach((cam) => {
    const helper = new THREE.CameraHelper(cam);
    scene.add(helper);
  });

  const grid = new THREE.GridHelper(10, 10);
  scene.add(grid);
}