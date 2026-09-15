import Phaser from "phaser";

import { Angelita } from "../characters/Angelita";

import { registerAngelitaAnimations } from "../characters/AngelitaAnimations";

import {
  createSimpleImageMap,
  type CollisionArea,
} from "../maps/SimpleImageMap";
import { DialogueBox } from "../dialogue/DialogueBox";
import type { DialogueSequence } from "../dialogue/DialogueTypes";
import { createSceneExit } from "./SceneExit";
import { changeScene } from "../transitions/changeScene";

export class UrbanizationScene extends Phaser.Scene {
  private angelita!: Angelita;
  private dialogue!: DialogueBox;

  private readonly introduction: DialogueSequence = [
    {
      sender: "Narrador",
      message: "Todo comenzó en una tranquila urbanización.",
    },
    {
      sender: "Angelita",
      message: "Siento que este callejón me resulta familiar...",
    },
    {
      sender: "Narrador",
      message: "Camina hacia el final y descubre qué te espera.",
    },
  ];

  private readonly ending: DialogueSequence = [
    {
      sender: "Angelita",
      message: "Creo que este es el final del callejón.",
    },
    {
      sender: "???",
      message: "No es el final. Apenas estamos comenzando.",
    },
  ];

  preload(): void {
    this.load.image("urbanization-background", "/scenes/urbanization_1.webp");

    this.load.atlas(
      "angelita",
      "/sprites/angelita_spritesheet.png",
      "/sprites/angelita_atlas.json",
    );
  }

  create(): void {
    registerAngelitaAnimations(this);

    const collisionAreas: CollisionArea[] = [
      {
        x: 888,
        y: 140,
        width: 1776,
        height: 280,
      },
      {
        x: 888,
        y: 750,
        width: 1776,
        height: 274,
      },
    ];

    const map = createSimpleImageMap(this, {
      textureKey: "urbanization-background",
      collisionAreas,
    });

    this.angelita = new Angelita(this, {
      x: 888,
      y: 500,
      speed: 220,
      scale: 0.75,

      onInteract: () => {
        if (this.dialogue.isOpen()) {
          return;
        }

        void this.playDialogue([
          {
            sender: "Angelita",
            message: "Este auto parece llevar mucho tiempo estacionado.",
          },
          {
            sender: "Narrador",
            message: "En el parabrisas hay una fotografía antigua.",
          },
        ]);
      },
    });

    const physicsObject = this.angelita.getPhysicsObject();

    for (const collisionObject of map.collisionObjects) {
      this.physics.add.collider(physicsObject, collisionObject);
    }

    this.cameras.main.centerOn(physicsObject.x, physicsObject.y);

    this.cameras.main.startFollow(physicsObject, true, 0.15, 0.15);

    this.dialogue = new DialogueBox(this);

    this.createExit();

    this.time.delayedCall(100, () => {
      void this.playDialogue(this.introduction);
    });
  }

  update(): void {
    this.angelita.update();
  }

  private async playDialogue(messages: DialogueSequence): Promise<void> {
    this.angelita.setControlsEnabled(false);

    try {
      await this.dialogue.play(messages);
    } finally {
      this.angelita.setControlsEnabled(true);
    }
  }

  private createExit(): void {
    const mapWidth = 1776;

    createSceneExit(this, {
      /*
       * Zona invisible al final derecho del callejón.
       */
      x: mapWidth - 35,
      y: 500,
      width: 70,
      height: 350,

      player: this.angelita.getPhysicsObject(),

      onExit: async () => {
        this.angelita.setControlsEnabled(false);

        await this.dialogue.play(this.ending);

        changeScene(this, "NextScene");
      },
    });
  }
}
