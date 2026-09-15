import Phaser from "phaser";

export interface CollisionArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SimpleImageMapOptions {
  textureKey: string;

  collisionAreas: CollisionArea[];
}

export interface SimpleImageMap {
  width: number;
  height: number;

  collisionObjects: Phaser.GameObjects.Rectangle[];
}

export function createSimpleImageMap(
  scene: Phaser.Scene,
  options: SimpleImageMapOptions,
): SimpleImageMap {
  const background = scene.add
    .image(0, 0, options.textureKey)
    .setOrigin(0)
    .setDepth(-10_000);

  const width = background.width;
  const height = background.height;

  scene.physics.world.setBounds(0, 0, width, height);

  scene.cameras.main.setBounds(0, 0, width, height);

  const collisionObjects = options.collisionAreas.map((area) => {
    const rectangle = scene.add.rectangle(
      area.x,
      area.y,
      area.width,
      area.height,
      0xff0000,
      0,
    );

    scene.physics.add.existing(rectangle, true);

    return rectangle;
  });

  return {
    width,
    height,
    collisionObjects,
  };
}
