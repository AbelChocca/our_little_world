import Phaser from "phaser";

interface SceneExitOptions {
  x: number;
  y: number;
  width: number;
  height: number;

  player: Phaser.GameObjects.GameObject;

  onExit: () => Promise<void> | void;
}

export function createSceneExit(
  scene: Phaser.Scene,
  options: SceneExitOptions,
): Phaser.GameObjects.Zone {
  const exit = scene.add.zone(
    options.x,
    options.y,
    options.width,
    options.height,
  );

  scene.physics.add.existing(exit, true);

  let triggered = false;

  scene.physics.add.overlap(options.player, exit, () => {
    if (triggered) {
      return;
    }

    triggered = true;
    void options.onExit();
  });

  return exit;
}
