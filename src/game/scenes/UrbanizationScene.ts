import Phaser from "phaser";

export class UrbanizationScene extends Phaser.Scene {
  constructor() {
    super("UrbanizationScene");
  }

  create() {
    this.add
      .text(640, 200, "NUESTRA URBANIZACIÓN", {
        fontFamily: '"Press Start 2P"',
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(640, 260, "Donde empieza todo", {
        fontFamily: '"Press Start 2P"',
        fontSize: "12px",
        color: "#ff98b5",
      })
      .setOrigin(0.5);

    this.add.rectangle(640, 680, 1280, 80, 0x342743);
  }
}
