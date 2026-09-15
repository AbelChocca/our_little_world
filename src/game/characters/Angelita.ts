import Phaser from "phaser";

import { ANGELITA_ANIMATIONS, ANGELITA_EMOTES } from "./AngelitaAnimations";

type AngelitaEmote = keyof typeof ANGELITA_EMOTES;

type Direction = "up" | "down" | "left" | "right";

interface AngelitaControls {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;

  jump: Phaser.Input.Keyboard.Key;
  punch: Phaser.Input.Keyboard.Key;
  interact: Phaser.Input.Keyboard.Key;

  emoteDizzy: Phaser.Input.Keyboard.Key;
  emoteHappy: Phaser.Input.Keyboard.Key;
  emoteSit: Phaser.Input.Keyboard.Key;
  emoteShy: Phaser.Input.Keyboard.Key;
}

interface AngelitaOptions {
  x: number;
  y: number;

  speed?: number;
  scale?: number;

  onInteract?: (angelita: Angelita) => void;
  onPunch?: (angelita: Angelita) => void;
}

export class Angelita {
  private readonly scene: Phaser.Scene;

  /*
   * Zona invisible que contiene la posición real y las colisiones.
   * El sprite visual seguirá a esta zona.
   */
  private readonly bodyObject: Phaser.GameObjects.Zone;
  private readonly arcadeBody: Phaser.Physics.Arcade.Body;

  private readonly sprite: Phaser.GameObjects.Sprite;

  private readonly controls: AngelitaControls;
  private readonly cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  private readonly speed: number;

  private readonly onInteract?: (angelita: Angelita) => void;
  private readonly onPunch?: (angelita: Angelita) => void;

  private direction: Direction = "down";

  private animationLocked = false;
  private movementLocked = false;
  private isJumping = false;
  private jumpOffset = 0;

