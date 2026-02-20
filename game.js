const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const hud = {
  levelText: document.getElementById("levelText"),
  coinText: document.getElementById("coinText"),
  coinTotal: document.getElementById("coinTotal"),
  livesText: document.getElementById("livesText"),
  timeText: document.getElementById("timeText"),
  weaponIcon: document.getElementById("weaponIcon"),
  weaponText: document.getElementById("weaponText"),
};

const startScreen = document.getElementById("startScreen");
const winScreen = document.getElementById("winScreen");
const challengeModal = document.getElementById("challengeModal");
const challengePrompt = document.getElementById("challengePrompt");
const challengeCode = document.getElementById("challengeCode");
const challengeInput = document.getElementById("challengeInput");
const challengeHint = document.getElementById("challengeHint");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const checkAnswer = document.getElementById("checkAnswer");
const closeChallenge = document.getElementById("closeChallenge");
const speakLesson = document.getElementById("speakLesson");
const speakChallenge = document.getElementById("speakChallenge");
const showHint = document.getElementById("showHint");
const challengeTopicTitle = document.getElementById("challengeTopicTitle");
const challengeTopicText = document.getElementById("challengeTopicText");
const playerSelect = document.getElementById("playerSelect");
const toast = document.getElementById("toast");
const modeBasicBtn = document.getElementById("modeBasic");
const modeIntermediateBtn = document.getElementById("modeIntermediate");
const levelSelect = document.getElementById("levelSelect");
const gameTypePlatformBtn = document.getElementById("gameTypePlatform");
const gameTypeStrategyBtn = document.getElementById("gameTypeStrategy");
const gameTypeAdventureBtn = document.getElementById("gameTypeAdventure");
const menuPlatformBtn = document.getElementById("menuPlatformBtn");
const menuStrategyBtn = document.getElementById("menuStrategyBtn");
const menuAdventureBtn = document.getElementById("menuAdventureBtn");
const fullscreenToggleBtn = document.getElementById("fullscreenToggleBtn");
const platformConfig = document.getElementById("platformConfig");
const strategyConfig = document.getElementById("strategyConfig");
const adventureConfig = document.getElementById("adventureConfig");
const winText = document.getElementById("winText");
const noteGoal = document.getElementById("noteGoal");
const noteLearn = document.getElementById("noteLearn");

const GRAVITY = 0.45;
const MOVE_SPEED = 3.4;
const JUMP_SPEED = -16;

const assets = {
  images: {},
  sounds: {},
};

const keys = {
  left: false,
  right: false,
  jump: false,
  attack: false,
};

const defaultLevels = [
  {
    name: "Secuencia",
    intro: true,
    width: 1800,
    spawn: { x: 80, y: 360 },
    goal: { x: 1680, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 1800, h: 60 },
      { x: 300, y: 390, w: 220, h: 20 },
      { x: 650, y: 330, w: 220, h: 20 },
      { x: 1000, y: 270, w: 220, h: 20 },
      { x: 1350, y: 330, w: 220, h: 20 },
    ],
    coins: [
      { x: 350, y: 330 },
      { x: 700, y: 270 },
      { x: 1050, y: 210 },
      { x: 1400, y: 270 },
    ],
    enemies: [
      { x: 520, y: 420, w: 48, h: 48, minX: 480, maxX: 620, vx: 1.2 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: el personaje quiere avanzar. Elige la accion correcta.",
        code: "¿Que accion hace avanzar?",
        options: [
          "Mover derecha",
          "Saltar",
          "Abrir puerta",
        ],
        expectedIndex: 0,
        hint: "Mover a la derecha hace avanzar.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la accion para mover al personaje:",
        code: "Mover derecha",
        expected: "Mover derecha",
        hint: "Recuerda: una instruccion termina con ;",
      },
    },
  },
  {
    name: "Condicional",
    intro: true,
    width: 2000,
    spawn: { x: 80, y: 360 },
    goal: { x: 1870, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2000, h: 60 },
      { x: 260, y: 400, w: 180, h: 20 },
      { x: 520, y: 330, w: 200, h: 20 },
      { x: 860, y: 300, w: 220, h: 20 },
      { x: 1200, y: 260, w: 200, h: 20 },
      { x: 1500, y: 320, w: 200, h: 20 },
    ],
    coins: [
      { x: 300, y: 340 },
      { x: 570, y: 270 },
      { x: 920, y: 240 },
      { x: 1250, y: 200 },
      { x: 1550, y: 260 },
    ],
    enemies: [
      { x: 700, y: 420, w: 48, h: 48, minX: 680, maxX: 860, vx: 1.5 },
      { x: 1350, y: 420, w: 48, h: 48, minX: 1320, maxX: 1500, vx: 1.3 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: el personaje tiene una llave. ¿Que debe hacer?",
        code: "¿Que debe hacer?",
        options: [
          "Abrir puerta",
          "Saltar",
          "Mover derecha",
        ],
        expectedIndex: 0,
        hint: "Si hay llave, abrimos la puerta.",
      },
      intermediate: {
        type: "text",
        prompt: "Contexto: el personaje tiene una llave. Completa la accion correcta.",
        code: "____",
        expected: "Abrir puerta",
        hint: "La accion es abrir la puerta.",
      },
    },
    reward: { weapon: "sword" },
  },
  {
    name: "Ciclos",
    intro: true,
    width: 2200,
    spawn: { x: 80, y: 360 },
    goal: { x: 2050, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2200, h: 60 },
      { x: 240, y: 380, w: 200, h: 20 },
      { x: 520, y: 320, w: 200, h: 20 },
      { x: 820, y: 260, w: 200, h: 20 },
      { x: 1120, y: 320, w: 200, h: 20 },
      { x: 1420, y: 260, w: 200, h: 20 },
      { x: 1720, y: 320, w: 200, h: 20 },
    ],
    coins: [
      { x: 280, y: 320 },
      { x: 570, y: 260 },
      { x: 870, y: 200 },
      { x: 1170, y: 260 },
      { x: 1470, y: 200 },
      { x: 1770, y: 260 },
    ],
    enemies: [
      { x: 620, y: 420, w: 48, h: 48, minX: 600, maxX: 760, vx: 1.7 },
      { x: 1280, y: 420, w: 48, h: 48, minX: 1260, maxX: 1500, vx: 1.6 },
      { x: 1780, y: 420, w: 48, h: 48, minX: 1740, maxX: 1940, vx: 1.5 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: el personaje quiere subir una escalera saltando 3 veces.",
        code: "¿Que accion se repite?",
        options: [
          "Saltar",
          "Mover derecha",
          "Abrir puerta",
        ],
        expectedIndex: 0,
        hint: "Dentro del ciclo va la accion que se repite.",
      },
      intermediate: {
        type: "text",
        prompt: "Contexto: el personaje quiere subir una escalera saltando 3 veces.",
        code: "____",
        expected: "Saltar",
        hint: "La accion que se repite es saltar.",
      },
    },
  },
  {
    name: "Opciones",
    intro: true,
    width: 2000,
    spawn: { x: 80, y: 360 },
    goal: { x: 1860, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2000, h: 60 },
      { x: 260, y: 390, w: 200, h: 20 },
      { x: 560, y: 330, w: 200, h: 20 },
      { x: 900, y: 300, w: 220, h: 20 },
      { x: 1250, y: 270, w: 200, h: 20 },
      { x: 1550, y: 330, w: 200, h: 20 },
    ],
    coins: [
      { x: 310, y: 330 },
      { x: 610, y: 270 },
      { x: 950, y: 240 },
      { x: 1300, y: 210 },
      { x: 1600, y: 270 },
    ],
    enemies: [
      { x: 720, y: 420, w: 48, h: 48, minX: 700, maxX: 860, vx: 1.4 },
      { x: 1400, y: 420, w: 48, h: 48, minX: 1380, maxX: 1560, vx: 1.3 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: necesitas saltar muchas veces. Elige la accion correcta.",
        code: "¿Cual opcion es correcta?",
        options: [
          "Repetir 5 saltos",
          "si (5) { Saltar }",
          "Saltar 5 veces",
        ],
        expectedIndex: 0,
        hint: "El ciclo debe incluir la accion dentro de llaves.",
      },
      intermediate: {
        type: "multiple",
        prompt: "Contexto: necesitas saltar muchas veces. Elige la accion correcta.",
        code: "¿Cual opcion es correcta?",
        options: [
          "Repetir 5 saltos",
          "si (5) { Saltar }",
          "Saltar 5 veces",
        ],
        expectedIndex: 0,
        hint: "El ciclo debe incluir la accion dentro de llaves.",
      },
    },
    reward: { weapon: "pistol" },
  },
  {
    name: "Orden y Depurar",
    intro: true,
    width: 2100,
    spawn: { x: 80, y: 360 },
    goal: { x: 1960, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2100, h: 60 },
      { x: 280, y: 380, w: 200, h: 20 },
      { x: 600, y: 320, w: 200, h: 20 },
      { x: 920, y: 260, w: 200, h: 20 },
      { x: 1240, y: 320, w: 200, h: 20 },
      { x: 1560, y: 260, w: 200, h: 20 },
    ],
    coins: [
      { x: 330, y: 320 },
      { x: 650, y: 260 },
      { x: 970, y: 200 },
      { x: 1290, y: 260 },
      { x: 1610, y: 200 },
    ],
    enemies: [
      { x: 820, y: 420, w: 48, h: 48, minX: 800, maxX: 980, vx: 1.5 },
      { x: 1480, y: 420, w: 48, h: 48, minX: 1460, maxX: 1660, vx: 1.4 },
    ],
    challenge: {
      basic: {
        type: "order",
        prompt: "Contexto: el personaje ve una moneda. Ordena los pasos correctos.",
        steps: [
          "Si hay moneda",
          "Recoger moneda",
          "Avanzar",
        ],
        expectedOrder: [1, 2, 3],
        hint: "Primero verificamos, luego recogemos, y al final avanzamos.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la secuencia para recoger una moneda:",
        code: "Ver moneda\n____\nAvanzar",
        expected: "Recoger moneda",
        hint: "La accion del medio es recoger la moneda.",
      },
    },
  },
  {
    name: "Depurar",
    width: 2100,
    spawn: { x: 80, y: 360 },
    goal: { x: 1960, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2100, h: 60 },
      { x: 260, y: 380, w: 200, h: 20 },
      { x: 560, y: 320, w: 200, h: 20 },
      { x: 860, y: 260, w: 200, h: 20 },
      { x: 1160, y: 320, w: 200, h: 20 },
      { x: 1460, y: 260, w: 200, h: 20 },
      { x: 1760, y: 320, w: 200, h: 20 },
    ],
    coins: [
      { x: 310, y: 320 },
      { x: 610, y: 260 },
      { x: 910, y: 200 },
      { x: 1210, y: 260 },
      { x: 1510, y: 200 },
      { x: 1810, y: 260 },
    ],
    enemies: [
      { x: 700, y: 420, w: 48, h: 48, minX: 680, maxX: 860, vx: 1.4 },
      { x: 1300, y: 420, w: 48, h: 48, minX: 1280, maxX: 1460, vx: 1.4 },
      { x: 1820, y: 420, w: 48, h: 48, minX: 1780, maxX: 1960, vx: 1.3 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: queremos mover 3 pasos a la derecha. Elige la opcion correcta.",
        code: "¿Que opcion es correcta?",
        options: [
          "repetir 3 pasos",
          "repetir 5 pasos",
          "no moverse",
        ],
        expectedIndex: 0,
        hint: "Debe repetir 3 pasos.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la accion para mover 3 pasos:",
        code: "____",
        expected: "Mover derecha",
        hint: "La accion es mover a la derecha.",
      },
    },
  },
  {
    name: "Puentes",
    width: 2200,
    spawn: { x: 80, y: 360 },
    goal: { x: 2050, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2200, h: 60 },
      { x: 260, y: 400, w: 180, h: 20 },
      { x: 520, y: 340, w: 180, h: 20 },
      { x: 780, y: 300, w: 180, h: 20 },
      { x: 1040, y: 260, w: 180, h: 20 },
      { x: 1300, y: 300, w: 180, h: 20 },
      { x: 1560, y: 340, w: 180, h: 20 },
      { x: 1820, y: 400, w: 180, h: 20 },
    ],
    coins: [
      { x: 310, y: 340 },
      { x: 570, y: 280 },
      { x: 830, y: 240 },
      { x: 1090, y: 200 },
      { x: 1350, y: 240 },
      { x: 1610, y: 280 },
      { x: 1870, y: 340 },
    ],
    enemies: [
      { x: 700, y: 420, w: 48, h: 48, minX: 680, maxX: 860, vx: 1.3 },
      { x: 1500, y: 420, w: 48, h: 48, minX: 1480, maxX: 1660, vx: 1.2 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: el personaje llega a un puente. ¿Que debe hacer primero?",
        code: "¿Que va primero?",
        options: [
          "Mirar si es seguro",
          "Correr",
          "Saltar",
        ],
        expectedIndex: 0,
        hint: "Primero revisamos si es seguro.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa el paso para revisar antes de cruzar:",
        code: "____",
        expected: "Cruzar",
        hint: "Si es seguro, cruzamos.",
      },
    },
  },
  {
    name: "Semaforo",
    width: 2100,
    spawn: { x: 80, y: 360 },
    goal: { x: 1960, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2100, h: 60 },
      { x: 280, y: 380, w: 200, h: 20 },
      { x: 600, y: 320, w: 200, h: 20 },
      { x: 920, y: 260, w: 200, h: 20 },
      { x: 1240, y: 320, w: 200, h: 20 },
      { x: 1560, y: 260, w: 200, h: 20 },
    ],
    coins: [
      { x: 330, y: 320 },
      { x: 650, y: 260 },
      { x: 970, y: 200 },
      { x: 1290, y: 260 },
      { x: 1610, y: 200 },
    ],
    enemies: [
      { x: 820, y: 420, w: 48, h: 48, minX: 800, maxX: 980, vx: 1.2 },
    ],
    challenge: {
      basic: {
        type: "keysequence",
        prompt: "Juego de reflejos lógicos: si el semaforo cambia de rojo a verde, ejecuta la secuencia correcta.",
        code: "Esperar\nMover derecha\nMover derecha",
        expectedKeys: ["JUMP", "RIGHT", "RIGHT"],
        hint: "Usa Espacio para iniciar y luego dos veces derecha (flecha derecha o D).",
      },
      intermediate: {
        type: "keysequence",
        prompt: "Juego de reflejos lógicos: evita el choque y avanza en orden.",
        code: "Dash\nAtacar\nMover derecha",
        expectedKeys: ["DASH", "ATTACK", "RIGHT"],
        hint: "Haz Shift, luego F/J y termina con derecha.",
      },
    },
  },
  {
    name: "Repetir 4",
    width: 2100,
    spawn: { x: 80, y: 360 },
    goal: { x: 1960, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2100, h: 60 },
      { x: 260, y: 400, w: 180, h: 20 },
      { x: 520, y: 340, w: 180, h: 20 },
      { x: 780, y: 300, w: 180, h: 20 },
      { x: 1040, y: 260, w: 180, h: 20 },
      { x: 1300, y: 300, w: 180, h: 20 },
      { x: 1560, y: 340, w: 180, h: 20 },
    ],
    coins: [
      { x: 310, y: 340 },
      { x: 570, y: 280 },
      { x: 830, y: 240 },
      { x: 1090, y: 200 },
      { x: 1350, y: 240 },
      { x: 1610, y: 280 },
    ],
    enemies: [
      { x: 980, y: 420, w: 48, h: 48, minX: 960, maxX: 1120, vx: 1.3 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: necesitas saltar 4 veces. Elige la accion correcta.",
        code: "¿Cual opcion es correcta?",
        options: [
          "Repetir 4 saltos",
          "Repetir 2 saltos",
          "Saltar 4 veces",
        ],
        expectedIndex: 0,
        hint: "Debe repetir 4 veces.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa el ciclo para saltar 4 veces:",
        code: "____",
        expected: "Saltar",
        hint: "La accion es saltar.",
      },
    },
  },
  {
    name: "Llave y Puerta",
    width: 2200,
    spawn: { x: 80, y: 360 },
    goal: { x: 2050, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2200, h: 60 },
      { x: 240, y: 390, w: 200, h: 20 },
      { x: 540, y: 330, w: 200, h: 20 },
      { x: 840, y: 270, w: 200, h: 20 },
      { x: 1140, y: 330, w: 200, h: 20 },
      { x: 1440, y: 270, w: 200, h: 20 },
      { x: 1740, y: 330, w: 200, h: 20 },
    ],
    coins: [
      { x: 290, y: 330 },
      { x: 590, y: 270 },
      { x: 890, y: 210 },
      { x: 1190, y: 270 },
      { x: 1490, y: 210 },
      { x: 1790, y: 270 },
    ],
    enemies: [
      { x: 760, y: 420, w: 48, h: 48, minX: 740, maxX: 900, vx: 1.4 },
      { x: 1540, y: 420, w: 48, h: 48, minX: 1520, maxX: 1700, vx: 1.2 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: tienes llave. ¿Que haces?",
        code: "¿Que haces?",
        options: [
          "Abrir puerta",
          "Dormir",
          "Saltar",
        ],
        expectedIndex: 0,
        hint: "Con llave abrimos la puerta.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la accion correcta:",
        code: "____",
        expected: "Abrir puerta",
        hint: "Abrimos la puerta.",
      },
    },
  },
  {
    name: "Secuencia 2",
    width: 2000,
    spawn: { x: 80, y: 360 },
    goal: { x: 1870, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2000, h: 60 },
      { x: 260, y: 400, w: 200, h: 20 },
      { x: 560, y: 340, w: 200, h: 20 },
      { x: 860, y: 280, w: 200, h: 20 },
      { x: 1160, y: 340, w: 200, h: 20 },
      { x: 1460, y: 400, w: 200, h: 20 },
    ],
    coins: [
      { x: 310, y: 340 },
      { x: 610, y: 280 },
      { x: 910, y: 220 },
      { x: 1210, y: 280 },
      { x: 1510, y: 340 },
    ],
    enemies: [
      { x: 1020, y: 420, w: 48, h: 48, minX: 1000, maxX: 1180, vx: 1.2 },
    ],
    challenge: {
      basic: {
        type: "order",
        prompt: "Contexto: para llegar a la meta, ordena los pasos.",
        steps: [
          "Avanzar",
          "Saltar",
          "Avanzar",
        ],
        expectedOrder: [1, 2, 3],
        hint: "Primero avanzas, luego saltas, luego avanzas.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la secuencia:",
        code: "Avanzar\n____\nAvanzar",
        expected: "Saltar",
        hint: "El paso del medio es saltar.",
      },
    },
  },
  {
    name: "Repetir 2",
    width: 1900,
    spawn: { x: 80, y: 360 },
    goal: { x: 1750, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 1900, h: 60 },
      { x: 260, y: 400, w: 200, h: 20 },
      { x: 560, y: 340, w: 200, h: 20 },
      { x: 860, y: 280, w: 200, h: 20 },
      { x: 1160, y: 340, w: 200, h: 20 },
      { x: 1460, y: 400, w: 200, h: 20 },
    ],
    coins: [
      { x: 310, y: 340 },
      { x: 610, y: 280 },
      { x: 910, y: 220 },
      { x: 1210, y: 280 },
      { x: 1510, y: 340 },
    ],
    enemies: [
      { x: 740, y: 420, w: 48, h: 48, minX: 720, maxX: 900, vx: 1.1 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: necesitas avanzar 2 veces. Elige la accion correcta.",
        code: "¿Cual opcion es correcta?",
        options: [
          "Repetir 2 avances",
          "Repetir 3 avances",
          "Avanzar 2 veces",
        ],
        expectedIndex: 0,
        hint: "Debe repetir 2 veces.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa el ciclo para avanzar 2 veces:",
        code: "____",
        expected: "Avanzar",
        hint: "La accion es avanzar.",
      },
    },
  },
  {
    name: "Si Hay Moneda",
    width: 2000,
    spawn: { x: 80, y: 360 },
    goal: { x: 1870, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2000, h: 60 },
      { x: 260, y: 400, w: 200, h: 20 },
      { x: 560, y: 330, w: 200, h: 20 },
      { x: 860, y: 260, w: 200, h: 20 },
      { x: 1160, y: 330, w: 200, h: 20 },
      { x: 1460, y: 400, w: 200, h: 20 },
    ],
    coins: [
      { x: 310, y: 340 },
      { x: 610, y: 270 },
      { x: 910, y: 200 },
      { x: 1210, y: 270 },
      { x: 1510, y: 340 },
    ],
    enemies: [
      { x: 1020, y: 420, w: 48, h: 48, minX: 1000, maxX: 1180, vx: 1.2 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: ves una moneda. ¿Que haces?",
        code: "¿Que haces?",
        options: [
          "Recoger moneda",
          "Dormir",
          "Saltar",
        ],
        expectedIndex: 0,
        hint: "Si hay moneda, la recogemos.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la accion correcta:",
        code: "____",
        expected: "Recoger moneda",
        hint: "Recogemos la moneda.",
      },
    },
  },
  {
    name: "Repetir 5",
    width: 2300,
    spawn: { x: 80, y: 360 },
    goal: { x: 2150, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2300, h: 60 },
      { x: 260, y: 400, w: 200, h: 20 },
      { x: 560, y: 340, w: 200, h: 20 },
      { x: 860, y: 280, w: 200, h: 20 },
      { x: 1160, y: 220, w: 200, h: 20 },
      { x: 1460, y: 280, w: 200, h: 20 },
      { x: 1760, y: 340, w: 200, h: 20 },
      { x: 2060, y: 400, w: 200, h: 20 },
    ],
    coins: [
      { x: 310, y: 340 },
      { x: 610, y: 280 },
      { x: 910, y: 220 },
      { x: 1210, y: 160 },
      { x: 1510, y: 220 },
      { x: 1810, y: 280 },
      { x: 2110, y: 340 },
    ],
    enemies: [
      { x: 900, y: 420, w: 48, h: 48, minX: 880, maxX: 1060, vx: 1.4 },
      { x: 1700, y: 420, w: 48, h: 48, minX: 1680, maxX: 1860, vx: 1.3 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: necesitas avanzar 5 veces. Elige la accion correcta.",
        code: "¿Cual opcion es correcta?",
        options: [
          "Repetir 5 avances",
          "Repetir 4 avances",
          "Avanzar 5 veces",
        ],
        expectedIndex: 0,
        hint: "Debe repetir 5 veces.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa el ciclo para avanzar 5 veces:",
        code: "____",
        expected: "Avanzar",
        hint: "La accion es avanzar.",
      },
    },
  },
  {
    name: "Depurar 2",
    width: 2100,
    spawn: { x: 80, y: 360 },
    goal: { x: 1960, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2100, h: 60 },
      { x: 260, y: 380, w: 200, h: 20 },
      { x: 560, y: 320, w: 200, h: 20 },
      { x: 860, y: 260, w: 200, h: 20 },
      { x: 1160, y: 320, w: 200, h: 20 },
      { x: 1460, y: 260, w: 200, h: 20 },
      { x: 1760, y: 320, w: 200, h: 20 },
    ],
    coins: [
      { x: 310, y: 320 },
      { x: 610, y: 260 },
      { x: 910, y: 200 },
      { x: 1210, y: 260 },
      { x: 1510, y: 200 },
      { x: 1810, y: 260 },
    ],
    enemies: [
      { x: 700, y: 420, w: 48, h: 48, minX: 680, maxX: 860, vx: 1.3 },
      { x: 1300, y: 420, w: 48, h: 48, minX: 1280, maxX: 1460, vx: 1.2 },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: quieres saltar 2 veces. Elige la opcion correcta.",
        code: "¿Cual opcion es correcta?",
        options: [
          "saltar dos veces",
          "saltar cinco veces",
          "no saltar",
        ],
        expectedIndex: 0,
        hint: "Debe saltar 2 veces.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la accion para saltar:",
        code: "____",
        expected: "Saltar",
        hint: "La accion es saltar.",
      },
    },
  },
  {
    name: "Orden Final",
    width: 2200,
    spawn: { x: 80, y: 360 },
    goal: { x: 2050, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2200, h: 60 },
      { x: 300, y: 380, w: 200, h: 20 },
      { x: 640, y: 320, w: 200, h: 20 },
      { x: 980, y: 260, w: 200, h: 20 },
      { x: 1320, y: 320, w: 200, h: 20 },
      { x: 1660, y: 380, w: 200, h: 20 },
    ],
    coins: [
      { x: 350, y: 320 },
      { x: 690, y: 260 },
      { x: 1030, y: 200 },
      { x: 1370, y: 260 },
      { x: 1710, y: 320 },
    ],
    enemies: [
      { x: 820, y: 420, w: 48, h: 48, minX: 800, maxX: 980, vx: 1.3 },
      { x: 1500, y: 420, w: 48, h: 48, minX: 1480, maxX: 1660, vx: 1.2 },
    ],
    challenge: {
      basic: {
        type: "order",
        prompt: "Contexto: para ganar, ordena los pasos.",
        steps: [
          "Recoger monedas",
          "Llegar a la meta",
          "Celebrar",
        ],
        expectedOrder: [1, 2, 3],
        hint: "Primero monedas, luego meta, al final celebrar.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la secuencia final:",
        code: "Recoger monedas\n____\nCelebrar",
        expected: "Llegar a la meta",
        hint: "El paso del medio es llegar a la meta.",
      },
    },
  },
  {
    name: "Persecucion",
    width: 2400,
    spawn: { x: 80, y: 360 },
    goal: { x: 2250, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2400, h: 60 },
      { x: 280, y: 390, w: 200, h: 20 },
      { x: 620, y: 330, w: 200, h: 20 },
      { x: 960, y: 270, w: 200, h: 20 },
      { x: 1300, y: 330, w: 200, h: 20 },
      { x: 1640, y: 390, w: 200, h: 20 },
      { x: 1960, y: 330, w: 200, h: 20 },
    ],
    coins: [
      { x: 330, y: 330 },
      { x: 670, y: 270 },
      { x: 1010, y: 210 },
      { x: 1350, y: 270 },
      { x: 1690, y: 330 },
      { x: 2010, y: 270 },
    ],
    enemies: [
      {
        x: 520,
        y: 420,
        w: 48,
        h: 48,
        minX: 480,
        maxX: 720,
        vx: 1.4,
        aggroRange: 260,
        chaseSpeed: 2.1,
      },
      {
        x: 1160,
        y: 420,
        w: 48,
        h: 48,
        minX: 1120,
        maxX: 1320,
        vx: 1.5,
        aggroRange: 320,
        chaseSpeed: 2.3,
        spawnDelay: 900,
      },
      {
        x: 1760,
        y: 420,
        w: 48,
        h: 48,
        minX: 1720,
        maxX: 1960,
        vx: 1.6,
        aggroRange: 360,
        chaseSpeed: 2.5,
      },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: un enemigo esta cerca. ¿Que accion es correcta?",
        code: "¿Que haces?",
        options: [
          "Atacar",
          "Dormir",
          "Pintar",
        ],
        expectedIndex: 0,
        hint: "Si el enemigo esta cerca, atacamos.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la accion cuando el enemigo esta cerca:",
        code: "____",
        expected: "Atacar",
        hint: "La accion es atacar.",
      },
    },
  },
  {
    name: "Torres y Olas",
    width: 2600,
    spawn: { x: 80, y: 360 },
    goal: { x: 2450, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2600, h: 60 },
      { x: 260, y: 400, w: 180, h: 20 },
      { x: 560, y: 320, w: 180, h: 20 },
      { x: 860, y: 240, w: 180, h: 20 },
      { x: 1160, y: 320, w: 180, h: 20 },
      { x: 1460, y: 400, w: 180, h: 20 },
      { x: 1760, y: 320, w: 180, h: 20 },
      { x: 2060, y: 240, w: 180, h: 20 },
    ],
    coins: [
      { x: 300, y: 340 },
      { x: 600, y: 260 },
      { x: 900, y: 180 },
      { x: 1200, y: 260 },
      { x: 1500, y: 340 },
      { x: 1800, y: 260 },
      { x: 2100, y: 180 },
    ],
    enemies: [
      {
        x: 520,
        y: 420,
        w: 48,
        h: 48,
        minX: 480,
        maxX: 700,
        vx: 1.6,
        aggroRange: 280,
        chaseSpeed: 2.4,
      },
      {
        x: 1040,
        y: 420,
        w: 48,
        h: 48,
        minX: 1000,
        maxX: 1220,
        vx: 1.5,
        aggroRange: 320,
        chaseSpeed: 2.5,
        spawnDelay: 1200,
      },
      {
        x: 1560,
        y: 420,
        w: 48,
        h: 48,
        minX: 1520,
        maxX: 1760,
        vx: 1.6,
        aggroRange: 340,
        chaseSpeed: 2.6,
        spawnDelay: 2200,
      },
      {
        x: 2080,
        y: 420,
        w: 48,
        h: 48,
        minX: 2040,
        maxX: 2280,
        vx: 1.7,
        aggroRange: 360,
        chaseSpeed: 2.7,
        spawnDelay: 3200,
      },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: necesitas esquivar y luego atacar. Elige el orden.",
        code: "¿Que va primero?",
        options: [
          "Esquivar luego Atacar",
          "Atacar luego Esquivar",
          "Esperar luego Dormir",
        ],
        expectedIndex: 0,
        hint: "Primero esquivas, luego atacas.",
      },
      intermediate: {
        type: "order",
        prompt: "Ordena los pasos para enfrentar al enemigo:",
        steps: [
          "Esquivar",
          "Atacar",
          "Avanzar",
        ],
        expectedOrder: [1, 2, 3],
        hint: "Primero esquivas, luego atacas y avanzas.",
      },
    },
  },
  {
    name: "Asalto Final",
    width: 2800,
    spawn: { x: 80, y: 360 },
    goal: { x: 2650, y: 400, w: 60, h: 80 },
    platforms: [
      { x: 0, y: 480, w: 2800, h: 60 },
      { x: 280, y: 400, w: 200, h: 20 },
      { x: 600, y: 330, w: 200, h: 20 },
      { x: 920, y: 260, w: 200, h: 20 },
      { x: 1240, y: 330, w: 200, h: 20 },
      { x: 1560, y: 260, w: 200, h: 20 },
      { x: 1880, y: 330, w: 200, h: 20 },
      { x: 2200, y: 400, w: 200, h: 20 },
      { x: 2520, y: 330, w: 200, h: 20 },
    ],
    coins: [
      { x: 330, y: 340 },
      { x: 650, y: 270 },
      { x: 970, y: 200 },
      { x: 1290, y: 270 },
      { x: 1610, y: 200 },
      { x: 1930, y: 270 },
      { x: 2250, y: 340 },
      { x: 2570, y: 270 },
    ],
    enemies: [
      {
        x: 520,
        y: 420,
        w: 48,
        h: 48,
        minX: 480,
        maxX: 720,
        vx: 1.7,
        aggroRange: 320,
        chaseSpeed: 2.7,
      },
      {
        x: 1120,
        y: 420,
        w: 48,
        h: 48,
        minX: 1080,
        maxX: 1300,
        vx: 1.7,
        aggroRange: 360,
        chaseSpeed: 2.8,
        spawnDelay: 900,
      },
      {
        x: 1640,
        y: 420,
        w: 48,
        h: 48,
        minX: 1600,
        maxX: 1820,
        vx: 1.8,
        aggroRange: 380,
        chaseSpeed: 2.9,
        spawnDelay: 1800,
      },
      {
        x: 2120,
        y: 420,
        w: 48,
        h: 48,
        minX: 2080,
        maxX: 2300,
        vx: 1.8,
        aggroRange: 400,
        chaseSpeed: 3.0,
        spawnDelay: 2600,
      },
      {
        x: 2560,
        y: 420,
        w: 48,
        h: 48,
        minX: 2520,
        maxX: 2720,
        vx: 1.9,
        aggroRange: 420,
        chaseSpeed: 3.1,
        spawnDelay: 3400,
      },
    ],
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Contexto: necesitas atacar 3 veces. Elige la accion correcta.",
        code: "¿Cual opcion es correcta?",
        options: [
          "repetir 3 ataques",
          "repetir 1 ataque",
          "no atacar",
        ],
        expectedIndex: 0,
        hint: "Debe atacar 3 veces.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa el ciclo para atacar 3 veces:",
        code: "____",
        expected: "Atacar",
        hint: "La accion repetida es atacar.",
      },
    },
  },
];

