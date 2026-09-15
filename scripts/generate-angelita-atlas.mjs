import { mkdir, writeFile } from "node:fs/promises";

const IMAGE_WIDTH = 1448;
const IMAGE_HEIGHT = 1086;

const sourceSizes = {
  idle: {
    width: 140,
    height: 190,
  },

  walk: {
    width: 150,
    height: 190,
  },

  jump: {
    width: 155,
    height: 215,
  },

  interact: {
    width: 160,
    height: 190,
  },

  punch: {
    width: 220,
    height: 190,
  },

  emote: {
    width: 170,
    height: 190,
  },
};

const animations = {
  idle: [
    [303, 3, 106, 177],
    [464, 3, 106, 177],
    [624, 3, 106, 177],
    [784, 3, 105, 177],
  ],

  walk: [
    [229, 187, 127, 172],
    [401, 187, 132, 172],
    [569, 187, 124, 172],
    [738, 187, 134, 172],
    [911, 187, 131, 172],
    [1081, 187, 126, 172],
  ],

  jump: [
    [231, 362, 128, 203],
    [395, 362, 135, 203],
    [563, 362, 125, 203],
    [730, 362, 135, 203],
    [890, 362, 141, 203],
    [1067, 362, 135, 203],
  ],

  interact: [
    [313, 563, 106, 174],
    [485, 563, 142, 174],
    [669, 563, 144, 174],
    [838, 563, 107, 174],
  ],

  punch: [
    [332, 743, 133, 167],
    [517, 743, 175, 167],
    [735, 743, 205, 167],
    [976, 743, 129, 167],
  ],

  emote: [
    [313, 914, 132, 172],
    [540, 914, 129, 172],
    [728, 914, 157, 172],
    [970, 914, 151, 172],
  ],
};

const frames = {};

for (const [animation, rectangles] of Object.entries(animations)) {
  const sourceSize = sourceSizes[animation];

  rectangles.forEach(([x, y, width, height], index) => {
    const name = `${animation}-${index}`;

    const offsetX = Math.round((sourceSize.width - width) / 2);

    const offsetY = sourceSize.height - height;

    frames[name] = {
      frame: {
        x,
        y,
        w: width,
        h: height,
      },

      rotated: false,
      trimmed: true,

      spriteSourceSize: {
        x: offsetX,
        y: offsetY,
        w: width,
        h: height,
      },

      sourceSize: {
        w: sourceSize.width,
        h: sourceSize.height,
      },
    };
  });
}

const atlas = {
  frames,
  meta: {
    app: "our-little-world",
    version: "1.0",
    image: "angelita_spritesheet.png",
    format: "RGBA8888",
    size: {
      w: IMAGE_WIDTH,
      h: IMAGE_HEIGHT,
    },
    scale: "1",
  },
};

await mkdir("public/sprites", { recursive: true });

await writeFile(
  "public/sprites/angelita_atlas.json",
  JSON.stringify(atlas, null, 2),
);

console.log("Atlas generado en public/sprites/angelita_atlas.json");