  constructor(scene: Phaser.Scene, options: AngelitaOptions) {
    this.scene = scene;

    this.speed = options.speed ?? 220;

    this.onInteract = options.onInteract;
    this.onPunch = options.onPunch;

    this.bodyObject = scene.add.zone(options.x, options.y, 42, 24);

    scene.physics.add.existing(this.bodyObject);

    this.arcadeBody = this.bodyObject.body as Phaser.Physics.Arcade.Body;

    /*
     * El juego tiene gravedad global, pero Angelita es top-down.
     * Por eso desactivamos la gravedad únicamente para ella.
     */
    this.arcadeBody.setAllowGravity(false).setCollideWorldBounds(true);

    this.sprite = scene.add
      .sprite(options.x, options.y, "angelita", "idle-0")
      .setOrigin(0.5, 1)
      .setScale(options.scale ?? 0.75);

    const keyboard = scene.input.keyboard;

    if (!keyboard) {
      throw new Error("El teclado de Phaser no está disponible.");
    }

    this.cursors = keyboard.createCursorKeys();

    this.controls = keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,

      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      punch: Phaser.Input.Keyboard.KeyCodes.J,
      interact: Phaser.Input.Keyboard.KeyCodes.E,

      emoteDizzy: Phaser.Input.Keyboard.KeyCodes.ONE,
      emoteHappy: Phaser.Input.Keyboard.KeyCodes.TWO,
      emoteSit: Phaser.Input.Keyboard.KeyCodes.THREE,
      emoteShy: Phaser.Input.Keyboard.KeyCodes.FOUR,
    }) as AngelitaControls;

    this.playAnimation(ANGELITA_ANIMATIONS.idle);
    this.syncVisual();
  }

  update(): void {
    this.syncVisual();

    this.handleCommands();

    if (this.movementLocked) {
      this.arcadeBody.setVelocity(0);
      return;
    }

    this.handleMovement();
  }

  private handleMovement(): void {
    const movement = new Phaser.Math.Vector2(0, 0);

    const movingLeft = this.controls.left.isDown || this.cursors.left.isDown;

    const movingRight = this.controls.right.isDown || this.cursors.right.isDown;

    const movingUp = this.controls.up.isDown || this.cursors.up.isDown;

    const movingDown = this.controls.down.isDown || this.cursors.down.isDown;

    if (movingLeft) movement.x -= 1;
    if (movingRight) movement.x += 1;
    if (movingUp) movement.y -= 1;
    if (movingDown) movement.y += 1;

    if (movement.lengthSq() === 0) {
      this.arcadeBody.setVelocity(0);

      if (!this.animationLocked) {
        this.playAnimation(ANGELITA_ANIMATIONS.idle);
      }

      return;
    }

    movement.normalize();

    const currentSpeed = this.isJumping ? this.speed * 1.35 : this.speed;

    movement.scale(currentSpeed);

    this.arcadeBody.setVelocity(movement.x, movement.y);

    this.updateDirection(movement);

    if (!this.animationLocked) {
      this.playAnimation(ANGELITA_ANIMATIONS.walk);
    }
  }

  private updateDirection(movement: Phaser.Math.Vector2): void {
    /*
     * Priorizamos el eje con mayor intensidad.
     */
    if (Math.abs(movement.x) >= Math.abs(movement.y)) {
      if (movement.x < 0) {
        this.direction = "left";
        this.sprite.setFlipX(true);
      } else {
        this.direction = "right";
        this.sprite.setFlipX(false);
      }

      return;
    }

    if (movement.y < 0) {
      this.direction = "up";
    } else {
      this.direction = "down";
    }
  }

  private handleCommands(): void {
    if (Phaser.Input.Keyboard.JustDown(this.controls.jump)) {
      void this.jump();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.punch)) {
      void this.punch();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.interact)) {
      void this.interact();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.emoteDizzy)) {
      void this.emote("dizzy");
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.emoteHappy)) {
      void this.emote("happy");
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.emoteSit)) {
      void this.emote("sit");
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.emoteShy)) {
      void this.emote("shy");
    }
  }

  async jump(): Promise<void> {
    if (this.animationLocked || this.isJumping) {
      return;
    }

    this.animationLocked = true;
    this.isJumping = true;

    this.sprite.play(ANGELITA_ANIMATIONS.jump, true);

    await new Promise<void>((resolve) => {
      this.scene.tweens.add({
        targets: this,
        jumpOffset: -55,

        duration: 300,
        ease: "Quad.Out",
        yoyo: true,

        onComplete: () => {
          this.jumpOffset = 0;
          resolve();
        },
      });
    });

    this.isJumping = false;
    this.animationLocked = false;
  }

  async punch(): Promise<void> {
    if (this.animationLocked) {
      return;
    }

    this.lockAction();

    try {
      this.onPunch?.(this);

      await this.playOneShotAnimation(ANGELITA_ANIMATIONS.punch);
    } finally {
      this.unlockAction();
    }
  }

  async interact(): Promise<void> {
    if (this.animationLocked) {
      return;
    }

    this.lockAction();

    try {
      this.onInteract?.(this);

      await this.playOneShotAnimation(ANGELITA_ANIMATIONS.interact);
    } finally {
      this.unlockAction();
    }
  }

  async emote(emote: AngelitaEmote): Promise<void> {
    if (this.animationLocked) {
      return;
    }

    this.lockAction();

    try {
      this.sprite.stop();
      this.sprite.setFrame(ANGELITA_EMOTES[emote]);

      await new Promise<void>((resolve) => {
        this.scene.time.delayedCall(900, resolve);
      });
    } finally {
      this.unlockAction();
    }
  }

  private lockAction(): void {
    this.animationLocked = true;
    this.movementLocked = true;

    this.arcadeBody.setVelocity(0);
  }

  private unlockAction(): void {
    this.animationLocked = false;
    this.movementLocked = false;
  }

  private playAnimation(key: string): void {
    if (this.sprite.anims.currentAnim?.key === key) {
      return;
    }

    this.sprite.play(key, true);
  }

  private playOneShotAnimation(key: string): Promise<void> {
    return new Promise((resolve) => {
      this.sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () =>
        resolve(),
      );

      this.sprite.play(key, true);
    });
  }

  private syncVisual(): void {
    this.sprite.setPosition(
      this.bodyObject.x,
      this.bodyObject.y + this.jumpOffset,
    );

    /*
     * Objetos ubicados más abajo aparecen delante.
     */
    this.sprite.setDepth(Math.floor(this.bodyObject.y));
  }

  getPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.bodyObject.x, this.bodyObject.y);
  }

  getDirection(): Direction {
    return this.direction;
  }

  getPhysicsObject(): Phaser.GameObjects.Zone {
    return this.bodyObject;
  }

  setControlsEnabled(enabled: boolean): void {
    this.movementLocked = !enabled;

    if (!enabled) {
      this.arcadeBody.setVelocity(0);
      this.playAnimation(ANGELITA_ANIMATIONS.idle);
    }
  }

  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  setPosition(x: number, y: number): void {
    this.bodyObject.setPosition(x, y);
    this.syncVisual();
  }

  destroy(): void {
    this.scene.tweens.killTweensOf(this);
    this.sprite.destroy();
    this.bodyObject.destroy();
  }
}
