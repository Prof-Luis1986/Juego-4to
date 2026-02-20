const stage = document.getElementById("stage");
const ctx = stage.getContext("2d");
const sessionTimeEl = document.getElementById("sessionTime");
const pointsText = document.getElementById("pointsText");
const missionNumber = document.getElementById("missionNumber");
const builderFullscreenBtn = document.getElementById("builderFullscreenBtn");
const missionTitle = document.getElementById("missionTitle");
const missionInstruction = document.getElementById("missionInstruction");
const missionStory = document.getElementById("missionStory");
const missionChecklist = document.getElementById("missionChecklist");
const missionCard = document.getElementById("missionCard");
const cursorHelp = document.getElementById("cursorHelp");
const paintTools = document.getElementById("paintTools");
const flashChallenge = document.getElementById("flashChallenge");
const streakText = document.getElementById("streakText");
const coachText = document.getElementById("coachText");
const avatarSelect = document.getElementById("avatarSelect");
const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseText = document.getElementById("surpriseText");
const builderLevelText = document.getElementById("builderLevelText");
const levelFill = document.getElementById("levelFill");
const badgeBuilder = document.getElementById("badgeBuilder");
const badgeExplorer = document.getElementById("badgeExplorer");
const badgeHero = document.getElementById("badgeHero");
const cursorLeftBtn = document.getElementById("cursorLeftBtn");
const cursorUpBtn = document.getElementById("cursorUpBtn");
const cursorDownBtn = document.getElementById("cursorDownBtn");
const cursorRightBtn = document.getElementById("cursorRightBtn");
const bgThemeSelect = document.getElementById("bgThemeSelect");
const enemyModeSelect = document.getElementById("enemyModeSelect");
const enemySpeedSelect = document.getElementById("enemySpeedSelect");
const musicToggle = document.getElementById("musicToggle");
const sfxToggle = document.getElementById("sfxToggle");
const feedbackText = document.getElementById("feedbackText");
const guideTextEl = document.getElementById("guideText");
const guideSpeakBtn = document.getElementById("guideSpeakBtn");
const guideStopBtn = document.getElementById("guideStopBtn");
const guideRepeatBtn = document.getElementById("guideRepeatBtn");
const autoNarration = document.getElementById("autoNarration");
const palette = document.getElementById("blockPalette");
const programArea = document.getElementById("programArea");
const hintBtn = document.getElementById("hintBtn");
const runBtn = document.getElementById("runBtn");
const stepBtn = document.getElementById("stepBtn");
const resetBtn = document.getElementById("resetBtn");
const nextMissionBtn = document.getElementById("nextMissionBtn");
const clearProgramBtn = document.getElementById("clearProgramBtn");
const playWorldBtn = document.getElementById("playWorldBtn");

const cols = 10;
const rows = 10;
const cell = 42;
const TILE = {
  EMPTY: "empty",
  PLATFORM: "platform",
  COIN: "coin",
  ENEMY: "enemy",
  START: "start",
  GOAL: "goal",
  SPIKE: "spike",
  BOOST: "boost",
  WATER: "water",
  EARTH: "earth",
  FIRE: "fire",
  OBSTACLE: "obstacle",
};

const blockDefs = [
  { id: "set_start", label: "poner inicio", cat: "inicio", cmd: { type: "place", tile: TILE.START } },
  { id: "set_goal", label: "poner meta", cat: "inicio", cmd: { type: "place", tile: TILE.GOAL } },
  { id: "right", label: "mover derecha", cat: "mov", cmd: { type: "move", dx: 1, dy: 0 } },
  { id: "left", label: "mover izquierda", cat: "mov", cmd: { type: "move", dx: -1, dy: 0 } },
  { id: "up", label: "mover arriba", cat: "mov", cmd: { type: "move", dx: 0, dy: -1 } },
  { id: "down", label: "mover abajo", cat: "mov", cmd: { type: "move", dx: 0, dy: 1 } },
  { id: "platform", label: "colocar plataforma", cat: "build", cmd: { type: "place", tile: TILE.PLATFORM } },
  { id: "coin", label: "colocar moneda", cat: "build", cmd: { type: "place", tile: TILE.COIN } },
  { id: "enemy", label: "colocar enemigo", cat: "build", cmd: { type: "place", tile: TILE.ENEMY } },
  { id: "spike", label: "colocar trampa", cat: "build", cmd: { type: "place", tile: TILE.SPIKE } },
  { id: "boost", label: "colocar turbo", cat: "build", cmd: { type: "place", tile: TILE.BOOST } },
  { id: "water", label: "colocar agua", cat: "build", cmd: { type: "place", tile: TILE.WATER } },
  { id: "earth", label: "colocar tierra", cat: "build", cmd: { type: "place", tile: TILE.EARTH } },
  { id: "fire", label: "colocar fuego", cat: "build", cmd: { type: "place", tile: TILE.FIRE } },
  { id: "obstacle", label: "colocar obstáculo", cat: "build", cmd: { type: "place", tile: TILE.OBSTACLE } },
  { id: "clean", label: "limpiar obstáculo", cat: "build", cmd: { type: "clean" } },
  { id: "erase", label: "borrar", cat: "build", cmd: { type: "erase" } },
  { id: "repeat2", label: "repetir x2", cat: "ctrl", cmd: { type: "repeat", times: 2 } },
];

const quickTools = [
  { id: "tool_cursor", label: "Mover cursor", cursor: true },
  { id: "tool_platform", label: "Plataforma", tile: TILE.PLATFORM },
  { id: "tool_coin", label: "Moneda", tile: TILE.COIN },
  { id: "tool_enemy", label: "Enemigo", tile: TILE.ENEMY },
  { id: "tool_spike", label: "Trampa", tile: TILE.SPIKE },
  { id: "tool_boost", label: "Turbo", tile: TILE.BOOST },
  { id: "tool_water", label: "Agua", tile: TILE.WATER },
  { id: "tool_earth", label: "Tierra", tile: TILE.EARTH },
  { id: "tool_fire", label: "Fuego", tile: TILE.FIRE },
  { id: "tool_obstacle", label: "Obstáculo", tile: TILE.OBSTACLE },
  { id: "tool_clean", label: "Limpiar", clean: true },
  { id: "tool_start", label: "Inicio", tile: TILE.START },
  { id: "tool_goal", label: "Meta", tile: TILE.GOAL },
  { id: "tool_erase", label: "Borrar", tile: TILE.EMPTY, erase: true },
];