function buildGeneratedLevels(startIndex, count) {
  const generated = [];
  for (let i = 0; i < count; i += 1) {
    const levelNumber = startIndex + i + 1;
    const width = 3400 + i * 320;
    const platforms = [];
    const pattern = i % 3;

    const segmentCount = 7 + Math.floor(i / 2);
    const segmentWidth = Math.max(300, Math.floor(width / segmentCount) - 48);
    const gapSize = 60 + (i % 3) * 24;
    let groundX = 0;
    const climbStage = i >= 6;
    let groundY = 480;
    for (let s = 0; s < segmentCount; s += 1) {
      if (climbStage && s > 0 && s % 2 === 0) {
        groundY = Math.max(240, groundY - 40);
      }
      const w = segmentWidth - (s % 2) * 40;
      platforms.push({ x: groundX, y: groundY, w, h: 60 });
      if (s < segmentCount - 1) {
        const bridgeX = groundX + w + Math.floor(gapSize * 0.2);
        const bridgeY = Math.max(340, groundY - 34);
        platforms.push({ x: bridgeX, y: bridgeY, w: 150, h: 20 });
      }
      groundX += w + gapSize;
    }

    if (pattern === 0) {
      // Staircase climb
      const stepCount = 10 + (i % 6);
      for (let p = 0; p < stepCount; p += 1) {
        const px = 220 + p * 210;
        const py = 400 - p * 28;
        platforms.push({ x: px, y: py, w: 180, h: 20 });
      }
      for (let h = 0; h < 6; h += 1) {
        const px = 360 + h * 380;
        const py = 220 - (h % 2) * 30;
        platforms.push({ x: px, y: py, w: 160, h: 18 });
      }
    } else if (pattern === 1) {
      // Zigzag across heights
      const zigCount = 12 + (i % 5);
      for (let p = 0; p < zigCount; p += 1) {
        const px = 160 + p * 220;
        const py = p % 2 === 0 ? 360 : 260;
        platforms.push({ x: px, y: py, w: 200, h: 20 });
      }
      for (let s = 0; s < 7; s += 1) {
        const px = 280 + s * 320;
        const py = 300 - (s % 3) * 50;
        platforms.push({ x: px, y: py, w: 120, h: 18 });
      }
    } else {
      // Tower sections (taller vertical jumps)
      const towerCount = 8 + (i % 4);
      for (let t = 0; t < towerCount; t += 1) {
        const baseX = 260 + t * 300;
        for (let step = 0; step < 4; step += 1) {
          const px = baseX + (step % 2) * 80;
          const py = 420 - step * 70;
          platforms.push({ x: px, y: py, w: 140, h: 18 });
        }
      }
    }

    const coins = [];
    const coinPoints = platforms.filter((p) => p.h <= 20);
    coinPoints.forEach((p) => {
      coins.push({ x: p.x + p.w / 2 - 10, y: p.y - 50 });
      coins.push({ x: p.x + 20, y: p.y - 50 });
    });

    const enemyCount = 3 + Math.min(5, Math.floor(i / 2));
    const enemies = [];
    for (let e = 0; e < enemyCount; e += 1) {
      const baseX = 420 + e * 420;
      const speed = 1.25 + i * 0.04 + e * 0.06;
      enemies.push({
        x: baseX,
        y: 420,
        w: 48,
        h: 48,
        minX: baseX - 40,
        maxX: baseX + 260,
        vx: speed,
        aggroRange: 260 + i * 16,
        chaseSpeed: Math.min(3.8, 1.9 + i * 0.07 + e * 0.05),
        spawnDelay: e === 0 ? 0 : 800 + e * 550 + i * 100,
      });
    }

    // Enemies on platforms
    const platformEnemies = Math.min(4, Math.floor(i / 2));
    const elevatedPlatforms = platforms.filter((p) => p.h <= 20 && p.y <= 360);
    for (let e = 0; e < platformEnemies && e < elevatedPlatforms.length; e += 1) {
      const p = elevatedPlatforms[(e * 2 + i) % elevatedPlatforms.length];
      const ex = p.x + Math.min(40, Math.max(0, p.w - 80));
      const enemyWidth = 48;
      const enemyHeight = 48;
      const minX = p.x;
      const maxX = p.x + p.w - enemyWidth;
      enemies.push({
        x: ex,
        y: p.y - enemyHeight,
        w: enemyWidth,
        h: enemyHeight,
        minX,
        maxX,
        vx: 1.1 + i * 0.03,
        aggroRange: 240 + i * 10,
        chaseSpeed: Math.min(3.4, 1.6 + i * 0.05),
        spawnDelay: 500 + e * 400,
      });
    }
    const challenge = {
      basic: {
        type: "multiple",
        prompt: "Contexto: el enemigo se acerca. ¿Que haces?",
        code: "¿Que haces?",
        options: [
          "Atacar",
          "Dormir",
          "Esconderse",
        ],
        expectedIndex: 0,
        hint: "Si el enemigo esta cerca, atacamos.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la accion correcta:",
        code: "____",
        expected: "Atacar",
        hint: "La accion es atacar.",
      },
    };

    generated.push({
      name: `Nivel ${levelNumber}`,
      displayLevelNumber: levelNumber,
      width,
      spawn: { x: 80, y: 360 },
      goal: { x: width - 120, y: 400, w: 60, h: 80 },
      platforms,
      coins,
      enemies,
      challenge,
    });
  }
  return generated;
}

const MIN_LEVELS = 16;
if (defaultLevels.length < MIN_LEVELS) {
  const extraCount = MIN_LEVELS - defaultLevels.length;
  const generated = buildGeneratedLevels(defaultLevels.length, extraCount);
  defaultLevels.push(...generated);
}

function createAdventureFallbackLevels() {
  return [
    {
      name: "Aventura Blockly - Inicio",
      width: 2100,
      spawn: { x: 80, y: 360 },
      goal: { x: 1960, y: 400, w: 60, h: 80 },
      platforms: [
        { x: 0, y: 480, w: 2100, h: 60 },
        { x: 260, y: 390, w: 200, h: 20 },
        { x: 560, y: 330, w: 200, h: 20 },
        { x: 860, y: 270, w: 200, h: 20 },
        { x: 1160, y: 330, w: 200, h: 20 },
        { x: 1460, y: 270, w: 200, h: 20 },
      ],
      coins: [
        { x: 310, y: 330 },
        { x: 610, y: 270 },
        { x: 910, y: 210 },
        { x: 1210, y: 270 },
        { x: 1510, y: 210 },
      ],
      enemies: [
        { x: 700, y: 420, w: 48, h: 48, minX: 680, maxX: 840, vx: 1.3 },
      ],
      challenge: {
        basic: {
          type: "multiple",
          prompt: "Aventura: cruza el bosque y alcanza la puerta final.",
          code: "¿Que accion te ayuda a avanzar con seguridad?",
          options: ["Mirar el camino", "Saltar sin mirar", "Quedarte quieto"],
          expectedIndex: 0,
          hint: "Observar primero evita errores.",
        },
        intermediate: {
          type: "text",
          prompt: "Completa la accion principal de esta aventura:",
          code: "____",
          expected: "Avanzar",
          hint: "La meta requiere avanzar paso a paso.",
        },
      },
    },
  ];
}

let levels = [];
let platformLevels = [];
let adventureGeneratedLevels = null;
const LEVELS_VERSION = 13;
let levelsStorageValid = true;

const PLATFORM_LIGHT_MODE = true;
const STRATEGY_COLS = 12;
const STRATEGY_ROWS = 8;
const STRATEGY_TILE = 56;
const STRATEGY_TOTAL_LEVELS = 50;
const STRATEGY_ANIM_SMOOTH = 0.2;
const SESSION_TARGET_MS = 60 * 60 * 1000;
const PLATFORM_MIN_DURATION_MS = 60 * 60 * 1000;
const strategyBiomes = [
  {
    name: "Pradera",
    overlay: "rgba(16, 40, 22, 0.46)",
    tileA: "rgba(176, 224, 138, 0.11)",
    tileB: "rgba(121, 182, 91, 0.08)",
    wallTint: "rgba(23, 62, 32, 0.45)",
    doorLocked: "#8d6b3f",
    doorOpen: "#2f8d5f",
    bossZone: "rgba(255, 120, 80, 0.12)",
    ambient: "fireflies",
  },
  {
    name: "Cuevas",
    overlay: "rgba(14, 18, 30, 0.58)",
    tileA: "rgba(130, 145, 173, 0.11)",
    tileB: "rgba(86, 96, 118, 0.08)",
    wallTint: "rgba(10, 15, 24, 0.58)",
    doorLocked: "#695245",
    doorOpen: "#2f6d84",
    bossZone: "rgba(255, 100, 100, 0.14)",
    ambient: "dust",
  },
  {
    name: "Ruinas",
    overlay: "rgba(40, 30, 18, 0.52)",
    tileA: "rgba(198, 158, 104, 0.12)",
    tileB: "rgba(140, 100, 64, 0.09)",
    wallTint: "rgba(48, 30, 17, 0.5)",
    doorLocked: "#8d4f35",
    doorOpen: "#4b9f7a",
    bossZone: "rgba(255, 140, 90, 0.13)",
    ambient: "sand",
  },
  {
    name: "Volcan",
    overlay: "rgba(42, 12, 8, 0.58)",
    tileA: "rgba(220, 110, 80, 0.12)",
    tileB: "rgba(150, 54, 40, 0.09)",
    wallTint: "rgba(52, 16, 8, 0.55)",
    doorLocked: "#a14530",
    doorOpen: "#6fb26a",
    bossZone: "rgba(255, 70, 70, 0.18)",
    ambient: "embers",
  },
  {
    name: "Castillo",
    overlay: "rgba(18, 22, 38, 0.55)",
    tileA: "rgba(155, 166, 196, 0.11)",
    tileB: "rgba(92, 104, 130, 0.09)",
    wallTint: "rgba(15, 18, 29, 0.56)",
    doorLocked: "#5f6478",
    doorOpen: "#4aa87a",
    bossZone: "rgba(240, 90, 140, 0.14)",
    ambient: "rain",
  },
];

const platformScenes = [
  {
    name: "Aula Digital",
    circuitA: "#83bfd8",
    circuitB: "#264f73",
    fog: "rgba(220, 245, 255, 0.3)",
    platformTop: "#3d6b87",
    platformSide: "#204053",
    deco: "bus",
  },
  {
    name: "Biblioteca Tech",
    circuitA: "#d9c193",
    circuitB: "#8a5f38",
    fog: "rgba(255, 234, 200, 0.25)",
    platformTop: "#866b45",
    platformSide: "#5f4527",
    deco: "chip",
  },
  {
    name: "Laboratorio Retro",
    circuitA: "#9ae0bb",
    circuitB: "#2f6a51",
    fog: "rgba(210, 255, 235, 0.26)",
    platformTop: "#4f8471",
    platformSide: "#285848",
    deco: "traces",
  },
  {
    name: "Ciudad Pixel",
    circuitA: "#df9fcb",
    circuitB: "#4f3c80",
    fog: "rgba(255, 212, 224, 0.2)",
    platformTop: "#6b5d9f",
    platformSide: "#3b2f6b",
    deco: "city",
  },
  {
    name: "Museo Gamer",
    circuitA: "#d4d27f",
    circuitB: "#454f84",
    fog: "rgba(245, 245, 180, 0.22)",
    platformTop: "#6a709f",
    platformSide: "#3f456d",
    deco: "pulse",
  },
  {
    name: "Futuro IA",
    circuitA: "#8beef9",
    circuitB: "#165c7f",
    fog: "rgba(170, 247, 255, 0.2)",
    platformTop: "#3a7ca0",
    platformSide: "#1f4f67",
    deco: "circuits",
  },
];

const educationalJourney = {
  title: "Mision Electronica 4to",
  durationMinutes: 60,
  levels: [
    {
      title: "Encendido de un LED",
      text: "Un LED es un diodo emisor de luz. Para que funcione bien necesita corriente en el sentido correcto y una resistencia que lo proteja.",
      questions: [
        {
          type: "multiple",
          prompt: "¿Que es un LED?",
          options: ["Un diodo emisor de luz", "Una bateria", "Un motor"],
          expectedIndex: 0,
          hint: "Es un componente que convierte electricidad en luz.",
        },
        {
          type: "multiple",
          prompt: "Si conectas un LED al reves, ¿que ocurre?",
          options: ["Se enciende mas", "No enciende", "Explota siempre"],
          expectedIndex: 1,
          hint: "El LED tiene polaridad.",
        },
        {
          type: "multiple",
          prompt: "¿Para que sirve la pata larga del LED?",
          options: ["Es el polo positivo", "Es el polo negativo", "No importa"],
          expectedIndex: 0,
          hint: "La pata larga es el anodo.",
        },
        {
          type: "multiple",
          prompt: "Conectar un LED sin resistencia puede:",
          options: ["Protegerlo", "Quemarlo", "No cambiar nada"],
          expectedIndex: 1,
          hint: "Sin limite de corriente puede danarse.",
        },
        {
          type: "text",
          prompt: "Explica en una frase por que usamos resistencia con un LED.",
          expectedKeywords: ["limita", "corriente", "protege", "led"],
          minKeywordMatches: 2,
          hint: "Relaciona resistencia, corriente y proteccion.",
        },
      ],
      reward: { type: "coins", value: 2, label: "Monedas de circuito" },
    },
    {
      title: "Resistencias",
      text: "La resistencia controla el paso de corriente y se mide en ohms. A mayor resistencia, menor corriente en el circuito.",
      questions: [
        {
          type: "multiple",
          prompt: "¿Que hace una resistencia en un circuito?",
          options: ["Produce luz", "Limita corriente", "Guarda energia"],
          expectedIndex: 1,
          hint: "Su trabajo principal es controlar el paso de corriente.",
        },
        {
          type: "multiple",
          prompt: "La unidad de la resistencia es:",
          options: ["Voltios", "Amperes", "Ohms"],
          expectedIndex: 2,
          hint: "Se representa con el simbolo omega.",
        },
        {
          type: "multiple",
          prompt: "Si aumenta el valor de la resistencia, la corriente:",
          options: ["Aumenta", "Disminuye", "No cambia"],
          expectedIndex: 1,
          hint: "Mas oposicion significa menos corriente.",
        },
        {
          type: "multiple",
          prompt: "¿Las resistencias tienen polaridad?",
          options: ["Si", "No", "Solo algunas con colores"],
          expectedIndex: 1,
          hint: "Se pueden conectar en cualquier sentido.",
        },
        {
          type: "text",
          prompt: "Escribe que significa el simbolo Ω.",
          expectedKeywords: ["ohm", "ohms", "resistencia"],
          minKeywordMatches: 1,
          hint: "Omega representa la unidad de resistencia.",
        },
      ],
      reward: { type: "shield", value: 1, label: "Escudo aislante" },
    },
    {
      title: "Ley de Ohm basica",
      text: "La Ley de Ohm relaciona voltaje, corriente y resistencia: V = I x R. Si conoces dos valores, puedes calcular el tercero.",
      questions: [
        {
          type: "multiple",
          prompt: "Con V = 9V y R = 3Ω, la corriente I es:",
          options: ["1 A", "3 A", "6 A"],
          expectedIndex: 1,
          hint: "Usa I = V / R.",
        },
        {
          type: "multiple",
          prompt: "Con V = 6V y R = 2Ω, ¿cuanto vale I?",
          options: ["2 A", "3 A", "4 A"],
          expectedIndex: 1,
          hint: "Divide 6 entre 2.",
        },
        {
          type: "multiple",
          prompt: "Con V = 8V y R = 4Ω, la I correcta es:",
          options: ["1 A", "2 A", "4 A"],
          expectedIndex: 1,
          hint: "8 / 4 = 2.",
        },
        {
          type: "multiple",
          prompt: "¿Que ley relaciona voltaje, corriente y resistencia?",
          options: ["Ley de Newton", "Ley de Ohm", "Ley de Faraday"],
          expectedIndex: 1,
          hint: "Es la formula V = I x R.",
        },
        {
          type: "text",
          prompt: "Escribe la formula de corriente usando V y R.",
          expectedKeywords: ["i", "v", "r", "v/r", "divide"],
          minKeywordMatches: 2,
          hint: "Debes despejar I de V = I x R.",
        },
      ],
      reward: { type: "speed", value: 10000, label: "Turbo de calculo" },
    },
    {
      title: "Conexiones en serie",
      text: "En serie, los componentes van uno tras otro en un solo camino. Si uno falla, se interrumpe todo el circuito.",
      questions: [
        {
          type: "multiple",
          prompt: "En una conexion en serie los componentes van:",
          options: ["Uno tras otro", "En caminos separados", "Sin cables"],
          expectedIndex: 0,
          hint: "Solo existe un camino para la corriente.",
        },
        {
          type: "multiple",
          prompt: "Si un foco se apaga en serie, los demas:",
          options: ["Siguen igual", "Tambien se apagan", "Brillan mas"],
          expectedIndex: 1,
          hint: "El camino unico se corta.",
        },
        {
          type: "multiple",
          prompt: "En serie la corriente en los componentes es:",
          options: ["La misma", "Distinta en cada uno", "Cero siempre"],
          expectedIndex: 0,
          hint: "La misma corriente pasa por cada elemento.",
        },
        {
          type: "multiple",
          prompt: "Dos resistencias de 5Ω en serie suman:",
          options: ["5Ω", "10Ω", "25Ω"],
          expectedIndex: 1,
          hint: "En serie se suman directamente.",
        },
        {
          type: "text",
          prompt: "Explica por que se suman resistencias en serie.",
          expectedKeywords: ["suman", "camino", "oposicion", "corriente"],
          minKeywordMatches: 2,
          hint: "Piensa en la oposicion total en un camino unico.",
        },
      ],
      reward: { type: "shortcut", value: 260, label: "Atajo en serie" },
    },
    {
      title: "Conexiones en paralelo",
      text: "En paralelo hay varios caminos para la corriente. Si un componente falla, los otros pueden seguir funcionando.",
      questions: [
        {
          type: "multiple",
          prompt: "En paralelo los componentes estan:",
          options: ["En un solo camino", "En varios caminos", "Sin conexion"],
          expectedIndex: 1,
          hint: "Cada rama es un camino distinto.",
        },
        {
          type: "multiple",
          prompt: "Si un foco se apaga en paralelo, los otros:",
          options: ["Tambien se apagan", "Siguen encendidos", "Se desconectan por seguridad"],
          expectedIndex: 1,
          hint: "Las ramas restantes siguen activas.",
        },
        {
          type: "multiple",
          prompt: "En paralelo la corriente total:",
          options: ["No se divide", "Se divide entre ramas", "Se convierte en voltaje"],
          expectedIndex: 1,
          hint: "Cada rama toma parte de la corriente.",
        },
        {
          type: "multiple",
          prompt: "¿Que conexion se usa normalmente en las casas?",
          options: ["Serie", "Paralelo", "Circular"],
          expectedIndex: 1,
          hint: "Permite que aparatos funcionen por separado.",
        },
        {
          type: "text",
          prompt: "Escribe por que paralelo es mas util en casa.",
          expectedKeywords: ["independiente", "aparatos", "siguen", "funcionando", "rama"],
          minKeywordMatches: 2,
          hint: "Si uno se apaga, los demas siguen.",
        },
      ],
      reward: { type: "life", value: 1, label: "Vida en paralelo" },
    },
    {
      title: "Pulsador",
      text: "Un pulsador es un boton que abre o cierra el circuito. Al presionarlo, permite el paso de corriente temporalmente.",
      questions: [
        {
          type: "multiple",
          prompt: "¿Que es un pulsador?",
          options: ["Un boton que abre o cierra circuito", "Una bateria recargable", "Un cable largo"],
          expectedIndex: 0,
          hint: "Funciona como control manual del paso de corriente.",
        },
        {
          type: "multiple",
          prompt: "Cuando presionas un pulsador comun, el circuito:",
          options: ["Se cierra", "Se borra", "Se rompe"],
          expectedIndex: 0,
          hint: "Presionar permite el flujo.",
        },
        {
          type: "multiple",
          prompt: "Cuando sueltas el pulsador, normalmente el circuito:",
          options: ["Se abre", "Se vuelve paralelo", "Aumenta voltaje"],
          expectedIndex: 0,
          hint: "Deja de pasar corriente.",
        },
        {
          type: "multiple",
          prompt: "Un pulsador sirve para controlar:",
          options: ["La corriente", "La gravedad", "El color del cable"],
          expectedIndex: 0,
          hint: "Controla cuando pasa corriente.",
        },
        {
          type: "text",
          prompt: "Da un ejemplo de uso diario de un pulsador.",
          expectedKeywords: ["timbre", "boton", "juguete", "elevador", "control"],
          minKeywordMatches: 1,
          hint: "Piensa en botones que se presionan y sueltan.",
        },
      ],
      reward: { type: "coins", value: 3, label: "Bonus boton" },
    },
    {
      title: "Brillo con transistor",
      text: "Un transistor puede actuar como interruptor o control de corriente. Con el circuito adecuado se puede variar el brillo de un LED.",
      questions: [
        {
          type: "multiple",
          prompt: "¿Para que sirve un transistor en basico?",
          options: ["Controlar o amplificar corriente", "Guardar audio", "Medir temperatura del aula"],
          expectedIndex: 0,
          hint: "Su funcion principal es controlar senales o corriente.",
        },
        {
          type: "multiple",
          prompt: "¿Un transistor puede controlar brillo de LED?",
          options: ["Si", "No", "Solo con pilas gigantes"],
          expectedIndex: 0,
          hint: "Es una aplicacion comun en electronica escolar.",
        },
        {
          type: "multiple",
          prompt: "En muchos ejemplos, un transistor se comporta como:",
          options: ["Un interruptor", "Una lampara", "Una bateria"],
          expectedIndex: 0,
          hint: "Puede abrir o cerrar el paso de corriente.",
        },
        {
          type: "multiple",
          prompt: "Para aumentar brillo del LED con transistor se requiere:",
          options: ["Controlar la corriente", "Quitar todos los cables", "Invertir la gravedad"],
          expectedIndex: 0,
          hint: "El brillo depende de cuanta corriente recibe.",
        },
        {
          type: "text",
          prompt: "Explica en tus palabras transistor como interruptor.",
          expectedKeywords: ["abre", "cierra", "controla", "corriente", "switch"],
          minKeywordMatches: 2,
          hint: "Relaciona transistor con encender o apagar paso de corriente.",
        },
      ],
      reward: { type: "shield", value: 1, label: "Escudo transistor" },
    },
    {
      title: "Motores basicos",
      text: "Un motor electrico transforma energia electrica en movimiento. Si inviertes la polaridad, puede girar en sentido contrario.",
      questions: [
        {
          type: "multiple",
          prompt: "¿Que hace un motor electrico?",
          options: ["Convierte energia electrica en movimiento", "Convierte luz en sonido", "Solo almacena energia"],
          expectedIndex: 0,
          hint: "El resultado visible es movimiento.",
        },
        {
          type: "multiple",
          prompt: "Un motor produce principalmente:",
          options: ["Movimiento", "Luz", "Internet"],
          expectedIndex: 0,
          hint: "Gira un eje para mover algo.",
        },
        {
          type: "multiple",
          prompt: "Si conectas bateria a un motor DC, normalmente:",
          options: ["Gira", "Desaparece", "Se vuelve LED"],
          expectedIndex: 0,
          hint: "Con energia adecuada comienza a rotar.",
        },
        {
          type: "multiple",
          prompt: "Si inviertes los cables de un motor DC:",
          options: ["Gira al reves", "Se apaga para siempre", "No pasa nada"],
          expectedIndex: 0,
          hint: "Cambiar polaridad cambia el sentido de giro.",
        },
        {
          type: "text",
          prompt: "Escribe una maquina escolar que use motor.",
          expectedKeywords: ["ventilador", "carrito", "robot", "licuadora", "taladro"],
          minKeywordMatches: 1,
          hint: "Piensa en objetos que giran o se mueven.",
        },
      ],
      reward: { type: "speed", value: 12000, label: "Turbo mecanico" },
    },
    {
      title: "Robotica y Asimov",
      text: "La robotica combina mecanica, electronica y programacion. Isaac Asimov propuso leyes famosas para guiar el comportamiento seguro de robots.",
      questions: [
        {
          type: "multiple",
          prompt: "¿Que es un robot?",
          options: ["Una maquina que realiza tareas", "Solo un juguete de plastico", "Un tipo de bateria"],
          expectedIndex: 0,
          hint: "Puede ejecutar acciones de forma automatica.",
        },
        {
          type: "multiple",
          prompt: "¿Quien escribio leyes de la robotica?",
          options: ["Isaac Asimov", "Albert Einstein", "Marie Curie"],
          expectedIndex: 0,
          hint: "Fue un escritor de ciencia ficcion.",
        },
        {
          type: "multiple",
          prompt: "Primera ley de robotica de Asimov:",
          options: ["No danar a un humano", "Correr mas rapido", "Construir mas robots"],
          expectedIndex: 0,
          hint: "La seguridad humana es prioridad.",
        },
        {
          type: "multiple",
          prompt: "¿Los robots piensan igual que humanos?",
          options: ["Si, exactamente igual", "No exactamente", "Solo cuando llueve"],
          expectedIndex: 1,
          hint: "Procesan datos, pero no son humanos.",
        },
        {
          type: "text",
          prompt: "Explica por que la seguridad es importante en robotica.",
          expectedKeywords: ["personas", "seguridad", "evitar", "danos", "control"],
          minKeywordMatches: 2,
          hint: "Relaciona robots con cuidado de personas.",
        },
      ],
      reward: { type: "shortcut", value: 340, label: "Atajo robotico" },
    },
    {
      title: "Reto integrador de circuitos",
      text: "Un circuito simple puede tener bateria, resistencia, pulsador y LED. Comprender el papel de cada parte ayuda a disenar proyectos seguros.",
      questions: [
        {
          type: "multiple",
          prompt: "En un circuito basico: bateria, resistencia, pulsador y LED. ¿Que da energia?",
          options: ["Bateria", "Pulsador", "LED"],
          expectedIndex: 0,
          hint: "Es la fuente de voltaje.",
        },
        {
          type: "multiple",
          prompt: "En ese mismo circuito, ¿que componente protege al LED?",
          options: ["Resistencia", "Bateria", "Cable largo"],
          expectedIndex: 0,
          hint: "Limita la corriente.",
        },
        {
          type: "multiple",
          prompt: "Con dos LEDs en serie, si uno se quema:",
          options: ["El otro sigue", "Ambos se apagan", "Brillan doble"],
          expectedIndex: 1,
          hint: "En serie se corta el unico camino.",
        },
        {
          type: "multiple",
          prompt: "Con dos LEDs en paralelo, si uno se quema:",
          options: ["El otro sigue encendido", "Se apagan ambos", "Se invierte bateria"],
          expectedIndex: 0,
          hint: "Las ramas son independientes.",
        },
        {
          type: "text",
          prompt: "Explica que conexion es mas segura para casa y por que.",
          expectedKeywords: ["paralelo", "independiente", "aparatos", "siguen", "funcionando"],
          minKeywordMatches: 2,
          hint: "Si falla uno, los demas deben seguir.",
        },
      ],
      reward: { type: "life", value: 1, label: "Vida de ingeniero" },
    },
  ],
};

const player = {
  x: 0,
  y: 0,
  w: 52,
  h: 60,
  vx: 0,
  vy: 0,
  onGround: false,
  facing: 1,
};

