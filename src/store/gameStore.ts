import { create } from "zustand";

type GameScreen = "menu" | "game";

interface GameState {
  screen: GameScreen;
  memoriesFound: number;
  lettersFound: number;
  easterEggsFound: number;

  startGame: () => void;
  returnToMenu: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: "menu",

  memoriesFound: 0,
  lettersFound: 0,
  easterEggsFound: 0,

  startGame: () => set({ screen: "game" }),

  returnToMenu: () => set({ screen: "menu" }),
}));