const missions = [
  {
    title: "Misión 1: Crea un camino",
    instruction: "Pon inicio, meta y mínimo 4 plataformas conectadas para formar camino.",
    hint: "Haz: inicio, mover, plataforma, mover, plataforma... y al final meta.",
    validate: (g) => countTile(g, TILE.START) >= 1 && countTile(g, TILE.GOAL) >= 1 && countTile(g, TILE.PLATFORM) >= 4,
  },
  {
    title: "Misión 2: Monedas",
    instruction: "Agrega 3 monedas sin borrar inicio y meta.",
    hint: "Primero crea el camino y luego coloca monedas.",
    validate: (g) => countTile(g, TILE.COIN) >= 3 && countTile(g, TILE.START) === 1 && countTile(g, TILE.GOAL) === 1,
  },
  {
    title: "Misión 3: Un enemigo",
    instruction: "Construye un camino seguro y coloca 1 enemigo.",
    hint: "No pongas el enemigo encima del inicio.",
    validate: (g) => countTile(g, TILE.ENEMY) >= 1 && hasPath(g),
  },
  {
    title: "Misión 4: Constructor experto",
    instruction: "Usa repetir x2 al menos una vez y completa camino.",
    hint: "Agrega repetir x2 antes de dos movimientos iguales.",
    validate: (g, p) => p.some((c) => c.type === "repeat") && hasPath(g),
  },
  {
    title: "Misión 5: Puente largo",
    instruction: "Crea un camino largo con 6 plataformas.",
    hint: "Avanza y coloca varias plataformas seguidas.",
    validate: (g) => countTile(g, TILE.PLATFORM) >= 6 && hasPath(g),
  },
  {
    title: "Misión 6: Recolector",
    instruction: "Coloca 5 monedas.",
    hint: "Puedes distribuirlas en diferentes filas.",
    validate: (g) => countTile(g, TILE.COIN) >= 5,
  },
  {
    title: "Misión 7: Superviviente",
    instruction: "Coloca 2 enemigos y mantén camino válido.",
    hint: "Los enemigos deben estar fuera de la ruta principal.",
    validate: (g) => countTile(g, TILE.ENEMY) >= 2 && hasPath(g),
  },
  {
    title: "Misión 8: Gran final",
    instruction: "Tu mejor mundo: camino válido, 6 plataformas, 4 monedas y 2 enemigos.",
    hint: "Construye por partes: camino, monedas y al final enemigos.",
    validate: (g) =>
      hasPath(g) &&
      countTile(g, TILE.PLATFORM) >= 6 &&
      countTile(g, TILE.COIN) >= 4 &&
      countTile(g, TILE.ENEMY) >= 2,
  },
  {
    title: "Misión 9 ODS 6: Agua limpia",
    instruction: "Coloca 3 bloques de agua y mantiene camino válido.",
    hint: "Agrega agua en diferentes casillas sin romper tu camino.",
    validate: (g) => countTile(g, TILE.WATER) >= 3 && hasPath(g),
  },
  {
    title: "Misión 10 ODS 15: Cuidar la tierra",
    instruction: "Coloca 3 bloques de tierra y 1 de fuego en zona segura.",
    hint: "Usa tierra como zona verde y fuego lejos del inicio.",
    validate: (g) => countTile(g, TILE.EARTH) >= 3 && countTile(g, TILE.FIRE) >= 1 && hasPath(g),
  },
  {
    title: "Misión 11 ODS 13: Limpieza",
    instruction: "Usa limpiar obstáculo al menos 1 vez y deja el camino libre.",
    hint: "Coloca obstáculo y luego usa limpiar sobre esa casilla.",
    validate: (g, p) => p.some((c) => c.type === "clean" || c.type === "clean_at") && countTile(g, TILE.OBSTACLE) === 0 && hasPath(g),
  },
  {
    title: "Misión 12 ODS Final",
    instruction: "Combina agua+tierra+fuego y limpia obstáculos. Debe existir camino.",
    hint: "Meta final: 2 agua, 2 tierra, 1 fuego, sin obstáculos y con camino.",
    validate: (g) =>
      countTile(g, TILE.WATER) >= 2 &&
      countTile(g, TILE.EARTH) >= 2 &&
      countTile(g, TILE.FIRE) >= 1 &&
      countTile(g, TILE.OBSTACLE) === 0 &&
      hasPath(g),
  },
];

const state = {
  grid: createGrid(),
  cursor: { x: 1, y: 8 },
  program: [],
  points: 0,
  mission: 0,
  elapsed: 0,
  running: false,
  lastGuideText: "",
  hero: null,
  manualPlay: false,
  paintTool: "tool_platform",
  streak: 0,
  flash: null,
  flashProgress: 0,
  enemies: [],
  settings: {
    bgTheme: "sky",
    enemyMode: "static",
    enemySpeed: 1,
    musicOn: true,
    sfxOn: true,
  },
  surpriseReadyAt: 0,
  badges: {
    builder: false,
    explorer: false,
    hero: false,
  },
  seenThemes: new Set(["sky"]),
};

const assets = { images: {}, sounds: {} };
const heroFrames = [
  "sprites/Players/Player_1.png",
  "sprites/Players/Player_2.png",
  "sprites/Players/Player_4.png",
  "sprites/Players/Player_5.png",
];
const coachLines = [
  "Coach: ¡Excelente! Sigue construyendo.",
  "Coach: Buen trabajo, ahora agrega algo sorpresa.",
  "Coach: Tu mundo ya se ve poderoso.",
  "Coach: ¡Gran idea! Prueba Ejecutar para verlo cobrar vida.",
  "Coach: Vas muy bien, constructor estrella.",
];

function createGrid() {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => TILE.EMPTY));
}

function countTile(grid, tile) {
  return grid.flat().filter((x) => x === tile).length;
}

function hasMoveCommand(program) {
  return program.some((cmd) => cmd.type === "move" || cmd.type === "repeat");
}

function usesDirectPlacement(program) {
  return program.some((cmd) => cmd.type === "place_at" || cmd.type === "erase_at");
}

function playSound(name) {
  if (!state.settings.sfxOn && name !== "bg") return;
  const s = assets.sounds[name];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
}

function updateBuilderFullscreenLabel() {
  if (!builderFullscreenBtn) return;
  builderFullscreenBtn.textContent = document.fullscreenElement ? "Salir pantalla completa" : "Pantalla completa";
}

function syncBuilderFullscreenUiState() {
  const active = !!document.fullscreenElement;
  document.body.classList.toggle("fullscreen-active", active);
}

async function toggleBuilderFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    setFeedback("No se pudo activar pantalla completa.", "bad");
  } finally {
    syncBuilderFullscreenUiState();
    updateBuilderFullscreenLabel();
  }
}

function themeColors() {
  if (state.settings.bgTheme === "forest") return { bg: "#d8ecd6", empty: "#e8f3e7" };
  if (state.settings.bgTheme === "lava") return { bg: "#f7d8ce", empty: "#fde9df" };
  if (state.settings.bgTheme === "space") return { bg: "#ccd5f0", empty: "#dde4fa" };
  if (state.settings.bgTheme === "classic") return { bg: "#d6dfe9", empty: "#e4ebf4" };
  return { bg: "#d2e6f7", empty: "#eaf3fb" };
}

function stopNarration() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function speakGuideText(text) {
  const msg = String(text || "").trim();
  if (!msg) return;
  state.lastGuideText = msg;
  if (!("speechSynthesis" in window)) {
    setFeedback("Este navegador no tiene voz. Sigue la guía en texto.", "bad");
    return;
  }
  stopNarration();
  const utter = new SpeechSynthesisUtterance(msg);
  utter.lang = "es-MX";
  utter.rate = 0.95;
  utter.pitch = 1.05;
  window.speechSynthesis.speak(utter);
}

function buildGuideText() {
  const m = missions[state.mission];
  const story = getMissionStory(state.mission);
  if (state.mission >= 8) {
    return `Misión ODS ${state.mission + 1}. ${story}. ${m.instruction}. Usa bloques de agua, tierra, fuego y limpiar obstáculo para cuidar el planeta.`;
  }
  return `Misión ${state.mission + 1}. ${story}. ${m.instruction}. Tip fácil: elige un bloque en "Construcción fácil" y haz clic en la cuadrícula para construir.`;
}

function getMissionStory(index) {
  const stories = [
    "El pueblo necesita un camino seguro para empezar.",
    "Ahora deben recoger recursos para ayudar a la escuela.",
    "Apareció una zona peligrosa: diseña una ruta inteligente.",
    "El equipo te eligió líder constructor del día.",
    "Hay que crear un puente largo para cruzar el valle.",
    "Hora de recolectar tesoros para abrir el laboratorio.",
    "Protege al pueblo colocando enemigos fuera de la ruta.",
    "Gran final clásico: combina todo lo aprendido.",
    "ODS 6: el río del barrio está sucio, ayúdalo con bloques de agua.",
    "ODS 15: el parque necesita tierra sana y control del fuego.",
    "ODS 13: limpia obstáculos para que la comunidad respire mejor.",
    "Misión ODS final: salva la eco-ciudad con todas tus habilidades.",
  ];
  return stories[index] || "Nueva aventura en progreso.";
}

function setFeedback(text, kind = "") {
  feedbackText.textContent = text;
  feedbackText.classList.remove("ok", "bad");
  if (kind) feedbackText.classList.add(kind);
  if (kind === "ok" && autoNarration && autoNarration.checked) {
    speakGuideText(`${text} Muy bien. Sigue con la siguiente misión.`);
  }
}

