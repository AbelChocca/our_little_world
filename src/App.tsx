import { MainMenu } from "./components/MainMenu/MainMenu";

import { useGameStore } from "./store/gameStore";

function App() {
  const screen = useGameStore((state) => state.screen);

  if (screen === "menu") {
    return <MainMenu />;
  }

  return <div>GAME AQUÍ XD</div>;
}

export default App;
