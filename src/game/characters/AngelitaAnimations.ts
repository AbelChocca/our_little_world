import Phaser from "phaser";

const ANIMATION_PREFIX = "angelita";

export const ANGELITA_ANIMATIONS = {
  idle: `${ANIMATION_PREFIX}-idle`,
  walk: `${ANIMATION_PREFIX}-walk`,
  jump: `${ANIMATION_PREFIX}-jump`,
  interact: `${ANIMATION_PREFIX}-interact`,
  punch: `${ANIMATION_PREFIX}-punch`,
} as const;

export const ANGELITA_EMOTES = {
  dizzy: "emote-0",
  happy: "emote-1",
  sit: "emote-2",
  shy: "emote-3",
} as const;

function createAnimation(
  scene: Phaser.Scene,
  key: string,
  framePrefix: string,
  start: number,
  end: number,
  frameRate: number,
  repeat: number,
): void {
  if (scene.anims.exists(key)) {
    return;
  }

  scene.anims.create({
    key,
    frames: scene.anims.generateFrameNames("angelita", {
      prefix: framePrefix,
      start,
      end,
    }),
    frameRate,
    repeat,
  });
}

export function registerAngelitaAnimations(scene: Phaser.Scene): void {
  createAnimation(scene, ANGELITA_ANIMATIONS.idle, "idle-", 0, 3, 4, -1);

  createAnimation(scene, ANGELITA_ANIMATIONS.walk, "walk-", 0, 5, 10, -1);

  createAnimation(scene, ANGELITA_ANIMATIONS.jump, "jump-", 0, 5, 10, 0);

  createAnimation(scene, ANGELITA_ANIMATIONS.interact, "interact-", 0, 3, 7, 0);

  createAnimation(scene, ANGELITA_ANIMATIONS.punch, "punch-", 0, 3, 12, 0);
}