function setCoachLine(text = "") {
  if (!coachText) return;
  coachText.textContent = text || coachLines[Math.floor(Math.random() * coachLines.length)];
}

function celebrateCard() {
  if (!missionCard) return;
  missionCard.classList.remove("celebrate");
  void missionCard.offsetWidth;
  missionCard.classList.add("celebrate");
}

function updateStreakUI() {
  if (!streakText) return;
  streakText.textContent = `Racha: ${state.streak}`;
}

function updateLevelUI() {
  const level = Math.floor(state.points / 25) + 1;
  const progress = (state.points % 25) / 25;
  if (builderLevelText) builderLevelText.textContent = String(level);
  if (levelFill) levelFill.style.width = `${Math.round(progress * 100)}%`;
}

function unlockBadge(id, text) {
  if (state.badges[id]) return;
  state.badges[id] = true;
  if (id === "builder" && badgeBuilder) badgeBuilder.classList.replace("lock", "unlock");
  if (id === "explorer" && badgeExplorer) badgeExplorer.classList.replace("lock", "unlock");
  if (id === "hero" && badgeHero) badgeHero.classList.replace("lock", "unlock");
  setFeedback(`🏅 Medalla desbloqueada: ${text}`, "ok");
  playSound("good");
}

function updateScore(delta) {
  state.points += delta;
  pointsText.textContent = String(state.points);
  updateLevelUI();
}

function pickFlashChallenge() {
  const options =
    state.mission >= 8
      ? [
          { label: "Reto flash ODS: Coloca 2 bloques de agua (+5).", target: 2, tile: TILE.WATER },
          { label: "Reto flash ODS: Coloca 2 bloques de tierra (+5).", target: 2, tile: TILE.EARTH },
          { label: "Reto flash ODS: Limpia 1 obstáculo (+5).", target: 1, tile: TILE.OBSTACLE },
        ]
      : state.mission < 1
      ? [
          { label: "Reto flash: Coloca 3 plataformas para ganar +5 puntos.", target: 3, tile: TILE.PLATFORM },
          { label: "Reto flash: Haz 5 clics de construcción para ganar +5 puntos.", target: 5, tile: null },
        ]
      : [
          { label: "Reto flash: Coloca 3 plataformas para ganar +5 puntos.", target: 3, tile: TILE.PLATFORM },
          { label: "Reto flash: Coloca 2 monedas para ganar +5 puntos.", target: 2, tile: TILE.COIN },
          { label: "Reto flash: Haz 6 clics de construcción para ganar +5 puntos.", target: 6, tile: null },
        ];
  state.flash = options[Math.floor(Math.random() * options.length)];
  state.flashProgress = 0;
  if (flashChallenge) {
    flashChallenge.classList.remove("done");
    flashChallenge.textContent = state.flash.label;
  }
}

function progressFlashChallenge(placedTile) {
  if (!state.flash) return;
  if (state.flash.tile && state.flash.tile !== placedTile) return;
  state.flashProgress += 1;
  const left = Math.max(0, state.flash.target - state.flashProgress);
  if (left > 0) {
    if (flashChallenge) flashChallenge.textContent = `${state.flash.label} (faltan ${left})`;
    return;
  }
  updateScore(5);
  if (flashChallenge) {
    flashChallenge.classList.add("done");
    flashChallenge.textContent = "Reto flash completado: +5 puntos. ¡Nuevo reto en camino!";
  }
  setCoachLine("Coach: ¡Bonus desbloqueado! Eres un constructor turbo.");
  celebrateCard();
  playSound("good");
  setTimeout(pickFlashChallenge, 1400);
}

function applyAvatarSelection() {
  if (!avatarSelect) return;
  const value = avatarSelect.value;
  const src = `sprites/Players/Player_${value}.png`;
  localStorage.setItem("plataformas_player", `player${value}`);
  loadAsset("player", src).then(() => renderStage());
}

function avatarFromStoredPlayer(storedPlayer) {
  if (storedPlayer === "player2") return "2";
  if (storedPlayer === "player4") return "4";
  if (storedPlayer === "player5") return "5";
  return "1";
}

function runSurpriseBox() {
  const now = Date.now();
  if (now < state.surpriseReadyAt) {
    const left = Math.ceil((state.surpriseReadyAt - now) / 1000);
    if (surpriseText) surpriseText.textContent = `Espera ${left}s`;
    setFeedback(`La caja sorpresa se recarga en ${left} segundos.`);
    return;
  }
  state.surpriseReadyAt = now + 30000;
  const prizes = [
    { text: "Ganaste +4 puntos", apply: () => updateScore(4) },
    {
      text: "Moneda bonus en el programa",
      apply: () => {
        state.program.push({
          type: "place_at",
          x: Math.max(0, Math.min(cols - 1, state.cursor.x + 1)),
          y: state.cursor.y,
          tile: TILE.COIN,
          label: "moneda bonus",
        });
        renderProgram();
        buildWorldFromProgram();
      },
    },
    {
      text: "Turbo bonus en el programa",
      apply: () => {
        state.program.push({
          type: "place_at",
          x: state.cursor.x,
          y: Math.max(0, Math.min(rows - 1, state.cursor.y - 1)),
          tile: TILE.BOOST,
          label: "turbo bonus",
        });
        renderProgram();
        buildWorldFromProgram();
      },
    },
  ];
  const prize = prizes[Math.floor(Math.random() * prizes.length)];
  prize.apply();
  if (surpriseText) surpriseText.textContent = `🎉 ${prize.text}`;
  setCoachLine("Coach: ¡Premio sorpresa! Úsalo para mejorar tu mundo.");
  playSound("good");
}

function showMission() {
  const m = missions[state.mission];
  missionTitle.textContent = m.title;
  missionInstruction.textContent = m.instruction;
  if (missionStory) missionStory.textContent = `Historia: ${getMissionStory(state.mission)}`;
  missionNumber.textContent = String(state.mission + 1);
  const guide = buildGuideText();
  if (guideTextEl) guideTextEl.textContent = guide;
  state.lastGuideText = guide;
  nextMissionBtn.disabled = true;
  updateMissionChecklist();
  pickFlashChallenge();
  setCoachLine("Coach: Lee el reto y empieza por pasos cortos.");
  if (autoNarration && autoNarration.checked) {
    speakGuideText(guide);
  }
}

function updateMissionChecklist() {
  if (!missionChecklist) return;
  const starts = countTile(state.grid, TILE.START);
  const goals = countTile(state.grid, TILE.GOAL);
  const platforms = countTile(state.grid, TILE.PLATFORM);
  const connected = hasPath(state.grid) ? "Si" : "No";
  if (state.mission === 0) {
    missionChecklist.textContent = `Checklist: Inicio ${Math.min(starts, 1)}/1 | Meta ${Math.min(goals, 1)}/1 | Plataformas ${Math.min(
      platforms,
      4
    )}/4 | Camino conectado: ${connected}`;
    return;
  }
  if (state.mission >= 8) {
    missionChecklist.textContent = `ODS: Agua ${countTile(state.grid, TILE.WATER)} | Tierra ${countTile(
      state.grid,
      TILE.EARTH
    )} | Fuego ${countTile(state.grid, TILE.FIRE)} | Obstáculos ${countTile(state.grid, TILE.OBSTACLE)} | Camino: ${connected}`;
    return;
  }
  missionChecklist.textContent = `Checklist: Inicio ${starts} | Meta ${goals} | Plataformas ${platforms} | Monedas ${countTile(
    state.grid,
    TILE.COIN
  )} | Enemigos ${countTile(state.grid, TILE.ENEMY)}`;
}

function updateCursorHelp() {
  if (!cursorHelp) return;
  cursorHelp.innerHTML = `Cursor constructor: <strong>(${state.cursor.x + 1},${state.cursor.y + 1})</strong>. Puedes moverlo con flechas. En construcción fácil, haz clic para colocar bloques.`;
}

