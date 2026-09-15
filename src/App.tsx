import { MainMenu } from "./components/MainMenu/MainMenu";
import { WorldMap } from "./components/WorldMap/WorldMap";

import { useGameStore } from "./store/gameStore";

function App() {
  const screen = useGameStore((state) => state.screen);

  switch (screen) {
    case "menu":
      return <MainMenu />;

    case "world-map":
      return <WorldMap />;

    case "urbanization":
      return <div>NIVEL 1 - URBANIZACIÓN</div>;

    case "university":
      return <div>NIVEL 2 - UNIVERSIDAD</div>;

    case "cinema":
      return <div>NIVEL 3 - CINE</div>;

    case "beach":
      return <div>NIVEL 4 - PLAYA</div>;

    case "japan":
      return <div>NIVEL 5 - JAPÓN</div>;

    default:
      return <MainMenu />;
  }
}

export default App;
