import fs from "fs";

const FILE = "../scene.json";

let scene = JSON.parse(fs.readFileSync(FILE, "utf-8"));

export function getScene() {
  return scene;
}

export function updateScene(newScene) {
  scene = newScene;

  fs.writeFileSync(FILE, JSON.stringify(scene, null, 2));
}