function keepCursor() {
  state.cursor.x = Math.max(0, Math.min(cols - 1, state.cursor.x));
  state.cursor.y = Math.max(0, Math.min(rows - 1, state.cursor.y));
}

function moveCursorBy(dx, dy, source = "botones") {
  if (state.running) {
    setFeedback("Espera: se está ejecutando el programa.", "bad");
    return;
  }
  if (state.manualPlay) {
    setFeedback("Ahora estás en jugar mi mundo. Termina esa partida para mover el cursor constructor.", "bad");
    return;
  }
  state.cursor.x += dx;
  state.cursor.y += dy;
  keepCursor();
  renderStage();
  setFeedback(
    `Cursor movido a (${state.cursor.x + 1}, ${state.cursor.y + 1}) desde ${source}. Siguiente paso: pulsa Ejecutar para construir.`,
    ""
  );
  playSound("pop");
}

function setUnique(tile) {
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (state.grid[y][x] === tile) state.grid[y][x] = TILE.EMPTY;
    }
  }
  state.grid[state.cursor.y][state.cursor.x] = tile;
}

function executeCmd(cmd) {
  if (cmd.type === "clean_at") {
    state.cursor.x = cmd.x;
    state.cursor.y = cmd.y;
    keepCursor();
    if (state.grid[state.cursor.y][state.cursor.x] === TILE.OBSTACLE) {
      state.grid[state.cursor.y][state.cursor.x] = TILE.PLATFORM;
    }
    return;
  }
  if (cmd.type === "place_at") {
    state.cursor.x = cmd.x;
    state.cursor.y = cmd.y;
    keepCursor();
    if (cmd.tile === TILE.START || cmd.tile === TILE.GOAL) setUnique(cmd.tile);
    else state.grid[state.cursor.y][state.cursor.x] = cmd.tile;
    return;
  }
  if (cmd.type === "erase_at") {
    state.cursor.x = cmd.x;
    state.cursor.y = cmd.y;
    keepCursor();
    state.grid[state.cursor.y][state.cursor.x] = TILE.EMPTY;
    return;
  }
  if (cmd.type === "move") {
    state.cursor.x += cmd.dx;
    state.cursor.y += cmd.dy;
    keepCursor();
    return;
  }
  if (cmd.type === "place") {
    if (cmd.tile === TILE.START || cmd.tile === TILE.GOAL) setUnique(cmd.tile);
    else state.grid[state.cursor.y][state.cursor.x] = cmd.tile;
    return;
  }
  if (cmd.type === "erase") {
    state.grid[state.cursor.y][state.cursor.x] = TILE.EMPTY;
    return;
  }
  if (cmd.type === "clean") {
    if (state.grid[state.cursor.y][state.cursor.x] === TILE.OBSTACLE) {
      state.grid[state.cursor.y][state.cursor.x] = TILE.PLATFORM;
    }
    return;
  }
  if (cmd.type === "repeat") {
    const out = [];
    for (let i = 0; i < cmd.times; i += 1) out.push({ type: "move", dx: 1, dy: 0 }, { type: "place", tile: TILE.PLATFORM });
    out.forEach(executeCmd);
  }
}

function expandProgram(program) {
  const out = [];
  program.forEach((cmd) => {
    if (cmd.type === "repeat") {
      for (let i = 0; i < cmd.times; i += 1) out.push({ type: "move", dx: 1, dy: 0 }, { type: "place", tile: TILE.PLATFORM });
    } else out.push(cmd);
  });
  return out;
}

function hasPath(grid) {
  const start = findTile(grid, TILE.START);
  const goal = findTile(grid, TILE.GOAL);
  if (!start || !goal) return false;
  const q = [start];
  const visited = new Set();
  const key = (x, y) => `${x},${y}`;
  while (q.length) {
    const c = q.shift();
    if (c.x === goal.x && c.y === goal.y) return true;
    const k = key(c.x, c.y);
    if (visited.has(k)) continue;
    visited.add(k);
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].forEach(([dx, dy]) => {
      const nx = c.x + dx;
      const ny = c.y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return;
      const t = grid[ny][nx];
      if (
        [TILE.PLATFORM, TILE.START, TILE.GOAL, TILE.COIN, TILE.ENEMY, TILE.BOOST, TILE.SPIKE, TILE.WATER, TILE.EARTH, TILE.FIRE].includes(
          t
        )
      ) {
        q.push({ x: nx, y: ny });
      }
    });
  }
  return false;
}

function findTile(grid, tile) {
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) if (grid[y][x] === tile) return { x, y };
  }
  return null;
}

function validateMissionForKids(missionIndex, grid, program) {
  const starts = countTile(grid, TILE.START);
  const goals = countTile(grid, TILE.GOAL);
  const platforms = countTile(grid, TILE.PLATFORM);
  const coins = countTile(grid, TILE.COIN);
  const enemies = countTile(grid, TILE.ENEMY);
  const water = countTile(grid, TILE.WATER);
  const earth = countTile(grid, TILE.EARTH);
  const fire = countTile(grid, TILE.FIRE);
  const obstacles = countTile(grid, TILE.OBSTACLE);
  const pathOk = hasPath(grid);

  if (!hasMoveCommand(program) && !usesDirectPlacement(program)) {
    return {
      ok: false,
      message:
        "Casi lo logras. Falta mover el cursor. Si pones muchos bloques sin moverte, todos caen en la misma casilla. Usa mover derecha/izquierda/arriba/abajo.",
    };
  }

  if (missionIndex === 0) {
    if (starts < 1) return { ok: false, message: "Falta el bloque Inicio (azul). Puede que lo hayas tapado con otro bloque." };
    if (goals < 1) return { ok: false, message: "Falta el bloque Meta (morado). Ponlo al final del camino." };
    if (platforms < 4) return { ok: false, message: `Necesitas 4 plataformas y solo hay ${platforms}.` };
    if (!pathOk) {
      return {
        ok: false,
        message: "Inicio y Meta aún no están conectados. Haz un camino continuo moviendo el cursor y colocando plataformas.",
      };
    }
    return { ok: true, message: "¡Misión completada! Excelente trabajo." };
  }

  if (missionIndex === 1) {
    if (coins < 3) return { ok: false, message: `Faltan monedas: tienes ${coins} de 3.` };
    if (starts < 1 || goals < 1) return { ok: false, message: "No borres Inicio ni Meta al colocar monedas." };
    return { ok: true, message: "¡Misión completada! Excelente trabajo." };
  }

  if (missionIndex === 2) {
    if (enemies < 1) return { ok: false, message: "Falta colocar al menos 1 enemigo." };
    if (!pathOk) return { ok: false, message: "Debe existir un camino válido aunque haya enemigo." };
    return { ok: true, message: "¡Misión completada! Excelente trabajo." };
  }

  if (missionIndex === 3) {
    const hasRepeat = program.some((cmd) => cmd.type === "repeat");
    if (!hasRepeat) return { ok: false, message: "En esta misión debes usar el bloque repetir x2 al menos una vez." };
    if (!pathOk) return { ok: false, message: "Tu camino no conecta Inicio con Meta." };
    return { ok: true, message: "¡Misión completada! Excelente trabajo." };
  }

  if (missionIndex === 4) {
    if (platforms < 6) return { ok: false, message: `Necesitas 6 plataformas y tienes ${platforms}.` };
    if (!pathOk) return { ok: false, message: "No hay camino completo entre Inicio y Meta." };
    return { ok: true, message: "¡Misión completada! Excelente trabajo." };
  }

  if (missionIndex === 5) {
    if (coins < 5) return { ok: false, message: `Necesitas 5 monedas y tienes ${coins}.` };
    return { ok: true, message: "¡Misión completada! Excelente trabajo." };
  }

  if (missionIndex === 6) {
    if (enemies < 2) return { ok: false, message: `Necesitas 2 enemigos y tienes ${enemies}.` };
    if (!pathOk) return { ok: false, message: "Debe existir un camino válido con los enemigos colocados." };
    return { ok: true, message: "¡Misión completada! Excelente trabajo." };
  }

  if (missionIndex === 8) {
    if (water < 3) return { ok: false, message: `Misión ODS 6: necesitas 3 bloques de agua y tienes ${water}.` };
    if (!pathOk) return { ok: false, message: "Mantén un camino válido entre inicio y meta." };
    return { ok: true, message: "¡ODS 6 completado! Cuidaste el agua del mundo." };
  }

  if (missionIndex === 9) {
    if (earth < 3) return { ok: false, message: `Misión ODS 15: necesitas 3 bloques de tierra y tienes ${earth}.` };
    if (fire < 1) return { ok: false, message: "Agrega al menos 1 bloque de fuego controlado." };
    if (!pathOk) return { ok: false, message: "No rompas el camino mientras construyes." };
    return { ok: true, message: "¡ODS 15 completado! Naturaleza protegida." };
  }

  if (missionIndex === 10) {
    const usedClean = program.some((c) => c.type === "clean" || c.type === "clean_at");
    if (!usedClean) return { ok: false, message: "Debes usar el bloque limpiar obstáculo al menos una vez." };
    if (obstacles > 0) return { ok: false, message: `Aún quedan ${obstacles} obstáculos por limpiar.` };
    if (!pathOk) return { ok: false, message: "Después de limpiar, deja un camino válido." };
    return { ok: true, message: "¡ODS 13 completado! Mundo limpio y seguro." };
  }

  if (missionIndex === 11) {
    if (water < 2 || earth < 2 || fire < 1) {
      return { ok: false, message: "ODS final: necesitas 2 agua, 2 tierra y 1 fuego." };
    }
    if (obstacles > 0) return { ok: false, message: "ODS final: limpia todos los obstáculos." };
    if (!pathOk) return { ok: false, message: "ODS final: debe existir camino entre inicio y meta." };
    return { ok: true, message: "¡Gran final ODS completado! Eres guardián del planeta." };
  }

  if (platforms < 6 || coins < 4 || enemies < 2 || !pathOk) {
    return { ok: false, message: "Para la misión final: 6 plataformas, 4 monedas, 2 enemigos y camino válido." };
  }
  return { ok: true, message: "¡Misión completada! Excelente trabajo." };
}

