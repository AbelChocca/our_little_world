import "./MainMenu.css";

import { useGameStore } from "../../store/gameStore";

export function MainMenu() {
  const startGame = useGameStore((state) => state.startGame);

  return (
    <main className="main-menu">
      <div className="menu-stars" />

      <section className="menu-content">
        <div className="heart">♥</div>

        <h1>
          OUR LITTLE
          <span>WORLD</span>
        </h1>

        <p className="subtitle">Una pequeña aventura sobre nosotros</p>

        <nav className="menu-options">
          <button className="menu-button primary" onClick={startGame}>
            ▶ COMENZAR
          </button>

          <button className="menu-button">MEMORIAS</button>

          <button className="menu-button">CONFIGURACION</button>
        </nav>

        <p className="menu-footer">Hecho con ♥ para ti</p>
      </section>
    </main>
  );
}
