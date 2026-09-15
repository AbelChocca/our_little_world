import { MainMenu } from "./components/MainMenu/MainMenu";
import { WorldMap } from "./components/WorldMap/WorldMap";
import { GameCanvas } from "./game/GameCanvas";

import { useGameStore } from "./store/gameStore";

function App() {
  const screen = useGameStore((state) => state.screen);

  switch (screen) {
    case "menu":
      return <MainMenu />;

    case "world-map":
      return <WorldMap />;

    case "urbanization":
      return <GameCanvas level={1} />;

    case "university":
      return <GameCanvas level={2} />;

    case "cinema":
      return <GameCanvas level={3} />;

    case "beach":
      return <GameCanvas level={4} />;

    case "japan":
      return <GameCanvas level={5} />;

    default:
      return <MainMenu />;
  }
}

export default App;