function drawTile(x, y, tile) {
  const px = x * cell;
  const py = y * cell;
  const palette = themeColors();
  ctx.fillStyle = palette.empty;
  if (tile === TILE.PLATFORM) ctx.fillStyle = "#80b589";
  if (tile === TILE.COIN) ctx.fillStyle = "#efd16c";
  if (tile === TILE.ENEMY) ctx.fillStyle = "#d87979";
  if (tile === TILE.START) ctx.fillStyle = "#70acd7";
  if (tile === TILE.GOAL) ctx.fillStyle = "#9b80d9";
  if (tile === TILE.SPIKE) ctx.fillStyle = "#f09c9c";
  if (tile === TILE.BOOST) ctx.fillStyle = "#92e0ec";
  if (tile === TILE.WATER) ctx.fillStyle = "#7cc6f3";
  if (tile === TILE.EARTH) ctx.fillStyle = "#9ac786";
  if (tile === TILE.FIRE) ctx.fillStyle = "#f2a066";
  if (tile === TILE.OBSTACLE) ctx.fillStyle = "#b7b7b7";
  ctx.fillRect(px + 1, py + 1, cell - 2, cell - 2);
  ctx.strokeStyle = "rgba(53, 83, 112, 0.25)";
  ctx.strokeRect(px + 0.5, py + 0.5, cell - 1, cell - 1);

  if (tile === TILE.COIN && assets.images.coin) ctx.drawImage(assets.images.coin, px + 10, py + 10, 22, 22);
  if (tile === TILE.ENEMY && assets.images.enemy) ctx.drawImage(assets.images.enemy, px + 6, py + 6, 30, 30);
  if (tile === TILE.GOAL && assets.images.goal) ctx.drawImage(assets.images.goal, px + 8, py + 4, 26, 32);
  if (tile === TILE.START && assets.images.player) ctx.drawImage(assets.images.player, px + 8, py + 5, 24, 30);
  if (tile === TILE.SPIKE) {
    if (assets.images.spike) ctx.drawImage(assets.images.spike, px + 8, py + 8, 26, 26);
    else {
      ctx.fillStyle = "#9c2f2f";
      ctx.font = "bold 18px Trebuchet MS";
      ctx.fillText("!", px + 15, py + 25);
    }
  }
  if (tile === TILE.BOOST) {
    if (assets.images.boost) ctx.drawImage(assets.images.boost, px + 8, py + 8, 26, 26);
    else {
      ctx.fillStyle = "#135c7d";
      ctx.font = "bold 18px Trebuchet MS";
      ctx.fillText(">", px + 15, py + 25);
    }
  }
  if (tile === TILE.WATER) {
    ctx.fillStyle = "#1f6fa8";
    ctx.font = "bold 18px Trebuchet MS";
    ctx.fillText("~", px + 15, py + 24);
  }
  if (tile === TILE.EARTH) {
    ctx.fillStyle = "#2c6f34";
    ctx.font = "bold 18px Trebuchet MS";
    ctx.fillText("+", px + 15, py + 24);
  }
  if (tile === TILE.FIRE) {
    ctx.fillStyle = "#9a3b12";
    ctx.font = "bold 18px Trebuchet MS";
    ctx.fillText("^", px + 15, py + 24);
  }
  if (tile === TILE.OBSTACLE) {
    ctx.fillStyle = "#4f5964";
    ctx.font = "bold 16px Trebuchet MS";
    ctx.fillText("X", px + 14, py + 24);
  }
}

function drawStageBackground() {
  const palette = themeColors();
  const grd = ctx.createLinearGradient(0, 0, 0, stage.height);
  grd.addColorStop(0, palette.bg);
  grd.addColorStop(1, "#eef4fb");
  if (state.settings.bgTheme === "lava") {
    grd.addColorStop(1, "#fde1d4");
  }
  if (state.settings.bgTheme === "space") {
    grd.addColorStop(0.7, "#dae1fb");
    grd.addColorStop(1, "#eef0ff");
  }
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, stage.width, stage.height);
}

function renderStage() {
  drawStageBackground();
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) drawTile(x, y, state.grid[y][x]);
  }
  if (state.enemies.length) {
    state.enemies.forEach((enemy) => {
      const ex = enemy.x * cell + 6;
      const ey = enemy.y * cell + 6;
      if (assets.images.enemy) ctx.drawImage(assets.images.enemy, ex, ey, 30, 30);
    });
  }
  if (state.hero) {
    const hx = state.hero.x * cell + 8;
    const hy = state.hero.y * cell + 5;
    if (assets.images.player) {
      ctx.drawImage(assets.images.player, hx, hy, 24, 30);
    } else {
      ctx.fillStyle = "#2f78bf";
      ctx.beginPath();
      ctx.arc(state.hero.x * cell + cell / 2, state.hero.y * cell + cell / 2, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const cx = state.cursor.x * cell;
  const cy = state.cursor.y * cell;
  ctx.fillStyle = "rgba(47, 108, 162, 0.22)";
  ctx.fillRect(cx + 2, cy + 2, cell - 4, cell - 4);
  ctx.strokeStyle = "#2f6ca2";
  ctx.lineWidth = 3;
  ctx.strokeRect(cx + 2, cy + 2, cell - 4, cell - 4);
  const centerX = cx + cell / 2;
  const centerY = cy + cell / 2;
  ctx.strokeStyle = "#2f6ca2";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX - 8, centerY);
  ctx.lineTo(centerX + 8, centerY);
  ctx.moveTo(centerX, centerY - 8);
  ctx.lineTo(centerX, centerY + 8);
  ctx.stroke();
  ctx.fillStyle = "#184f82";
  ctx.font = "bold 13px Trebuchet MS";
  ctx.fillText("C", cx + 5, cy + 15);
  updateCursorHelp();
  updateMissionChecklist();
}

function isWalkable(tile) {
  return [TILE.PLATFORM, TILE.START, TILE.GOAL, TILE.COIN, TILE.ENEMY, TILE.BOOST, TILE.SPIKE, TILE.WATER, TILE.EARTH, TILE.FIRE].includes(
    tile
  );
}

function renderPalette() {
  palette.innerHTML = "";
  blockDefs.forEach((b, i) => {
    const btn = document.createElement("button");
    btn.className = "blockBtn";
    btn.dataset.cat = b.cat;
    btn.dataset.i = String(i);
    btn.draggable = true;
    btn.textContent = b.label;
    btn.addEventListener("click", () => addBlock(i));
    btn.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", String(i)));
    palette.appendChild(btn);
  });
}

function renderQuickTools() {
  if (!paintTools) return;
  paintTools.innerHTML = "";
  quickTools.forEach((tool) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "paintToolBtn";
    if (state.paintTool === tool.id) btn.classList.add("active");
    btn.textContent = tool.label;
    btn.addEventListener("click", () => {
      state.paintTool = tool.id;
      renderQuickTools();
      setFeedback(`Herramienta activa: ${tool.label}. Ahora haz clic en la cuadrícula.`);
      playSound("pop");
    });
    paintTools.appendChild(btn);
  });
}

