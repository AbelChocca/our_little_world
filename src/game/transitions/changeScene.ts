import Phaser from "phaser";

export function changeScene(
  scene: Phaser.Scene,
  nextSceneKey: string,
  duration = 600,
): void {
  scene.cameras.main.fadeOut(duration, 0, 0, 0);

  scene.cameras.main.once(
    Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
    () => {
      scene.scene.start(nextSceneKey);
    },
  );
}
