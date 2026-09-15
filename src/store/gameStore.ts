import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GameScreen =
  | "menu"
  | "world-map"
  | "urbanization"
  | "university"
  | "cinema"
  | "beach"
  | "japan";

interface GameState {
  screen: GameScreen;

  completedLevels: number[];

  startGame: () => void;
  goToMenu: () => void;
  goToWorldMap: () => void;

  enterLevel: (level: number) => void;
  completeLevel: (level: number) => void;

  isLevelUnlocked: (level: number) => boolean;

  resetProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: "menu",

      completedLevels: [],

      startGame: () => {
        set({
          screen: "world-map",
        });
      },

      goToMenu: () => {
        set({
          screen: "menu",
        });
      },

      goToWorldMap: () => {
        set({
          screen: "world-map",
        });
      },

      enterLevel: (level) => {
        if (!get().isLevelUnlocked(level)) {
          return;
        }

        const screens: Record<number, GameScreen> = {
          1: "urbanization",
          2: "university",
          3: "cinema",
          4: "beach",
          5: "japan",
        };

        set({
          screen: screens[level],
        });
      },

      completeLevel: (level) => {
        const completedLevels = get().completedLevels;

        if (completedLevels.includes(level)) {
          return;
        }

        set({
          completedLevels: [...completedLevels, level],
        });
      },

      isLevelUnlocked: (level) => {
        if (level === 1) {
          return true;
        }

        return get().completedLevels.includes(level - 1);
      },

      resetProgress: () => {
        set({
          completedLevels: [],
          screen: "menu",
        });
      },
    }),
    {
      name: "our-little-world-progress",
    },
  ),
);