function renderProgram() {
  programArea.innerHTML = "";
  if (!state.program.length) {
    const s = document.createElement("div");
    s.className = "progChip";
    s.textContent = "Arrastra bloques aquí";
    programArea.appendChild(s);
    return;
  }
  state.program.forEach((cmd, idx) => {
    const chip = document.createElement("button");
    chip.className = "progChip";
    chip.textContent = `${idx + 1}. ${cmd.label}`;
    chip.addEventListener("click", () => {
      state.program.splice(idx, 1);
      renderProgram();
      playSound("pop");
    });
    programArea.appendChild(chip);
  });
}

function addBlock(index) {
  const def = blockDefs[index];
  if (!def) return;
  state.program.push({ ...def.cmd, label: def.label });
  renderProgram();
  if (state.program.length === 1) {
    setFeedback("Bloque agregado. Recuerda: el cursor se usa cuando pulsas Ejecutar o Paso a paso.");
  }
  if (def.cmd.type === "place") {
    progressFlashChallenge(def.cmd.tile || null);
  }
  if (def.cmd.type === "clean") {
    progressFlashChallenge(TILE.OBSTACLE);
  }
  if (state.program.length % 4 === 0) {
    setCoachLine();
  }
  playSound("pop");
}

function addDirectPlacementCommand(x, y) {
  const tool = quickTools.find((t) => t.id === state.paintTool);
  if (!tool) return;
  if (tool.cursor) {
    state.cursor.x = x;
    state.cursor.y = y;
    keepCursor();
    renderStage();
    setFeedback(`Cursor movido a (${x + 1}, ${y + 1}).`);
    playSound("pop");
    return;
  }
  if (tool.clean) {
    const cmd = { type: "clean_at", x, y, label: `limpiar en (${x + 1},${y + 1})` };
    state.program.push(cmd);
    renderProgram();
    const built = buildWorldFromProgram();
    if (!built.ok) {
      setFeedback(built.reason, "bad");
      return;
    }
    setFeedback(`Agregado: ${cmd.label}.`);
    progressFlashChallenge(TILE.OBSTACLE);
    playSound("pop");
    return;
  }
  let cmd;
  if (tool.erase) {
    cmd = { type: "erase_at", x, y, label: `borrar en (${x + 1},${y + 1})` };
  } else {
    cmd = { type: "place_at", x, y, tile: tool.tile, label: `${tool.label.toLowerCase()} en (${x + 1},${y + 1})` };
  }
  state.program.push(cmd);
  renderProgram();
  const built = buildWorldFromProgram();
  if (!built.ok) {
    setFeedback(built.reason, "bad");
    return;
  }
  setFeedback(`Agregado: ${cmd.label}. Puedes seguir haciendo clic para construir.`);
  progressFlashChallenge(tool.tile || null);
  if (state.program.length % 3 === 0) setCoachLine();
  playSound("pop");
}

function resetWorld() {
  state.grid = createGrid();
  state.cursor = { x: 1, y: 8 };
  state.hero = null;
  state.manualPlay = false;
  state.enemies = [];
  renderStage();
}

function buildWorldFromProgram() {
  resetWorld();
  const commands = expandProgram(state.program);
  if (!commands.length) {
    return { ok: false, reason: "Primero agrega bloques al programa." };
  }
  commands.forEach((cmd) => executeCmd(cmd));
  renderStage();
  return { ok: true };
}

function findPath(grid, start, goal) {
  const queue = [{ ...start }];
  const visited = new Set();
  const parent = new Map();
  const key = (x, y) => `${x},${y}`;
  while (queue.length) {
    const c = queue.shift();
    if (c.x === goal.x && c.y === goal.y) {
      const path = [goal];
      let curKey = key(goal.x, goal.y);
      while (parent.has(curKey)) {
        const p = parent.get(curKey);
        path.push(p);
        curKey = key(p.x, p.y);
      }
      path.reverse();
      return path;
    }
    const k = key(c.x, c.y);
    if (visited.has(k)) continue;
    visited.add(k);
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
      const nx = c.x + dx;
      const ny = c.y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return;
      const tile = grid[ny][nx];
      const walkable = [TILE.PLATFORM, TILE.START, TILE.GOAL, TILE.COIN, TILE.ENEMY, TILE.BOOST, TILE.SPIKE, TILE.WATER, TILE.EARTH, TILE.FIRE].includes(tile);
      if (!walkable) return;
      const nk = key(nx, ny);
      if (visited.has(nk) || parent.has(nk)) return;
      parent.set(nk, { x: c.x, y: c.y });
      queue.push({ x: nx, y: ny });
    });
  }
  return [];
}

async function playMyWorld() {
  if (state.running) return;
  state.running = true;
  const built = buildWorldFromProgram();
  if (!built.ok) {
    setFeedback(built.reason, "bad");
    state.running = false;
    return;
  }
  const start = findTile(state.grid, TILE.START);
  const goal = findTile(state.grid, TILE.GOAL);
  if (!start || !goal) {
    setFeedback("Falta inicio o meta. Coloca ambos bloques.", "bad");
    state.running = false;
    return;
  }
  const path = findPath(state.grid, start, goal);
  if (!path.length) {
    setFeedback("No hay camino para el personaje. Agrega más plataformas.", "bad");
    playSound("bad");
    state.running = false;
    return;
  }
  state.hero = { ...start };
  renderStage();
  setFeedback("¡El personaje está caminando!");
  for (let i = 1; i < path.length; i += 1) {
    const step = path[i];
    state.hero = { ...step };
    if (state.grid[step.y][step.x] === TILE.COIN) {
      state.grid[step.y][step.x] = TILE.PLATFORM;
      updateScore(1);
      playSound("pop");
    }
    if (state.grid[step.y][step.x] === TILE.ENEMY) {
      setFeedback("¡Ups! El personaje tocó un enemigo. Mejora tu camino.", "bad");
      playSound("bad");
      renderStage();
      state.running = false;
      return;
    }
    renderStage();
    await new Promise((r) => setTimeout(r, 260));
  }
  setFeedback("¡Llegó a la meta! Excelente construcción.", "ok");
  playSound("good");
  state.running = false;
}

function prepareEnemiesForPlay() {
  state.enemies = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (state.grid[y][x] === TILE.ENEMY) {
        state.enemies.push({ x, y });
        state.grid[y][x] = TILE.PLATFORM;
      }
    }
  }
}

