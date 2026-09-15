import { useEffect, useRef } from "react";
import Phaser from "phaser";

import { createGameConfig } from "./config";

interface GameCanvasProps {
  level: number;
}

export function GameCanvas({ level }: GameCanvasProps) {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    const config = createGameConfig(level);

    gameRef.current = new Phaser.Game(config);

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [level]);

  return <div id="game-container" />;
}
