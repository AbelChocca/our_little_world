import Phaser from "phaser";

import { UrbanizationScene } from "./scenes/UrbanizationScene";
import { NextScene } from "./scenes/NextScene";

export function createGameConfig(level: number): Phaser.Types.Core.GameConfig {
  const scenes: Record<number, (typeof Phaser.Scene)[]> = {
    /*
     * La primera escena del arreglo se inicia
     * automáticamente.
     *
     * Las demás quedan registradas y disponibles.
     */
    1: [UrbanizationScene, NextScene],
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
          y: 0,
        },

        debug: false,
      },
    },

    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    scene: scenes[level] ?? [UrbanizationScene, NextScene],
  };
}