function enemyStep() {
  if (state.settings.enemyMode !== "patrol" || !state.enemies.length) return;
  const steps = Math.max(1, Number(state.settings.enemySpeed) || 1);
  for (let s = 0; s < steps; s += 1) {
    state.enemies = state.enemies.map((enemy) => {
      const options = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]
        .map(([dx, dy]) => ({ x: enemy.x + dx, y: enemy.y + dy }))
        .filter((p) => p.x >= 0 && p.y >= 0 && p.x < cols && p.y < rows)
        .filter((p) => isWalkable(state.grid[p.y][p.x]));
      if (!options.length) return enemy;
      return options[Math.floor(Math.random() * options.length)];
    });
  }
}

function heroHitsEnemy() {
  if (!state.hero) return false;
  return state.enemies.some((enemy) => enemy.x === state.hero.x && enemy.y === state.hero.y);
}

function tryManualMove(dx, dy) {
  if (!state.manualPlay || !state.hero || state.running) return;
  const nx = state.hero.x + dx;
  const ny = state.hero.y + dy;
  if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return;
  const tile = state.grid[ny][nx];
  if (!isWalkable(tile)) return;

  state.hero = { x: nx, y: ny };
  if (tile === TILE.COIN) {
    state.grid[ny][nx] = TILE.PLATFORM;
    updateScore(1);
    setFeedback("¡Moneda recogida! Sigue avanzando.");
    playSound("pop");
  } else if (tile === TILE.WATER) {
    updateScore(1);
    setFeedback("¡Agua limpia recolectada! +1 punto.");
    playSound("pop");
    state.grid[ny][nx] = TILE.PLATFORM;
  } else if (tile === TILE.EARTH) {
    setFeedback("Tierra restaurada. Sigue cuidando el entorno.");
    state.grid[ny][nx] = TILE.PLATFORM;
  } else if (tile === TILE.SPIKE) {
    setFeedback("¡Caíste en una trampa! Cambia tu diseño.", "bad");
    playSound("bad");
    state.manualPlay = false;
    renderStage();
    return;
  } else if (tile === TILE.FIRE) {
    setFeedback("¡Te quemaste con fuego! Busca una ruta más segura.", "bad");
    playSound("bad");
    state.manualPlay = false;
    renderStage();
    return;
  } else if (tile === TILE.ENEMY) {
    setFeedback("¡Te tocó un enemigo! Reintenta con otro camino.", "bad");
    playSound("bad");
    state.manualPlay = false;
    renderStage();
    return;
  } else if (tile === TILE.BOOST) {
    setFeedback("¡Turbo! Avanzas una casilla extra.");
    const bx = nx + dx;
    const by = ny + dy;
    if (bx >= 0 && by >= 0 && bx < cols && by < rows && isWalkable(state.grid[by][bx])) {
      state.hero = { x: bx, y: by };
    }
  } else if (tile === TILE.GOAL) {
    setFeedback("¡Llegaste a la meta controlando al personaje! Excelente.", "ok");
    playSound("good");
    state.manualPlay = false;
    unlockBadge("hero", "Héroe Imparable");
    renderStage();
    return;
  }

  enemyStep();
  if (heroHitsEnemy()) {
    setFeedback("¡Un enemigo en patrulla te atrapó! Ajusta el nivel o cambia dificultad.", "bad");
    playSound("bad");
    state.manualPlay = false;
    renderStage();
    return;
  }
  renderStage();
}

function startManualPlay() {
  if (state.running) return;
  if (!hasMoveCommand(state.program) && !usesDirectPlacement(state.program)) {
    setFeedback("Antes de jugar, agrega bloques o usa Construcción fácil para crear tu mundo.", "bad");
    return;
  }
  const built = buildWorldFromProgram();
  if (!built.ok) {
    setFeedback(built.reason, "bad");
    return;
  }
  const start = findTile(state.grid, TILE.START);
  const goal = findTile(state.grid, TILE.GOAL);
  if (!start || !goal) {
    setFeedback("Para jugar, primero coloca Inicio y Meta.", "bad");
    return;
  }
  if (!hasPath(state.grid)) {
    setFeedback("Tu mundo no tiene camino válido. Agrega plataformas.", "bad");
    return;
  }
  prepareEnemiesForPlay();
  state.hero = { ...start };
  state.manualPlay = true;
  renderStage();
  setFeedback("¡Ahora controla al personaje con flechas o WASD! Prueba trampas, turbo y enemigos.");
  if (assets.sounds.bg) {
    if (state.settings.musicOn) assets.sounds.bg.play().catch(() => {});
    else assets.sounds.bg.pause();
  }
}

async function runProgram(stepMode = false) {
  if (state.running) return;
  state.running = true;
  resetWorld();
  const commands = expandProgram(state.program);
  if (!commands.length) {
    setFeedback("Primero agrega bloques al programa.", "bad");
    state.running = false;
    return;
  }
  setFeedback(`Construyendo mapa desde el cursor (${state.cursor.x + 1}, ${state.cursor.y + 1})...`);
  const baseDelay = stepMode ? 320 : 140;
  for (let i = 0; i < commands.length; i += 1) {
    executeCmd(commands[i]);
    renderStage();
    setFeedback(`Ejecutando bloque ${i + 1} de ${commands.length}...`);
    await new Promise((r) => setTimeout(r, baseDelay));
  }

  const result = validateMissionForKids(state.mission, state.grid, state.program);
  if (result.ok) {
    unlockBadge("builder", "Primer Constructor");
    state.streak += 1;
    const streakBonus = Math.min(20, state.streak * 2);
    updateScore(10 + streakBonus);
    updateStreakUI();
    setFeedback(`${result.message} Bonus racha +${streakBonus}.`, "ok");
    nextMissionBtn.disabled = false;
    celebrateCard();
    setCoachLine("Coach: ¡Nivel dominado! Pulsa Siguiente misión.");
    playSound("good");
  } else {
    state.streak = 0;
    updateStreakUI();
    setFeedback(result.message, "bad");
    setCoachLine("Coach: Nada de rendirse. Ajusta 1-2 bloques y vuelve a probar.");
    playSound("bad");
  }
  state.running = false;
}

function tickClock() {
  state.elapsed += 1;
  const m = Math.floor(state.elapsed / 60);
  const s = state.elapsed % 60;
  sessionTimeEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  if (state.elapsed % 600 === 0) {
    setFeedback(`¡Genial! Llevas ${m} minutos de trabajo continuo.`, "ok");
  }
  if (surpriseText) {
    const left = Math.max(0, Math.ceil((state.surpriseReadyAt - Date.now()) / 1000));
    if (left > 0) surpriseText.textContent = `Caja en ${left}s`;
    else if (!surpriseText.textContent.includes("Sorpresa lista")) surpriseText.textContent = "Sorpresa lista";
  }
}

function setupDnD() {
  programArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    programArea.classList.add("drag");
  });
  programArea.addEventListener("dragleave", () => programArea.classList.remove("drag"));
  programArea.addEventListener("drop", (e) => {
    e.preventDefault();
    programArea.classList.remove("drag");
    const i = Number(e.dataTransfer.getData("text/plain"));
    addBlock(i);
  });
}

function setupStageCursorControl() {
  const onPoint = (clientX, clientY) => {
    if (state.running) {
      setFeedback("Espera: se está ejecutando el programa.", "bad");
      return;
    }
    if (state.manualPlay) {
      setFeedback("Ahora estás en jugar mi mundo. Termina esa partida para mover el cursor constructor.", "bad");
      return;
    }
    const rect = stage.getBoundingClientRect();
    const scaleX = stage.width / rect.width;
    const scaleY = stage.height / rect.height;
    const px = (clientX - rect.left) * scaleX;
    const py = (clientY - rect.top) * scaleY;
    const tx = Math.max(0, Math.min(cols - 1, Math.floor(px / cell)));
    const ty = Math.max(0, Math.min(rows - 1, Math.floor(py / cell)));
    addDirectPlacementCommand(tx, ty);
  };
  stage.addEventListener("click", (e) => {
    onPoint(e.clientX, e.clientY);
  });
  stage.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      e.preventDefault();
      onPoint(t.clientX, t.clientY);
    },
    { passive: false }
  );
}

