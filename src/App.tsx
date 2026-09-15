import { useState } from "react";
import MainMenu from "./components/MainMenu";
import GameCanvas from "./game/GameCanvas";

function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <MainMenu onStart={() => setStarted(true)} />;
  }

  return <GameCanvas />;
}

export default App;