let cameraX = 0;
let currentLevelIndex = 0;
let collectedCoins = 0;
let totalCoins = 0;
let lives = 3;
let gameState = "start";
let lastTime = 0;
let coinFrame = 0;
let coinTimer = 0;
let selectedChoice = null;
let selectedPlayer = "player1";
let attackCooldown = 0;
let attackTimer = 0;
const projectiles = [];
const enemyProjectiles = [];
let dashCooldown = 0;
let dashTime = 0;
const hitEffects = [];
let whipCooldown = 0;
let whipVisualTimer = 0;
let whipTarget = null;
let selectedOrder = [];
let selectedKeySequence = [];
let currentMode = "basic";
let selectedGameType = "platform";
let activeGame = "platform";
let selectedStartLevel = 0;
let platformProfileSeed = 0;
let platformSessionSeed = 0;
const dashTrail = [];
let heldItemTimer = 0;
let speedBoostTimer = 0;
let shieldCharges = 0;
let pendingShortcut = 0;
let pendingCoinBonus = 0;
let currentChallengeSnapshot = null;
const topicQuestionState = new Map();
const recentTopicPromptsByMode = new Map();
const usedChallengePromptKeys = new Set();
let generatedQuestionSerial = 0;
let randomEnemySpawnTimer = 0;
let nextRandomEnemySpawnMs = 2800;
let blocklyWorkspace = null;
let blocklyLoadPromise = null;
let builderStageCtx = null;
let builderStepTimer = null;
const fallbackBuilder = {
  enabled: false,
  commands: [],
};
const FORCE_FALLBACK_BUILDER = true;

const strategyLevels = [];
let strategyWorldIndex = 0;
let strategyLives = 3;
let resumeStrategyWorld = null;
let strategyCollected = 0;
let strategyTotalGems = 0;
let strategyPlayer = { x: 0, y: 0 };
let strategyPortal = { x: 0, y: 0 };
let strategyWalls = new Set();
let strategyDoors = new Set();
let strategyHasKey = false;
let strategyGems = [];
let strategyEnemies = [];
let strategyPlayerRender = { x: 0, y: 0 };
let strategyMoveCooldown = 0;
let strategyAnimTime = 0;
let strategyPlayerFacing = 1;
let strategyTurnCount = 0;
let strategyHotPool = [];
let strategyHotActive = new Set();
let strategyMovingDoorActive = new Set();
let strategyDoorOverrideTurns = 0;
let strategyPowerup = null;
let strategyPowerupCharges = 0;
let strategyHazardWarnings = { hotKey: "", boss: false, collision: false };
let sessionElapsedMs = 0;
let sessionNextMilestone = 10 * 60 * 1000;

const HELD_ITEM_TIME = 220;
const HELD_ITEM_SIZE = 28;
const ATTACK_VIS_TIME = 160;
const ENEMY_SHOT_BASE_COOLDOWN = 1400;

const DASH_SPEED = 9;
const DASH_TIME = 140;
const DASH_COOLDOWN = 700;
const WHIP_RANGE = 220;
const WHIP_COOLDOWN = 620;
const WHIP_MISS_COOLDOWN = 260;
const WHIP_VIS_TIME = 150;

const weapons = {
  punch: {
    id: "punch",
    name: "Puños",
    type: "melee",
    range: 45,
    cooldown: 380,
    icon: "weapon_punch_icon",
  },
  sword: {
    id: "sword",
    name: "Espada",
    type: "melee",
    range: 70,
    cooldown: 420,
    icon: "weapon_sword_icon",
  },
  pistol: {
    id: "pistol",
    name: "Pistola",
    type: "range",
    speed: 8,
    cooldown: 320,
    icon: "weapon_pistol_icon",
    projectile: "projectile1",
    sound: "shot",
  },
};

let currentWeapon = weapons.punch;
const unlockedWeapons = new Set(["punch"]);

const editor = {
  text: document.getElementById("editorText"),
  status: document.getElementById("editorStatus"),
  loadBtn: document.getElementById("loadEditor"),
  applyBtn: document.getElementById("applyEditor"),
  resetBtn: document.getElementById("resetEditor"),
};

const adventureBuilder = {
  shell: document.getElementById("blocklyAdventure"),
  exerciseTitle: document.getElementById("builderExerciseTitle"),
  instruction: document.getElementById("builderInstruction"),
  hintBtn: document.getElementById("builderHintBtn"),
  pointsBadge: document.getElementById("builderPointsBadge"),
  modeGuidedBtn: document.getElementById("builderModeGuided"),
  modeFreeBtn: document.getElementById("builderModeFree"),
  worldName: document.getElementById("builderWorldName"),
  difficulty: document.getElementById("builderDifficulty"),
  stageCanvas: document.getElementById("builderStage"),
  runLog: document.getElementById("builderRunLog"),
  runBtn: document.getElementById("builderRunBtn"),
  stepBtn: document.getElementById("builderStepBtn"),
  resetBtn: document.getElementById("builderResetBtn"),
  playBtn: document.getElementById("builderPlayBtn"),
  status: document.getElementById("adventureStatus"),
  workspaceHost: document.getElementById("blocklyWorkspace"),
};

const builderState = {
  mode: "guided",
  exerciseIndex: 0,
  points: 0,
  usedHint: false,
  attempts: 0,
  cols: 10,
  rows: 10,
  cellSize: 34,
  baseGrid: [],
  grid: [],
  cursor: { x: 1, y: 8 },
  runQueue: [],
  runIndex: 0,
  isRunning: false,
  canPlay: false,
  solvedExercises: new Set(),
};

const answerBlocks = {
  text: document.getElementById("textAnswer"),
  multiple: document.getElementById("multiAnswer"),
  order: document.getElementById("orderAnswer"),
  debug: document.getElementById("debugAnswer"),
  keysequence: document.getElementById("keySequenceAnswer"),
};

const debugInput = document.getElementById("debugInput");
const choiceButtons = document.getElementById("choiceButtons");
const orderChoices = document.getElementById("orderChoices");
const orderSelected = document.getElementById("orderSelected");
const orderClear = document.getElementById("orderClear");
const keySequenceProgress = document.getElementById("keySequenceProgress");
const keySequenceReset = document.getElementById("keySequenceReset");

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function normalizeAdventureDifficulty(value) {
  if (value === "facil" || value === "dificil") return value;
  return "medio";
}

function setAdventureStatus(message) {
  if (!adventureBuilder.status) return;
  adventureBuilder.status.textContent = message;
}

function setBuilderRunLog(message, state = "") {
  if (!adventureBuilder.runLog) return;
  adventureBuilder.runLog.textContent = message;
  adventureBuilder.runLog.classList.remove("error", "success");
  if (state) adventureBuilder.runLog.classList.add(state);
}

function fallbackCommandDefs() {
  return [
    { label: "Mover derecha", cmd: { type: "move", dx: 1, dy: 0 } },
    { label: "Mover izquierda", cmd: { type: "move", dx: -1, dy: 0 } },
    { label: "Mover arriba", cmd: { type: "move", dx: 0, dy: -1 } },
    { label: "Mover abajo", cmd: { type: "move", dx: 0, dy: 1 } },
    { label: "Plataforma", cmd: { type: "place", tile: TILE_PLATFORM } },
    { label: "Moneda", cmd: { type: "place", tile: TILE_COIN } },
    { label: "Enemigo", cmd: { type: "place", tile: TILE_ENEMY } },
    { label: "Inicio", cmd: { type: "place", tile: TILE_SPAWN } },
    { label: "Meta", cmd: { type: "place", tile: TILE_GOAL } },
    { label: "Borrar", cmd: { type: "erase" } },
  ];
}

function renderFallbackBuilderUI() {
  if (!adventureBuilder.workspaceHost) return;
  fallbackBuilder.enabled = true;
  const defs = fallbackCommandDefs();
  const palette = defs
    .map((d, idx) => `<button type="button" class="fbBlockBtn" draggable="true" data-i="${idx}">${d.label}</button>`)
    .join("");
  adventureBuilder.workspaceHost.innerHTML = `
    <div class="fbWrap">
      <div class="fbColumns">
        <section class="fbPanel">
          <p class="fbTitle">Bloques</p>
          <div class="fbPalette">${palette}</div>
        </section>
        <section class="fbPanel">
          <p class="fbTitle">Espacio de trabajo</p>
          <div id="fbProgram" class="fbProgram" aria-label="Espacio de trabajo de bloques"></div>
          <div class="fbActions">
            <button type="button" class="ghost" id="fbClearBtn">Limpiar</button>
          </div>
        </section>
      </div>
    </div>
  `;

  const programEl = adventureBuilder.workspaceHost.querySelector("#fbProgram");
  const redraw = () => {
    if (!programEl) return;
    programEl.innerHTML = fallbackBuilder.commands.length
      ? fallbackBuilder.commands
        .map((c, i) => `<button type="button" class="fbChip" data-rm="${i}">${i + 1}. ${c.label}</button>`)
        .join("")
      : `<span class="fbEmpty">Pulsa bloques para construir tu programa</span>`;
  };

  adventureBuilder.workspaceHost.querySelectorAll(".fbBlockBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-i"));
      const def = defs[idx];
      if (!def) return;
      fallbackBuilder.commands.push({ ...def.cmd, label: def.label });
      redraw();
      saveBuilderState();
    });
    btn.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", btn.getAttribute("data-i") || "");
    });
  });
  if (programEl) {
    programEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      programEl.classList.add("isDrop");
    });
    programEl.addEventListener("dragleave", () => {
      programEl.classList.remove("isDrop");
    });
    programEl.addEventListener("drop", (e) => {
      e.preventDefault();
      programEl.classList.remove("isDrop");
      const idx = Number(e.dataTransfer.getData("text/plain"));
      const def = defs[idx];
      if (!def) return;
      fallbackBuilder.commands.push({ ...def.cmd, label: def.label });
      redraw();
      saveBuilderState();
    });
  }
  adventureBuilder.workspaceHost.addEventListener("click", (e) => {
    const chip = e.target.closest(".fbChip");
    if (!chip) return;
    const idx = Number(chip.getAttribute("data-rm"));
    if (Number.isNaN(idx)) return;
    fallbackBuilder.commands.splice(idx, 1);
    redraw();
    saveBuilderState();
  });
  const clearBtn = adventureBuilder.workspaceHost.querySelector("#fbClearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      fallbackBuilder.commands = [];
      redraw();
      saveBuilderState();
    });
  }
  redraw();
  setAdventureStatus("Modo compatible activo: usa los bloques de la izquierda para construir.");
}

const TILE_EMPTY = "empty";
const TILE_PLATFORM = "platform";
const TILE_COIN = "coin";
const TILE_ENEMY = "enemy";
const TILE_SPAWN = "spawn";
const TILE_GOAL = "goal";

const builderExercises = [
  {
    id: "ex-1",
    title: "Ejercicio 1 - Construye un camino",
    instruction: "Coloca 3 plataformas, define inicio y meta en el mismo nivel.",
    hint: "Empieza con 'cuando inicie', coloca plataforma, mueve cursor y vuelve a colocar.",
    toolboxProfile: "basic",
    objective: {
      requiredTiles: [
        { type: TILE_PLATFORM, count: 3 },
        { type: TILE_SPAWN, count: 1 },
        { type: TILE_GOAL, count: 1 },
      ],
      requireReachablePath: true,
    },
    successMessage: "Excelente, construiste una ruta básica.",
  },
  {
    id: "ex-2",
    title: "Ejercicio 2 - Repite construcción",
    instruction: "Usa 'repetir' para crear una línea de plataformas y agrega 2 monedas.",
    hint: "Dentro de repetir coloca mover cursor + plataforma.",
    toolboxProfile: "loops",
    objective: {
      requiredTiles: [
        { type: TILE_PLATFORM, count: 4 },
        { type: TILE_COIN, count: 2 },
        { type: TILE_SPAWN, count: 1 },
        { type: TILE_GOAL, count: 1 },
      ],
      requireReachablePath: true,
    },
    successMessage: "Buen uso de repetición para construir más rápido.",
  },
  {
    id: "ex-3",
    title: "Ejercicio 3 - Ruta con riesgo",
    instruction: "Construye una ruta válida e incluye al menos 1 enemigo.",
    hint: "Primero asegura camino, luego coloca enemigo fuera del inicio.",
    toolboxProfile: "conditions",
    objective: {
      requiredTiles: [
        { type: TILE_PLATFORM, count: 4 },
        { type: TILE_ENEMY, count: 1 },
        { type: TILE_SPAWN, count: 1 },
        { type: TILE_GOAL, count: 1 },
      ],
      requireReachablePath: true,
      maxBlocks: 18,
    },
    successMessage: "Muy bien, combinaste construcción y desafío.",
  },
];

function createEmptyGrid(cols, rows) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => TILE_EMPTY));
}

function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

function keepCursorInside() {
  builderState.cursor.x = Math.max(0, Math.min(builderState.cols - 1, builderState.cursor.x));
  builderState.cursor.y = Math.max(0, Math.min(builderState.rows - 1, builderState.cursor.y));
}

function updateBuilderPointsBadge() {
  if (!adventureBuilder.pointsBadge) return;
  adventureBuilder.pointsBadge.textContent = `Puntos: ${builderState.points}`;
}

function updateBuilderModeButtons() {
  if (!adventureBuilder.modeGuidedBtn || !adventureBuilder.modeFreeBtn) return;
  const guided = builderState.mode === "guided";
  adventureBuilder.modeGuidedBtn.classList.toggle("selected", guided);
  adventureBuilder.modeFreeBtn.classList.toggle("selected", !guided);
}

function tileColor(tile) {
  if (tile === TILE_PLATFORM) return "#6c8bb3";
  if (tile === TILE_COIN) return "#f8c95a";
  if (tile === TILE_ENEMY) return "#e35f67";
  if (tile === TILE_SPAWN) return "#4ac391";
  if (tile === TILE_GOAL) return "#8d77ea";
  return "#eef3f9";
}

function tileLabel(tile) {
  if (tile === TILE_COIN) return "C";
  if (tile === TILE_ENEMY) return "E";
  if (tile === TILE_SPAWN) return "S";
  if (tile === TILE_GOAL) return "G";
  return "";
}

function renderBuilderStage() {
  const stage = adventureBuilder.stageCanvas;
  if (!stage) return;
  if (!builderStageCtx) {
    builderStageCtx = stage.getContext("2d");
  }
  const ctx2 = builderStageCtx;
  const { cols, rows } = builderState;
  const cell = Math.floor(stage.width / cols);
  builderState.cellSize = cell;

  ctx2.clearRect(0, 0, stage.width, stage.height);
  ctx2.fillStyle = "#f0f5fb";
  ctx2.fillRect(0, 0, stage.width, stage.height);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const tile = builderState.grid[y][x];
      const px = x * cell;
      const py = y * cell;
      ctx2.fillStyle = tileColor(tile);
      ctx2.fillRect(px + 1, py + 1, cell - 2, cell - 2);
      ctx2.strokeStyle = "rgba(58,84,108,0.18)";
      ctx2.strokeRect(px + 0.5, py + 0.5, cell - 1, cell - 1);
      if (tile === TILE_PLATFORM) {
        ctx2.fillStyle = "rgba(33,51,78,0.36)";
        ctx2.fillRect(px + 4, py + cell - 8, cell - 8, 4);
      }
      const label = tileLabel(tile);
      if (label) {
        ctx2.fillStyle = "rgba(28,46,66,0.88)";
        ctx2.font = "bold 12px BakeSoda, sans-serif";
        ctx2.fillText(label, px + cell / 2 - 5, py + cell / 2 + 4);
      }
    }
  }

  const cx = builderState.cursor.x * cell;
  const cy = builderState.cursor.y * cell;
  ctx2.strokeStyle = "rgba(27,77,126,0.95)";
  ctx2.lineWidth = 3;
  ctx2.strokeRect(cx + 2, cy + 2, cell - 4, cell - 4);
}

function saveBuilderState() {
  try {
    localStorage.setItem("builder_mode", builderState.mode);
    localStorage.setItem("builder_exercise_index", String(builderState.exerciseIndex));
    localStorage.setItem("builder_points", String(builderState.points));
    if (blocklyWorkspace && window.Blockly) {
      const dom = window.Blockly.Xml.workspaceToDom(blocklyWorkspace);
      const xml = window.Blockly.Xml.domToText(dom);
      localStorage.setItem("builder_workspace_xml", xml);
      localStorage.removeItem("builder_fallback_commands");
    }
    if (fallbackBuilder.enabled) {
      localStorage.setItem("builder_fallback_commands", JSON.stringify(fallbackBuilder.commands));
    }
  } catch {}
}

function restoreBuilderState() {
  const storedMode = localStorage.getItem("builder_mode");
  if (storedMode === "guided" || storedMode === "free") builderState.mode = storedMode;
  const idx = Number(localStorage.getItem("builder_exercise_index") || "0");
  if (!Number.isNaN(idx)) {
    builderState.exerciseIndex = Math.max(0, Math.min(builderExercises.length - 1, idx));
  }
  const points = Number(localStorage.getItem("builder_points") || "0");
  if (!Number.isNaN(points)) builderState.points = Math.max(0, points);
  try {
    const raw = localStorage.getItem("builder_fallback_commands");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) fallbackBuilder.commands = parsed;
    }
  } catch {}
}

function resetBuilderGrid() {
  builderState.baseGrid = createEmptyGrid(builderState.cols, builderState.rows);
  builderState.grid = cloneGrid(builderState.baseGrid);
  builderState.cursor = { x: 1, y: builderState.rows - 2 };
  builderState.runQueue = [];
  builderState.runIndex = 0;
  builderState.isRunning = false;
  builderState.canPlay = false;
  renderBuilderStage();
}

function countTiles(type, grid = builderState.grid) {
  let total = 0;
  for (let y = 0; y < builderState.rows; y += 1) {
    for (let x = 0; x < builderState.cols; x += 1) {
      if (grid[y][x] === type) total += 1;
    }
  }
  return total;
}

function findTile(type, grid = builderState.grid) {
  for (let y = 0; y < builderState.rows; y += 1) {
    for (let x = 0; x < builderState.cols; x += 1) {
      if (grid[y][x] === type) return { x, y };
    }
  }
  return null;
}

function canTraverseTile(tile) {
  return tile === TILE_PLATFORM || tile === TILE_SPAWN || tile === TILE_GOAL || tile === TILE_COIN || tile === TILE_ENEMY;
}

function hasReachablePath(grid) {
  const start = findTile(TILE_SPAWN, grid);
  const goal = findTile(TILE_GOAL, grid);
  if (!start || !goal) return false;
  const visited = new Set();
  const queue = [start];
  const keyOf = (x, y) => `${x},${y}`;
  while (queue.length) {
    const node = queue.shift();
    if (node.x === goal.x && node.y === goal.y) return true;
    const key = keyOf(node.x, node.y);
    if (visited.has(key)) continue;
    visited.add(key);
    const neighbors = [
      { x: node.x + 1, y: node.y },
      { x: node.x - 1, y: node.y },
      { x: node.x, y: node.y + 1 },
      { x: node.x, y: node.y - 1 },
    ];
    neighbors.forEach((n) => {
      if (n.x < 0 || n.y < 0 || n.x >= builderState.cols || n.y >= builderState.rows) return;
      if (!canTraverseTile(grid[n.y][n.x])) return;
      const nKey = keyOf(n.x, n.y);
      if (!visited.has(nKey)) queue.push(n);
    });
  }
  return false;
}

function setUniqueTile(type) {
  for (let y = 0; y < builderState.rows; y += 1) {
    for (let x = 0; x < builderState.cols; x += 1) {
      if (builderState.grid[y][x] === type) builderState.grid[y][x] = TILE_EMPTY;
    }
  }
  builderState.grid[builderState.cursor.y][builderState.cursor.x] = type;
}

function applyBuilderCommand(cmd) {
  if (cmd.type === "move") {
    builderState.cursor.x += cmd.dx || 0;
    builderState.cursor.y += cmd.dy || 0;
    keepCursorInside();
    return;
  }
  if (cmd.type === "place") {
    if (cmd.tile === TILE_SPAWN || cmd.tile === TILE_GOAL) {
      setUniqueTile(cmd.tile);
    } else {
      builderState.grid[builderState.cursor.y][builderState.cursor.x] = cmd.tile;
    }
    return;
  }
  if (cmd.type === "erase") {
    builderState.grid[builderState.cursor.y][builderState.cursor.x] = TILE_EMPTY;
    return;
  }
  if (cmd.type === "if_empty") {
    if (builderState.grid[builderState.cursor.y][builderState.cursor.x] !== TILE_EMPTY) return;
    const branch = Array.isArray(cmd.branch) ? cmd.branch : [];
    branch.forEach((nested) => applyBuilderCommand(nested));
  }
}

function collectBuilderCommandsFromBlock(block, out) {
  let cursor = block;
  while (cursor) {
    if (cursor.type === "builder_move_right") {
      const steps = Math.max(1, Number(cursor.getFieldValue("STEPS")) || 1);
      for (let i = 0; i < steps; i += 1) out.push({ type: "move", dx: 1, dy: 0 });
    } else if (cursor.type === "builder_move_left") {
      const steps = Math.max(1, Number(cursor.getFieldValue("STEPS")) || 1);
      for (let i = 0; i < steps; i += 1) out.push({ type: "move", dx: -1, dy: 0 });
    } else if (cursor.type === "builder_move_up") {
      const steps = Math.max(1, Number(cursor.getFieldValue("STEPS")) || 1);
      for (let i = 0; i < steps; i += 1) out.push({ type: "move", dx: 0, dy: -1 });
    } else if (cursor.type === "builder_move_down") {
      const steps = Math.max(1, Number(cursor.getFieldValue("STEPS")) || 1);
      for (let i = 0; i < steps; i += 1) out.push({ type: "move", dx: 0, dy: 1 });
    } else if (cursor.type === "builder_place_platform") {
      out.push({ type: "place", tile: TILE_PLATFORM });
    } else if (cursor.type === "builder_place_coin") {
      out.push({ type: "place", tile: TILE_COIN });
    } else if (cursor.type === "builder_place_enemy") {
      out.push({ type: "place", tile: TILE_ENEMY });
    } else if (cursor.type === "builder_set_spawn") {
      out.push({ type: "place", tile: TILE_SPAWN });
    } else if (cursor.type === "builder_set_goal") {
      out.push({ type: "place", tile: TILE_GOAL });
    } else if (cursor.type === "builder_erase") {
      out.push({ type: "erase" });
    } else if (cursor.type === "builder_repeat") {
      const times = Math.max(1, Number(cursor.getFieldValue("TIMES")) || 1);
      const loop = [];
      const first = cursor.getInputTargetBlock("DO");
      if (first) collectBuilderCommandsFromBlock(first, loop);
      for (let i = 0; i < times; i += 1) out.push(...loop);
    } else if (cursor.type === "builder_if_empty") {
      const branch = [];
      const first = cursor.getInputTargetBlock("DO");
      if (first) collectBuilderCommandsFromBlock(first, branch);
      out.push({ type: "if_empty", branch });
    }
    cursor = cursor.getNextBlock();
  }
}

function getBuilderCommands() {
  if (fallbackBuilder.enabled) {
    return fallbackBuilder.commands.map((cmd) => ({ ...cmd }));
  }
  if (!blocklyWorkspace) return [];
  const tops = blocklyWorkspace.getTopBlocks(true);
  const startBlocks = tops.filter((b) => b.type === "builder_when_start");
  const base = startBlocks.length ? startBlocks : tops;
  const commands = [];
  base.forEach((block) => {
    if (block.type === "builder_when_start") {
      const first = block.getNextBlock();
      if (first) collectBuilderCommandsFromBlock(first, commands);
    } else {
      collectBuilderCommandsFromBlock(block, commands);
    }
  });
  return commands;
}

function validateExerciseResult(commandsCount) {
  if (builderState.mode !== "guided") {
    return { ok: true, message: "Modo libre: mundo construido. Puedes jugarlo o seguir mejorando." };
  }
  const ex = builderExercises[builderState.exerciseIndex];
  if (!ex) return { ok: true, message: "Sin ejercicio activo." };
  const objective = ex.objective || {};
  if (objective.maxBlocks && commandsCount > objective.maxBlocks) {
    return { ok: false, message: `Usaste demasiados bloques. Máximo recomendado: ${objective.maxBlocks}.` };
  }
  if (Array.isArray(objective.requiredTiles)) {
    for (const req of objective.requiredTiles) {
      const total = countTiles(req.type);
      if (req.count && total < req.count) {
        return { ok: false, message: `Faltan elementos: ${req.type} (${total}/${req.count}).` };
      }
      if (req.at) {
        const tile = builderState.grid[req.at.y] && builderState.grid[req.at.y][req.at.x];
        if (tile !== req.type) {
          return { ok: false, message: `La casilla (${req.at.x},${req.at.y}) debe ser ${req.type}.` };
        }
      }
    }
  }
  if (Array.isArray(objective.forbidTiles)) {
    for (const forbidden of objective.forbidTiles) {
      if (countTiles(forbidden) > 0) {
        return { ok: false, message: `No está permitido usar: ${forbidden}.` };
      }
    }
  }
  if (objective.requireReachablePath && !hasReachablePath(builderState.grid)) {
    return { ok: false, message: "No hay camino entre inicio y meta sobre casillas transitables." };
  }
  return { ok: true, message: ex.successMessage || "Reto completado." };
}

function awardBuilderPoints() {
  const reward = builderState.usedHint ? 2 : 3;
  builderState.points += reward;
  builderState.usedHint = false;
  updateBuilderPointsBadge();
  saveBuilderState();
}

function runBuilderProgram({ stepMode = false } = {}) {
  if (!blocklyWorkspace) return;
  resetBuilderGrid();
  builderState.attempts += 1;
  const commands = getBuilderCommands();
  if (!commands.length) {
    setBuilderRunLog("Agrega bloques al programa antes de ejecutar.", "error");
    setAdventureStatus("No hay bloques para ejecutar.");
    return;
  }
  builderState.runQueue = commands;
  builderState.runIndex = 0;
  builderState.isRunning = true;
  builderState.canPlay = false;

  const finishRun = () => {
    builderState.isRunning = false;
    const validation = validateExerciseResult(commands.length);
    if (!validation.ok) {
      setBuilderRunLog(validation.message, "error");
      setAdventureStatus(validation.message);
      renderBuilderStage();
      saveBuilderState();
      return;
    }
    builderState.canPlay = true;
    setBuilderRunLog(validation.message, "success");
    setAdventureStatus("Validación correcta. Ya puedes jugar este mundo.");
    if (builderState.mode === "guided") {
      const ex = builderExercises[builderState.exerciseIndex];
      if (ex && !builderState.solvedExercises.has(ex.id)) {
        builderState.solvedExercises.add(ex.id);
        awardBuilderPoints();
        if (builderState.exerciseIndex < builderExercises.length - 1) {
          const nextIndex = builderState.exerciseIndex + 1;
          loadExercise(nextIndex, { clearWorkspace: true });
          setAdventureStatus("Reto completado. Se cargó el siguiente ejercicio.");
          saveBuilderState();
        }
      }
    }
    renderBuilderStage();
    saveBuilderState();
  };

  const stepFn = () => {
    if (builderState.runIndex >= builderState.runQueue.length) {
      if (builderStepTimer) {
        clearInterval(builderStepTimer);
        builderStepTimer = null;
      }
      finishRun();
      return;
    }
    const command = builderState.runQueue[builderState.runIndex];
    builderState.runIndex += 1;
    applyBuilderCommand(command);
    renderBuilderStage();
    setBuilderRunLog(`Ejecutando bloque ${builderState.runIndex}/${builderState.runQueue.length}.`);
  };

  if (builderStepTimer) {
    clearInterval(builderStepTimer);
    builderStepTimer = null;
  }
  if (stepMode) {
    builderStepTimer = setInterval(stepFn, 280);
  } else {
    while (builderState.runIndex < builderState.runQueue.length) {
      stepFn();
    }
    finishRun();
  }
}

function buildAdventureLevelFromGrid() {
  const difficulty = normalizeAdventureDifficulty(adventureBuilder.difficulty ? adventureBuilder.difficulty.value : "medio");
  const difficultyScale = difficulty === "facil" ? 0.85 : difficulty === "dificil" ? 1.2 : 1;
  const worldName = adventureBuilder.worldName && adventureBuilder.worldName.value
    ? adventureBuilder.worldName.value.trim()
    : "Mi mundo Blockly";

  const tileW = 90;
  const rowHeight = 32;
  const originX = 120;
  const originY = 160;
  const width = originX + builderState.cols * tileW + 320;
  const platforms = [{ x: 0, y: 480, w: width, h: 60 }];
  const coins = [];
  const enemies = [];
  let spawn = { x: 90, y: 360 };
  let goal = { x: width - 130, y: 400, w: 60, h: 80 };

  for (let y = 0; y < builderState.rows; y += 1) {
    let segmentStart = null;
    for (let x = 0; x <= builderState.cols; x += 1) {
      const tile = x < builderState.cols ? builderState.grid[y][x] : TILE_EMPTY;
      const worldX = originX + x * tileW;
      const worldY = originY + y * rowHeight;
      if (tile === TILE_PLATFORM && segmentStart === null) {
        segmentStart = x;
      }
      if ((tile !== TILE_PLATFORM || x === builderState.cols) && segmentStart !== null) {
        const length = x - segmentStart;
        platforms.push({
          x: originX + segmentStart * tileW,
          y: worldY,
          w: length * tileW,
          h: 20,
        });
        segmentStart = null;
      }
      if (tile === TILE_COIN) {
        coins.push({ x: worldX + 24, y: worldY - 56 });
      } else if (tile === TILE_ENEMY) {
        const speed = Math.max(1, Math.min(2.2, 1.15 * difficultyScale));
        enemies.push({
          x: worldX + 18,
          y: worldY - 48,
          w: 48,
          h: 48,
          minX: Math.max(40, worldX - 70),
          maxX: Math.min(width - 80, worldX + tileW + 60),
          vx: speed,
        });
      } else if (tile === TILE_SPAWN) {
        spawn = { x: worldX + 12, y: worldY - 60 };
      } else if (tile === TILE_GOAL) {
        goal = { x: worldX + 14, y: worldY - 80, w: 60, h: 80 };
      }
    }
  }

  return {
    name: worldName || "Mi mundo Blockly",
    width,
    spawn,
    goal,
    platforms,
    coins,
    enemies,
    challenge: {
      basic: {
        type: "multiple",
        prompt: "Diseñaste este mundo con bloques. ¿Qué debes hacer ahora?",
        code: "Revisar -> Probar -> Mejorar",
        options: ["Probar y ajustar", "Ignorar errores", "Eliminar todo"],
        expectedIndex: 0,
        hint: "La mejora iterativa ayuda a crear mejores niveles.",
      },
      intermediate: {
        type: "multiple",
        prompt: "¿Cuál es la mejor práctica al construir niveles?",
        code: "Selecciona la respuesta correcta.",
        options: ["Construir y validar en ciclos", "No validar nunca", "Cambiar todo al azar"],
        expectedIndex: 0,
        hint: "La validación continua evita fallas en el diseño.",
      },
    },
  };
}