function setupCursorButtons() {
  if (cursorLeftBtn) cursorLeftBtn.addEventListener("click", () => moveCursorBy(-1, 0, "botones"));
  if (cursorRightBtn) cursorRightBtn.addEventListener("click", () => moveCursorBy(1, 0, "botones"));
  if (cursorUpBtn) cursorUpBtn.addEventListener("click", () => moveCursorBy(0, -1, "botones"));
  if (cursorDownBtn) cursorDownBtn.addEventListener("click", () => moveCursorBy(0, 1, "botones"));
}

function applyLevelOptionsUI() {
  if (bgThemeSelect) bgThemeSelect.value = state.settings.bgTheme;
  if (enemyModeSelect) enemyModeSelect.value = state.settings.enemyMode;
  if (enemySpeedSelect) enemySpeedSelect.value = String(state.settings.enemySpeed);
  if (musicToggle) musicToggle.checked = state.settings.musicOn;
  if (sfxToggle) sfxToggle.checked = state.settings.sfxOn;
}

function setupLevelOptions() {
  applyLevelOptionsUI();
  if (bgThemeSelect) {
    bgThemeSelect.addEventListener("change", () => {
      state.settings.bgTheme = bgThemeSelect.value;
      state.seenThemes.add(state.settings.bgTheme);
      if (state.seenThemes.size >= 3) unlockBadge("explorer", "Explorador de Fondos");
      renderStage();
      setFeedback(`Fondo cambiado a ${bgThemeSelect.options[bgThemeSelect.selectedIndex].text}.`);
    });
  }
  if (enemyModeSelect) {
    enemyModeSelect.addEventListener("change", () => {
      state.settings.enemyMode = enemyModeSelect.value;
      setFeedback(`Modo de enemigos: ${state.settings.enemyMode === "patrol" ? "Patrulla" : "Quietos"}.`);
    });
  }
  if (enemySpeedSelect) {
    enemySpeedSelect.addEventListener("change", () => {
      state.settings.enemySpeed = Number(enemySpeedSelect.value) || 1;
      setFeedback(`Velocidad de enemigos: ${state.settings.enemySpeed === 2 ? "Rápida" : "Normal"}.`);
    });
  }
  if (musicToggle) {
    musicToggle.addEventListener("change", () => {
      state.settings.musicOn = !!musicToggle.checked;
      if (assets.sounds.bg) {
        if (state.settings.musicOn) assets.sounds.bg.play().catch(() => {});
        else assets.sounds.bg.pause();
      }
    });
  }
  if (sfxToggle) {
    sfxToggle.addEventListener("change", () => {
      state.settings.sfxOn = !!sfxToggle.checked;
      setFeedback(`Efectos ${state.settings.sfxOn ? "activados" : "desactivados"}.`);
    });
  }
}

function loadAsset(name, src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve((assets.images[name] = img));
    img.onerror = () => resolve(null);
  });
}

function initAudio() {
  const pop = new Audio("audio/UI Pop.mp3");
  pop.volume = 0.4;
  assets.sounds.pop = pop;
  const good = new Audio("audio/UI Pop.mp3");
  good.volume = 0.8;
  assets.sounds.good = good;
  const bad = new Audio("audio/EnemyHit.wav");
  bad.volume = 0.5;
  assets.sounds.bad = bad;
  const bg = new Audio("audio/Bg Music.mp3");
  bg.volume = 0.2;
  bg.loop = true;
  assets.sounds.bg = bg;
}

Promise.all([
  loadAsset("player", heroFrames[0]),
  loadAsset("enemy", "sprites/Enemies/Enemy_1.png"),
  loadAsset("coin", "sprites/Gold/gold_1.png"),
  loadAsset("goal", "sprites/Spawn_mark.png"),
  loadAsset("spike", "sprites/Projectiles/Projectile_enemy.png"),
  loadAsset("boost", "sprites/Upgrades/1.png"),
]).then(() => {
  const storedPlayer = localStorage.getItem("plataformas_player");
  if (avatarSelect && storedPlayer) {
    avatarSelect.value = avatarFromStoredPlayer(storedPlayer);
    applyAvatarSelection();
  }
  initAudio();
  renderQuickTools();
  renderPalette();
  renderProgram();
  updateStreakUI();
  updateLevelUI();
  setCoachLine("Coach: ¡Vamos, constructor! Tu mundo puede ser épico.");
  renderStage();
  showMission();
  setupDnD();
  setupStageCursorControl();
  setupCursorButtons();
  setupLevelOptions();
  if (avatarSelect) avatarSelect.addEventListener("change", applyAvatarSelection);
  if (builderFullscreenBtn) {
    builderFullscreenBtn.addEventListener("click", () => {
      toggleBuilderFullscreen();
    });
    syncBuilderFullscreenUiState();
    updateBuilderFullscreenLabel();
  }
  if (surpriseBtn) surpriseBtn.addEventListener("click", runSurpriseBox);
  setInterval(tickClock, 1000);
});

document.addEventListener("fullscreenchange", () => {
  syncBuilderFullscreenUiState();
  updateBuilderFullscreenLabel();
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  btn.classList.add("btnFlash");
  setTimeout(() => btn.classList.remove("btnFlash"), 140);
});

hintBtn.addEventListener("click", () => {
  setFeedback(`Pista: ${missions[state.mission].hint}`);
  playSound("pop");
  if (autoNarration && autoNarration.checked) {
    speakGuideText(`Pista: ${missions[state.mission].hint}`);
  }
});

if (guideSpeakBtn) {
  guideSpeakBtn.addEventListener("click", () => {
    speakGuideText(state.lastGuideText || buildGuideText());
  });
}

if (guideStopBtn) {
  guideStopBtn.addEventListener("click", () => {
    stopNarration();
    setFeedback("Audio detenido.");
  });
}

if (guideRepeatBtn) {
  guideRepeatBtn.addEventListener("click", () => {
    speakGuideText(state.lastGuideText || buildGuideText());
  });
}

runBtn.addEventListener("click", () => runProgram(false));
stepBtn.addEventListener("click", () => runProgram(true));
resetBtn.addEventListener("click", () => {
  resetWorld();
  setFeedback("Escenario reiniciado.");
  setCoachLine("Coach: Reinicio listo. Haz una versión mejor.");
});
clearProgramBtn.addEventListener("click", () => {
  state.program = [];
  renderProgram();
  resetWorld();
  setFeedback("Programa limpio. ¡Vamos de nuevo!");
  setCoachLine("Coach: Mente fresca, mundo nuevo.");
});
nextMissionBtn.addEventListener("click", () => {
  if (state.mission >= missions.length - 1) {
    setFeedback("¡Terminaste todas las misiones! Puedes seguir en modo libre hasta 60:00.", "ok");
    nextMissionBtn.disabled = true;
    return;
  }
  state.mission += 1;
  showMission();
  resetWorld();
  setFeedback("Nueva misión cargada. ¡A construir!");
});
playWorldBtn.addEventListener("click", () => {
  startManualPlay();
  const bg = assets.sounds.bg;
  if (bg && bg.paused && state.settings.musicOn) bg.play().catch(() => {});
});

window.addEventListener("keydown", (e) => {
  if (!state.manualPlay) return;
  if (e.code === "ArrowLeft" || e.code === "KeyA") {
    e.preventDefault();
    tryManualMove(-1, 0);
    return;
  }
  if (e.code === "ArrowRight" || e.code === "KeyD") {
    e.preventDefault();
    tryManualMove(1, 0);
    return;
  }
  if (e.code === "ArrowUp" || e.code === "KeyW") {
    e.preventDefault();
    tryManualMove(0, -1);
    return;
  }
  if (e.code === "ArrowDown" || e.code === "KeyS") {
    e.preventDefault();
    tryManualMove(0, 1);
  }
});
