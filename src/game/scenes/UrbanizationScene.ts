import Phaser from "phaser";

import { Angelita } from "../characters/Angelita";
import { registerAngelitaAnimations } from "../characters/AngelitaAnimations";

export class UrbanizationScene extends Phaser.Scene {
  private angelita!: Angelita;

  constructor() {
    super("UrbanizationScene");
  }

  preload(): void {
    this.load.atlas(
      "angelita",
      "/sprites/angelita_spritesheet.png",
      "/sprites/angelita_atlas.json",
    );
  }

  create(): void {
    registerAngelitaAnimations(this);

    const mapWidth = 2400;
    const mapHeight = 1600;

    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    this.add
      .rectangle(mapWidth / 2, mapHeight / 2, mapWidth, mapHeight, 0x342743)
      .setDepth(-1);

    this.angelita = new Angelita(this, {
      x: 640,
      y: 360,
      speed: 220,
      scale: 0.75,

      onInteract: (angelita) => {
        console.log(
          "Interacción:",
          angelita.getPosition(),
          angelita.getDirection(),
        );
      },

      onPunch: (angelita) => {
        console.log("Golpe:", angelita.getPosition(), angelita.getDirection());
      },
    });

    this.cameras.main.startFollow(
      this.angelita.getPhysicsObject(),
      true,
      0.1,
      0.1,
    );
  }

  update(): void {
    this.angelita.update();
  }
}