async function generateAdventurePackFromBlockly() {
  const workspace = await initAdventureBlockly();
  if (!workspace) return null;
  resetBuilderGrid();
  const commands = getBuilderCommands();
  commands.forEach((cmd) => applyBuilderCommand(cmd));
  renderBuilderStage();
  const level = buildAdventureLevelFromGrid();
  const pack = [level];
  adventureGeneratedLevels = pack;
  setAdventureStatus(`Nivel generado con ${commands.length || 1} bloques.`);
  return pack;
}

function getToolboxForProfile(profile) {
  const controlExtra = profile === "conditions" ? '<block type="builder_if_empty"></block>' : "";
  return `
    <xml>
      <category name="Inicio" colour="#9b8b53">
        <block type="builder_when_start"></block>
      </category>
      <category name="Movimiento" colour="#4f7ea8">
        <block type="builder_move_right"></block>
        <block type="builder_move_left"></block>
        <block type="builder_move_up"></block>
        <block type="builder_move_down"></block>
      </category>
      <category name="Construccion" colour="#5d9e6f">
        <block type="builder_place_platform"></block>
        <block type="builder_place_coin"></block>
        <block type="builder_place_enemy"></block>
        <block type="builder_set_spawn"></block>
        <block type="builder_set_goal"></block>
        <block type="builder_erase"></block>
      </category>
      <category name="Control" colour="#8d62b9">
        <block type="builder_repeat"></block>
        ${controlExtra}
      </category>
    </xml>
  `;
}

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.head.appendChild(script);
  });
}

function ensureBlocklyLoaded() {
  if (window.Blockly) return Promise.resolve(window.Blockly);
  if (blocklyLoadPromise) return blocklyLoadPromise;

  const sources = [
    "https://unpkg.com/blockly/blockly.min.js",
    "https://cdn.jsdelivr.net/npm/blockly/blockly.min.js",
  ];

  blocklyLoadPromise = (async () => {
    for (const src of sources) {
      try {
        await loadExternalScript(src);
        if (window.Blockly) return window.Blockly;
      } catch {}
    }
    throw new Error("No se pudo cargar Blockly desde las fuentes disponibles.");
  })();

  return blocklyLoadPromise;
}

