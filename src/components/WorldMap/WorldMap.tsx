import "./WorldMap.css";

import worldMap from "../../assets/world-map.png";

import { useGameStore } from "../../store/gameStore";

interface World {
  id: number;
  name: string;
  subtitle: string;

  x: number;
  y: number;
}

const worlds: World[] = [
  {
    id: 1,
    name: "Nuestra Urbanización",
    subtitle: "Donde empieza todo",
    x: 20,
    y: 32,
  },
  {
    id: 2,
    name: "La Universidad",
    subtitle: "Nuestra rutina",
    x: 50,
    y: 45,
  },
  {
    id: 3,
    name: "El Cine",
    subtitle: "Nuestras historias",
    x: 82,
    y: 33,
  },
  {
    id: 4,
    name: "La Playa",
    subtitle: "Nuestro escape",
    x: 25,
    y: 75,
  },
  {
    id: 5,
    name: "Japón",
    subtitle: "Nuestro futuro",
    x: 73,
    y: 75,
  },
];

export function WorldMap() {
  const enterLevel = useGameStore((state) => state.enterLevel);

  const completedLevels = useGameStore((state) => state.completedLevels);

  const isLevelUnlocked = useGameStore((state) => state.isLevelUnlocked);

  const goToMenu = useGameStore((state) => state.goToMenu);

  return (
    <main
      className="world-map"
      style={{
        backgroundImage: `url(${worldMap})`,
      }}
    >
      <div className="world-map-overlay" />

      <header className="world-map-header">
        <button className="back-button" onClick={goToMenu}>
          ← VOLVER
        </button>

        <div>
          <h1>OUR LITTLE WORLD</h1>

          <p>Elige nuestro próximo recuerdo</p>
        </div>
      </header>

      <section className="worlds">
        {worlds.map((world) => {
          const unlocked = isLevelUnlocked(world.id);

          const completed = completedLevels.includes(world.id);

          return (
            <button
              key={world.id}
              className={`
                world-node
                ${unlocked ? "unlocked" : "locked"}
                ${completed ? "completed" : ""}
              `}
              style={{
                left: `${world.x}%`,
                top: `${world.y}%`,
              }}
              disabled={!unlocked}
              onClick={() => enterLevel(world.id)}
            >
              <div className="world-icon">
                {completed ? "✓" : unlocked ? world.id : "🔒"}
              </div>

              <div className="world-info">
                <strong>{world.name}</strong>

                <span>{unlocked ? world.subtitle : "Bloqueado"}</span>
              </div>
            </button>
          );
        })}
      </section>

      <div className="world-map-progress">
        {completedLevels.length} / 5 mundos completados
      </div>
    </main>
  );
}
