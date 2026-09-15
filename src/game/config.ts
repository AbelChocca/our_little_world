import Phaser from "phaser";

import { UrbanizationScene } from "./scenes/UrbanizationScene";

export function createGameConfig(level: number): Phaser.Types.Core.GameConfig {
  const scenes: Record<number, (typeof Phaser.Scene)[]> = {
    1: [UrbanizationScene],

    // Luego:
    // 2: [UniversityScene],
    // 3: [CinemaScene],
    // 4: [BeachScene],
    // 5: [JapanScene],
  };

  return {
    type: Phaser.AUTO,

    parent: "game-container",

    width: 1280,
    height: 720,

    backgroundColor: "#171327",

    physics: {
      default: "arcade",

      arcade: {
        gravity: {
          x: 0,
          y: 900,
        },

        debug: false,
      },
    },

    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: scenes[level] ?? [UrbanizationScene],
  };
}