function defineAdventureBlocklyBlocks(Blockly) {
  if (Blockly.Blocks.builder_when_start) return;
  Blockly.defineBlocksWithJsonArray([
    {
      type: "builder_when_start",
      message0: "cuando inicie",
      nextStatement: null,
      colour: 36,
    },
    {
      type: "builder_move_right",
      message0: "mover cursor derecha %1",
      args0: [{ type: "field_number", name: "STEPS", value: 1, min: 1, max: 10, precision: 1 }],
      previousStatement: null,
      nextStatement: null,
      colour: 205,
    },
    {
      type: "builder_move_left",
      message0: "mover cursor izquierda %1",
      args0: [{ type: "field_number", name: "STEPS", value: 1, min: 1, max: 10, precision: 1 }],
      previousStatement: null,
      nextStatement: null,
      colour: 205,
    },
    {
      type: "builder_move_up",
      message0: "mover cursor arriba %1",
      args0: [{ type: "field_number", name: "STEPS", value: 1, min: 1, max: 10, precision: 1 }],
      previousStatement: null,
      nextStatement: null,
      colour: 205,
    },
    {
      type: "builder_move_down",
      message0: "mover cursor abajo %1",
      args0: [{ type: "field_number", name: "STEPS", value: 1, min: 1, max: 10, precision: 1 }],
      previousStatement: null,
      nextStatement: null,
      colour: 205,
    },
    {
      type: "builder_place_platform",
      message0: "colocar plataforma",
      previousStatement: null,
      nextStatement: null,
      colour: 125,
    },
    {
      type: "builder_place_coin",
      message0: "colocar moneda",
      previousStatement: null,
      nextStatement: null,
      colour: 50,
    },
    {
      type: "builder_place_enemy",
      message0: "colocar enemigo",
      previousStatement: null,
      nextStatement: null,
      colour: 2,
    },
    {
      type: "builder_set_spawn",
      message0: "definir inicio",
      previousStatement: null,
      nextStatement: null,
      colour: 260,
    },
    {
      type: "builder_set_goal",
      message0: "definir meta",
      previousStatement: null,
      nextStatement: null,
      colour: 285,
    },
    {
      type: "builder_erase",
      message0: "borrar casilla",
      previousStatement: null,
      nextStatement: null,
      colour: 0,
    },
    {
      type: "builder_repeat",
      message0: "repetir %1 veces %2 %3",
      args0: [
        { type: "field_number", name: "TIMES", value: 2, min: 1, max: 8, precision: 1 },
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 290,
    },
    {
      type: "builder_if_empty",
      message0: "si casilla actual está vacía %1 %2",
      args0: [
        { type: "input_dummy" },
        { type: "input_statement", name: "DO" },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 68,
    },
  ]);
}

function getStarterXml() {
  return `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="builder_when_start" x="30" y="24">
        <next>
          <block type="builder_set_spawn">
            <next>
              <block type="builder_place_platform">
                <next>
                  <block type="builder_move_right">
                    <field name="STEPS">2</field>
                    <next>
                      <block type="builder_place_platform">
                        <next>
                          <block type="builder_set_goal"></block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </xml>
  `;
}

function updateExerciseHeader() {
  if (!adventureBuilder.exerciseTitle || !adventureBuilder.instruction) return;
  if (builderState.mode === "free") {
    adventureBuilder.exerciseTitle.textContent = "Modo libre - Construye tu mundo";
    adventureBuilder.instruction.textContent = "Diseña en cuadrícula con bloques, ejecuta y luego juega tu nivel.";
    return;
  }
  const ex = builderExercises[builderState.exerciseIndex];
  if (!ex) return;
  adventureBuilder.exerciseTitle.textContent = ex.title;
  adventureBuilder.instruction.textContent = ex.instruction;
}

function loadExercise(index, { clearWorkspace = true } = {}) {
  builderState.exerciseIndex = Math.max(0, Math.min(builderExercises.length - 1, index));
  updateExerciseHeader();
  resetBuilderGrid();
  if (!blocklyWorkspace || !window.Blockly || !clearWorkspace) return;
  blocklyWorkspace.clear();
  try {
    const xml = window.Blockly.utils.xml.textToDom(getStarterXml());
    window.Blockly.Xml.domToWorkspace(xml, blocklyWorkspace);
  } catch {}
  saveBuilderState();
}

function setBuilderMode(mode, { clearWorkspace = true } = {}) {
  builderState.mode = mode === "free" ? "free" : "guided";
  updateBuilderModeButtons();
  updateExerciseHeader();
  if (blocklyWorkspace && window.Blockly) {
    const ex = builderExercises[builderState.exerciseIndex];
    const profile = builderState.mode === "guided" && ex ? ex.toolboxProfile : "conditions";
    try {
      blocklyWorkspace.updateToolbox(getToolboxForProfile(profile));
    } catch {
      blocklyWorkspace.updateToolbox(getToolboxForProfile("basic"));
      setAdventureStatus("Se cargó toolbox básico por compatibilidad.");
    }
  }
  if (clearWorkspace && blocklyWorkspace) {
    loadExercise(builderState.exerciseIndex, { clearWorkspace: true });
  }
  saveBuilderState();
}

async function initAdventureBlockly(force = false) {
  if (FORCE_FALLBACK_BUILDER) {
    renderFallbackBuilderUI();
    return null;
  }
  let Blockly = window.Blockly;
  if (!adventureBuilder.workspaceHost) return null;
  if (!Blockly) {
    setAdventureStatus("Cargando Blockly...");
    try {
      Blockly = await ensureBlocklyLoaded();
    } catch {
      renderFallbackBuilderUI();
      return null;
    }
  }

  if (blocklyWorkspace && !force) return blocklyWorkspace;
  if (blocklyWorkspace && force) {
    blocklyWorkspace.dispose();
    blocklyWorkspace = null;
  }

  defineAdventureBlocklyBlocks(Blockly);
  const ex = builderExercises[builderState.exerciseIndex];
  const profile = builderState.mode === "guided" && ex ? ex.toolboxProfile : "conditions";
  let toolboxXml = getToolboxForProfile(profile);
  blocklyWorkspace = Blockly.inject(adventureBuilder.workspaceHost, {
    toolbox: toolboxXml,
    trashcan: true,
    move: { scrollbars: true, drag: true, wheel: true },
    zoom: { controls: true, wheel: true, startScale: 0.9, maxScale: 1.4, minScale: 0.45, scaleSpeed: 1.12 },
  });

  const storedXml = localStorage.getItem("builder_workspace_xml");
  let loaded = false;
  if (storedXml) {
    try {
      const xml = Blockly.utils.xml.textToDom(storedXml);
      Blockly.Xml.domToWorkspace(xml, blocklyWorkspace);
      loaded = true;
    } catch {}
  }
  if (!loaded) {
    try {
      const xml = Blockly.utils.xml.textToDom(getStarterXml());
      Blockly.Xml.domToWorkspace(xml, blocklyWorkspace);
    } catch {}
  }
  blocklyWorkspace.addChangeListener(() => saveBuilderState());
  try {
    blocklyWorkspace.updateToolbox(toolboxXml);
  } catch {
    toolboxXml = getToolboxForProfile("basic");
    blocklyWorkspace.updateToolbox(toolboxXml);
    setAdventureStatus("Toolbox básico cargado por compatibilidad.");
  }
  Blockly.svgResize(blocklyWorkspace);
  setTimeout(() => {
    if (blocklyWorkspace && window.Blockly) {
      window.Blockly.svgResize(blocklyWorkspace);
    }
  }, 0);
  setTimeout(() => {
    try {
      const tb = blocklyWorkspace && blocklyWorkspace.getToolbox ? blocklyWorkspace.getToolbox() : null;
      if (!tb && !fallbackBuilder.enabled) {
        renderFallbackBuilderUI();
      }
    } catch {
      if (!fallbackBuilder.enabled) renderFallbackBuilderUI();
    }
  }, 120);
  updateExerciseHeader();
  updateBuilderModeButtons();
  updateBuilderPointsBadge();
  renderBuilderStage();
  setAdventureStatus("Builder listo: construye, ejecuta y valida.");
  return blocklyWorkspace;
}

function initBuilderUI() {
  restoreBuilderState();
  setBuilderMode(builderState.mode, { clearWorkspace: false });
  updateBuilderPointsBadge();
  updateBuilderModeButtons();
  updateExerciseHeader();
  resetBuilderGrid();
  setBuilderRunLog("Listo para ejecutar bloques.");

  if (adventureBuilder.hintBtn) {
    adventureBuilder.hintBtn.addEventListener("click", () => {
      const ex = builderExercises[builderState.exerciseIndex];
      if (builderState.mode === "guided" && ex) {
        builderState.usedHint = true;
        setBuilderRunLog(`Pista: ${ex.hint}`);
        setAdventureStatus("Pista mostrada. Esta ronda dará menos puntos.");
      } else {
        setBuilderRunLog("En modo libre: prueba construir inicio, camino y meta.");
      }
    });
  }

  if (adventureBuilder.modeGuidedBtn) {
    adventureBuilder.modeGuidedBtn.addEventListener("click", () => {
      setBuilderMode("guided");
    });
  }
  if (adventureBuilder.modeFreeBtn) {
    adventureBuilder.modeFreeBtn.addEventListener("click", () => {
      setBuilderMode("free");
    });
  }
  if (adventureBuilder.runBtn) {
    adventureBuilder.runBtn.addEventListener("click", async () => {
      await initAdventureBlockly();
      runBuilderProgram({ stepMode: false });
    });
  }
  if (adventureBuilder.stepBtn) {
    adventureBuilder.stepBtn.addEventListener("click", async () => {
      await initAdventureBlockly();
      runBuilderProgram({ stepMode: true });
    });
  }
  if (adventureBuilder.resetBtn) {
    adventureBuilder.resetBtn.addEventListener("click", () => {
      if (builderStepTimer) {
        clearInterval(builderStepTimer);
        builderStepTimer = null;
      }
      resetBuilderGrid();
      setBuilderRunLog("Escenario reiniciado.");
      setAdventureStatus("Puedes volver a ejecutar tu programa.");
    });
  }
}

function formatClock(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function refreshSessionHud() {
  if (!hud.timeText) return;
  hud.timeText.textContent = formatClock(sessionElapsedMs);
}

function resetSessionClock() {
  sessionElapsedMs = 0;
  sessionNextMilestone = 10 * 60 * 1000;
  refreshSessionHud();
}

function updateSessionClock(delta) {
  if (gameState !== "playing") return;
  sessionElapsedMs += Math.max(0, delta);
  if (sessionElapsedMs >= sessionNextMilestone && sessionNextMilestone <= SESSION_TARGET_MS) {
    const minuteMark = Math.floor(sessionNextMilestone / 60000);
    showToast(`Excelente: ${minuteMark} minutos jugados`);
    sessionNextMilestone += 10 * 60 * 1000;
  }
  refreshSessionHud();
}

function startBackgroundMusic() {
  const bg = assets.sounds.bg;
  if (!bg) return;
  bg.loop = true;
  if (bg.paused) {
    bg.currentTime = 0;
    bg.play().catch(() => {});
  }
}

function gridKey(x, y) {
  return `${x},${y}`;
}

function createSeededRng(seed) {
  let value = (seed >>> 0) || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return ((value >>> 0) % 1000000) / 1000000;
  };
}

function randomInt(min, max, rng) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shuffleArray(list, rng) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function getStrategyBiome(levelIndex) {
  return strategyBiomes[levelIndex % strategyBiomes.length];
}

function allGridCells() {
  const cells = [];
  for (let y = 0; y < STRATEGY_ROWS; y += 1) {
    for (let x = 0; x < STRATEGY_COLS; x += 1) {
      cells.push({ x, y });
    }
  }
  return cells;
}

function orthogonalNeighbors(cell) {
  return [
    { x: cell.x + 1, y: cell.y },
    { x: cell.x - 1, y: cell.y },
    { x: cell.x, y: cell.y + 1 },
    { x: cell.x, y: cell.y - 1 },
  ].filter((n) => n.x >= 0 && n.y >= 0 && n.x < STRATEGY_COLS && n.y < STRATEGY_ROWS);
}

function buildRoute(start, end, rng) {
  const route = [{ ...start }];
  let x = start.x;
  let y = start.y;
  let guard = 0;
  while ((x !== end.x || y !== end.y) && guard < 200) {
    guard += 1;
    const options = [];
    if (x < end.x) options.push({ x: x + 1, y });
    if (x > end.x) options.push({ x: x - 1, y });
    if (y < end.y) options.push({ x, y: y + 1 });
    if (y > end.y) options.push({ x, y: y - 1 });
    const next = options[Math.floor(rng() * options.length)] || { x: end.x, y: end.y };
    x = next.x;
    y = next.y;
    route.push({ x, y });
  }
  return route;
}

function buildWiggleRoute(start, end, rng, wiggles = 2) {
  const route = [];
  let cursor = { ...start };
  for (let i = 0; i < wiggles; i += 1) {
    const pivot = {
      x: randomInt(Math.min(cursor.x, end.x), Math.max(cursor.x, end.x), rng),
      y: randomInt(Math.min(cursor.y, end.y), Math.max(cursor.y, end.y), rng),
    };
    route.push(...buildRoute(cursor, pivot, rng));
    cursor = pivot;
  }
  route.push(...buildRoute(cursor, end, rng));
  const dedup = [];
  const seen = new Set();
  route.forEach((cell) => {
    const key = gridKey(cell.x, cell.y);
    if (!seen.has(key)) {
      dedup.push(cell);
      seen.add(key);
    }
  });
  return dedup;
}

function computeReachable(start, wallsSet, doorsSet, hasKey) {
  const visited = new Set();
  const queue = [{ ...start }];
  while (queue.length) {
    const current = queue.shift();
    const key = gridKey(current.x, current.y);
    if (visited.has(key)) continue;
    visited.add(key);
    for (const next of orthogonalNeighbors(current)) {
      const nKey = gridKey(next.x, next.y);
      if (visited.has(nKey)) continue;
      if (wallsSet.has(nKey)) continue;
      if (doorsSet.has(nKey) && !hasKey) continue;
      queue.push(next);
    }
  }
  return visited;
}

function makeEnemyPattern(levelIndex, rng) {
  const length = 4 + Math.min(6, Math.floor(levelIndex / 7));
  const dirs = ["L", "R", "U", "D"];
  const pattern = [];
  for (let i = 0; i < length; i += 1) {
    pattern.push(dirs[Math.floor(rng() * dirs.length)]);
  }
  return pattern;
}

function getStrategyDifficulty(levelIndex) {
  if (levelIndex < 10) {
    return {
      tier: "facil",
      wallDensity: 0.11 + levelIndex * 0.004,
      wiggles: 1,
      doorCount: 1,
      gemTarget: 2 + Math.floor(levelIndex / 4),
      enemyCount: 1 + Math.floor(levelIndex / 5),
      enemyMovesPerTurn: 1,
      moveCooldown: 125,
      miniBoss: false,
      volcanoHotCount: 4,
      volcanoCycle: 4,
      caveVisionRadius: 185,
      castleDoorCycle: 3,
    };
  }
  if (levelIndex < 30) {
    const mid = levelIndex - 10;
    return {
      tier: "medio",
      wallDensity: 0.16 + Math.min(0.08, mid * 0.003),
      wiggles: 2,
      doorCount: 1 + Math.min(1, Math.floor(mid / 8)),
      gemTarget: 3 + Math.min(2, Math.floor(mid / 6)),
      enemyCount: 2 + Math.min(3, Math.floor(mid / 5)),
      enemyMovesPerTurn: 1 + Math.min(1, Math.floor(mid / 10)),
      moveCooldown: 108,
      miniBoss: false,
      volcanoHotCount: 6,
      volcanoCycle: 3,
      caveVisionRadius: 155,
      castleDoorCycle: 2,
    };
  }
  const hard = levelIndex - 30;
  return {
    tier: "dificil",
    wallDensity: 0.24 + Math.min(0.1, hard * 0.004),
    wiggles: 3,
    doorCount: 2 + Math.min(1, Math.floor(hard / 10)),
    gemTarget: 5 + Math.min(3, Math.floor(hard / 6)),
    enemyCount: 4 + Math.min(4, Math.floor(hard / 5)),
    enemyMovesPerTurn: 2 + Math.min(1, Math.floor(hard / 10)),
    moveCooldown: 90,
    miniBoss: (levelIndex + 1) % 5 === 0,
    volcanoHotCount: 8 + Math.min(4, Math.floor(hard / 6)),
    volcanoCycle: 2,
    caveVisionRadius: 125,
    castleDoorCycle: 2,
  };
}

function buildStrategyLevel(levelIndex) {
  const rng = createSeededRng(991 + levelIndex * 1973);
  const difficulty = getStrategyDifficulty(levelIndex);
  const biome = getStrategyBiome(levelIndex);
  const start = { x: 0, y: randomInt(0, STRATEGY_ROWS - 1, rng) };
  const portal = { x: STRATEGY_COLS - 1, y: randomInt(0, STRATEGY_ROWS - 1, rng) };
  const key = {
    x: randomInt(Math.floor(STRATEGY_COLS * 0.3), Math.floor(STRATEGY_COLS * 0.6), rng),
    y: randomInt(0, STRATEGY_ROWS - 1, rng),
  };

  const routeA = buildWiggleRoute(start, key, rng, difficulty.wiggles);
  const routeB = buildWiggleRoute(key, portal, rng, difficulty.wiggles);
  const safeRoute = [...routeA, ...routeB];
  const safeSet = new Set(safeRoute.map((cell) => gridKey(cell.x, cell.y)));

  const allCells = allGridCells();
  const walls = [];
  const doors = [];
  const wallDensity = difficulty.wallDensity;
  const desiredWalls = Math.floor(STRATEGY_COLS * STRATEGY_ROWS * wallDensity);
  for (const cell of shuffleArray(allCells, rng)) {
    if (walls.length >= desiredWalls) break;
    const keyCell = gridKey(cell.x, cell.y);
    if (safeSet.has(keyCell)) continue;
    if ((cell.x === start.x && cell.y === start.y) || (cell.x === portal.x && cell.y === portal.y)) continue;
    if (cell.x === key.x && cell.y === key.y) continue;
    walls.push(cell);
  }
  const wallsSet = new Set(walls.map((cell) => gridKey(cell.x, cell.y)));

  const doorCount = difficulty.doorCount;
  const routeForDoors = routeB.filter((cell) => cell.x > 2 && cell.x < STRATEGY_COLS - 2);
  const doorCandidates = shuffleArray(routeForDoors, rng);
  for (const cell of doorCandidates) {
    if (doors.length >= doorCount) break;
    if (cell.x === key.x && cell.y === key.y) continue;
    const k = gridKey(cell.x, cell.y);
    if (wallsSet.has(k)) continue;
    doors.push(cell);
  }
  const doorsSet = new Set(doors.map((cell) => gridKey(cell.x, cell.y)));

  const reachableWithKey = computeReachable(start, wallsSet, doorsSet, true);
  const gemPool = shuffleArray(
    allCells.filter((cell) => reachableWithKey.has(gridKey(cell.x, cell.y))),
    rng
  );
  const gemTarget = difficulty.gemTarget;
  const gems = [];
  for (const cell of gemPool) {
    if (gems.length >= gemTarget) break;
    const k = gridKey(cell.x, cell.y);
    if (k === gridKey(start.x, start.y) || k === gridKey(portal.x, portal.y) || k === gridKey(key.x, key.y)) {
      continue;
    }
    if (doorsSet.has(k) || wallsSet.has(k)) continue;
    gems.push(cell);
  }

  const enemySlots = shuffleArray(
    allCells.filter((cell) => reachableWithKey.has(gridKey(cell.x, cell.y)) && !safeSet.has(gridKey(cell.x, cell.y))),
    rng
  );
  const enemyCount = difficulty.enemyCount;
  const enemies = [];
  for (const cell of enemySlots) {
    if (enemies.length >= enemyCount) break;
    const k = gridKey(cell.x, cell.y);
    if (doorsSet.has(k) || wallsSet.has(k)) continue;
    enemies.push({
      ...cell,
      rx: cell.x,
      ry: cell.y,
      facing: 1,
      pattern: makeEnemyPattern(levelIndex, rng),
      step: 0,
      isMiniBoss: false,
    });
  }

  if (difficulty.miniBoss) {
    const bossSlot = enemySlots.find((cell) => {
      const k = gridKey(cell.x, cell.y);
      const farFromStart = Math.abs(cell.x - start.x) + Math.abs(cell.y - start.y) > 2;
      const farFromPortal = Math.abs(cell.x - portal.x) + Math.abs(cell.y - portal.y) > 1;
      return !doorsSet.has(k) && !wallsSet.has(k) && !safeSet.has(k) && farFromStart && farFromPortal;
    });
    if (bossSlot) {
      enemies.push({
        ...bossSlot,
        rx: bossSlot.x,
        ry: bossSlot.y,
        facing: -1,
        pattern: ["L", "U", "R", "R", "D", "L"],
        step: 0,
        isMiniBoss: true,
        bossSpeed: 2,
      });
    }
  }

  return {
    name: `Mundo ${levelIndex + 1} - ${biome.name}`,
    biomeName: biome.name,
    start,
    portal,
    walls,
    doors,
    key,
    hasKey: true,
    gems,
    enemies,
    enemyMovesPerTurn: difficulty.enemyMovesPerTurn,
    moveCooldown: difficulty.moveCooldown,
    tier: difficulty.tier,
    hasMiniBoss: difficulty.miniBoss,
    volcanoHotCount: difficulty.volcanoHotCount,
    volcanoCycle: difficulty.volcanoCycle,
    caveVisionRadius: difficulty.caveVisionRadius,
    castleDoorCycle: difficulty.castleDoorCycle,
  };
}

function parseStrategyLevels() {
  strategyLevels.length = 0;
  for (let i = 0; i < STRATEGY_TOTAL_LEVELS; i += 1) {
    strategyLevels.push(buildStrategyLevel(i));
  }
}

function ensurePlatformProfileSeed() {
  if (platformProfileSeed) return platformProfileSeed;
  const raw = localStorage.getItem("plataformas_profile_seed");
  const parsed = Number(raw || "0");
  if (parsed && Number.isFinite(parsed)) {
    platformProfileSeed = parsed;
    return platformProfileSeed;
  }
  platformProfileSeed = Math.floor(Math.random() * 9000000) + 1000000;
  localStorage.setItem("plataformas_profile_seed", String(platformProfileSeed));
  return platformProfileSeed;
}

function resetPlatformSessionSeed() {
  ensurePlatformProfileSeed();
  platformSessionSeed = Math.floor(Math.random() * 9000000) + 1000000;
}

function createPlatformVariationRng(levelIndex, salt = 0) {
  const profile = ensurePlatformProfileSeed();
  const session = platformSessionSeed || 1;
  const seed = profile * 131 + session * 17 + (levelIndex + 1) * 1973 + salt * 97;
  return createSeededRng(seed);
}

function applyPlatformSessionVariation(levelsList) {
  levelsList.forEach((level, index) => {
    if (!level || index < 3) return;
    const rng = createPlatformVariationRng(index, 11);
    const width = level.width || 2000;
    const elevated = (level.platforms || []).filter((p) => p.h <= 24);
    elevated.forEach((p) => {
      const xShift = randomInt(-24, 24, rng);
      const yShift = randomInt(-14, 14, rng);
      const wGrow = randomInt(-8, 42, rng);
      p.x = clamp(p.x + xShift, 20, Math.max(40, width - 220));
      p.y = clamp(p.y + yShift, 160, 430);
      p.w = clamp(p.w + wGrow, 150, 340);
    });

    (level.coins || []).forEach((coin) => {
      coin.x = clamp(coin.x + randomInt(-16, 16, rng), 20, width - 60);
      coin.y = clamp(coin.y + randomInt(-12, 12, rng), 40, 440);
    });

    (level.enemies || []).forEach((enemy) => {
      const speedScale = 0.92 + rng() * 0.36;
      enemy.vx = (enemy.vx || 1.4) * speedScale;
      enemy.aggroRange = Math.max(200, Math.floor((enemy.aggroRange || 260) * (0.9 + rng() * 0.5)));
      enemy.chaseSpeed = Math.max(1.8, (enemy.chaseSpeed || 2.2) * (0.92 + rng() * 0.45));
      if (enemy.minX != null && enemy.maxX != null) {
        const drift = randomInt(-28, 28, rng);
        enemy.minX += drift;
        enemy.maxX += drift + randomInt(0, 24, rng);
      }
    });
  });
}

function buildPlatformMarathonLevel(levelIndex) {
  const rng = createPlatformVariationRng(levelIndex, 53);
  const width = 3800 + levelIndex * 220 + randomInt(0, 440, rng);
  const platforms = [{ x: 0, y: 480, w: width, h: 60 }];
  const cols = 14 + Math.min(14, Math.floor(levelIndex / 2));
  const widthPenalty = Math.min(44, Math.floor(levelIndex / 5) * 5);
  for (let i = 0; i < cols; i += 1) {
    const x = 150 + i * 240 + randomInt(-42, 56, rng);
    const y = 352 - (i % 5) * 56 - Math.min(54, Math.floor(levelIndex / 4) * 5) + randomInt(-22, 20, rng);
    const w = clamp(170 + randomInt(0, 90, rng) - widthPenalty, 120, 240);
    platforms.push({ x: clamp(x, 60, width - 240), y: clamp(y, 180, 430), w, h: 20 });
    if (i % 2 === 0) {
      platforms.push({
        x: clamp(x + randomInt(76, 150, rng), 70, width - 230),
        y: clamp(y - randomInt(64, 104, rng), 110, 360),
        w: clamp(136 + randomInt(0, 74, rng) - Math.floor(widthPenalty * 0.6), 110, 220),
        h: 18,
      });
    }
    if (levelIndex >= 10 && i % 4 === 1) {
      platforms.push({
        x: clamp(x + randomInt(34, 92, rng), 70, width - 230),
        y: clamp(y - randomInt(110, 150, rng), 90, 330),
        w: clamp(118 + randomInt(0, 58, rng) - Math.floor(widthPenalty * 0.5), 96, 200),
        h: 18,
      });
    }
  }

  const coins = [];
  platforms.filter((p) => p.h <= 20).forEach((p) => {
    if (rng() < 0.9) coins.push({ x: p.x + Math.max(16, p.w / 2 - 16), y: p.y - 50 });
    if (rng() < 0.5) coins.push({ x: p.x + 24, y: p.y - 52 });
  });

  const enemies = [];
  const enemyCount = 6 + Math.min(14, Math.floor(levelIndex * 0.7));
  for (let e = 0; e < enemyCount; e += 1) {
    const baseX = 320 + e * 280 + randomInt(-44, 60, rng);
    const vx = (1.45 + e * 0.06 + levelIndex * 0.03) * (rng() < 0.5 ? -1 : 1);
    enemies.push({
      x: clamp(baseX, 80, width - 180),
      y: 420,
      w: 48,
      h: 48,
      minX: clamp(baseX - 130, 50, width - 260),
      maxX: clamp(baseX + 220, 180, width - 70),
      vx,
      aggroRange: 340 + Math.floor(levelIndex * 14 + rng() * 70),
      chaseSpeed: 2.4 + levelIndex * 0.06 + rng() * 0.5,
      spawnDelay: randomInt(0, 1900, rng),
    });
  }
  const elevatedPlatforms = platforms.filter((p) => p.h <= 20 && p.y <= 340);
  const ambusherCount = Math.min(6, 1 + Math.floor(levelIndex / 4));
  for (let a = 0; a < ambusherCount && a < elevatedPlatforms.length; a += 1) {
    const p = elevatedPlatforms[(a * 3 + levelIndex) % elevatedPlatforms.length];
    const enemyWidth = 48;
    const enemyHeight = 48;
    const minX = p.x;
    const maxX = Math.max(minX + 40, p.x + p.w - enemyWidth);
    enemies.push({
      x: clamp(p.x + 10 + a * 6, minX, maxX),
      y: p.y - enemyHeight,
      w: enemyWidth,
      h: enemyHeight,
      minX,
      maxX,
      vx: (1.25 + levelIndex * 0.02) * (a % 2 === 0 ? 1 : -1),
      aggroRange: 320 + levelIndex * 10,
      chaseSpeed: 2 + levelIndex * 0.05,
      spawnDelay: randomInt(300, 1700, rng),
    });
  }

  return {
    name: `Maraton ${levelIndex + 1}`,
    displayLevelNumber: levelIndex + 1,
    width,
    spawn: { x: 80, y: 360 },
    goal: { x: width - 120, y: 400, w: 60, h: 80 },
    platforms,
    coins,
    enemies,
    challenge: {
      basic: {
        type: "multiple",
        prompt: "¿Qué acción te ayuda más a superar una zona difícil?",
        options: ["Observar y decidir", "Correr sin mirar", "Quedarte quieto"],
        expectedIndex: 0,
        hint: "Planear antes de actuar ayuda a avanzar.",
      },
      intermediate: {
        type: "text",
        prompt: "Completa la acción clave para avanzar con estrategia:",
        expectedKeywords: ["observar", "planear", "analizar", "avanzar"],
        hint: "Piensa primero y luego ejecuta.",
      },
    },
  };
}

function ensureStrategyLevel(index) {
  while (strategyLevels.length <= index) {
    strategyLevels.push(buildStrategyLevel(strategyLevels.length));
  }
}

function getStrategyBiomeInstruction(level) {
  if (!level) return "Muevete con flechas o WASD.";
  if (level.biomeName === "Volcan") {
    return `Volcan: casillas rojas cambian cada ${level.volcanoCycle} turnos. Si te quedas 2 turnos en rojo, pierdes 1 vida. Orbe oculto: usa X para bomba de humo.`;
  }
  if (level.biomeName === "Cuevas") {
    return `Cuevas: vision reducida (radio ${Math.round(level.caveVisionRadius / 56)} celdas). Busca el orbe y usa X para mover guardias.`;
  }
  if (level.biomeName === "Castillo") {
    return `Castillo: puertas moviles cambian cada ${level.castleDoorCycle} turnos. Orbe oculto + X: aparta guardia y abre paso temporal.`;
  }
  return "Bioma tactico: recoge gemas, toma llave, busca orbe oculto y usa X como power-up.";
}

function speakBiomeInstruction(level) {
  const text = getStrategyBiomeInstruction(level);
  if ("speechSynthesis" in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "es-MX";
    utter.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    return;
  }
  showToast(text);
}

function updateGameTypeUI() {
  const platform = selectedGameType === "platform";
  const strategy = selectedGameType === "strategy";
  const adventure = selectedGameType === "adventure_builder";
  gameTypePlatformBtn.classList.toggle("selected", platform);
  gameTypeStrategyBtn.classList.toggle("selected", strategy);
  if (gameTypeAdventureBtn) gameTypeAdventureBtn.classList.toggle("selected", adventure);
  platformConfig.classList.toggle("hidden", !platform);
  strategyConfig.classList.toggle("hidden", !strategy);
  if (adventureConfig) adventureConfig.classList.toggle("hidden", !adventure);
}

function setSelectedGameType(type) {
  selectedGameType = type;
  localStorage.setItem("plataformas_game_type", selectedGameType);
  updateGameTypeUI();
}

function openStartMenuFor(type) {
  setSelectedGameType(type);
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  challengeModal.classList.remove("show");
  winScreen.classList.remove("show");
  startScreen.classList.add("show");
  gameState = "start";
  resetKeys();
}

function updateFullscreenButtonLabel() {
  if (!fullscreenToggleBtn) return;
  fullscreenToggleBtn.textContent = document.fullscreenElement ? "Salir pantalla completa" : "Pantalla completa";
}

function syncFullscreenUiState() {
  const active = !!document.fullscreenElement;
  document.body.classList.toggle("fullscreen-active", active);
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    showToast("No se pudo activar pantalla completa.");
  } finally {
    syncFullscreenUiState();
    updateFullscreenButtonLabel();
  }
}

function updateNotes() {
  if (activeGame === "strategy") {
    const level = strategyLevels[strategyWorldIndex];
    noteGoal.textContent = `Objetivo: ${level ? level.name : "bioma"} | Gemas ${strategyCollected}/${strategyTotalGems} | Power-up ${strategyPowerupCharges} (X) | Modo ${level ? level.tier : ""}.`;
    noteLearn.textContent = getStrategyBiomeInstruction(level);
  } else if (activeGame === "adventure") {
    noteGoal.textContent = "Objetivo: completa tu aventura creada con Blockly y llega a la puerta final.";
    noteLearn.textContent = "Aprendizajes: secuencia, patrones y pensamiento algorítmico.";
  } else {
    const level = levels[currentLevelIndex];
    const topic = level && level.lessonTopic ? level.lessonTopic : null;
    const rewardText = topic && topic.reward ? topic.reward.label : "Bonus sorpresa";
    noteGoal.textContent = `Objetivo: recolecta monedas, llega a la meta y responde el tema del nivel para desbloquear ${rewardText}. Usa Q para lanzar el latigo y alcanzar monedas lejanas.`;
    noteLearn.textContent = topic ? `Tema del nivel: ${topic.title}` : "Aprendizajes: electronica basica y pensamiento logico.";
  }
}

function updateHudForStrategy() {
  hud.levelText.textContent = strategyWorldIndex + 1;
  hud.coinText.textContent = strategyCollected;
  hud.coinTotal.textContent = strategyTotalGems;
  hud.livesText.textContent = strategyLives;
  hud.weaponText.textContent = `Power-up x${strategyPowerupCharges} (X)`;
  const icon = assets.images.orbe || assets.images.crystal_b || assets.images.weapon_pistol_icon;
  if (icon) hud.weaponIcon.src = icon.src;
  const weaponHud = document.getElementById("weaponHud");
  if (weaponHud) weaponHud.classList.remove("hidden");
}

function updateHudForPlatform() {
  const weaponHud = document.getElementById("weaponHud");
  if (weaponHud) weaponHud.classList.remove("hidden");
  const bonus = [];
  if (shieldCharges > 0) bonus.push(`Escudo x${shieldCharges}`);
  if (speedBoostTimer > 0) bonus.push("Turbo");
  hud.weaponText.textContent = bonus.length ? `${currentWeapon.name} | ${bonus.join(" | ")}` : currentWeapon.name;
}

function setupStrategyLevel(index) {
  const level = strategyLevels[index];
  strategyPlayer = { ...level.start };
  strategyPlayerRender = { ...level.start };
  strategyPlayerFacing = 1;
  strategyPortal = { ...level.portal };
  strategyWalls = new Set(level.walls.map((cell) => gridKey(cell.x, cell.y)));
  strategyDoors = new Set(level.doors.map((cell) => gridKey(cell.x, cell.y)));
  strategyHasKey = !level.hasKey;
  strategyGems = level.gems.map((gem) => ({ ...gem }));
  strategyEnemies = level.enemies.map((enemy) => ({
    ...enemy,
    step: 0,
    rx: enemy.x,
    ry: enemy.y,
    facing: enemy.facing || 1,
  }));
  strategyCollected = 0;
  strategyTotalGems = strategyGems.length;
  strategyMoveCooldown = 0;
  strategyTurnCount = 0;
  strategyHotPool = [];
  strategyHotActive = new Set();
  strategyMovingDoorActive = new Set();
  strategyHazardWarnings = { hotKey: "", boss: false, collision: false };
  strategyDoorOverrideTurns = 0;
  strategyPowerupCharges = 0;
  strategyPowerup = null;
  initStrategyBiomeMechanics(level);
  applyStrategyBiomeTurnEffects(level);
  placeStrategyPowerup(level);
  updateHudForStrategy();
  updateNotes();
  speakBiomeInstruction(level);
}

function initStrategyBiomeMechanics(level) {
  if (!level) return;
  if (level.biomeName === "Volcan") {
    const blocked = new Set([
      ...strategyWalls,
      ...strategyDoors,
      gridKey(level.start.x, level.start.y),
      gridKey(level.portal.x, level.portal.y),
      gridKey(level.key.x, level.key.y),
    ]);
    const candidates = [];
    for (let y = 0; y < STRATEGY_ROWS; y += 1) {
      for (let x = 0; x < STRATEGY_COLS; x += 1) {
        const key = gridKey(x, y);
        if (blocked.has(key)) continue;
        candidates.push({ x, y });
      }
    }
    const rng = createSeededRng(7001 + strategyWorldIndex * 97);
    const shuffled = shuffleArray(candidates, rng);
    const target = Math.min(14, level.volcanoHotCount || 6);
    strategyHotPool = shuffled.slice(0, target);
  }
}

function placeStrategyPowerup(level) {
  if (!level) return;
  const wallsSet = new Set(level.walls.map((cell) => gridKey(cell.x, cell.y)));
  const doorsSet = new Set(level.doors.map((cell) => gridKey(cell.x, cell.y)));
  const reachable = computeReachable(level.start, wallsSet, doorsSet, false);
  const enemySet = new Set(strategyEnemies.map((enemy) => gridKey(enemy.x, enemy.y)));
  const gemSet = new Set(strategyGems.map((gem) => gridKey(gem.x, gem.y)));
  const forbidden = new Set([
    gridKey(level.start.x, level.start.y),
    gridKey(level.portal.x, level.portal.y),
    gridKey(level.key.x, level.key.y),
    ...enemySet,
    ...gemSet,
  ]);

  const candidates = [];
  reachable.forEach((cellKey) => {
    if (forbidden.has(cellKey)) return;
    const [x, y] = cellKey.split(",").map(Number);
    candidates.push({ x, y });
  });

  if (!candidates.length) {
    strategyPowerup = null;
    return;
  }
  const rng = createSeededRng(9901 + strategyWorldIndex * 131);
  const picked = shuffleArray(candidates, rng)[0];
  strategyPowerup = { x: picked.x, y: picked.y, active: true };
}

function activateStrategyPowerup() {
  if (strategyPowerupCharges <= 0) {
    showToast("Sin carga. Busca el orbe oculto.");
    return;
  }
  if (!strategyEnemies.length) {
    showToast("No hay guardias para usar el power-up.");
    return;
  }

  const level = strategyLevels[strategyWorldIndex];
  const ranked = [...strategyEnemies]
    .map((enemy) => {
      const nearPortal = Math.abs(enemy.x - strategyPortal.x) + Math.abs(enemy.y - strategyPortal.y);
      const nearPlayer = Math.abs(enemy.x - strategyPlayer.x) + Math.abs(enemy.y - strategyPlayer.y);
      const score = nearPortal * 2 + nearPlayer + (enemy.isMiniBoss ? -2 : 0);
      return { enemy, score };
    })
    .sort((a, b) => a.score - b.score);
  const target = ranked[0].enemy;

  const occupied = new Set(strategyEnemies.filter((e) => e !== target).map((e) => gridKey(e.x, e.y)));
  const candidates = [];
  for (let y = 0; y < STRATEGY_ROWS; y += 1) {
    for (let x = 0; x < STRATEGY_COLS; x += 1) {
      const key = gridKey(x, y);
      if (isStrategyBlocked(x, y)) continue;
      if (occupied.has(key)) continue;
      if (Math.abs(x - strategyPortal.x) + Math.abs(y - strategyPortal.y) < 4) continue;
      if (Math.abs(x - strategyPlayer.x) + Math.abs(y - strategyPlayer.y) < 3) continue;
      candidates.push({ x, y });
    }
  }
  if (!candidates.length) {
    showToast("No hay espacio para desplazar al guardia.");
    return;
  }

  const rng = createSeededRng(13001 + strategyWorldIndex * 173 + strategyTurnCount * 19);
  const destination = shuffleArray(candidates, rng)[0];
  target.x = destination.x;
  target.y = destination.y;
  target.rx = destination.x;
  target.ry = destination.y;
  target.stunnedTurns = target.isMiniBoss ? 1 : 2;
  strategyDoorOverrideTurns = Math.max(strategyDoorOverrideTurns, 1);
  strategyPowerupCharges -= 1;
  strategyMoveCooldown = 90;
  playSound("hit");
  showToast(`Bomba de humo usada: ${target.isMiniBoss ? "mini-jefe" : "guardia"} desplazado.`);
  updateHudForStrategy();
  updateNotes();

  if (level && level.biomeName === "Volcan") {
    strategyHotActive.clear();
  }
}

function applyStrategyBiomeTurnEffects(level) {
  if (!level) return;
  strategyHotActive.clear();
  strategyMovingDoorActive.clear();
  if (strategyDoorOverrideTurns > 0) {
    strategyDoorOverrideTurns -= 1;
  }

  if (level.biomeName === "Volcan") {
    const cycle = Math.max(2, level.volcanoCycle || 3);
    strategyHotPool.forEach((cell, idx) => {
      if ((idx + strategyTurnCount) % cycle === 0) {
        strategyHotActive.add(gridKey(cell.x, cell.y));
      }
    });
  }

  if (level.biomeName === "Castillo") {
    const cycle = Math.max(2, level.castleDoorCycle || 2);
    const doors = [...strategyDoors];
    doors.forEach((key, idx) => {
      if ((idx + strategyTurnCount) % cycle === 0) {
        strategyMovingDoorActive.add(key);
      }
    });
  }
}

function isStrategyBlocked(x, y) {
  if (x < 0 || y < 0 || x >= STRATEGY_COLS || y >= STRATEGY_ROWS) return true;
  const key = gridKey(x, y);
  if (strategyWalls.has(key)) return true;
  if (strategyDoors.has(key) && !strategyHasKey) return true;
  const level = strategyLevels[strategyWorldIndex];
  if (
    level &&
    level.biomeName === "Castillo" &&
    strategyDoorOverrideTurns <= 0 &&
    strategyMovingDoorActive.has(key)
  ) {
    return true;
  }
  return false;
}

function strategyPlayerHitEnemy() {
  return strategyEnemies.some((enemy) => enemy.x === strategyPlayer.x && enemy.y === strategyPlayer.y);
}

function strategyPlayerOnHotTile() {
  const level = strategyLevels[strategyWorldIndex];
  if (!level || level.biomeName !== "Volcan") return false;
  return strategyHotActive.has(gridKey(strategyPlayer.x, strategyPlayer.y));
}

function strategyPlayerInBossZone() {
  return strategyEnemies.some((enemy) => {
    if (!enemy.isMiniBoss) return false;
    const dist = Math.abs(enemy.x - strategyPlayer.x) + Math.abs(enemy.y - strategyPlayer.y);
    return dist <= 1;
  });
}

function resolveStrategyHazardsAfterTurn() {
  if (strategyPlayerHitEnemy()) {
    if (strategyHazardWarnings.collision) {
      playSound("hit");
      strategyHazardWarnings.collision = false;
      loseStrategyLife();
      return true;
    }
    strategyHazardWarnings.collision = true;
    showToast("Alerta: un guardia te alcanzó. Muévete en el siguiente turno.", 2800);
    return false;
  }
  strategyHazardWarnings.collision = false;

  if (strategyPlayerOnHotTile()) {
    const currentKey = gridKey(strategyPlayer.x, strategyPlayer.y);
    if (strategyHazardWarnings.hotKey === currentKey) {
      playSound("hit");
      showToast("Piso caliente. Perdiste una vida.", 2400);
      strategyHazardWarnings.hotKey = "";
      loseStrategyLife();
      return true;
    }
    strategyHazardWarnings.hotKey = currentKey;
    showToast("Cuidado: piso caliente. Sal de esa casilla en el siguiente turno.", 2800);
  } else {
    strategyHazardWarnings.hotKey = "";
  }

  if (strategyPlayerInBossZone()) {
    if (strategyHazardWarnings.boss) {
      playSound("hit");
      showToast("Mini-jefe muy cerca. Perdiste una vida.", 2400);
      strategyHazardWarnings.boss = false;
      loseStrategyLife();
      return true;
    }
    strategyHazardWarnings.boss = true;
    showToast("Alerta: mini-jefe cerca. Aléjate en el siguiente turno.", 2800);
  } else {
    strategyHazardWarnings.boss = false;
  }

  return false;
}

function advanceStrategyEnemies() {
  const level = strategyLevels[strategyWorldIndex];
  const loops = level ? Math.max(1, level.enemyMovesPerTurn || 1) : 1;
  const canMoveEnemyTo = (enemy, x, y, occupied) => {
    if (isStrategyBlocked(x, y)) return false;
    const key = gridKey(x, y);
    const current = gridKey(enemy.x, enemy.y);
    return key === current || !occupied.has(key);
  };

  for (let turn = 0; turn < loops; turn += 1) {
    const occupied = new Set(strategyEnemies.map((enemy) => gridKey(enemy.x, enemy.y)));
    const rng = createSeededRng(22001 + strategyWorldIndex * 173 + strategyTurnCount * 41 + turn * 7);

    strategyEnemies.forEach((enemy) => {
      occupied.delete(gridKey(enemy.x, enemy.y));

      if (enemy.stunnedTurns && enemy.stunnedTurns > 0) {
        enemy.stunnedTurns -= 1;
        occupied.add(gridKey(enemy.x, enemy.y));
        return;
      }

      if (enemy.isMiniBoss) {
        const speed = enemy.bossSpeed || 2;
        let movedAtLeastOnce = false;
        for (let hop = 0; hop < speed; hop += 1) {
          const dx = strategyPlayer.x - enemy.x;
          const dy = strategyPlayer.y - enemy.y;
          const options = Math.abs(dx) >= Math.abs(dy)
            ? [
                { x: enemy.x + Math.sign(dx), y: enemy.y, face: Math.sign(dx) || enemy.facing },
                { x: enemy.x, y: enemy.y + Math.sign(dy), face: enemy.facing },
              ]
            : [
                { x: enemy.x, y: enemy.y + Math.sign(dy), face: enemy.facing },
                { x: enemy.x + Math.sign(dx), y: enemy.y, face: Math.sign(dx) || enemy.facing },
              ];
          let moved = false;
          for (const option of options) {
            if (option.x === enemy.x && option.y === enemy.y) continue;
            if (!canMoveEnemyTo(enemy, option.x, option.y, occupied)) continue;
            enemy.x = option.x;
            enemy.y = option.y;
            if (option.face) enemy.facing = option.face;
            movedAtLeastOnce = true;
            moved = true;
            break;
          }
          if (!moved) break;
        }
        if (!movedAtLeastOnce) {
          const fallbackDirs = shuffleArray(
            [
              { dx: 1, dy: 0 },
              { dx: -1, dy: 0 },
              { dx: 0, dy: 1 },
              { dx: 0, dy: -1 },
            ],
            rng
          );
          for (const dir of fallbackDirs) {
            const nx = enemy.x + dir.dx;
            const ny = enemy.y + dir.dy;
            if (!canMoveEnemyTo(enemy, nx, ny, occupied)) continue;
            enemy.x = nx;
            enemy.y = ny;
            if (dir.dx !== 0) enemy.facing = dir.dx;
            break;
          }
        }
        occupied.add(gridKey(enemy.x, enemy.y));
        return;
      }

      const dir = enemy.pattern[enemy.step % enemy.pattern.length];
      enemy.step = (enemy.step + 1) % enemy.pattern.length;
      let dx = 0;
      let dy = 0;
      if (dir === "L") dx = -1;
      if (dir === "R") dx = 1;
      if (dir === "U") dy = -1;
      if (dir === "D") dy = 1;
      const nextX = enemy.x + dx;
      const nextY = enemy.y + dy;
      if (canMoveEnemyTo(enemy, nextX, nextY, occupied)) {
        enemy.x = nextX;
        enemy.y = nextY;
        if (dx !== 0) enemy.facing = dx;
        enemy.blockedTurns = 0;
        occupied.add(gridKey(enemy.x, enemy.y));
        return;
      }

      enemy.blockedTurns = (enemy.blockedTurns || 0) + 1;
      if (enemy.blockedTurns >= 2) {
        const fallback = shuffleArray(
          [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
          ],
          rng
        );
        for (const option of fallback) {
          const fx = enemy.x + option.dx;
          const fy = enemy.y + option.dy;
          if (!canMoveEnemyTo(enemy, fx, fy, occupied)) continue;
          enemy.x = fx;
          enemy.y = fy;
          if (option.dx !== 0) enemy.facing = option.dx;
          enemy.blockedTurns = 0;
          break;
        }
      }
      occupied.add(gridKey(enemy.x, enemy.y));
    });
  }
}

function loseStrategyLife() {
  strategyLives -= 1;
  updateHudForStrategy();
  if (strategyLives <= 0) {
    resumeStrategyWorld = strategyWorldIndex;
    gameState = "start";
    startScreen.classList.add("show");
    showToast(`Perdiste en estrategia. Reintentas en mundo ${strategyWorldIndex + 1}.`);
    return;
  }
  setupStrategyLevel(strategyWorldIndex);
}

function completeStrategyWorld() {
  const reachedEnd = strategyWorldIndex >= strategyLevels.length - 1;
  if (reachedEnd && sessionElapsedMs < SESSION_TARGET_MS) {
    ensureStrategyLevel(strategyWorldIndex + 1);
  }

  if (strategyWorldIndex < strategyLevels.length - 1) {
    strategyWorldIndex += 1;
    setupStrategyLevel(strategyWorldIndex);
    const nextLevel = strategyLevels[strategyWorldIndex];
    const bossTag = nextLevel.hasMiniBoss ? " | Mini-jefe activo" : "";
    showToast(`Pasaste a ${nextLevel.name} (${nextLevel.tier})${bossTag}`);
    return;
  }

  gameState = "win";
  if (sessionElapsedMs >= SESSION_TARGET_MS) {
    winText.textContent = `Maratón completada: ${formatClock(sessionElapsedMs)} de juego continuo.`;
  } else {
    winText.textContent = `Completaste los ${strategyLevels.length} mundos de estrategia.`;
  }
  winScreen.classList.add("show");
}

function tryStrategyMove(dx, dy) {
  if (strategyMoveCooldown > 0) return;
  const level = strategyLevels[strategyWorldIndex];
  const nextX = strategyPlayer.x + dx;
  const nextY = strategyPlayer.y + dy;
  if (isStrategyBlocked(nextX, nextY)) {
    playSound("hit");
    strategyMoveCooldown = 70;
    return;
  }

  strategyPlayer.x = nextX;
  strategyPlayer.y = nextY;
  if (dx !== 0) strategyPlayerFacing = dx;
  strategyMoveCooldown = level ? level.moveCooldown : 110;
  playSound("click");

  if (level.key && !strategyHasKey && nextX === level.key.x && nextY === level.key.y) {
    strategyHasKey = true;
    showToast("Tomaste la llave. Ya puedes abrir puertas.");
  }

  if (strategyPowerup && strategyPowerup.active && nextX === strategyPowerup.x && nextY === strategyPowerup.y) {
    strategyPowerup.active = false;
    strategyPowerupCharges += 1;
    playSound("success");
    showToast("Orbe oculto obtenido. Pulsa X para bomba de humo.");
    updateHudForStrategy();
    updateNotes();
  }

  const gemIndex = strategyGems.findIndex((gem) => gem.x === nextX && gem.y === nextY);
  if (gemIndex >= 0) {
    strategyGems.splice(gemIndex, 1);
    strategyCollected += 1;
    updateHudForStrategy();
    updateNotes();
    playSound("coin");
  }

  strategyTurnCount += 1;
  applyStrategyBiomeTurnEffects(level);

  advanceStrategyEnemies();
  if (resolveStrategyHazardsAfterTurn()) {
    return;
  }

  if (
    strategyCollected >= strategyTotalGems &&
    strategyPlayer.x === strategyPortal.x &&
    strategyPlayer.y === strategyPortal.y
  ) {
    completeStrategyWorld();
    return;
  }
  updateNotes();
}

function startStrategyGame() {
  activeGame = "strategy";
  gameState = "playing";
  strategyLives = 3;
  speedBoostTimer = 0;
  shieldCharges = 0;
  const worldToStart = resumeStrategyWorld != null ? resumeStrategyWorld : 0;
  strategyWorldIndex = Math.max(0, worldToStart);
  resumeStrategyWorld = null;
  resetSessionClock();
  startScreen.classList.remove("show");
  winScreen.classList.remove("show");
  challengeModal.classList.remove("show");
  winText.textContent = "Maratón completada: 60:00 de juego continuo.";
  updateNotes();
  setupStrategyLevel(strategyWorldIndex);
  startBackgroundMusic();
}

function improvePlatformFlow(level, index) {
  if (level.flowTuned) return;
  level.flowTuned = true;

  const baseWidth = level.width || 1800;
  const extra = 800 + index * 70;
  level.width = Math.max(baseWidth + extra, baseWidth + 500);
  if (level.goal) {
    level.goal.x = Math.min(level.width - 120, (level.goal.x || baseWidth - 120) + Math.round(extra * 0.58));
  }

  // Extiende suelo para que la ruta final siempre sea jugable.
  let extensionX = baseWidth - 220;
  while (extensionX < level.width - 260) {
    level.platforms.push({ x: extensionX, y: 480, w: 220, h: 60 });
    extensionX += 210;
  }

  const elevated = (level.platforms || [])
    .filter((p) => p && p.h <= 24)
    .sort((a, b) => a.x - b.x);

  const elevatedTarget = Math.min(34, Math.max(14, Math.floor(level.width / 260)));
  if (elevated.length < elevatedTarget) {
    const missing = elevatedTarget - elevated.length;
    const stepX = Math.max(150, Math.floor(level.width / (missing + 3)));
    for (let p = 0; p < missing; p += 1) {
      const px = clamp(140 + p * stepX + (p % 2) * 40, 80, level.width - 260);
      const py = clamp(370 - (p % 5) * 42, 180, 420);
      level.platforms.push({ x: px, y: py, w: 170 + (p % 3) * 24, h: 20 });
    }
  }

  const refreshedElevated = (level.platforms || [])
    .filter((p) => p && p.h <= 24)
    .sort((a, b) => a.x - b.x);

  refreshedElevated.forEach((p) => {
    p.w = Math.max(p.w || 0, 170);
  });

  for (let i = 0; i < refreshedElevated.length - 1; i += 1) {
    const left = refreshedElevated[i];
    const right = refreshedElevated[i + 1];
    const gap = right.x - (left.x + left.w);
    if (gap > 220) {
      const bridgeCount = Math.min(3, Math.max(1, Math.floor(gap / 230)));
      for (let b = 0; b < bridgeCount; b += 1) {
        const ratio = (b + 1) / (bridgeCount + 1);
        const bridgeX = left.x + left.w + Math.round(gap * ratio) - 90;
        const bridgeY = Math.round(left.y + (right.y - left.y) * ratio);
        level.platforms.push({
          x: clamp(bridgeX, 80, level.width - 240),
          y: clamp(bridgeY, 180, 420),
          w: 180,
          h: 20,
        });
      }
    }
  }

  level.platforms.push({
    x: Math.max(0, level.width - 560),
    y: 420,
    w: 300,
    h: 24,
  });
}

function scheduleNextRandomEnemySpawn(levelIndex) {
  const base = Math.max(750, 2400 - levelIndex * 95);
  const jitter = Math.floor(Math.random() * 1100);
  nextRandomEnemySpawnMs = base + jitter;
}

function respawnEnemyNearPlayer(enemy, level) {
  const spawnFrom = cameraX + canvas.width + 120 + Math.floor(Math.random() * 280);
  const spawnX = Math.max(60, Math.min(level.width - 120, spawnFrom));
  enemy.x = spawnX;
  enemy.y = enemy.baseY != null ? enemy.baseY : Math.min(420, enemy.y || 420);
  enemy.vx = (Math.random() > 0.5 ? 1 : -1) * (enemy.baseSpeed || 1.5);
  enemy.minX = spawnX - 120;
  enemy.maxX = spawnX + 220;
  enemy.alive = true;
  enemy.active = true;
  enemy.spawnTimer = 0;
  enemy.shotCooldown = Math.max(400, (enemy.shotRate || ENEMY_SHOT_BASE_COOLDOWN) * 0.65);
  enemy.respawnTimer = 2200 + Math.floor(Math.random() * 3800);
}

function updateRandomEnemySpawns(level, delta) {
  if (!level || gameState !== "playing") return;
  randomEnemySpawnTimer += delta;
  if (randomEnemySpawnTimer < nextRandomEnemySpawnMs) return;
  randomEnemySpawnTimer = 0;
  scheduleNextRandomEnemySpawn(currentLevelIndex);

  const aliveCount = level.enemies.filter((enemy) => enemy.alive && (enemy.active || !enemy.spawnDelay)).length;
  const aliveCap = 7 + Math.min(11, Math.floor(currentLevelIndex * 0.7));
  if (aliveCount >= aliveCap) return;

  const respawnable = level.enemies.filter((enemy) => !enemy.alive && enemy.respawnable);
  if (!respawnable.length) return;
  const selected = respawnable[Math.floor(Math.random() * respawnable.length)];
  respawnEnemyNearPlayer(selected, level);
  showToast("¡Enemigo nuevo en escena!");
}

function prepareLevels(list, baseIndex = 0) {
  list.forEach((level, offset) => {
    const index = baseIndex + offset;
    level.displayLevelNumber = getPlatformLevelNumber(level, index);
    level.platforms = level.platforms || [];
    level.coins = level.coins || [];
    level.enemies = level.enemies || [];
    improvePlatformFlow(level, index);
    level.scene = platformScenes[index % platformScenes.length];
    level.lessonTopic = getJourneyTopic(index);
    level.challenge = level.challenge || {};
    if (level.challenge.basic || level.challenge.intermediate) {
      level.challenge.basic = level.challenge.basic || level.challenge.intermediate;
      level.challenge.intermediate = level.challenge.intermediate || level.challenge.basic;
    } else {
      level.challenge = {
        basic: level.challenge,
        intermediate: level.challenge,
      };
    }
    if (!PLATFORM_LIGHT_MODE) {
      scaleLevelDifficulty(level, index);
      addExtraCoins(level);
      fixCoinPlacement(level);
      boostIntroLevel(level);
    }
    if (typeof level.coinGoal !== "number" || Number.isNaN(level.coinGoal)) {
      const coinCount = level.coins.length;
      if (coinCount <= 1) {
        level.coinGoal = coinCount;
      } else {
        level.coinGoal = Math.max(1, Math.min(coinCount - 1, Math.ceil(coinCount * 0.8)));
      }
    } else {
      level.coinGoal = Math.max(0, Math.min(level.coins.length, Math.floor(level.coinGoal)));
    }
    level.enemies.forEach((enemy) => {
      enemy.baseY = enemy.y;
      enemy.baseSpeed = Math.max(1.35, Math.abs(enemy.vx) || 1.35);
      enemy.canShoot = index >= 3;
      enemy.shotRate = Math.max(520, ENEMY_SHOT_BASE_COOLDOWN - index * 85);
      enemy.shotCooldown = 0;
      enemy.aggroRange = Math.max(enemy.aggroRange || 0, 320 + index * 20);
      enemy.chaseSpeed = Math.max(enemy.chaseSpeed || 0, 2.2 + index * 0.08);
      enemy.respawnable = true;
      enemy.lockToPlatform = enemy.minX != null && enemy.maxX != null && enemy.y < 440;
    });
    level.initialCoins = level.coins.map((coin) => ({ ...coin }));
    level.initialEnemies = level.enemies.map((enemy) => ({ ...enemy }));
  });
}

function scaleLevelDifficulty(level, index) {
  if (level.scaled) return;
  level.scaled = true;

  const lengthMultiplier = 1.6;
  const originalWidth = level.width || 1800;
  level.width = Math.max(originalWidth * lengthMultiplier, originalWidth + 1400);
  level.goal.x = Math.min(level.width - 120, level.goal.x + Math.round(originalWidth * 0.6));

  const extraPlatformCount = 8 + Math.min(8, Math.floor(index / 2));
  const baseX = originalWidth * 0.75;
  for (let i = 0; i < extraPlatformCount; i += 1) {
    const px = baseX + i * 200;
    const py = 380 - (i % 4) * 60;
    const pw = 160 + (i % 3) * 40;
    level.platforms.push({ x: px, y: py, w: pw, h: 20 });
  }

  const towerCount = 3 + Math.min(3, Math.floor(index / 3));
  for (let t = 0; t < towerCount; t += 1) {
    const towerX = originalWidth + 180 + t * 300;
    for (let step = 0; step < 4; step += 1) {
      level.platforms.push({
        x: towerX + (step % 2) * 70,
        y: 420 - step * 70,
        w: 120,
        h: 18,
      });
    }
  }

  const platformEnemies = 2 + Math.min(4, Math.floor(index / 2));
  const elevatedPlatforms = level.platforms.filter((p) => p.h <= 20 && p.y <= 360);
  for (let e = 0; e < platformEnemies && e < elevatedPlatforms.length; e += 1) {
    const p = elevatedPlatforms[(e * 3 + index) % elevatedPlatforms.length];
    const enemyWidth = 48;
    const enemyHeight = 48;
    const minX = p.x;
    const maxX = p.x + p.w - enemyWidth;
    level.enemies.push({
      x: minX + 10,
      y: p.y - enemyHeight,
      w: enemyWidth,
      h: enemyHeight,
      minX,
      maxX,
      vx: 1.2 + index * 0.03,
      aggroRange: 260 + index * 8,
      chaseSpeed: Math.min(3.6, 1.7 + index * 0.05),
      spawnDelay: 500 + e * 350,
    });
  }

  const groundEnemies = 1 + Math.min(3, Math.floor(index / 3));
  for (let g = 0; g < groundEnemies; g += 1) {
    const gx = originalWidth + 160 + g * 260;
    level.enemies.push({
      x: gx,
      y: 420,
      w: 48,
      h: 48,
      minX: gx - 40,
      maxX: gx + 200,
      vx: 1.3 + index * 0.03,
      aggroRange: 260 + index * 8,
      chaseSpeed: Math.min(3.4, 1.6 + index * 0.05),
      spawnDelay: 600 + g * 300,
    });
  }
}

function boostIntroLevel(level) {
  if (!level.intro || level.boosted) return;
  level.boosted = true;

  const extraWidth = 1200;
  level.width = Math.max(level.width + extraWidth, level.goal.x + 400);
  level.goal.x = level.width - 120;

  const baseY = 480;
  const segmentCount = 4;
  const segmentWidth = 240;
  const gap = 90;
  let startX = level.width - (segmentCount * (segmentWidth + gap));
  for (let i = 0; i < segmentCount; i += 1) {
    level.platforms.push({
      x: startX,
      y: baseY,
      w: segmentWidth,
      h: 60,
    });
    startX += segmentWidth + gap;
  }

  const stairStartX = level.width - 900;
  for (let s = 0; s < 6; s += 1) {
    level.platforms.push({
      x: stairStartX + s * 140,
      y: 380 - s * 35,
      w: 130,
      h: 20,
    });
  }

  for (let p = 0; p < 4; p += 1) {
    level.platforms.push({
      x: level.width - 600 + p * 140,
      y: 260 - (p % 2) * 40,
      w: 120,
      h: 18,
    });
  }

  level.coins.push(
    { x: level.width - 780, y: 300 },
    { x: level.width - 640, y: 260 },
    { x: level.width - 500, y: 220 },
    { x: level.width - 360, y: 180 }
  );

  level.enemies.push(
    {
      x: level.width - 980,
      y: 420,
      w: 48,
      h: 48,
      minX: level.width - 1020,
      maxX: level.width - 860,
      vx: 1.4,
      aggroRange: 260,
      chaseSpeed: 2.0,
      spawnDelay: 800,
    },
    {
      x: level.width - 520,
      y: 220,
      w: 48,
      h: 48,
      minX: level.width - 600,
      maxX: level.width - 420,
      vx: 1.2,
      aggroRange: 220,
      chaseSpeed: 1.8,
      spawnDelay: 1200,
    }
  );
}

function addExtraCoins(level) {
  if (level.autoCoins === false) return;
  const existing = level.coins || [];
  const isNear = (x, y) =>
    existing.some((coin) => Math.hypot(coin.x - x, coin.y - y) < 60);
  let added = 0;
  const targets = level.platforms.filter((p) => p.y < 460);
  for (let i = 0; i < targets.length; i += 1) {
    if (added >= 6) break;
    const p = targets[i];
    const x = p.x + p.w / 2 - 10;
    const y = p.y - 60;
    if (x > 40 && x < level.width - 60 && !isNear(x, y)) {
      existing.push({ x, y });
      added += 1;
    }
  }
  if (added < 4 && targets.length) {
    for (let i = 0; i < targets.length; i += 1) {
      const p = targets[i];
      const x = p.x + 20;
      const y = p.y - 60;
      if (x > 40 && x < level.width - 60 && !isNear(x, y)) {
        existing.push({ x, y });
        added += 1;
      }
      if (added >= 8) break;
    }
  }
  level.coins = existing;
}

function fixCoinPlacement(level) {
  const coins = level.coins || [];
  const platforms = level.platforms || [];
  const coinSize = 32;
  coins.forEach((coin) => {
    let tries = 0;
    let box = { x: coin.x, y: coin.y, w: coinSize, h: coinSize };
    while (
      tries < 8 &&
      platforms.some((p) => rectsIntersect(box, { x: p.x, y: p.y, w: p.w, h: p.h }))
    ) {
      coin.y -= 8;
      box = { x: coin.x, y: coin.y, w: coinSize, h: coinSize };
      tries += 1;
    }
    if (coin.y < 20) coin.y = 20;
  });
}

function setRuntimeLevels(newLevels) {
  levels = cloneData(newLevels);
  if (activeGame === "platform" && platformSessionSeed) {
    applyPlatformSessionVariation(levels);
  }
  prepareLevels(levels);
  if (selectedStartLevel >= levels.length) selectedStartLevel = 0;
}

function persistPlatformProgress() {
  if (!levels.length) return;
  try {
    const safeIndex = clamp(currentLevelIndex, 0, Math.max(0, levels.length - 1));
    selectedStartLevel = safeIndex;
    platformLevels = cloneData(levels);
    localStorage.setItem("plataformas_levels", JSON.stringify(levels));
    localStorage.setItem("plataformas_levels_version", String(LEVELS_VERSION));
    localStorage.setItem("plataformas_start_level", String(selectedStartLevel));
  } catch {
    levelsStorageValid = false;
  }
}

function setLevels(newLevels, { save } = { save: false }) {
  setRuntimeLevels(newLevels);
  platformLevels = cloneData(levels);
  if (save) {
    localStorage.setItem("plataformas_levels", JSON.stringify(levels));
    localStorage.setItem("plataformas_levels_version", String(LEVELS_VERSION));
  }
  if (selectedStartLevel >= levels.length) {
    selectedStartLevel = 0;
  }
  currentLevelIndex = 0;
  lives = 3;
  startScreen.classList.add("show");
  winScreen.classList.remove("show");
  gameState = "start";
  resetLevel();
  renderLevelSelect();
}

function loadLevelsFromStorage() {
  try {
    const version = Number(localStorage.getItem("plataformas_levels_version") || "0");
    if (version !== LEVELS_VERSION) {
      levelsStorageValid = false;
      localStorage.removeItem("plataformas_levels");
      localStorage.removeItem("plataformas_levels_version");
      return null;
    }
    const raw = localStorage.getItem("plataformas_levels");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    levelsStorageValid = false;
    return null;
  }
}

function normalizeMode(value) {
  return value === "intermediate" ? "intermediate" : "basic";
}

function mergeStoredLevels(stored, defaults) {
  if (!Array.isArray(stored)) return { levels: null, changed: false };
  const storedNames = new Set(
    stored
      .map((level) => (level && typeof level.name === "string" ? level.name : ""))
      .filter(Boolean)
  );
  const missingDefaults = defaults.filter((level) => !storedNames.has(level.name));
  if (missingDefaults.length === 0) {
    return { levels: stored, changed: false };
  }
  return { levels: [...stored, ...missingDefaults], changed: true };
}

function loadImage(name, src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      assets.images[name] = img;
      resolve(img);
    };
    img.onerror = reject;
  });
}

