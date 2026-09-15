import Phaser from "phaser";

import type { DialogueMessage, DialogueSequence } from "./DialogueTypes";

export class DialogueBox {
  private readonly scene: Phaser.Scene;

  private readonly container: Phaser.GameObjects.Container;
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly senderText: Phaser.GameObjects.Text;
  private readonly messageText: Phaser.GameObjects.Text;
  private readonly continueText: Phaser.GameObjects.Text;

  private currentMessage?: DialogueMessage;
  private displayedCharacters = 0;

  private typewriterTimer?: Phaser.Time.TimerEvent;
  private continueResolver?: () => void;

  private open = false;
  private writing = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    const camera = scene.cameras.main;

    const width = Math.min(camera.width - 48, 1000);

    const height = 180;

    this.background = scene.add
      .rectangle(0, 0, width, height, 0x171327, 0.96)
      .setStrokeStyle(5, 0xff98b5)
      .setOrigin(0.5);

    this.senderText = scene.add.text(-width / 2 + 30, -height / 2 + 22, "", {
      fontFamily: '"Press Start 2P"',
      fontSize: "15px",
      color: "#ff98b5",
    });

    this.messageText = scene.add.text(-width / 2 + 30, -height / 2 + 62, "", {
      fontFamily: '"Press Start 2P"',
      fontSize: "12px",
      color: "#ffffff",

      wordWrap: {
        width: width - 60,
      },

      lineSpacing: 10,
    });

    this.continueText = scene.add
      .text(width / 2 - 30, height / 2 - 24, "ENTER  ▼", {
        fontFamily: '"Press Start 2P"',
        fontSize: "9px",
        color: "#f7c8dc",
      })
      .setOrigin(1);

    this.container = scene.add
      .container(camera.width / 2, camera.height - height / 2 - 28, [
        this.background,
        this.senderText,
        this.messageText,
        this.continueText,
      ])
      .setScrollFactor(0)
      .setDepth(100_000)
      .setVisible(false);

    /*
     * Toda la caja puede recibir clics.
     */
    this.background.setInteractive({
      useHandCursor: true,
    });

    this.background.on(Phaser.Input.Events.POINTER_DOWN, () => this.continue());

    scene.input.keyboard?.on("keydown-ENTER", this.continue, this);

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  async play(sequence: DialogueSequence): Promise<void> {
    if (this.open || sequence.length === 0) {
      return;
    }

    this.open = true;
    this.container.setVisible(true);

    for (const message of sequence) {
      await this.showMessage(message);
    }

    this.container.setVisible(false);
    this.open = false;
  }

  private async showMessage(message: DialogueMessage): Promise<void> {
    this.currentMessage = message;
    this.displayedCharacters = 0;
    this.writing = true;

    this.senderText.setText(message.sender);
    this.messageText.setText("");
    this.continueText.setVisible(false);

    this.typewriterTimer?.remove();

    this.typewriterTimer = this.scene.time.addEvent({
      delay: 28,
      repeat: Math.max(message.message.length - 1, 0),

      callback: () => {
        this.displayedCharacters += 1;

        this.messageText.setText(
          message.message.slice(0, this.displayedCharacters),
        );

        if (this.displayedCharacters >= message.message.length) {
          this.finishWriting();
        }
      },
    });

    await new Promise<void>((resolve) => {
      this.continueResolver = resolve;
    });
  }

  private continue(): void {
    if (!this.open || !this.currentMessage) {
      return;
    }

    /*
     * Primer Enter/clic:
     * muestra inmediatamente todo el mensaje.
     */
    if (this.writing) {
      this.typewriterTimer?.remove();

      this.messageText.setText(this.currentMessage.message);

      this.finishWriting();
      return;
    }

    /*
     * Segundo Enter/clic:
     * continúa al siguiente mensaje.
     */
    const resolve = this.continueResolver;

    this.continueResolver = undefined;
    resolve?.();
  }

  private finishWriting(): void {
    this.writing = false;
    this.continueText.setVisible(true);
  }

  isOpen(): boolean {
    return this.open;
  }

  destroy(): void {
    this.typewriterTimer?.remove();

    this.scene.input.keyboard?.off("keydown-ENTER", this.continue, this);

    this.container.destroy(true);
  }
}
