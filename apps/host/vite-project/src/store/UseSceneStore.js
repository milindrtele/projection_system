import { create } from "zustand";

export const useSceneStore = create((set) => ({
  scene: {
    cameras: []
  },

  activeCameraId: null,

  setScene: (scene) => set({ scene }),

  setActiveCamera: (id) => set({ activeCameraId: id }),

  updateCamera: (id, newData) =>
    set((state) => {
      const updated = {
        ...state.scene,
        cameras: state.scene.cameras.map((c) =>
          c.id === id ? { ...c, ...newData } : c
        )
      };

      return { scene: updated };
    })
}));