function loadAudio(name, src, volume = 0.6) {
  const audio = new Audio(src);
  audio.volume = volume;
  assets.sounds[name] = audio;
}

function initAudio() {
  loadAudio("bg", "audio/Bg Music.mp3", 0.3);
  loadAudio("coin", "audio/UI Pop.mp3", 0.7);
  loadAudio("success", "audio/UI Pop.mp3", 0.9);
  loadAudio("hit", "audio/EnemyHit.wav", 0.7);
  loadAudio("jump", "audio/Punch.mp3", 0.5);
  loadAudio("shot", "audio/ShotgunFire.wav", 0.6);
  loadAudio("click", "audio/UI Pop.mp3", 0.4);
}

function playSound(name) {
  const sound = assets.sounds[name];
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
}

function loadAssets() {
  const images = [
    ["bg", "sprites/BG.png"],
    ["map", "sprites/Map.png"],
    ["shadow", "sprites/shadow.png"],
    ["player1", "sprites/Players/Player_1.png"],
    ["player2", "sprites/Players/Player_2.png"],
    ["player4", "sprites/Players/Player_4.png"],
    ["player5", "sprites/Players/Player_5.png"],
    ["enemy", "sprites/Enemies/Enemy_1.png"],
    ["goal", "sprites/Spawn_mark.png"],
    ["llave", "sprites/LLAVE.png"],
    ["orbe", "sprites/ORBE.png"],
    ["crystal_a", "sprites/crystal-a.png"],
    ["crystal_b", "sprites/crystal-b.png"],
    ["coin1", "sprites/Gold/gold_1.png"],
    ["coin2", "sprites/Gold/gold_2.png"],
    ["coin3", "sprites/Gold/gold_3.png"],
    ["coin4", "sprites/Gold/gold_4.png"],
    ["weapon_punch_icon", "sprites/Weapons/Icons/weapon_punch_icon.png"],
    ["weapon_sword_icon", "sprites/Weapons/Icons/weapon_sword_icon.png"],
    ["weapon_pistol_icon", "sprites/Weapons/Icons/weapon_pistol_icon.png"],
    ["projectile1", "sprites/Projectiles/Projectile_1.png"],
  ];
  return Promise.all(
    images.map(([name, src]) =>
      loadImage(name, src).catch(() => {
        console.warn(`No se pudo cargar imagen: ${src}`);
        return null;
      })
    )
  );
}

function resetLevel() {
  const level = levels[currentLevelIndex];
  currentChallengeSnapshot = null;
  randomEnemySpawnTimer = 0;
  scheduleNextRandomEnemySpawn(currentLevelIndex);
  level.coins = level.initialCoins.map((coin) => ({ ...coin }));
  level.enemies = level.initialEnemies.map((enemy) => ({
    ...enemy,
    alive: true,
    active: false,
    spawnDelay: Math.max(0, Math.floor((enemy.spawnDelay || 0) * 0.5) + Math.floor(Math.random() * 1600)),
    spawnTimer: 0,
    shotCooldown: 0,
    respawnable: enemy.respawnable !== false,
    respawnTimer: 1800 + Math.floor(Math.random() * 2600),
  }));
  if (level.enemies[0]) {
    level.enemies[0].active = true;
    level.enemies[0].spawnDelay = 0;
  }
  projectiles.length = 0;
  enemyProjectiles.length = 0;
  player.x = level.spawn.x;
  player.y = level.spawn.y;
  if (pendingShortcut > 0) {
    player.x = Math.min(level.goal.x - 180, player.x + pendingShortcut);
    pendingShortcut = 0;
  }
  player.vx = 0;
  player.vy = 0;
  resetKeys();
  collectedCoins = 0;
  totalCoins = Math.min(level.coins.length, level.coinGoal || 0);
  if (pendingCoinBonus > 0 && totalCoins > 0) {
    collectedCoins = Math.min(totalCoins, pendingCoinBonus);
    pendingCoinBonus = Math.max(0, pendingCoinBonus - collectedCoins);
  }
  hud.coinText.textContent = collectedCoins;
  hud.coinTotal.textContent = totalCoins;
  hud.levelText.textContent = getPlatformLevelNumber(level, currentLevelIndex);
  hud.livesText.textContent = lives;
  heldItemTimer = 0;
  whipCooldown = 0;
  whipVisualTimer = 0;
  whipTarget = null;
}

function showToast(message, duration = 1800) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function updateWeaponHud() {
  const icon = assets.images[currentWeapon.icon];
  if (icon) hud.weaponIcon.src = icon.src;
  hud.weaponText.textContent = currentWeapon.name;
}

function setWeapon(id) {
  if (!weapons[id] || !unlockedWeapons.has(id)) return;
  currentWeapon = weapons[id];
  updateWeaponHud();
  localStorage.setItem("plataformas_current_weapon", id);
}

function unlockWeapon(id) {
  if (!weapons[id] || unlockedWeapons.has(id)) return;
  unlockedWeapons.add(id);
  localStorage.setItem("plataformas_weapons", JSON.stringify([...unlockedWeapons]));
  setWeapon(id);
  showToast(`Nueva herramienta: ${weapons[id].name}`);
}

function cycleWeapon() {
  const order = ["punch", "sword", "pistol"].filter((id) => unlockedWeapons.has(id));
  if (order.length <= 1) return;
  const currentIndex = order.indexOf(currentWeapon.id);
  const next = order[(currentIndex + 1) % order.length];
  setWeapon(next);
}

function startGame() {
  activeGame = "platform";
  resetPlatformSessionSeed();
  if (platformLevels.length) {
    setRuntimeLevels(platformLevels);
  }
  gameState = "playing";
  resetSessionClock();
  startScreen.classList.remove("show");
  winScreen.classList.remove("show");
  challengeModal.classList.remove("show");
  resetKeys();
  lives = 3;
  speedBoostTimer = 0;
  shieldCharges = 0;
  pendingShortcut = 0;
  pendingCoinBonus = 0;
  currentLevelIndex = selectedStartLevel;
  resetLevel();
  updateNotes();
  updateHudForPlatform();
  winText.textContent = "Terminaste todos los niveles y resolviste los retos.";
  startBackgroundMusic();
}

function startAdventureGame() {
  activeGame = "adventure";
  const adventurePack = adventureGeneratedLevels && adventureGeneratedLevels.length
    ? adventureGeneratedLevels
    : createAdventureFallbackLevels();
  setRuntimeLevels(adventurePack);
  gameState = "playing";
  resetSessionClock();
  startScreen.classList.remove("show");
  winScreen.classList.remove("show");
  challengeModal.classList.remove("show");
  resetKeys();
  lives = 3;
  speedBoostTimer = 0;
  shieldCharges = 0;
  pendingShortcut = 0;
  pendingCoinBonus = 0;
  currentLevelIndex = 0;
  resetLevel();
  updateNotes();
  updateHudForPlatform();
  winText.textContent = "Completaste la aventura creada con Blockly.";
  startBackgroundMusic();
}

function getJourneyTopic(index) {
  const topics = educationalJourney.levels;
  if (!topics.length) return null;
  return topics[index % topics.length];
}

function getPlatformLevelNumber(level, fallbackIndex = currentLevelIndex) {
  if (level && Number.isFinite(level.displayLevelNumber)) {
    return Math.max(1, Math.floor(level.displayLevelNumber));
  }
  if (level && typeof level.name === "string") {
    const match = level.name.match(/(?:Nivel|Maraton)\s+(\d+)/i);
    if (match && Number.isFinite(Number(match[1]))) {
      return Math.max(1, Number(match[1]));
    }
  }
  return Math.max(1, fallbackIndex + 1);
}

function buildTopicQuestionKey(topic, mode) {
  const title = topic && topic.title ? topic.title : "tema";
  return `${mode}:${title}`;
}

function buildPromptKey(prompt) {
  return String(prompt || "").trim().toLowerCase();
}

function isPromptUsed(prompt) {
  const key = buildPromptKey(prompt);
  return key ? usedChallengePromptKeys.has(key) : false;
}

function registerUsedPrompt(prompt) {
  const key = buildPromptKey(prompt);
  if (!key) return;
  usedChallengePromptKeys.add(key);
}

function pushRecentPrompt(mode, prompt) {
  const key = mode || "basic";
  const promptKey = buildPromptKey(prompt);
  if (!promptKey) return;
  const recent = recentTopicPromptsByMode.get(key) || [];
  const cleaned = recent.filter((item) => item !== promptKey);
  cleaned.unshift(promptKey);
  while (cleaned.length > 4) cleaned.pop();
  recentTopicPromptsByMode.set(key, cleaned);
}

function extractTopicKeywords(topic, max = 6) {
  const text = `${topic && topic.title ? topic.title : ""} ${topic && topic.text ? topic.text : ""}`;
  const words = normalizeAnswer(text).split(" ").filter(Boolean);
  const stopwords = new Set([
    "que", "para", "como", "con", "una", "uno", "las", "los", "del", "por", "son", "sus", "hoy",
    "antes", "luego", "todo", "esta", "este", "desde", "entre", "solo", "tambien", "muy", "mas",
    "fue", "hay", "nos", "sin", "porque", "sobre", "hasta", "donde", "ellos", "ellas", "cada",
  ]);
  const seen = new Set();
  const selected = [];
  for (let i = 0; i < words.length; i += 1) {
    const word = words[i];
    if (word.length < 5 || stopwords.has(word) || seen.has(word)) continue;
    seen.add(word);
    selected.push(word);
    if (selected.length >= max) break;
  }
  return selected;
}

function generateDynamicQuestion(topic, mode) {
  generatedQuestionSerial += 1;
  const serial = generatedQuestionSerial;
  const title = topic && topic.title ? topic.title : "Tecnologia";
  const keywords = extractTopicKeywords(topic, 6);
  const hintKeywords = keywords.slice(0, 3);
  if (mode === "basic") {
    const optionA = `Aplicar ${title}`;
    return {
      type: "multiple",
      prompt: `Reto nuevo ${serial}: ${title}. ¿Que opcion se relaciona mejor con el tema?`,
      code: `Tema: ${title}`,
      options: [optionA, "Responder al azar", "Ignorar las instrucciones"],
      expectedIndex: 0,
      hint: `Elige la opcion que conecta con ${title.toLowerCase()}.`,
      expected: "",
      expectedKeywords: hintKeywords,
      acceptedAnswers: [],
      minKeywordMatches: 1,
    };
  }
  return {
    type: "text",
    prompt: `Reto nuevo ${serial}: ${title}. Explica una idea principal con tus palabras.`,
    code: `Tema: ${title}`,
    hint: hintKeywords.length
      ? `Incluye al menos una idea clave: ${hintKeywords.join(", ")}.`
      : "Relaciona tu respuesta con el tema principal del nivel.",
    expected: "",
    expectedKeywords: hintKeywords.length ? hintKeywords : [normalizeAnswer(title)],
    acceptedAnswers: [],
    minKeywordMatches: 1,
  };
}

function ensureUniqueChallengePrompt(challenge, topic, mode) {
  if (!challenge) return challenge;
  if (challenge.prompt && !isPromptUsed(challenge.prompt)) {
    registerUsedPrompt(challenge.prompt);
    pushRecentPrompt(mode, challenge.prompt);
    return challenge;
  }
  const generated = generateDynamicQuestion(topic, mode);
  const merged = {
    ...challenge,
    ...generated,
    reward: challenge.reward,
    topicTitle: challenge.topicTitle || (topic && topic.title ? topic.title : ""),
    topicText: challenge.topicText || (topic && topic.text ? topic.text : ""),
  };
  registerUsedPrompt(merged.prompt);
  pushRecentPrompt(mode, merged.prompt);
  return merged;
}

function pickTopicQuestion(topic, mode) {
  if (!topic || !Array.isArray(topic.questions) || !topic.questions.length) return null;
  const key = buildTopicQuestionKey(topic, mode);
  const total = topic.questions.length;
  const indices = [];
  for (let i = 0; i < total; i += 1) indices.push(i);

  let state = topicQuestionState.get(key);
  const needsNewDeck = !state || !Array.isArray(state.deck) || state.deck.length !== total || state.cursor >= state.deck.length;
  if (needsNewDeck) {
    let deck = shuffleArray(indices, () => Math.random());
    if (state && state.lastIndex != null && deck.length > 1 && deck[0] === state.lastIndex) {
      [deck[0], deck[1]] = [deck[1], deck[0]];
    }
    state = {
      deck,
      cursor: 0,
      lastIndex: state && state.lastIndex != null ? state.lastIndex : null,
    };
  }

  const remaining = state.deck.slice(state.cursor);
  const recentPrompts = recentTopicPromptsByMode.get(mode || "basic") || [];
  const preferredType = mode === "intermediate" ? "text" : "multiple";
  let selectedOffset = remaining.findIndex((index) => {
    const question = topic.questions[index];
    return (
      question
      && question.type === preferredType
      && !isPromptUsed(question.prompt)
      && !recentPrompts.includes(buildPromptKey(question.prompt))
    );
  });
  if (selectedOffset === -1) {
    selectedOffset = remaining.findIndex((index) => {
      const question = topic.questions[index];
      return question && question.type === preferredType && !isPromptUsed(question.prompt);
    });
  }
  if (selectedOffset === -1) {
    selectedOffset = remaining.findIndex((index) => {
      const question = topic.questions[index];
      return question && !isPromptUsed(question.prompt) && !recentPrompts.includes(buildPromptKey(question.prompt));
    });
  }
  if (selectedOffset === -1) {
    selectedOffset = remaining.findIndex((index) => {
      const question = topic.questions[index];
      return question && !isPromptUsed(question.prompt);
    });
  }
  if (selectedOffset < 0) selectedOffset = 0;
  const selectedDeckPos = state.cursor + selectedOffset;
  if (selectedDeckPos !== state.cursor) {
    [state.deck[state.cursor], state.deck[selectedDeckPos]] = [state.deck[selectedDeckPos], state.deck[state.cursor]];
  }
  const questionIndex = state.deck[state.cursor];
  state.cursor += 1;
  state.lastIndex = questionIndex;
  topicQuestionState.set(key, state);
  return topic.questions[questionIndex] || topic.questions[0];
}

function buildAdaptiveTextHint(question, fallbackHint) {
  if (question && typeof question.hint === "string" && question.hint.trim()) {
    return question.hint;
  }
  const keywords = Array.isArray(question && question.expectedKeywords)
    ? question.expectedKeywords.filter((word) => typeof word === "string" && word.trim())
    : [];
  if (keywords.length) {
    const preview = keywords.slice(0, 3).join(", ");
    return `Incluye ideas clave como: ${preview}.`;
  }
  if (fallbackHint) return fallbackHint;
  return "Relaciona tu respuesta con el tema del nivel y escribe una idea clara.";
}

function makeChallengeFromTopic(level, topic) {
  const fallback = currentMode === "intermediate" ? level.challenge.intermediate : level.challenge.basic;
  if (!topic || !Array.isArray(topic.questions) || !topic.questions.length) {
    return ensureUniqueChallengePrompt({ ...(fallback || {}) }, topic, currentMode);
  }
  const question = pickTopicQuestion(topic, currentMode);
  if (!question) {
    return ensureUniqueChallengePrompt({ ...(fallback || {}) }, topic, currentMode);
  }
  const challenge = {
    type: question.type || "text",
    prompt: question.prompt || fallback.prompt || "Responde la pregunta.",
    code: `Tema: ${topic.title}`,
    hint: question.type === "text"
      ? buildAdaptiveTextHint(question, fallback.hint || "Piensa en el texto informativo del nivel.")
      : (question.hint || fallback.hint || "Piensa en el texto informativo del nivel."),
    topicTitle: topic.title,
    topicText: topic.text,
    reward: topic.reward || level.reward,
  };
  if (challenge.type === "multiple") {
    challenge.options = question.options || [];
    challenge.expectedIndex = Number(question.expectedIndex || 0);
  } else if (challenge.type === "text") {
    challenge.expected = question.expected || "";
    challenge.expectedKeywords = Array.isArray(question.expectedKeywords) ? question.expectedKeywords : [];
    challenge.acceptedAnswers = Array.isArray(question.acceptedAnswers) ? question.acceptedAnswers : [];
    challenge.minKeywordMatches = Number.isFinite(question.minKeywordMatches) ? Math.max(1, Math.floor(question.minKeywordMatches)) : 1;
  }
  return ensureUniqueChallengePrompt(challenge, topic, currentMode);
}

function getCurrentChallenge(level) {
  if (!level) return null;
  if (currentChallengeSnapshot) return currentChallengeSnapshot;
  const challenge = makeChallengeFromTopic(level, level.lessonTopic);
  currentChallengeSnapshot = challenge;
  return challenge;
}

function showChallenge() {
  const level = levels[currentLevelIndex];
  const challenge = getCurrentChallenge(level);
  if (!challenge) return;
  gameState = "challenge";
  heldItemTimer = 0;
  attackTimer = 0;
  if (challengeTopicTitle) challengeTopicTitle.textContent = challenge.topicTitle || "";
  if (challengeTopicText) challengeTopicText.textContent = challenge.topicText || "";
  challengePrompt.textContent = challenge.prompt;
  challengeCode.textContent = buildChallengeCode(challenge);
  challengeInput.value = "";
  debugInput.value = "";
  selectedChoice = null;
  selectedOrder = [];
  selectedKeySequence = [];
  challengeHint.textContent = "";
  showAnswerBlock(challenge.type);
  if (challenge.type === "multiple") {
    renderChoices(challenge.options || []);
  }
  if (challenge.type === "order") {
    renderOrderChoices(challenge.steps || []);
  }
  if (challenge.type === "keysequence") {
    renderKeySequenceProgress(normalizeExpectedSequence(challenge.expectedKeys));
  }
  challengeModal.classList.add("show");
  const lessonText = [challenge.topicTitle, challenge.topicText].filter(Boolean).join(". ");
  if (lessonText) {
    setTimeout(() => speak(lessonText), 120);
  }
  resetKeys();
  if (challenge.type === "debug") {
    debugInput.focus();
  } else if (challenge.type === "text") {
    challengeInput.focus();
  } else if (challenge.type === "keysequence") {
    checkAnswer.focus();
  }
}

function closeChallengeModal() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  currentChallengeSnapshot = null;
  gameState = "playing";
  heldItemTimer = 0;
  attackTimer = 0;
  selectedKeySequence = [];
  challengeModal.classList.remove("show");
}

