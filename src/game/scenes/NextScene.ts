import Phaser from "phaser";

import { DialogueBox } from "../dialogue/DialogueBox";

export class NextScene extends Phaser.Scene {
  private dialogue!: DialogueBox;

  constructor() {
    super("NextScene");
  }

  preload(): void {
    /*
     * Aquí cargarás la imagen de esta escena.
     * Por ahora podemos probar con un fondo simple.
     */
  }

  create(): void {
    this.cameras.main.fadeIn(600, 0, 0, 0);

    this.add.rectangle(640, 360, 1280, 720, 0x19152b);

    this.add
      .text(640, 260, "SIGUIENTE ESCENA", {
        fontFamily: '"Press Start 2P"',
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.dialogue = new DialogueBox(this);

    this.time.delayedCall(700, () => {
      void this.dialogue.play([
        {
          sender: "Narrador",
          message: "Angelita había llegado al final del callejón.",
        },
        {
          sender: "Angelita",
          message: "Definitivamente recuerdo este lugar...",
        },
      ]);
    });
  }
}