function completeChallenge() {
  challengeModal.classList.remove("show");
  const level = levels[currentLevelIndex];
  const challenge = getCurrentChallenge(level);
  applyChallengeReward(level, challenge && challenge.reward ? challenge.reward : level.reward);
  currentChallengeSnapshot = null;
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex += 1;
    resetLevel();
    updateNotes();
    if (activeGame === "platform") persistPlatformProgress();
    gameState = "playing";
  } else {
    if (activeGame === "platform") {
      const nextIndex = levels.length;
      const nextLevel = buildPlatformMarathonLevel(nextIndex);
      prepareLevels([nextLevel], nextIndex);
      levels.push(nextLevel);
      currentLevelIndex += 1;
      resetLevel();
      updateNotes();
      persistPlatformProgress();
      gameState = "playing";
      const marathonLabel = sessionElapsedMs < PLATFORM_MIN_DURATION_MS
        ? `${formatClock(sessionElapsedMs)}/60:00`
        : `${formatClock(sessionElapsedMs)} total`;
      showToast(`Nuevo nivel generado (${marathonLabel}).`, 2600);
      return;
    }
    gameState = "win";
    if (activeGame === "platform") {
      winText.textContent = `Completaste ${levels.length} niveles en ${formatClock(sessionElapsedMs)}.`;
    }
    winScreen.classList.add("show");
  }
}

function applyChallengeReward(level, reward) {
  if (!reward) return;
  if (reward.weapon) {
    unlockWeapon(reward.weapon);
  }
  if (reward.type === "life") {
    lives += Math.max(1, Number(reward.value) || 1);
    hud.livesText.textContent = lives;
    showToast(`Recompensa: +${reward.value || 1} vida`);
  } else if (reward.type === "shortcut") {
    pendingShortcut += Math.max(120, Number(reward.value) || 220);
    showToast(`Recompensa: ${reward.label || "Atajo"} activado`);
  } else if (reward.type === "coins") {
    pendingCoinBonus += Math.max(1, Number(reward.value) || 1);
    showToast(`Recompensa: +${reward.value || 1} monedas al iniciar`);
  } else if (reward.type === "speed") {
    speedBoostTimer = Math.max(speedBoostTimer, Math.max(6000, Number(reward.value) || 10000));
    showToast(`Recompensa: ${reward.label || "Turbo"} activo`);
  } else if (reward.type === "shield") {
    shieldCharges += Math.max(1, Number(reward.value) || 1);
    showToast(`Recompensa: ${reward.label || "Escudo"} listo`);
  } else if (reward.type === "weapon" && reward.value) {
    unlockWeapon(reward.value);
  }
  if (activeGame !== "strategy") updateHudForPlatform();
}

function normalizeAnswer(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactAnswer(value) {
  return normalizeAnswer(value).replace(/\s+/g, "");
}

function tokenizeAnswer(value) {
  return normalizeAnswer(value)
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);
}

function countKeywordMatches(answer, keywords) {
  if (!answer || !Array.isArray(keywords) || !keywords.length) return 0;
  const compact = compactAnswer(answer);
  const tokens = tokenizeAnswer(answer);
  const tokenSet = new Set(tokens);
  let matches = 0;
  keywords.forEach((keyword) => {
    const normalized = normalizeAnswer(keyword);
    if (!normalized) return;
    const normalizedCompact = normalized.replace(/\s+/g, "");
    if (normalized.includes(" ")) {
      if (compact.includes(normalizedCompact)) matches += 1;
      return;
    }
    if (tokenSet.has(normalized) || compact.includes(normalizedCompact)) {
      matches += 1;
    }
  });
  return matches;
}

function matchesExpectedText(answer, expected) {
  const expectedTokens = tokenizeAnswer(expected).filter((token) => token.length > 2);
  if (!expectedTokens.length) return false;
  const answerTokens = tokenizeAnswer(answer);
  if (!answerTokens.length) return false;
  const answerSet = new Set(answerTokens);
  const answerCompact = compactAnswer(answer);
  return expectedTokens.every((token) => {
    const compactToken = token.replace(/\s+/g, "");
    return answerSet.has(token) || answerCompact.includes(compactToken);
  });
}

function normalizeSequenceToken(token) {
  return String(token || "").trim().toUpperCase();
}

function normalizeExpectedSequence(sequence) {
  if (!Array.isArray(sequence)) return [];
  return sequence.map(normalizeSequenceToken).filter(Boolean);
}

function keyCodeToSequenceToken(code) {
  if (code === "ArrowLeft" || code === "KeyA") return "LEFT";
  if (code === "ArrowRight" || code === "KeyD") return "RIGHT";
  if (code === "ArrowUp" || code === "KeyW" || code === "Space") return "JUMP";
  if (code === "KeyF" || code === "KeyJ") return "ATTACK";
  if (code === "ShiftLeft" || code === "ShiftRight") return "DASH";
  return "";
}

function sequenceTokenLabel(token) {
  if (token === "LEFT") return "Izquierda";
  if (token === "RIGHT") return "Derecha";
  if (token === "JUMP") return "Saltar";
  if (token === "ATTACK") return "Atacar";
  if (token === "DASH") return "Dash";
  return token;
}

function renderKeySequenceProgress(expected = []) {
  if (!keySequenceProgress) return;
  const typed = selectedKeySequence.map(sequenceTokenLabel).join(" -> ");
  const target = expected.map(sequenceTokenLabel).join(" -> ");
  keySequenceProgress.textContent = `Tu secuencia: ${typed || "(vacia)"}\nObjetivo: ${target || "(sin objetivo)"}`;
}

function buildChallengeCode(challenge) {
  if (challenge.type === "order" && Array.isArray(challenge.steps)) {
    return challenge.steps
      .map((step, index) => `${index + 1}) ${step}`)
      .join("\n");
  }
  return challenge.code || "";
}

function showAnswerBlock(type) {
  Object.values(answerBlocks).forEach((block) => block.classList.remove("show"));
  if (answerBlocks[type]) {
    answerBlocks[type].classList.add("show");
  } else {
    answerBlocks.text.classList.add("show");
  }
}

function renderChoices(options) {
  choiceButtons.innerHTML = "";
  options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "ghost";
    btn.textContent = option;
    btn.addEventListener("click", () => {
      selectedChoice = index;
      [...choiceButtons.children].forEach((child) => child.classList.remove("choiceSelected"));
      btn.classList.add("choiceSelected");
    });
    choiceButtons.appendChild(btn);
  });
}

function renderOrderChoices(steps) {
  orderChoices.innerHTML = "";
  orderSelected.textContent = "Tu orden: ";
  steps.forEach((step, index) => {
    const btn = document.createElement("button");
    btn.className = "ghost";
    btn.textContent = step;
    btn.addEventListener("click", () => {
      if (selectedOrder.includes(index + 1)) return;
      selectedOrder.push(index + 1);
      orderSelected.textContent = `Tu orden: ${selectedOrder.join(", ")}`;
    });
    orderChoices.appendChild(btn);
  });
}

orderClear.addEventListener("click", () => {
  selectedOrder = [];
  orderSelected.textContent = "Tu orden: ";
});

keySequenceReset.addEventListener("click", () => {
  selectedKeySequence = [];
  const level = levels[currentLevelIndex];
  const challenge = getCurrentChallenge(level);
  renderKeySequenceProgress(normalizeExpectedSequence(challenge.expectedKeys));
});

function checkChallengeAnswer() {
  const level = levels[currentLevelIndex];
  const challenge = getCurrentChallenge(level);
  if (!challenge) return;
  const type = challenge.type || "text";

  function succeed() {
    challengeHint.textContent = "¡Correcto! 👍";
    playSound("success");
    setTimeout(() => completeChallenge(), 450);
  }

  if (type === "multiple") {
    const expectedIndex = challenge.expectedIndex;
    if (selectedChoice === expectedIndex) {
      succeed();
      return;
    }
  } else if (type === "order") {
    const expectedOrder = challenge.expectedOrder || [];
    if (
      selectedOrder.length &&
      expectedOrder.length === selectedOrder.length &&
      expectedOrder.every((value, idx) => value === selectedOrder[idx])
    ) {
      succeed();
      return;
    }
  } else if (type === "debug") {
    const expected = compactAnswer(challenge.expected || "");
    const got = compactAnswer(debugInput.value);
    if (got && got === expected) {
      succeed();
      return;
    }
  } else if (type === "keysequence") {
    const expected = normalizeExpectedSequence(challenge.expectedKeys);
    if (
      expected.length > 0 &&
      expected.length === selectedKeySequence.length &&
      expected.every((value, idx) => value === selectedKeySequence[idx])
    ) {
      succeed();
      return;
    }
  } else {
    const rawInput = challengeInput.value || "";
    const expected = compactAnswer(challenge.expected || "");
    const got = compactAnswer(rawInput);
    const accepted = (challenge.acceptedAnswers || []).map(compactAnswer).filter(Boolean);
    const keywords = (challenge.expectedKeywords || []).map(normalizeAnswer).filter(Boolean);
    const minKeywordMatches = Number.isFinite(challenge.minKeywordMatches)
      ? Math.max(1, Math.floor(challenge.minKeywordMatches))
      : 1;
    const keywordMatches = countKeywordMatches(rawInput, keywords);
    const keywordMatch = keywords.length > 0 && keywordMatches >= Math.min(minKeywordMatches, keywords.length);
    const softExpectedMatch = challenge.expected ? matchesExpectedText(rawInput, challenge.expected) : false;
    if ((got && got === expected) || (got && accepted.includes(got)) || (got && softExpectedMatch) || (got && keywordMatch)) {
      succeed();
      return;
    }
  }

  challengeHint.textContent = challenge.hint || "Intenta otra vez.";
}

function getChallengeSpeechText(challenge) {
  const parts = [];
  if (challenge.topicTitle) parts.push(`Tema: ${challenge.topicTitle}.`);
  if (challenge.topicText) parts.push(challenge.topicText);
  if (challenge.prompt) parts.push(challenge.prompt);
  const code = buildChallengeCode(challenge);
  if (code) parts.push(code.replace(/\n/g, " "));
  if (challenge.type === "multiple" && Array.isArray(challenge.options)) {
    parts.push("Opciones:");
    challenge.options.forEach((option, index) => {
      parts.push(`Opcion ${index + 1}: ${option}`);
    });
  } else if (challenge.type === "keysequence") {
    const expected = normalizeExpectedSequence(challenge.expectedKeys);
    if (expected.length) {
      parts.push("Secuencia esperada:");
      parts.push(expected.map(sequenceTokenLabel).join(", "));
    }
  }
  return parts.join(" ");
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "es-MX";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function rectsIntersect(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function resolveCollisions(entity, platforms, axis) {
  for (const p of platforms) {
    if (rectsIntersect(entity, p)) {
      if (axis === "x") {
        if (entity.vx > 0) {
          entity.x = p.x - entity.w;
        } else if (entity.vx < 0) {
          entity.x = p.x + p.w;
        }
        entity.vx = 0;
      } else if (axis === "y") {
        if (entity.vy > 0) {
          entity.y = p.y - entity.h;
          entity.onGround = true;
        } else if (entity.vy < 0) {
          entity.y = p.y + p.h;
        }
        entity.vy = 0;
      }
    }
  }
}

function attemptAttack() {
  if (attackCooldown > 0) return;
  attackCooldown = currentWeapon.cooldown;
  attackTimer = ATTACK_VIS_TIME;

  if (currentWeapon.type === "melee") {
    const range = currentWeapon.range;
    const hitBox = {
      x: player.facing === 1 ? player.x + player.w : player.x - range,
      y: player.y + 10,
      w: range,
      h: player.h - 20,
    };
    const level = levels[currentLevelIndex];
    for (const enemy of level.enemies) {
      if (!enemy.alive) continue;
      if (rectsIntersect(hitBox, { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h })) {
        enemy.alive = false;
        playSound("hit");
        spawnHitEffect(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2);
      }
    }
  } else if (currentWeapon.type === "range") {
    const size = { w: 18, h: 10 };
    const proj = {
      x: player.facing === 1 ? player.x + player.w : player.x - size.w,
      y: player.y + player.h / 2 - size.h / 2,
      w: size.w,
      h: size.h,
      vx: currentWeapon.speed * player.facing,
    };
    projectiles.push(proj);
    if (currentWeapon.sound) playSound(currentWeapon.sound);
  }
}

function spawnHitEffect(x, y) {
  hitEffects.push({ x, y, life: 140 });
}

function updateHitEffects(delta) {
  for (let i = hitEffects.length - 1; i >= 0; i -= 1) {
    hitEffects[i].life -= delta;
    if (hitEffects[i].life <= 0) hitEffects.splice(i, 1);
  }
}

function updateDashTrail(delta) {
  for (let i = dashTrail.length - 1; i >= 0; i -= 1) {
    dashTrail[i].life -= delta;
    if (dashTrail[i].life <= 0) dashTrail.splice(i, 1);
  }
}

function attemptDash() {
  if (dashCooldown > 0 || dashTime > 0) return;
  dashTime = DASH_TIME;
  dashCooldown = DASH_COOLDOWN;
}

function findWhipCoinTarget(level) {
  if (!level || !level.coins || !level.coins.length) return null;
  const originX = player.x + player.w / 2;
  const originY = player.y + player.h / 2;
  let best = null;
  for (let i = 0; i < level.coins.length; i += 1) {
    const coin = level.coins[i];
    const coinX = coin.x + 16;
    const coinY = coin.y + 16;
    const dx = coinX - originX;
    const dy = coinY - originY;
    const distance = Math.hypot(dx, dy);
    if (distance > WHIP_RANGE) continue;
    const facingPenalty = dx * player.facing < -18 ? 45 : 0;
    const score = distance + facingPenalty;
    if (!best || score < best.score) {
      best = { index: i, x: coinX, y: coinY, score };
    }
  }
  return best;
}

function attemptWhipCollect() {
  if (activeGame !== "platform" || gameState !== "playing") return;
  if (whipCooldown > 0) return;

  const level = levels[currentLevelIndex];
  const target = findWhipCoinTarget(level);
  if (!target) {
    whipCooldown = WHIP_MISS_COOLDOWN;
    whipVisualTimer = WHIP_VIS_TIME;
    whipTarget = {
      x: player.x + player.w / 2 + player.facing * Math.min(WHIP_RANGE * 0.8, 160),
      y: player.y + player.h / 2 - 6,
    };
    return;
  }

  whipCooldown = WHIP_COOLDOWN;
  whipVisualTimer = WHIP_VIS_TIME;
  whipTarget = { x: target.x, y: target.y };
  level.coins.splice(target.index, 1);
  collectedCoins += 1;
  hud.coinText.textContent = collectedCoins;
  playSound("coin");
  heldItemTimer = HELD_ITEM_TIME;
}

function updateProjectiles(level) {
  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const proj = projectiles[i];
    proj.x += proj.vx;
    if (proj.x < 0 || proj.x > level.width) {
      projectiles.splice(i, 1);
      continue;
    }
    for (const enemy of level.enemies) {
      if (!enemy.alive) continue;
      if (enemy.spawnDelay && !enemy.active) continue;
      if (rectsIntersect(proj, enemy)) {
        enemy.alive = false;
        playSound("hit");
        projectiles.splice(i, 1);
        break;
      }
    }
  }
}

function updateEnemyProjectiles(level) {
  for (let i = enemyProjectiles.length - 1; i >= 0; i -= 1) {
    const proj = enemyProjectiles[i];
    proj.x += proj.vx;
    proj.y += proj.vy;
    if (proj.x < -40 || proj.x > level.width + 40 || proj.y < -40 || proj.y > canvas.height + 40) {
      enemyProjectiles.splice(i, 1);
      continue;
    }
    if (rectsIntersect(player, proj)) {
      enemyProjectiles.splice(i, 1);
      if (shieldCharges > 0) {
        shieldCharges -= 1;
        showToast("Escudo activado");
        continue;
      }
      loseLife();
      break;
    }
  }
}

function updatePlayer(level) {
  const moveSpeed = speedBoostTimer > 0 ? MOVE_SPEED * 1.35 : MOVE_SPEED;
  if (dashTime > 0) {
    player.vx = DASH_SPEED * player.facing;
    dashTrail.push({
      x: player.x + player.w / 2,
      y: player.y + player.h / 2,
      life: 160,
    });
  } else {
    if (keys.left) {
      player.vx = -moveSpeed;
      player.facing = -1;
    } else if (keys.right) {
      player.vx = moveSpeed;
      player.facing = 1;
    } else {
      player.vx = 0;
    }
  }

  if (keys.jump && player.onGround) {
    player.vy = JUMP_SPEED;
    playSound("jump");
  }

  player.x += player.vx;
  resolveCollisions(player, level.platforms, "x");

  player.onGround = false;
  player.vy += GRAVITY;
  player.y += player.vy;
  resolveCollisions(player, level.platforms, "y");

  if (player.y > canvas.height + 200) {
    loseLife();
  }
}

function updateEnemies(level, delta) {
  for (const enemy of level.enemies) {
    if (!enemy.alive) {
      if (enemy.respawnable) {
        enemy.respawnTimer = Math.max(0, (enemy.respawnTimer || 0) - delta);
        if (enemy.respawnTimer <= 0) {
          respawnEnemyNearPlayer(enemy, level);
        }
      }
      continue;
    }
    if (enemy.spawnDelay && !enemy.active) {
      enemy.spawnTimer += delta;
      if (enemy.spawnTimer >= enemy.spawnDelay) {
        enemy.active = true;
      }
      continue;
    }
    enemy.shotCooldown = Math.max(0, (enemy.shotCooldown || 0) - delta);
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const aggroRange = enemy.aggroRange || 0;
    const yRange = enemy.aggroYRange || 80;
    const shouldChase = aggroRange > 0 && Math.abs(dx) <= aggroRange && Math.abs(dy) <= yRange;
    if (shouldChase) {
      const dir = dx === 0 ? 0 : dx > 0 ? 1 : -1;
      const baseSpeed = Math.abs(enemy.vx) || 1.2;
      const chaseSpeed = enemy.chaseSpeed || Math.max(1.6, baseSpeed + 0.4);
      enemy.vx = dir * chaseSpeed;
      let nextX = enemy.x + enemy.vx;
      if (enemy.minX != null && enemy.maxX != null) {
        nextX = Math.min(enemy.maxX, Math.max(enemy.minX, nextX));
      }
      enemy.x = nextX;
      if (enemy.canShoot && enemy.shotCooldown <= 0 && Math.abs(dx) <= 420 && Math.abs(dy) <= 120) {
        spawnEnemyProjectile(enemy, dir);
        enemy.shotCooldown = enemy.shotRate || ENEMY_SHOT_BASE_COOLDOWN;
      }
      continue;
    }
    enemy.x += enemy.vx * 1.2;
    if (enemy.minX != null && enemy.maxX != null) {
      if (enemy.x < enemy.minX || enemy.x > enemy.maxX) {
        enemy.vx *= -1;
      }
    }
  }
}

function spawnEnemyProjectile(enemy, dir) {
  const size = { w: 16, h: 8 };
  enemyProjectiles.push({
    x: enemy.x + (dir >= 0 ? enemy.w : -size.w),
    y: enemy.y + enemy.h / 2 - size.h / 2,
    w: size.w,
    h: size.h,
    vx: 5.2 * dir,
    vy: 0,
  });
}

function checkCoins(level) {
  for (let i = level.coins.length - 1; i >= 0; i -= 1) {
    const coin = level.coins[i];
    const coinBox = { x: coin.x, y: coin.y, w: 32, h: 32 };
    if (rectsIntersect(player, coinBox)) {
      level.coins.splice(i, 1);
      collectedCoins += 1;
      hud.coinText.textContent = collectedCoins;
      playSound("coin");
      heldItemTimer = HELD_ITEM_TIME;
    }
  }
}

function checkEnemies(level) {
  for (const enemy of level.enemies) {
    if (!enemy.alive) continue;
    if (enemy.spawnDelay && !enemy.active) continue;
    const enemyBox = { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h };
    if (rectsIntersect(player, enemyBox)) {
      if (shieldCharges > 0) {
        shieldCharges -= 1;
        showToast("Escudo activado");
        enemy.alive = false;
        continue;
      }
      loseLife();
      playSound("hit");
      break;
    }
  }
}

function checkGoal(level) {
  if (collectedCoins < totalCoins) return;
  const goalBox = { x: level.goal.x, y: level.goal.y, w: level.goal.w, h: level.goal.h };
  if (rectsIntersect(player, goalBox)) {
    showChallenge();
  }
}

function loseLife() {
  lives -= 1;
  hud.livesText.textContent = lives;
  if (lives <= 0) {
    // Reintento desde el nivel perdido en modo plataformas.
    const level = levels[currentLevelIndex];
    const displayLevel = getPlatformLevelNumber(level, currentLevelIndex);
    selectedStartLevel = currentLevelIndex;
    if (activeGame === "platform") {
      persistPlatformProgress();
    } else {
      localStorage.setItem("plataformas_start_level", String(selectedStartLevel));
    }
    renderLevelSelect();
    startScreen.classList.add("show");
    gameState = "start";
    showToast(`Perdiste en el nivel ${displayLevel}. Puedes reintentar desde ahí.`);
  } else {
    resetLevel();
  }
}

function updateCamera(level) {
  const target = player.x + player.w / 2 - canvas.width / 2;
  cameraX = Math.max(0, Math.min(level.width - canvas.width, target));
}

function drawBackground(level) {
  const scene = level && level.scene ? level.scene : platformScenes[0];
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, scene.circuitA || "#2f5f9a");
  grad.addColorStop(1, scene.circuitB || "#1d3551");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bg = assets.images.bg;
  if (bg) {
    const parallax = (cameraX * 0.18) % canvas.width;
    ctx.globalAlpha = 0.14;
    ctx.drawImage(bg, -parallax, 0, canvas.width, canvas.height);
    ctx.drawImage(bg, canvas.width - parallax, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }

  const netColor = scene.fog || "rgba(220, 245, 255, 0.2)";
  const pulse = 0.3 + (Math.sin(lastTime * 0.0016) + 1) * 0.2;
  const horizon = canvas.height * 0.56;

  ctx.strokeStyle = `rgba(130, 238, 255, ${(0.08 + pulse * 0.08).toFixed(3)})`;
  ctx.lineWidth = 1;
  for (let y = horizon; y < canvas.height + 1; y += 22) {
    const depth = (y - horizon) / Math.max(1, canvas.height - horizon);
    const drift = (cameraX * (0.08 + depth * 0.2)) % 180;
    ctx.beginPath();
    ctx.moveTo(-180 + drift, y);
    ctx.lineTo(canvas.width + 180 + drift, y);
    ctx.stroke();
  }

  ctx.strokeStyle = `rgba(110, 224, 255, ${(0.08 + pulse * 0.1).toFixed(3)})`;
  for (let x = -240; x <= canvas.width + 240; x += 58) {
    const shift = (cameraX * 0.12) % 58;
    ctx.beginPath();
    ctx.moveTo(x - shift, horizon);
    ctx.lineTo(canvas.width / 2, canvas.height + 120);
    ctx.stroke();
  }

  ctx.fillStyle = `rgba(120, 235, 255, ${(0.05 + pulse * 0.06).toFixed(3)})`;
  for (let i = 0; i < 26; i += 1) {
    const x = ((i * 87 + cameraX * 0.23) % (canvas.width + 160)) - 80;
    const y = ((i * 53 + lastTime * 0.04) % (horizon + 40)) - 20;
    const w = 1 + (i % 3);
    const h = 6 + (i % 5) * 2;
    ctx.fillRect(x, y, w, h);
  }

  ctx.fillStyle = "rgba(10, 28, 44, 0.28)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = netColor;
  ctx.strokeStyle = netColor;
  ctx.lineWidth = 2;
  for (let i = 0; i < 10; i += 1) {
    const x = ((i * 160 - cameraX * 0.35) % (canvas.width + 240)) - 100;
    const y = 28 + (i % 5) * 44;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 62, y);
    ctx.lineTo(x + 62, y + 16);
    ctx.lineTo(x + 118, y + 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 62, y, 3, 0, Math.PI * 2);
    ctx.arc(x + 118, y + 16, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  if (scene.deco === "city") {
    ctx.fillStyle = "rgba(20, 34, 64, 0.34)";
    for (let i = 0; i < 9; i += 1) {
      const bx = ((i * 170 - cameraX * 0.45) % (canvas.width + 200)) - 40;
      const bh = 100 + (i % 4) * 36;
      ctx.fillRect(bx, canvas.height - 80 - bh, 74, bh);
    }
  } else if (scene.deco === "circuits") {
    ctx.strokeStyle = "rgba(130, 250, 255, 0.24)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i += 1) {
      const x = ((i * 120 - cameraX * 0.4) % (canvas.width + 140)) - 20;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 70 + (i % 3) * 34);
      ctx.lineTo(x + 36, 96 + (i % 2) * 28);
      ctx.stroke();
    }
  }
}

function drawPlatforms(level) {
  const scene = level && level.scene ? level.scene : platformScenes[0];
  for (const p of level.platforms) {
    const drawX = p.x - cameraX;
    const topH = Math.min(12, p.h);
    ctx.fillStyle = scene.platformSide || "#1f3e4f";
    ctx.fillRect(drawX, p.y, p.w, p.h);
    ctx.fillStyle = scene.platformTop || "#3d6b87";
    ctx.fillRect(drawX, p.y, p.w, topH);
  }
}

function drawPlayer() {
  const img = assets.images[selectedPlayer] || assets.images.player1;
  if (!img) return;
  const drawX = player.x - cameraX;
  ctx.save();
  ctx.translate(drawX, player.y);
  if (player.facing === -1) {
    ctx.translate(player.w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(img, 0, 0, player.w, player.h);
  if (shieldCharges > 0) {
    ctx.strokeStyle = "rgba(120, 230, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.w / 2, player.h / 2, 30, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (speedBoostTimer > 0) {
    ctx.strokeStyle = "rgba(255, 242, 120, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.w / 2, player.h / 2, 22, 0, Math.PI * 2);
    ctx.stroke();
  }
  drawHeldItem();
  drawPlayerWeapon();
  ctx.restore();
}

function drawHeldItem() {
  if (heldItemTimer <= 0 || gameState !== "playing") return;
  const coinImg = assets.images.coin1;
  if (!coinImg) return;
  const alpha = Math.min(1, heldItemTimer / HELD_ITEM_TIME + 0.1);
  ctx.globalAlpha = alpha;
  ctx.drawImage(
    coinImg,
    player.w - HELD_ITEM_SIZE + 2,
    -HELD_ITEM_SIZE - 6,
    HELD_ITEM_SIZE,
    HELD_ITEM_SIZE
  );
  ctx.globalAlpha = 1;
}

function drawPlayerWeapon() {
  const gripX = player.w - 8;
  const gripY = Math.max(18, player.h / 2 - 6);
  const showAttack = attackTimer > 0;
  const attackPhase = showAttack ? 1 - attackTimer / ATTACK_VIS_TIME : 0;
  const throwOffset = showAttack ? Math.sin(attackPhase * Math.PI) * 26 : 0;
  const weaponX = gripX + throwOffset;
  if (currentWeapon.id === "sword") {
    ctx.strokeStyle = "#e6eef7";
    ctx.lineWidth = showAttack ? 4 : 3;
    ctx.beginPath();
    ctx.moveTo(weaponX, gripY);
    ctx.lineTo(
      weaponX + (showAttack ? 28 : 20),
      gripY - (showAttack ? 14 : 8)
    );
    ctx.stroke();
    ctx.fillStyle = "#f6c945";
    ctx.fillRect(weaponX - 2, gripY - 2, 6, 6);
  } else if (currentWeapon.id === "pistol") {
    ctx.fillStyle = "#dfe6ee";
    ctx.fillRect(weaponX, gripY, 16, 6);
    ctx.fillRect(weaponX + 12, gripY - 4, 8, 4);
    ctx.fillStyle = "#f6c945";
    ctx.fillRect(weaponX - 2, gripY + 4, 6, 6);
    if (showAttack) {
      ctx.fillStyle = "#ffec8a";
      ctx.fillRect(weaponX + 18, gripY - 2, 8, 4);
    }
  } else {
    ctx.fillStyle = "#f6c945";
    ctx.beginPath();
    ctx.arc(
      weaponX + (showAttack ? 12 : 8),
      gripY + 4,
      showAttack ? 7 : 5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

function drawEnemies(level) {
  const img = assets.images.enemy;
  if (!img) return;
  for (const enemy of level.enemies) {
    if (!enemy.alive) continue;
    if (enemy.spawnDelay && !enemy.active) continue;
    const drawX = enemy.x - cameraX;
    const facing = enemy.vx < 0 ? -1 : 1;
    ctx.save();
    if (facing === -1) {
      ctx.translate(drawX + enemy.w, enemy.y);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0, enemy.w, enemy.h);
    } else {
      ctx.drawImage(img, drawX, enemy.y, enemy.w, enemy.h);
    }
    ctx.restore();
  }
}

function drawProjectiles() {
  const img = assets.images.projectile1;
  if (!img) return;
  for (const proj of projectiles) {
    ctx.drawImage(img, proj.x - cameraX, proj.y, proj.w, proj.h);
  }
}

function drawEnemyProjectiles() {
  const img = assets.images.projectile1;
  if (!img) return;
  for (const proj of enemyProjectiles) {
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.drawImage(img, proj.x - cameraX, proj.y, proj.w, proj.h);
    ctx.restore();
  }
}

function drawHitEffects() {
  if (!hitEffects.length) return;
  for (const effect of hitEffects) {
    const alpha = Math.max(0, effect.life / 140);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#f6c945";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(effect.x - cameraX, effect.y, 16 * alpha + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawDashTrail() {
  if (!dashTrail.length) return;
  ctx.save();
  for (const point of dashTrail) {
    const alpha = Math.max(0, point.life / 160);
    ctx.globalAlpha = alpha * 0.6;
    ctx.fillStyle = "#6bd1ff";
    ctx.beginPath();
    ctx.arc(point.x - cameraX, point.y, 12 * alpha + 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawWhipEffect() {
  if (whipVisualTimer <= 0 || !whipTarget || gameState !== "playing") return;
  const phase = 1 - whipVisualTimer / WHIP_VIS_TIME;
  const handOffsetX = player.facing === 1 ? player.w - 8 : 8;
  const handOffsetY = Math.max(18, player.h / 2 - 6) + 8;
  const startX = player.x - cameraX + handOffsetX;
  const startY = player.y + handOffsetY;
  const endX = whipTarget.x - cameraX;
  const endY = whipTarget.y;
  const bend = Math.sin(phase * Math.PI) * 26;
  const ctrlX = (startX + endX) / 2 + player.facing * (20 + bend * 0.5);
  const ctrlY = Math.min(startY, endY) - 18 - bend;
  ctx.save();
  ctx.strokeStyle = "rgba(102, 240, 255, 0.9)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
  ctx.stroke();
  ctx.strokeStyle = "rgba(220, 255, 255, 0.75)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(startX + player.facing * 2, startY - 1);
  ctx.quadraticCurveTo(ctrlX, ctrlY - 4, endX, endY);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 245, 200, 0.92)";
  ctx.beginPath();
  ctx.arc(endX, endY, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCoins(level) {
  const crystalFrames = [assets.images.crystal_a, assets.images.crystal_b, assets.images.crystal_a, assets.images.crystal_b];
  const coinFrames = [assets.images.coin1, assets.images.coin2, assets.images.coin3, assets.images.coin4];
  const frames = crystalFrames.every(Boolean) ? crystalFrames : coinFrames;
  const frame = frames[coinFrame];
  if (!frame) return;
  for (const coin of level.coins) {
    ctx.drawImage(frame, coin.x - cameraX, coin.y, 32, 32);
  }
}

function drawGoal(level) {
  const img = assets.images.goal;
  if (!img) return;
  ctx.drawImage(img, level.goal.x - cameraX, level.goal.y, level.goal.w, level.goal.h);
  if (collectedCoins >= totalCoins) {
    ctx.fillStyle = "#f6c945";
    ctx.font = "16px BakeSoda, sans-serif";
    ctx.fillText("Meta", level.goal.x - cameraX - 6, level.goal.y - 10);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "14px BakeSoda, sans-serif";
    ctx.fillText("Aún necesitas más para llegar a la meta", level.goal.x - cameraX - 120, level.goal.y - 10);
  }
}

function drawStrategy() {
  const mapW = STRATEGY_COLS * STRATEGY_TILE;
  const mapH = STRATEGY_ROWS * STRATEGY_TILE;
  const offsetX = Math.floor((canvas.width - mapW) / 2);
  const offsetY = Math.floor((canvas.height - mapH) / 2);
  const level = strategyLevels[strategyWorldIndex];
  const biome = getStrategyBiome(strategyWorldIndex);
  const bg = assets.images.bg;
  if (bg) {
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGrad.addColorStop(0, "#102a38");
    bgGrad.addColorStop(1, "#0f1822");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.fillStyle = biome.overlay;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < STRATEGY_ROWS; y += 1) {
    for (let x = 0; x < STRATEGY_COLS; x += 1) {
      const px = offsetX + x * STRATEGY_TILE;
      const py = offsetY + y * STRATEGY_TILE;
      ctx.fillStyle = (x + y) % 2 === 0 ? biome.tileA : biome.tileB;
      ctx.fillRect(px + 1, py + 1, STRATEGY_TILE - 2, STRATEGY_TILE - 2);
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.strokeRect(px + 1, py + 1, STRATEGY_TILE - 2, STRATEGY_TILE - 2);
    }
  }

  const mapTexture = assets.images.map;
  strategyWalls.forEach((key) => {
    const [x, y] = key.split(",").map(Number);
    const px = offsetX + x * STRATEGY_TILE;
    const py = offsetY + y * STRATEGY_TILE;
    if (mapTexture) {
      ctx.drawImage(mapTexture, px + 2, py + 2, STRATEGY_TILE - 4, STRATEGY_TILE - 4);
      ctx.fillStyle = biome.wallTint;
      ctx.fillRect(px + 2, py + 2, STRATEGY_TILE - 4, STRATEGY_TILE - 4);
    } else {
      ctx.fillStyle = "#2f4657";
      ctx.fillRect(px + 6, py + 6, STRATEGY_TILE - 12, STRATEGY_TILE - 12);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.strokeRect(px + 3, py + 3, STRATEGY_TILE - 6, STRATEGY_TILE - 6);
  });

  strategyDoors.forEach((key) => {
    const [x, y] = key.split(",").map(Number);
    const px = offsetX + x * STRATEGY_TILE;
    const py = offsetY + y * STRATEGY_TILE;
    const movingClosed = level && level.biomeName === "Castillo" && strategyMovingDoorActive.has(key);
    const canOpen = strategyHasKey && !movingClosed;
    ctx.fillStyle = canOpen ? biome.doorOpen : biome.doorLocked;
    ctx.fillRect(px + 9, py + 8, STRATEGY_TILE - 18, STRATEGY_TILE - 16);
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(px + 12, py + 11, STRATEGY_TILE - 24, STRATEGY_TILE - 22);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.strokeRect(px + 9, py + 8, STRATEGY_TILE - 18, STRATEGY_TILE - 16);
    if (movingClosed) {
      ctx.strokeStyle = "rgba(255, 90, 90, 0.65)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px + 12, py + 11);
      ctx.lineTo(px + STRATEGY_TILE - 12, py + STRATEGY_TILE - 11);
      ctx.moveTo(px + STRATEGY_TILE - 12, py + 11);
      ctx.lineTo(px + 12, py + STRATEGY_TILE - 11);
      ctx.stroke();
    }
  });

  if (level && level.biomeName === "Volcan") {
    strategyHotActive.forEach((hotKey) => {
      const [x, y] = hotKey.split(",").map(Number);
      const px = offsetX + x * STRATEGY_TILE;
      const py = offsetY + y * STRATEGY_TILE;
      const pulse = 0.25 + (Math.sin(strategyAnimTime * 0.02 + x + y) + 1) * 0.17;
      ctx.fillStyle = `rgba(255, 90, 40, ${pulse.toFixed(3)})`;
      ctx.fillRect(px + 5, py + 5, STRATEGY_TILE - 10, STRATEGY_TILE - 10);
      ctx.strokeStyle = "rgba(255, 170, 80, 0.45)";
      ctx.strokeRect(px + 7, py + 7, STRATEGY_TILE - 14, STRATEGY_TILE - 14);
    });
  }

  strategyEnemies.forEach((enemy) => {
    if (!enemy.isMiniBoss) return;
    const zones = [
      { x: enemy.x, y: enemy.y },
      { x: enemy.x + 1, y: enemy.y },
      { x: enemy.x - 1, y: enemy.y },
      { x: enemy.x, y: enemy.y + 1 },
      { x: enemy.x, y: enemy.y - 1 },
    ];
    zones.forEach((cell) => {
      if (cell.x < 0 || cell.y < 0 || cell.x >= STRATEGY_COLS || cell.y >= STRATEGY_ROWS) return;
      const px = offsetX + cell.x * STRATEGY_TILE;
      const py = offsetY + cell.y * STRATEGY_TILE;
      ctx.fillStyle = biome.bossZone;
      ctx.fillRect(px + 4, py + 4, STRATEGY_TILE - 8, STRATEGY_TILE - 8);
    });
  });

  const goalImg = assets.images.goal;
  if (strategyCollected >= strategyTotalGems) {
    const px = offsetX + strategyPortal.x * STRATEGY_TILE + STRATEGY_TILE / 2;
    const py = offsetY + strategyPortal.y * STRATEGY_TILE + STRATEGY_TILE / 2;
    if (goalImg) {
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.drawImage(goalImg, px - 16, py - 20, 32, 40);
      ctx.restore();
    }
    ctx.strokeStyle = "rgba(116,240,168,0.95)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(px, py, 18, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const px = offsetX + strategyPortal.x * STRATEGY_TILE + STRATEGY_TILE / 2;
    const py = offsetY + strategyPortal.y * STRATEGY_TILE + STRATEGY_TILE / 2;
    if (goalImg) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.drawImage(goalImg, px - 14, py - 18, 28, 36);
      ctx.restore();
    }
    ctx.fillStyle = "rgba(95,111,130,0.85)";
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  if (level && level.key && !strategyHasKey) {
    const px = offsetX + level.key.x * STRATEGY_TILE + STRATEGY_TILE / 2;
    const py = offsetY + level.key.y * STRATEGY_TILE + STRATEGY_TILE / 2;
    const keyImg = assets.images.llave || assets.images.weapon_pistol_icon || assets.images.weapon_sword_icon;
    if (keyImg) {
      ctx.drawImage(keyImg, px - 12, py - 12, 24, 24);
    } else {
      ctx.fillStyle = "#ffd36c";
      ctx.fillRect(px - 10, py - 4, 20, 8);
      ctx.beginPath();
      ctx.arc(px + 10, py, 6, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffd36c";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  const crystalFrames = [assets.images.crystal_a, assets.images.crystal_b, assets.images.crystal_a, assets.images.crystal_b];
  const coinFrames = [assets.images.coin1, assets.images.coin2, assets.images.coin3, assets.images.coin4];
  const frames = crystalFrames.every(Boolean) ? crystalFrames : coinFrames;
  const gemFrame = frames[coinFrame] || frames[0];
  strategyGems.forEach((gem) => {
    const px = offsetX + gem.x * STRATEGY_TILE + 12;
    const py = offsetY + gem.y * STRATEGY_TILE + 12;
    if (gemFrame) {
      ctx.drawImage(gemFrame, px, py, 32, 32);
    } else {
      ctx.fillStyle = "#6bd1ff";
      ctx.beginPath();
      ctx.arc(px + 16, py + 16, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  if (strategyPowerup && strategyPowerup.active) {
    const px = offsetX + strategyPowerup.x * STRATEGY_TILE + 12;
    const py = offsetY + strategyPowerup.y * STRATEGY_TILE + 12;
    const orbImg = assets.images.orbe || assets.images.crystal_b || assets.images.crystal_a;
    const pulse = 0.65 + (Math.sin(strategyAnimTime * 0.014) + 1) * 0.2;
    ctx.save();
    ctx.globalAlpha = pulse;
    if (orbImg) {
      ctx.drawImage(orbImg, px, py, 32, 32);
    } else {
      ctx.fillStyle = "rgba(210,120,255,0.85)";
      ctx.beginPath();
      ctx.arc(px + 16, py + 16, 11, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.strokeStyle = "rgba(220,150,255,0.75)";
    ctx.strokeRect(px - 2, py - 2, 36, 36);
  }

  const enemyImg = assets.images.enemy;
  const shadowImg = assets.images.shadow;
  strategyEnemies.forEach((enemy) => {
    const bob = Math.sin(strategyAnimTime * 0.012 + enemy.rx + enemy.ry) * (enemy.isMiniBoss ? 3.5 : 2);
    const squash = Math.max(0.9, 1 - Math.abs(enemy.x - enemy.rx) * 0.06);
    const px = offsetX + enemy.rx * STRATEGY_TILE + 8;
    const py = offsetY + enemy.ry * STRATEGY_TILE + 6 + bob;
    const spriteW = enemy.isMiniBoss ? 48 : 40;
    const spriteH = enemy.isMiniBoss ? 52 : 44;
    if (shadowImg) ctx.drawImage(shadowImg, px + 6, py + 30, enemy.isMiniBoss ? 40 : 34, enemy.isMiniBoss ? 16 : 14);
    if (enemyImg) {
      ctx.save();
      ctx.translate(px + spriteW / 2, py + spriteH / 2);
      ctx.scale(enemy.facing < 0 ? -1 : 1, squash);
      ctx.drawImage(enemyImg, -spriteW / 2, -spriteH / 2, spriteW, spriteH);
      ctx.restore();
      if (enemy.isMiniBoss) {
        ctx.strokeStyle = "rgba(255,120,120,0.95)";
        ctx.lineWidth = 2;
        ctx.strokeRect(px - 1, py - 1, spriteW + 2, spriteH + 2);
      }
      if (enemy.stunnedTurns && enemy.stunnedTurns > 0) {
        ctx.fillStyle = "rgba(135,220,255,0.9)";
        ctx.font = "12px BakeSoda, sans-serif";
        ctx.fillText("STUN", px + 2, py - 4);
      }
    } else {
      ctx.fillStyle = "#ff7c7c";
      ctx.beginPath();
      ctx.arc(px + 20, py + 24, enemy.isMiniBoss ? 18 : 14, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  const playerImg = assets.images[selectedPlayer] || assets.images.player1;
  const playerBob = Math.sin(strategyAnimTime * 0.014) * 2;
  const playerSquash = Math.max(0.92, 1 - Math.abs(strategyPlayer.x - strategyPlayerRender.x) * 0.07);
  const playerPx = offsetX + strategyPlayerRender.x * STRATEGY_TILE + 8;
  const playerPy = offsetY + strategyPlayerRender.y * STRATEGY_TILE + 6 + playerBob;
  if (shadowImg) ctx.drawImage(shadowImg, playerPx + 6, playerPy + 28, 34, 14);
  if (playerImg) {
    ctx.save();
    ctx.translate(playerPx + 20, playerPy + 22);
    ctx.scale(strategyPlayerFacing < 0 ? -1 : 1, playerSquash);
    ctx.drawImage(playerImg, -20, -22, 40, 44);
    ctx.restore();
  } else {
    ctx.fillStyle = "#f6c945";
    ctx.beginPath();
    ctx.arc(playerPx + 20, playerPy + 22, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  const playerCenterX = playerPx + 20;
  const playerCenterY = playerPy + 22;

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "18px BakeSoda, sans-serif";
  const label = level ? level.name : "Mundo";
  const tierLabel = level ? level.tier.toUpperCase() : "";
  ctx.fillText(`${label} (${strategyWorldIndex + 1}/${strategyLevels.length}) [${tierLabel}]`, offsetX, offsetY - 12);

  if (biome.ambient === "fireflies") {
    for (let i = 0; i < 16; i += 1) {
      const x = (i * 83 + strategyAnimTime * 0.02) % canvas.width;
      const y = (i * 47 + Math.sin(strategyAnimTime * 0.001 + i) * 18 + 40) % canvas.height;
      ctx.fillStyle = "rgba(248, 240, 150, 0.45)";
      ctx.fillRect(x, y, 2, 2);
    }
  } else if (biome.ambient === "dust" || biome.ambient === "sand") {
    const color = biome.ambient === "dust" ? "rgba(210,220,235,0.13)" : "rgba(240,200,140,0.14)";
    for (let i = 0; i < 36; i += 1) {
      const x = (i * 59 + strategyAnimTime * 0.03) % canvas.width;
      const y = (i * 31 + strategyAnimTime * 0.006) % canvas.height;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  } else if (biome.ambient === "embers") {
    for (let i = 0; i < 28; i += 1) {
      const x = (i * 44 + strategyAnimTime * 0.025) % canvas.width;
      const y = canvas.height - ((i * 21 + strategyAnimTime * 0.01) % canvas.height);
      ctx.fillStyle = "rgba(255,120,80,0.28)";
      ctx.fillRect(x, y, 2, 2);
    }
  } else if (biome.ambient === "rain") {
    ctx.strokeStyle = "rgba(170, 190, 230, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 42; i += 1) {
      const x = (i * 37 + strategyAnimTime * 0.06) % canvas.width;
      const y = (i * 19 + strategyAnimTime * 0.04) % canvas.height;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 4, y + 10);
      ctx.stroke();
    }
  }

  if (level && level.biomeName === "Cuevas") {
    ctx.save();
    ctx.fillStyle = "rgba(4, 7, 12, 0.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "destination-out";
    const baseRadius = level.caveVisionRadius || 130;
    const radius = baseRadius + Math.sin(strategyAnimTime * 0.01) * 8;
    const light = ctx.createRadialGradient(playerCenterX, playerCenterY, 30, playerCenterX, playerCenterY, radius);
    light.addColorStop(0, "rgba(0,0,0,1)");
    light.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.arc(playerCenterX, playerCenterY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function update(delta) {
  updateSessionClock(delta);

  if (activeGame === "strategy") {
    if (gameState !== "playing") return;
    strategyAnimTime += delta;
    coinTimer += delta;
    if (coinTimer > 150) {
      coinFrame = (coinFrame + 1) % 4;
      coinTimer = 0;
    }
    strategyMoveCooldown = Math.max(0, strategyMoveCooldown - delta);
    strategyPlayerRender.x += (strategyPlayer.x - strategyPlayerRender.x) * STRATEGY_ANIM_SMOOTH;
    strategyPlayerRender.y += (strategyPlayer.y - strategyPlayerRender.y) * STRATEGY_ANIM_SMOOTH;
    strategyEnemies.forEach((enemy) => {
      enemy.rx += (enemy.x - enemy.rx) * STRATEGY_ANIM_SMOOTH;
      enemy.ry += (enemy.y - enemy.ry) * STRATEGY_ANIM_SMOOTH;
    });
    return;
  }

  const level = levels[currentLevelIndex];
  attackCooldown = Math.max(0, attackCooldown - delta);
  attackTimer = Math.max(0, attackTimer - delta);
  dashCooldown = Math.max(0, dashCooldown - delta);
  dashTime = Math.max(0, dashTime - delta);
  whipCooldown = Math.max(0, whipCooldown - delta);
  whipVisualTimer = Math.max(0, whipVisualTimer - delta);
  if (whipVisualTimer <= 0) whipTarget = null;
  heldItemTimer = Math.max(0, heldItemTimer - delta);
  speedBoostTimer = Math.max(0, speedBoostTimer - delta);
  if (gameState !== "playing") {
    heldItemTimer = 0;
    attackTimer = 0;
    whipVisualTimer = 0;
    whipTarget = null;
    return;
  }
  updatePlayer(level);
  updateEnemies(level, delta);
  updateRandomEnemySpawns(level, delta);
  updateProjectiles(level);
  updateEnemyProjectiles(level);
  updateHitEffects(delta);
  updateDashTrail(delta);
  checkCoins(level);
  checkEnemies(level);
  checkGoal(level);
  updateCamera(level);
  updateHudForPlatform();

  coinTimer += delta;
  if (coinTimer > 160) {
    coinFrame = (coinFrame + 1) % 4;
    coinTimer = 0;
  }
}

function render() {
  if (activeGame === "strategy") {
    drawStrategy();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const level = levels[currentLevelIndex];
  drawBackground(level);
  drawPlatforms(level);
  drawCoins(level);
  drawGoal(level);
  drawEnemies(level);
  drawProjectiles();
  drawEnemyProjectiles();
  drawHitEffects();
  drawDashTrail();
  drawWhipEffect();
  drawPlayer();
}

function loop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;
  update(delta);
  render();
  requestAnimationFrame(loop);
}

function handleChallengeKeyDown(e) {
  if (gameState !== "challenge") return false;
  const level = levels[currentLevelIndex];
  const challenge = getCurrentChallenge(level);
  if (!challenge || challenge.type !== "keysequence") return false;

  const expected = normalizeExpectedSequence(challenge.expectedKeys);
  const token = keyCodeToSequenceToken(e.code);

  if (e.code === "Backspace") {
    selectedKeySequence.pop();
    renderKeySequenceProgress(expected);
    e.preventDefault();
    return true;
  }

  if (!token) return false;
  e.preventDefault();

  if (selectedKeySequence.length >= expected.length) {
    selectedKeySequence = [];
  }
  selectedKeySequence.push(token);
  renderKeySequenceProgress(expected);

  const typedIndex = selectedKeySequence.length - 1;
  if (expected[typedIndex] !== token) {
    challengeHint.textContent = challenge.hint || "Esa tecla no corresponde.";
    return true;
  }

  challengeHint.textContent = "Buen paso, sigue la secuencia.";
  if (selectedKeySequence.length === expected.length) {
    checkChallengeAnswer();
  }
  return true;
}

function handleStrategyKeyDown(e) {
  if (activeGame !== "strategy" || gameState !== "playing") return false;
  if (e.code === "KeyX") {
    activateStrategyPowerup();
    e.preventDefault();
    return true;
  }
  if (e.code === "ArrowLeft" || e.code === "KeyA") {
    tryStrategyMove(-1, 0);
    e.preventDefault();
    return true;
  }
  if (e.code === "ArrowRight" || e.code === "KeyD") {
    tryStrategyMove(1, 0);
    e.preventDefault();
    return true;
  }
  if (e.code === "ArrowUp" || e.code === "KeyW") {
    tryStrategyMove(0, -1);
    e.preventDefault();
    return true;
  }
  if (e.code === "ArrowDown" || e.code === "KeyS") {
    tryStrategyMove(0, 1);
    e.preventDefault();
    return true;
  }
  return false;
}

function handleKey(e, isDown) {
  if (gameState !== "playing") return;
  if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = isDown;
  if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = isDown;
  if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") {
    keys.jump = isDown;
    if (isDown) e.preventDefault();
  }
  if (e.code === "KeyF" || e.code === "KeyJ") {
    keys.attack = isDown;
    if (isDown) attemptAttack();
  }
  if (e.code === "KeyE" && isDown) {
    cycleWeapon();
  }
  if ((e.code === "ShiftLeft" || e.code === "ShiftRight") && isDown) {
    attemptDash();
  }
  if (e.code === "KeyQ" && isDown) {
    attemptWhipCollect();
  }
}

function resetKeys() {
  keys.left = false;
  keys.right = false;
  keys.jump = false;
  keys.attack = false;
}

window.addEventListener("keydown", (e) => {
  if (handleChallengeKeyDown(e)) return;
  if (handleStrategyKeyDown(e)) return;
  handleKey(e, true);
});
window.addEventListener("keyup", (e) => handleKey(e, false));
window.addEventListener("blur", resetKeys);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) resetKeys();
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  playSound("click");
  btn.classList.add("btnFlash");
  setTimeout(() => btn.classList.remove("btnFlash"), 140);
});

startBtn.addEventListener("click", () => {
  if (selectedGameType === "strategy") {
    startStrategyGame();
  } else if (selectedGameType === "adventure_builder") {
    window.location.href = "builder.html";
  } else {
    startGame();
  }
});

modeBasicBtn.addEventListener("click", () => setMode("basic"));
modeIntermediateBtn.addEventListener("click", () => setMode("intermediate"));

restartBtn.addEventListener("click", () => {
  winScreen.classList.remove("show");
  if (activeGame === "strategy") {
    startStrategyGame();
  } else if (activeGame === "adventure") {
    startAdventureGame();
  } else {
    startGame();
  }
});

gameTypePlatformBtn.addEventListener("click", () => {
  setSelectedGameType("platform");
});

gameTypeStrategyBtn.addEventListener("click", () => {
  setSelectedGameType("strategy");
});

if (gameTypeAdventureBtn) {
  gameTypeAdventureBtn.addEventListener("click", () => {
    setSelectedGameType("adventure_builder");
  });
}

if (menuPlatformBtn) {
  menuPlatformBtn.addEventListener("click", () => {
    openStartMenuFor("platform");
  });
}

if (menuStrategyBtn) {
  menuStrategyBtn.addEventListener("click", () => {
    openStartMenuFor("strategy");
  });
}

if (menuAdventureBtn) {
  menuAdventureBtn.addEventListener("click", () => {
    setSelectedGameType("adventure_builder");
    window.location.href = "builder.html";
  });
}

if (fullscreenToggleBtn) {
  fullscreenToggleBtn.addEventListener("click", () => {
    toggleFullscreen();
  });
}

document.addEventListener("fullscreenchange", () => {
  syncFullscreenUiState();
  updateFullscreenButtonLabel();
});

checkAnswer.addEventListener("click", checkChallengeAnswer);

challengeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkChallengeAnswer();
});

debugInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkChallengeAnswer();
});

closeChallenge.addEventListener("click", () => {
  closeChallengeModal();
});

if (speakLesson) {
  speakLesson.addEventListener("click", () => {
    const level = levels[currentLevelIndex];
    const challenge = getCurrentChallenge(level);
    if (!challenge) return;
    const lessonText = [challenge.topicTitle, challenge.topicText].filter(Boolean).join(". ");
    speak(lessonText || "No hay tema disponible para este nivel.");
  });
}

speakChallenge.addEventListener("click", () => {
  const level = levels[currentLevelIndex];
  const challenge = getCurrentChallenge(level);
  if (!challenge) return;
  speak(getChallengeSpeechText(challenge));
});

showHint.addEventListener("click", () => {
  const level = levels[currentLevelIndex];
  const challenge = getCurrentChallenge(level);
  challengeHint.textContent = challenge.hint || "Sin pista.";
});

function renderPlayerSelect() {
  const options = [
    { id: "player1", label: "Jugador 1", file: "Player_1.png" },
    { id: "player2", label: "Jugador 2", file: "Player_2.png" },
    { id: "player4", label: "Jugador 4", file: "Player_4.png" },
    { id: "player5", label: "Jugador 5", file: "Player_5.png" },
  ];
  playerSelect.innerHTML = "";
  options.forEach((option) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "playerCard";
    const img = document.createElement("img");
    img.src = `sprites/Players/${option.file}`;
    img.alt = option.label;
    card.appendChild(img);
    card.addEventListener("click", () => {
      selectedPlayer = option.id;
      localStorage.setItem("plataformas_player", selectedPlayer);
      [...playerSelect.children].forEach((child) => child.classList.remove("selected"));
      card.classList.add("selected");
    });
    if (option.id === selectedPlayer) card.classList.add("selected");
    playerSelect.appendChild(card);
  });
}

function renderLevelSelect() {
  if (!levelSelect) return;
  levelSelect.innerHTML = "";
  levels.forEach((level, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "levelBtn";
    btn.textContent = String(index + 1);
    btn.title = level.name;
    if (index === selectedStartLevel) btn.classList.add("selected");
    btn.addEventListener("click", () => {
      selectedStartLevel = index;
      localStorage.setItem("plataformas_start_level", String(selectedStartLevel));
      [...levelSelect.children].forEach((child) => child.classList.remove("selected"));
      btn.classList.add("selected");
    });
    levelSelect.appendChild(btn);
  });
}

function updateModeUI() {
  modeBasicBtn.classList.toggle("selected", currentMode === "basic");
  modeIntermediateBtn.classList.toggle("selected", currentMode === "intermediate");
}

function setMode(mode) {
  currentMode = normalizeMode(mode);
  localStorage.setItem("plataformas_mode", currentMode);
  updateModeUI();
}

function exportLevels() {
  return levels.map((level) => ({
    name: level.name,
    width: level.width,
    spawn: level.spawn,
    goal: level.goal,
    platforms: level.platforms,
    coins: level.initialCoins,
    enemies: level.initialEnemies,
    challenge: level.challenge,
  }));
}

function setEditorStatus(message) {
  if (!editor.status) return;
  editor.status.textContent = message;
}

if (editor.loadBtn && editor.text) {
  editor.loadBtn.addEventListener("click", () => {
    editor.text.value = JSON.stringify(exportLevels(), null, 2);
    setEditorStatus("Niveles cargados en el editor.");
  });
}

if (editor.applyBtn && editor.text) {
  editor.applyBtn.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(editor.text.value);
      if (!Array.isArray(parsed)) {
        setEditorStatus("El JSON debe ser una lista de niveles.");
        return;
      }
      setLevels(parsed, { save: true });
      setEditorStatus("Cambios aplicados. Pulsa Jugar para probar.");
    } catch (err) {
      setEditorStatus("JSON invalido. Revisa comas y llaves.");
    }
  });
}

if (editor.resetBtn && editor.text) {
  editor.resetBtn.addEventListener("click", () => {
    setLevels(defaultLevels, { save: true });
    editor.text.value = JSON.stringify(exportLevels(), null, 2);
    setEditorStatus("Se restauraron los niveles por defecto.");
  });
}

if (adventureBuilder.playBtn) {
  adventureBuilder.playBtn.addEventListener("click", async () => {
    if (!builderState.canPlay) {
      setBuilderRunLog("Primero ejecuta y valida el ejercicio para habilitar el juego.", "error");
      return;
    }
    const pack = await generateAdventurePackFromBlockly();
    if (!pack) return;
    selectedGameType = "adventure_builder";
    localStorage.setItem("plataformas_game_type", selectedGameType);
    updateGameTypeUI();
    startAdventureGame();
  });
}

window.addEventListener("resize", () => {
  if (blocklyWorkspace && window.Blockly) {
    window.Blockly.svgResize(blocklyWorkspace);
  }
});

initAudio();

const storedLevels = loadLevelsFromStorage();
const mergedLevels = mergeStoredLevels(storedLevels, defaultLevels);
const storedPlayer = localStorage.getItem("plataformas_player");
if (storedPlayer) selectedPlayer = storedPlayer;
const storedMode = localStorage.getItem("plataformas_mode");
currentMode = normalizeMode(storedMode);
if (storedMode !== currentMode) {
  localStorage.setItem("plataformas_mode", currentMode);
}
const storedGameType = localStorage.getItem("plataformas_game_type");
selectedGameType =
  storedGameType === "strategy"
    ? "strategy"
    : storedGameType === "adventure_builder" || storedGameType === "adventure"
      ? "adventure_builder"
      : "platform";
const storedStartLevel = localStorage.getItem("plataformas_start_level");
if (storedStartLevel && !Number.isNaN(Number(storedStartLevel))) {
  selectedStartLevel = Math.max(0, Number(storedStartLevel));
}
const storedWeapons = localStorage.getItem("plataformas_weapons");
if (storedWeapons) {
  try {
    const parsed = JSON.parse(storedWeapons);
    if (Array.isArray(parsed)) {
      parsed.forEach((id) => {
        if (weapons[id]) unlockedWeapons.add(id);
      });
    }
  } catch {}
}
const storedCurrentWeapon = localStorage.getItem("plataformas_current_weapon");
if (storedCurrentWeapon && unlockedWeapons.has(storedCurrentWeapon)) {
  currentWeapon = weapons[storedCurrentWeapon];
}
ensurePlatformProfileSeed();
parseStrategyLevels();
setLevels(mergedLevels.levels || defaultLevels, { save: mergedLevels.changed || !levelsStorageValid });
if (editor.text) {
  editor.text.value = JSON.stringify(exportLevels(), null, 2);
}

loadAssets().then(() => {
  renderPlayerSelect();
  renderLevelSelect();
  syncFullscreenUiState();
  updateFullscreenButtonLabel();
  updateWeaponHud();
  updateModeUI();
  updateGameTypeUI();
  updateNotes();
  initBuilderUI();
  initAdventureBlockly();
  requestAnimationFrame(loop);
});
