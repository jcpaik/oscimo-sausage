const COLS = "ABCDEFGHIJKLMNOPQRST".split("");
const ROWS = Array.from({ length: 17 }, (_, index) => index + 1);
const STORAGE_KEY = "sausage-breadboard-layout-v2";
const WINDOW_NAME_PREFIX = "sausage-breadboard-layout:";
const LAYOUT_URL = "layout.json";
const LAYOUT_SAVE_URL = "/api/layout";
const AUTOSAVE_DELAY_MS = 120;

const geom = {
  left: 72,
  top: 72,
  cell: 34,
  gap: 38,
  rightPad: 72,
  bottomPad: 58,
};

const NODE_COLOR = "#334155";

const spanTools = new Set(["jumper", "resistor", "diode"]);
const boundaryLeftCols = ["E", "J", "O"];
const boundaryRightToLeft = { F: "E", K: "J", P: "O" };

const templates = {
  ic4069: {
    kind: "ic4069",
    labelBase: "U",
    display: "CD4069UBE",
    constraint: "boundary",
    pins: [
      { name: "4Y", number: 8, dc: 0, dr: 0 },
      { name: "4A", number: 9, dc: 0, dr: 1 },
      { name: "5Y", number: 10, dc: 0, dr: 2 },
      { name: "5A", number: 11, dc: 0, dr: 3 },
      { name: "6Y", number: 12, dc: 0, dr: 4 },
      { name: "6A", number: 13, dc: 0, dr: 5 },
      { name: "VDD", number: 14, dc: 0, dr: 6 },
      { name: "VSS", number: 7, dc: 1, dr: 0 },
      { name: "3Y", number: 6, dc: 1, dr: 1 },
      { name: "3A", number: 5, dc: 1, dr: 2 },
      { name: "2Y", number: 4, dc: 1, dr: 3 },
      { name: "2A", number: 3, dc: 1, dr: 4 },
      { name: "1Y", number: 2, dc: 1, dr: 5 },
      { name: "1A", number: 1, dc: 1, dr: 6 },
    ],
  },
  buzzer: {
    kind: "buzzer",
    labelBase: "BZ",
    display: "Buzzer",
    constraint: "boundary",
    pins: [
      { name: "+", dc: 0, dr: 0 },
      { name: "-", dc: 1, dr: 0 },
    ],
  },
  transistor: {
    kind: "transistor",
    labelBase: "Q",
    display: "Transistor",
    pins: [
      { name: "C", dc: 0, dr: 0 },
      { name: "B", dc: 0, dr: 1 },
      { name: "E", dc: 0, dr: 2 },
    ],
  },
  switch3: {
    kind: "switch3",
    labelBase: "SW",
    display: "Switch",
    pins: [
      { name: "A", dc: 0, dr: 0 },
      { name: "COM", dc: 0, dr: 1 },
      { name: "B", dc: 0, dr: 2 },
    ],
  },
  pot: {
    kind: "pot",
    labelBase: "POT",
    display: "Potentiometer",
    pins: [
      { name: "A", dc: 0, dr: 0 },
      { name: "W", dc: 0, dr: 2 },
      { name: "B", dc: 0, dr: 4 },
    ],
  },
  led: {
    kind: "led",
    labelBase: "LED",
    display: "LED",
    pins: [
      { name: "K", dc: 0, dr: 0 },
      { name: "A", dc: 0, dr: 1 },
    ],
  },
  capCyl: {
    kind: "capCyl",
    labelBase: "C",
    display: "Cap cyl",
    pins: [
      { name: "+", dc: 0, dr: 0 },
      { name: "-", dc: 0, dr: 1 },
    ],
  },
  capChip: {
    kind: "capChip",
    labelBase: "C",
    display: "Cap chip",
    pins: [
      { name: "A", dc: 0, dr: 0 },
      { name: "B", dc: 0, dr: 3 },
    ],
  },
  batPlus: {
    kind: "batPlus",
    labelBase: "BAT+",
    display: "Battery +",
    pins: [{ name: "+", dc: 0, dr: 0 }],
  },
  batMinus: {
    kind: "batMinus",
    labelBase: "BAT-",
    display: "Battery -",
    pins: [{ name: "-", dc: 0, dr: 0 }],
  },
};

const spanMeta = {
  jumper: { labelBase: "W", display: "Wire", color: "#f97316" },
  resistor: { labelBase: "R", display: "Resistor", color: "#0f766e" },
  diode: { labelBase: "D", display: "Diode", color: "#7c3aed" },
};

const SAVED_LAYOUT = {
  components: [
    {
      id: "c1780409644501",
      type: "fixed",
      template: "ic4069",
      label: "U1",
      origin: { col: "J", row: 6 },
    },
    {
      id: "c1780409644503",
      type: "fixed",
      template: "batPlus",
      label: "BAT+1",
      origin: { col: "F", row: 17 },
    },
    {
      id: "c1780409644504",
      type: "fixed",
      template: "batMinus",
      label: "BAT-1",
      origin: { col: "P", row: 17 },
    },
    {
      id: "c1780409644505",
      type: "fixed",
      template: "pot",
      label: "POT1",
      origin: { col: "A", row: 7 },
      knob: 50,
    },
    {
      id: "c1780409644506",
      type: "fixed",
      template: "pot",
      label: "POT2",
      origin: { col: "T", row: 7 },
      knob: 50,
    },
    {
      id: "c1780409644507",
      type: "span",
      kind: "jumper",
      label: "W1",
      from: { col: "C", row: 14 },
      to: { col: "C", row: 9 },
    },
    {
      id: "c1780409644508",
      type: "span",
      kind: "jumper",
      label: "W2",
      from: { col: "D", row: 7 },
      to: { col: "D", row: 15 },
    },
    {
      id: "c1780409644509",
      type: "span",
      kind: "jumper",
      label: "W3",
      from: { col: "E", row: 14 },
      to: { col: "F", row: 14 },
    },
    {
      id: "c1780409644510",
      type: "span",
      kind: "jumper",
      label: "W4",
      from: { col: "E", row: 15 },
      to: { col: "F", row: 15 },
    },
    {
      id: "c1780409644511",
      type: "span",
      kind: "jumper",
      label: "W5",
      from: { col: "G", row: 17 },
      to: { col: "G", row: 12 },
    },
    {
      id: "c1780409644512",
      type: "span",
      kind: "jumper",
      label: "W6",
      from: { col: "F", row: 12 },
      to: { col: "F", row: 5 },
    },
    {
      id: "c1780409644513",
      type: "span",
      kind: "jumper",
      label: "W7",
      from: { col: "G", row: 3 },
      to: { col: "G", row: 5 },
    },
  ],
};

const svg = document.querySelector("#boardSvg");
const showNodesInput = document.querySelector("#showNodes");
const statusLine = document.querySelector("#statusLine");
const selectionPanel = document.querySelector("#selectionPanel");
const exportBox = document.querySelector("#exportBox");
const simToggleButton = document.querySelector("#simToggle");
const simLed = document.querySelector("#simLed");
const simPot1 = document.querySelector("#simPot1");
const simPot2 = document.querySelector("#simPot2");
const simTone = document.querySelector("#simTone");
const simPulse = document.querySelector("#simPulse");
const simWave = document.querySelector("#simWave");
const simPower = document.querySelector("#simPower");

let selectedTool = "select";
let selectedId = null;
let pendingSpan = null;
let hoverHole = null;
let dragState = null;
let knobDrag = null;
let idCounter = Date.now();
let saveTimer = null;
let pendingSavePayload = null;
let lastSavedPayload = "";
let components = loadFallbackComponents();
const simulator = {
  running: false,
  context: null,
  carrier: null,
  lfo: null,
  lfoDepth: null,
  masterGain: null,
};
syncIdCounter();

function setup() {
  const width = geom.left + 19 * geom.cell + 3 * geom.gap + geom.rightPad;
  const height = geom.top + 16 * geom.cell + geom.bottomPad;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      setTool(button.dataset.tool);
    });
  });

  showNodesInput.addEventListener("change", render);
  document.addEventListener("click", handleDocumentClick);

  svg.addEventListener("pointermove", handlePointerMove);
  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointerleave", handlePointerLeave);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Delete" || event.key === "Backspace") {
      if (document.activeElement === exportBox) return;
      deleteSelected();
    }
    if (event.key === "Escape") {
      pendingSpan = null;
      hoverHole = null;
      setTool("select");
    }
  });
}

function handleDocumentClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.id === "deleteBtn") {
    deleteSelected();
  } else if (button.id === "clearBtn") {
    components = [];
    selectedId = null;
    pendingSpan = null;
    hoverHole = null;
    saveComponents();
    render();
    setStatus("Cleared");
  } else if (button.id === "resetBtn") {
    loadLayoutFile();
  } else if (button.id === "exportBtn") {
    exportBox.classList.toggle("open");
    exportBox.value = JSON.stringify({ components }, null, 2);
    if (exportBox.classList.contains("open")) {
      exportBox.focus();
      exportBox.select();
    }
  } else if (button.id === "simToggle") {
    toggleSimulation();
  }
}

function defaultComponents() {
  return cloneData(SAVED_LAYOUT.components);
}

function loadFallbackComponents() {
  try {
    const saved = readStoredLayout();
    if (Array.isArray(saved?.components)) return saved.components;
  } catch {
    try {
      globalThis.localStorage?.removeItem(STORAGE_KEY);
    } catch {}
  }
  return defaultComponents();
}

async function loadLayoutFile() {
  try {
    const layout = await requestJson("GET", `${LAYOUT_URL}?t=${Date.now()}`);
    if (!Array.isArray(layout.components)) {
      throw new Error("layout.json must contain a components array");
    }
    components = layout.components;
    selectedId = null;
    pendingSpan = null;
    hoverHole = null;
    syncIdCounter();
    lastSavedPayload = JSON.stringify({ components });
    saveFallback(lastSavedPayload);
    render({ persist: false });
    setStatus("Loaded layout.json");
  } catch (error) {
    render({ persist: false });
    setStatus("Could not load layout.json; using browser fallback");
    console.error(error);
  }
}

function readStoredLayout() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  try {
    if (typeof globalThis.name === "string" && globalThis.name.startsWith(WINDOW_NAME_PREFIX)) {
      return JSON.parse(globalThis.name.slice(WINDOW_NAME_PREFIX.length));
    }
  } catch {}

  return null;
}

function saveComponents() {
  const payload = JSON.stringify({ components });
  saveFallback(payload);
  queueLayoutFileSave(payload);
}

function saveFallback(payload) {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, payload);
  } catch {}
  try {
    globalThis.name = `${WINDOW_NAME_PREFIX}${payload}`;
  } catch {}
}

function queueLayoutFileSave(payload) {
  pendingSavePayload = payload;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(flushLayoutFileSave, AUTOSAVE_DELAY_MS);
}

async function flushLayoutFileSave() {
  saveTimer = null;
  const payload = pendingSavePayload;
  pendingSavePayload = null;
  if (!payload || payload === lastSavedPayload) return;

  try {
    await requestJson("POST", LAYOUT_SAVE_URL, payload);
    lastSavedPayload = payload;
    setStatus("Saved layout.json");
  } catch (error) {
    console.error(error);
    setStatus("Browser fallback saved; server save unavailable");
  }
}

function requestJson(method, url, body) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(method, url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        try {
          resolve(JSON.parse(request.responseText || "{}"));
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`${method} ${url} failed with ${request.status}`));
      }
    };
    request.onerror = () => reject(new Error(`${method} ${url} failed`));
    request.send(body || null);
  });
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function syncIdCounter() {
  const numericIds = components
    .map((component) => Number(String(component.id || "").replace(/^c/, "")))
    .filter(Number.isFinite);
  idCounter = Math.max(idCounter, ...numericIds);
}

function setTool(tool) {
  selectedTool = tool;
  pendingSpan = null;
  hoverHole = null;
  updateBoardInteractionMode();
  document.querySelectorAll("[data-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === tool);
  });
  setStatus(toolLabel(tool));
}

function toolLabel(tool) {
  if (spanMeta[tool]) return `${spanMeta[tool].display}: first pin`;
  if (templates[tool]) return templates[tool].display;
  return "Select";
}

function setStatus(text) {
  statusLine.textContent = text;
}

function render({ persist = true } = {}) {
  svg.innerHTML = "";
  updateBoardInteractionMode();
  svg.classList.toggle("sim-running", simulator.running);
  const nodeState = computeNodeState();
  renderBoard(nodeState);
  renderComponents(nodeState);
  renderPendingPreview();
  renderHoleTargets();
  renderSelectionPanel();
  updateSimulationUi();
  if (persist) saveComponents();
}

function updateBoardInteractionMode() {
  const placing = selectedTool !== "select";
  svg.classList.toggle("placing", placing);
  svg.querySelectorAll(".hole-target").forEach((target) => {
    target.setAttribute("pointer-events", placing ? "all" : "none");
  });
}

function renderBoard(nodeState) {
  const base = group("base");
  svg.append(base);

  for (let block = 0; block < 4; block += 1) {
    const start = posOf(COLS[block * 5], 1);
    const end = posOf(COLS[block * 5 + 4], 17);
    base.append(
      rect(start.x - 17, start.y - 17, end.x - start.x + 34, end.y - start.y + 34, {
        class: "block-panel",
        rx: 8,
      })
    );
    base.append(
      text((start.x + end.x) / 2, start.y - 43, `Block ${block + 1}`, {
        class: "block-label",
      })
    );
  }

  for (const leftCol of boundaryLeftCols) {
    const left = posOf(leftCol, 1);
    const right = posOf(COLS[colIndex(leftCol) + 1], 1);
    base.append(
      rect(left.x + 15, geom.top - 20, right.x - left.x - 30, 16 * geom.cell + 40, {
        class: "gap-panel",
        rx: 6,
      })
    );
  }

  COLS.forEach((col) => {
    const p = posOf(col, 1);
    base.append(text(p.x, geom.top - 27, col, { class: "board-label" }));
  });

  ROWS.forEach((row) => {
    const p = posOf("A", row);
    base.append(text(geom.left - 36, p.y, String(row), { class: "board-label" }));
    base.append(text(posOf("T", row).x + 36, p.y, String(row), { class: "board-label" }));
  });

  if (showNodesInput.checked) {
    const nodes = group("nodes");
    svg.append(nodes);
    nodeState.nodeSegments.forEach((segment) => {
      const first = posOf(segment.fromCol, segment.row);
      const last = posOf(segment.toCol, segment.row);
      nodes.append(
        line(first.x, first.y, last.x, last.y, {
          class: "node-line",
          stroke: NODE_COLOR,
          "stroke-width": 3,
          "stroke-dasharray": "5 6",
          opacity: 0.5,
        })
      );
    });
  }

  const holes = group("holes");
  svg.append(holes);
  for (const col of COLS) {
    for (const row of ROWS) {
      const hole = { col, row };
      const p = posOf(col, row);
      const root = nodeState.rootOf(holeKey(hole));
      const isActive = nodeState.activeHoles.has(holeKey(hole));
      if (showNodesInput.checked && isActive) {
        holes.append(
          centeredRect(p.x, p.y, 15, 15, {
            class: "hole-ring",
            stroke: NODE_COLOR,
            opacity: 0.55,
            rx: 2,
          })
        );
      }
      holes.append(centeredRect(p.x, p.y, 8, 8, { class: "hole-dot", rx: 1 }));
    }
  }
}

function renderHoleTargets() {
  const targets = group("hole-targets");
  svg.append(targets);
  for (const col of COLS) {
    for (const row of ROWS) {
      const p = posOf(col, row);
      const target = circle(p.x, p.y, 14, {
        class: "hole-target",
        "data-col": col,
        "data-row": row,
        "pointer-events": selectedTool === "select" ? "none" : "all",
      });
      target.addEventListener("click", handleHoleClick);
      targets.append(target);
    }
  }
}

function renderComponents(nodeState) {
  const layer = group("components");
  svg.append(layer);
  components.forEach((component) => {
    if (component.type === "span") {
      layer.append(renderSpanComponent(component, nodeState));
    } else {
      layer.append(renderFixedComponent(component, nodeState));
    }
  });
}

function renderPendingPreview() {
  if (!pendingSpan) return;
  const preview = group("preview");
  const start = posOf(pendingSpan.from.col, pendingSpan.from.row);
  preview.append(circle(start.x, start.y, 13, { class: "preview-start" }));

  if (hoverHole && !sameHole(pendingSpan.from, hoverHole)) {
    const end = posOf(hoverHole.col, hoverHole.row);
    preview.append(path(spanPath(start, end, pendingSpan.kind), { class: "preview-line" }));
  }
  svg.append(preview);
}

function renderSpanComponent(component) {
  const p1 = posOf(component.from.col, component.from.row);
  const p2 = posOf(component.to.col, component.to.row);
  const meta = spanMeta[component.kind];
  const g = componentGroup(component);
  const pathData = spanPath(p1, p2, component.kind);

  g.append(path(pathData, { class: "component-hit" }));
  g.append(
    path(pathData, {
      class: "wire-path",
      stroke: meta.color,
      "stroke-width": component.kind === "jumper" ? 7 : 4,
    })
  );

  drawInlineComponentLabel(g, p1, p2, component.label);

  const endpointLabels = component.kind === "diode" ? ["A", "K"] : ["1", "2"];
  drawPin(g, p1, endpointColor(component.kind), endpointLabels[0]);
  drawPin(g, p2, endpointColor(component.kind), endpointLabels[1]);
  appendSpanSelection(g, p1, p2);
  return g;
}

function renderFixedComponent(component, nodeState) {
  const template = templates[component.template];
  const pins = fixedPins(component);
  const g = componentGroup(component);
  drawBodylessFixedComponent(g, component, pins);

  for (const pin of pins) {
    const root = nodeState.rootOf(holeKey(pin.hole));
    drawPin(g, pin.point, nodeState.colorForRoot(root), pin.name);
  }
  appendFixedSelection(g, pins);
  g.dataset.template = template.kind;
  return g;
}

function componentGroup(component) {
  const g = group(`component ${selectedId === component.id ? "selected" : ""}`);
  g.dataset.id = component.id;
  g.dataset.label = component.label;
  g.addEventListener("pointerdown", (event) => startDrag(event, component.id));
  g.addEventListener("click", (event) => {
    event.stopPropagation();
    selectedId = component.id;
    render();
  });
  return g;
}

function handleHoleClick(event) {
  const hole = {
    col: event.currentTarget.dataset.col,
    row: Number(event.currentTarget.dataset.row),
  };

  if (selectedTool === "select") {
    selectedId = null;
    render();
    return;
  }

  if (spanTools.has(selectedTool)) {
    placeSpanPoint(hole);
    return;
  }

  const component = makeFixedComponent(selectedTool, hole);
  if (!component) return;
  components.push(component);
  selectedId = component.id;
  setTool("select");
  render();
}

function placeSpanPoint(hole) {
  const meta = spanMeta[selectedTool];
  if (!pendingSpan) {
    pendingSpan = { kind: selectedTool, from: hole };
    hoverHole = null;
    setStatus(`${meta.display}: second pin`);
    render({ persist: false });
    return;
  }
  if (sameHole(pendingSpan.from, hole)) {
    setStatus(`${meta.display}: choose another hole`);
    return;
  }
  const component = {
    id: makeId(),
    type: "span",
    kind: pendingSpan.kind,
    label: nextLabel(meta.labelBase),
    from: pendingSpan.from,
    to: hole,
  };
  components.push(component);
  selectedId = component.id;
  pendingSpan = null;
  hoverHole = null;
  setTool("select");
  render();
}

function makeFixedComponent(templateName, clickedHole) {
  const template = templates[templateName];
  if (!template) return null;
  const origin = normalizeOrigin(template, clickedHole);
  if (!origin) {
    setStatus(`${template.display}: invalid gap`);
    return null;
  }
  const component = {
    id: makeId(),
    type: "fixed",
    template: templateName,
    label: nextLabel(template.labelBase),
    origin,
  };
  if (templateName === "pot") component.knob = 50;
  if (templateName === "switch3") component.state = "A";
  if (!canPlaceFixed(component)) {
    setStatus(`${template.display}: out of board`);
    return null;
  }
  return component;
}

function normalizeOrigin(template, hole) {
  if (template.constraint !== "boundary") return { ...hole };
  if (boundaryLeftCols.includes(hole.col)) return { ...hole };
  if (boundaryRightToLeft[hole.col]) {
    return { col: boundaryRightToLeft[hole.col], row: hole.row };
  }
  return null;
}

function canPlaceFixed(component) {
  return fixedPins(component).every((pin) => isValidHole(pin.hole));
}

function fixedPins(component) {
  const template = templates[component.template];
  return template.pins.map((pin) => {
    const hole = offsetHole(component.origin, pin.dc, pin.dr);
    return {
      ...pin,
      hole,
      point: posOf(hole.col, hole.row),
    };
  });
}

function startDrag(event, id) {
  event.preventDefault();
  event.stopPropagation();
  const component = components.find((item) => item.id === id);
  if (!component) return;
  selectedId = id;
  const nearest = nearestHole(svgPoint(event));
  dragState = {
    id,
    startNearest: nearest,
    startComponent: structuredClone(component),
  };
  event.currentTarget.classList.add("dragging");
  svg.setPointerCapture(event.pointerId);
  render();
}

function startKnobDrag(event, id) {
  event.preventDefault();
  event.stopPropagation();
  const component = components.find((item) => item.id === id && item.template === "pot");
  if (!component) return;
  selectedId = id;
  setTool("select");
  knobDrag = { id };
  svg.setPointerCapture(event.pointerId);
  updateKnobFromPointer(event);
}

function handlePointerMove(event) {
  if (knobDrag) {
    updateKnobFromPointer(event);
    return;
  }

  if (pendingSpan && !dragState) {
    const nextHover = nearestHoleWithin(svgPoint(event), 24);
    if (!sameOptionalHole(hoverHole, nextHover)) {
      hoverHole = nextHover;
      render({ persist: false });
    }
    return;
  }

  if (!dragState) return;
  const component = components.find((item) => item.id === dragState.id);
  if (!component) return;
  const current = nearestHole(svgPoint(event));
  const dc = colIndex(current.col) - colIndex(dragState.startNearest.col);
  const dr = current.row - dragState.startNearest.row;

  if (component.type === "span") {
    const moved = moveSpan(dragState.startComponent, dc, dr);
    if (moved) Object.assign(component, moved);
  } else {
    const moved = moveFixed(dragState.startComponent, dc, dr);
    if (moved) Object.assign(component, moved);
  }
  render();
}

function updateKnobFromPointer(event) {
  if (!knobDrag) return;
  const component = components.find((item) => item.id === knobDrag.id && item.template === "pot");
  if (!component) return;
  const value = knobValueFromPoint(component, svgPoint(event));
  if (value === component.knob) return;
  component.knob = value;
  render();
}

function knobValueFromPoint(component, point) {
  const center = potKnobCenter(component, fixedPins(component));
  let angle = (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI;
  if (angle < 135) angle += 360;
  return Math.round(((clamp(angle, 135, 405) - 135) / 270) * 100);
}

function handlePointerLeave(event) {
  if (hoverHole) {
    hoverHole = null;
    render({ persist: false });
  }
  endDrag(event);
}

function endDrag(event) {
  if (knobDrag) {
    try {
      svg.releasePointerCapture(event.pointerId);
    } catch {}
    knobDrag = null;
    saveComponents();
    return;
  }

  if (!dragState) return;
  try {
    svg.releasePointerCapture(event.pointerId);
  } catch {}
  dragState = null;
  saveComponents();
}

function moveSpan(component, dc, dr) {
  const from = offsetHole(component.from, dc, dr);
  const to = offsetHole(component.to, dc, dr);
  if (!isValidHole(from) || !isValidHole(to)) return null;
  return { ...component, from, to };
}

function moveFixed(component, dc, dr) {
  const origin = offsetHole(component.origin, dc, dr);
  const moved = { ...component, origin };
  if (!canPlaceFixed(moved)) return null;
  if (templates[moved.template].constraint === "boundary" && !boundaryLeftCols.includes(origin.col)) {
    return null;
  }
  return moved;
}

function deleteSelected() {
  if (!selectedId) return;
  components = components.filter((component) => component.id !== selectedId);
  selectedId = null;
  saveComponents();
  render();
  setStatus("Deleted");
}

function renderSelectionPanel() {
  const selected = components.find((component) => component.id === selectedId);
  if (!selected) {
    selectionPanel.textContent = "None";
    return;
  }
  const rows = [];
  rows.push(infoRow("Label", selected.label));
  rows.push(infoRow("Kind", displayName(selected)));
  if (selected.type === "span") {
    if (selected.kind === "diode") {
      rows.push(infoRow("Anode", holeKey(selected.from)));
      rows.push(infoRow("Cathode", holeKey(selected.to)));
    } else {
      rows.push(infoRow("From", holeKey(selected.from)));
      rows.push(infoRow("To", holeKey(selected.to)));
    }
  } else {
    rows.push(infoRow("Origin", holeKey(selected.origin)));
    rows.push(infoRow("Pins", fixedPins(selected).map((pin) => `${pin.name}:${holeKey(pin.hole)}`).join(" ")));
    if (selected.template === "switch3") {
      rows.push(infoRow("State", switchStateLabel(selected)));
      rows.push(infoRow("Connects", switchConnectionLabel(selected)));
    }
  }
  selectionPanel.innerHTML = rows.join("");

  const actions = document.createElement("div");
  actions.className = "selection-actions";

  if (selected.kind === "diode") {
    const swap = document.createElement("button");
    swap.type = "button";
    swap.textContent = "Swap";
    swap.addEventListener("click", () => {
      const from = selected.from;
      selected.from = selected.to;
      selected.to = from;
      render();
    });
    actions.append(swap);
  }

  if (selected.template === "switch3") {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.textContent = selected.state === "B" ? "Turn Off" : "Turn On";
    toggle.addEventListener("click", () => {
      toggleSwitch(selected);
    });
    actions.append(toggle);
  }

  if (selected.template === "pot") {
    const rangeRow = document.createElement("div");
    rangeRow.className = "range-row";
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "100";
    input.value = String(selected.knob ?? 50);
    input.addEventListener("input", () => {
      selected.knob = Number(input.value);
      render();
    });
    rangeRow.append(input);
    selectionPanel.append(rangeRow);
  }

  const del = document.createElement("button");
  del.type = "button";
  del.textContent = "Delete";
  del.addEventListener("click", deleteSelected);
  actions.append(del);
  selectionPanel.append(actions);
}

function infoRow(label, value) {
  return `<div class="selection-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`;
}

function toggleSwitch(component) {
  component.state = component.state === "B" ? "A" : "B";
  selectedId = component.id;
  render();
  setStatus(`${component.label} ${switchStateLabel(component)}`);
}

function switchStateLabel(component) {
  return component.state === "B" ? "ON" : "OFF";
}

function switchConnectionLabel(component) {
  const pins = Object.fromEntries(fixedPins(component).map((pin) => [pin.name, pin]));
  const target = component.state === "B" ? pins.B : pins.A;
  if (!pins.COM || !target) return "--";
  return `${holeKey(pins.COM.hole)}-${holeKey(target.hole)}`;
}

async function toggleSimulation() {
  if (simulator.running) {
    stopSimulation();
    return;
  }
  await startSimulation();
}

async function startSimulation() {
  const AudioContextClass = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!AudioContextClass) {
    setStatus("Audio unavailable");
    return;
  }

  if (!simulator.context) simulator.context = new AudioContextClass();
  await simulator.context.resume();

  const context = simulator.context;
  simulator.carrier = context.createOscillator();
  simulator.carrier.type = "square";
  simulator.lfo = context.createOscillator();
  simulator.lfo.type = "sine";
  simulator.lfoDepth = context.createGain();
  simulator.masterGain = context.createGain();

  simulator.masterGain.gain.value = 0.035;
  simulator.lfoDepth.gain.value = 0.024;
  simulator.carrier.connect(simulator.masterGain);
  simulator.lfo.connect(simulator.lfoDepth);
  simulator.lfoDepth.connect(simulator.masterGain.gain);
  simulator.masterGain.connect(context.destination);
  simulator.carrier.start();
  simulator.lfo.start();
  simulator.running = true;
  updateSimulationUi();
  render({ persist: false });
  setStatus("Simulation running");
}

function stopSimulation() {
  ["carrier", "lfo"].forEach((key) => {
    try {
      simulator[key]?.stop();
    } catch {}
    try {
      simulator[key]?.disconnect();
    } catch {}
    simulator[key] = null;
  });
  try {
    simulator.lfoDepth?.disconnect();
    simulator.masterGain?.disconnect();
  } catch {}
  simulator.lfoDepth = null;
  simulator.masterGain = null;
  simulator.running = false;
  updateSimulationUi();
  render({ persist: false });
  setStatus("Simulation stopped");
}

function updateSimulationUi() {
  const model = simulationModel();
  document.body.classList.toggle("sim-running", simulator.running);
  simToggleButton.textContent = simulator.running ? "Stop Buzzer" : "Start Buzzer";
  simToggleButton.classList.toggle("active", simulator.running);
  simLed.classList.toggle("active", simulator.running && model.powered);
  simPot1.textContent = `${model.pot1}%`;
  simPot2.textContent = `${model.pot2}%`;
  simTone.textContent = `${model.toneHz} Hz`;
  simPulse.textContent = `${model.pulseHz.toFixed(1)} Hz`;
  simWave.textContent = model.waveLabel;
  simPower.textContent = model.powered ? "on" : "off";
  updateAudioFromModel(model);
}

function simulationModel() {
  const pot1 = normalizedKnob(components.find((component) => component.label === "POT1")?.knob);
  const pot2 = normalizedKnob(components.find((component) => component.label === "POT2")?.knob);
  const diodeShape = diodeShapeDirection();
  return {
    pot1,
    pot2,
    pulseHz: logInterpolate(0.8, 18, pot1 / 100),
    toneHz: Math.round(logInterpolate(90, 1600, pot2 / 100)),
    audioWaveType: diodeShape === "none" ? "square" : "sawtooth",
    waveLabel: diodeShape === "pinned" ? "sawtooth-like" : diodeShape === "flipped" ? "sawtooth-like (D1 flipped)" : "square",
    powered: isSimulationPowered(),
  };
}

function isSimulationPowered() {
  const switchComponent = components.find((component) => component.template === "switch3" && component.label === "SW1");
  const hasPositive = components.some((component) => component.template === "batPlus");
  const hasNegative = components.some((component) => component.template === "batMinus");
  return hasPositive && hasNegative && (!switchComponent || switchComponent.state === "B");
}

function updateAudioFromModel(model = simulationModel()) {
  if (!simulator.running || !simulator.context || !simulator.carrier || !simulator.lfo || !simulator.masterGain) return;
  const time = simulator.context.currentTime;
  simulator.carrier.type = model.audioWaveType;
  simulator.carrier.frequency.setTargetAtTime(model.toneHz, time, 0.03);
  simulator.lfo.frequency.setTargetAtTime(model.pulseHz, time, 0.04);
  simulator.masterGain.gain.setTargetAtTime(model.powered ? 0.035 : 0.0001, time, 0.025);
  simulator.lfoDepth.gain.setTargetAtTime(model.powered ? 0.024 : 0, time, 0.025);
}

function diodeShapeDirection() {
  const diode = components.find((component) => component.type === "span" && component.kind === "diode" && component.label === "D1");
  const oneY = findFixedPin("U1", "1Y");
  const twoA = findFixedPin("U1", "2A");
  if (!diode || !oneY || !twoA) return "none";

  const nodeState = computeNodeState();
  const fromRoot = nodeState.rootOf(holeKey(diode.from));
  const toRoot = nodeState.rootOf(holeKey(diode.to));
  const oneYRoot = nodeState.rootOf(holeKey(oneY.hole));
  const twoARoot = nodeState.rootOf(holeKey(twoA.hole));

  // Pinned physical direction: visible band/cathode on the lower node.
  // In this layout that means anode at L10/twoA and cathode at L11/oneY.
  if (fromRoot === twoARoot && toRoot === oneYRoot) return "pinned";

  // Opposite insertion still gives an asymmetric ramp, but with the fast and slow edges reversed.
  if (fromRoot === oneYRoot && toRoot === twoARoot) return "flipped";

  return "none";
}

function findFixedPin(componentLabel, pinName) {
  const component = components.find((item) => item.type === "fixed" && item.label === componentLabel);
  return component ? fixedPins(component).find((pin) => pin.name === pinName) : null;
}

function logInterpolate(min, max, value) {
  const amount = clamp(value, 0, 1);
  return min * (max / min) ** amount;
}

function computeNodeState() {
  const dsu = new DisjointSet(COLS.flatMap((col) => ROWS.map((row) => holeKey({ col, row }))));

  ROWS.forEach((row) => {
    for (let block = 0; block < 4; block += 1) {
      const first = holeKey({ col: COLS[block * 5], row });
      for (let offset = 1; offset < 5; offset += 1) {
        dsu.union(first, holeKey({ col: COLS[block * 5 + offset], row }));
      }
    }
  });

  const activeHoles = new Set();
  components.forEach((component) => {
    const pins = componentPins(component);
    pins.forEach((pin) => activeHoles.add(holeKey(pin.hole)));
    if (component.type === "span" && component.kind === "jumper") {
      dsu.union(holeKey(component.from), holeKey(component.to));
    }
    if (component.template === "switch3") {
      const fixed = fixedPins(component);
      const com = fixed.find((pin) => pin.name === "COM");
      const target = fixed.find((pin) => pin.name === (component.state || "A"));
      if (com && target) dsu.union(holeKey(com.hole), holeKey(target.hole));
    }
  });

  const activeRoots = new Set(Array.from(activeHoles).map((key) => dsu.find(key)));
  const nodeSegments = computeNodeSegments(activeHoles);

  return {
    activeHoles,
    activeRoots,
    nodeSegments,
    rootOf: (key) => dsu.find(key),
    colorForRoot: () => NODE_COLOR,
  };
}

function computeNodeSegments(activeHoles) {
  const groups = new Map();
  activeHoles.forEach((key) => {
    const hole = parseHoleKey(key);
    const block = Math.floor(colIndex(hole.col) / 5);
    const groupKey = `${block}:${hole.row}`;
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push(hole.col);
  });

  return Array.from(groups.entries())
    .map(([groupKey, cols]) => {
      const [block, row] = groupKey.split(":").map(Number);
      const uniqueCols = Array.from(new Set(cols)).sort((a, b) => colIndex(a) - colIndex(b));
      if (uniqueCols.length < 2) return null;
      return {
        block,
        row,
        fromCol: uniqueCols[0],
        toCol: uniqueCols[uniqueCols.length - 1],
      };
    })
    .filter(Boolean);
}

function componentPins(component) {
  if (component.type === "span") {
    if (component.kind === "diode") {
      return [
        { name: "A", hole: component.from },
        { name: "K", hole: component.to },
      ];
    }
    return [
      { name: "1", hole: component.from },
      { name: "2", hole: component.to },
    ];
  }
  return fixedPins(component);
}

function drawBodylessFixedComponent(g, component, pins) {
  if (component.template === "ic4069") {
    drawBodylessLabel(g, component, pins, `CD4069 ${component.label}`);
    return;
  }

  if (component.template === "buzzer") {
    drawBuzzerSymbol(g, component, pins);
    drawBodylessLabel(g, component, pins, fixedLabel(component));
    return;
  }

  if (component.template === "switch3") {
    drawSwitchSymbol(g, component, pins);
    drawBodylessLabel(g, component, pins, fixedLabel(component));
    return;
  }

  if (pins.length > 1) {
    const d = pins
      .map((pin, index) => `${index === 0 ? "M" : "L"} ${pin.point.x} ${pin.point.y}`)
      .join(" ");
    g.append(path(d, {
      class: "bodyless-link",
      stroke: fixedConnectorColor(component),
      "stroke-width": 4,
    }));
    g.append(path(d, { class: "component-hit" }));
  }

  if (component.template === "pot") {
    drawPotKnob(g, component, pins);
  }

  drawBodylessLabel(g, component, pins, fixedLabel(component));
}

function drawBodylessLabel(g, component, pins, label) {
  const center = pointsCenter(pins.map((pin) => pin.point));
  const offset = labelOffsetFor(component, pins);
  g.append(text(center.x + offset.x, center.y + offset.y, label, { class: "component-label" }));
}

function drawBuzzerSymbol(g, component, pins) {
  const center = pointsCenter(pins.map((pin) => pin.point));
  const radius = 25;
  g.append(circle(center.x, center.y, radius + 8, { class: "component-hit" }));
  g.append(circle(center.x, center.y, radius, { class: "buzzer-face" }));
  g.append(circle(center.x, center.y, 7, { class: "buzzer-hole" }));
}

function drawSwitchSymbol(g, component, pins) {
  const pinByName = Object.fromEntries(pins.map((pin) => [pin.name, pin]));
  const from = pinByName.COM;
  const to = pinByName[component.state === "B" ? "B" : "A"];
  const other = pinByName[component.state === "B" ? "A" : "B"];
  if (!from || !to || !other) return;

  g.append(line(from.point.x, from.point.y, other.point.x, other.point.y, { class: "switch-ghost-link" }));
  g.append(line(from.point.x, from.point.y, to.point.x, to.point.y, {
    class: `switch-throw ${component.state === "B" ? "on" : "off"}`,
  }));

  const center = pointsCenter(pins.map((pin) => pin.point));
  const side = colIndex(component.origin.col) >= 15 ? -1 : 1;
  const toggleCenter = { x: center.x + side * 38, y: center.y };
  const hitX = Math.min(from.point.x, toggleCenter.x) - 18;
  const hitY = Math.min(pinByName.A.point.y, toggleCenter.y - 27) - 10;
  const hitWidth = Math.abs(toggleCenter.x - from.point.x) + 36;
  const hitHeight = pinByName.B.point.y - pinByName.A.point.y + 20;
  g.append(rect(hitX, hitY, hitWidth, hitHeight, { class: "component-hit", rx: 8 }));

  const toggle = group(`switch-toggle ${component.state === "B" ? "on" : "off"}`);
  toggle.append(rect(toggleCenter.x - 16, toggleCenter.y - 27, 32, 54, { class: "switch-toggle-track", rx: 16 }));
  toggle.append(circle(toggleCenter.x, toggleCenter.y + (component.state === "B" ? 13 : -13), 10, {
    class: "switch-toggle-knob",
  }));
  toggle.append(text(toggleCenter.x, toggleCenter.y + 36, component.state === "B" ? "ON" : "OFF", {
    class: "switch-toggle-label",
  }));
  toggle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleSwitch(component);
  });
  g.append(toggle);
}

function drawPotKnob(g, component, pins) {
  const knob = group("pot-knob-group");
  const center = potKnobCenter(component, pins);
  const value = normalizedKnob(component.knob);
  const angle = potValueAngle(value);
  const pointer = polarPoint(center, angle, 17);

  knob.append(circle(center.x, center.y, 25, { class: "pot-knob-face" }));
  knob.append(line(center.x, center.y, pointer.x, pointer.y, { class: "pot-knob-pointer" }));
  knob.append(circle(center.x, center.y, 4, { class: "pot-knob-center" }));
  knob.addEventListener("pointerdown", (event) => startKnobDrag(event, component.id));
  g.append(knob);
}

function fixedLabel(component) {
  if (component.template === "pot") return `${component.label} ${component.knob ?? 50}%`;
  if (component.template === "switch3") return `${component.label} ${switchStateLabel(component)}`;
  return component.label;
}

function fixedConnectorColor(component) {
  if (component.template === "led") return "#ca8a04";
  if (component.template === "capCyl" || component.template === "capChip") return "#64748b";
  if (component.template === "buzzer") return "#111827";
  if (component.template === "switch3") return "#c2410c";
  if (component.template === "pot") return "#0891b2";
  if (component.template === "transistor") return "#253244";
  return "#475569";
}

function labelOffsetFor(component, pins = []) {
  if (component.template === "batPlus" || component.template === "batMinus") return { x: 0, y: 29 };
  if (component.template === "ic4069") return { x: 0, y: 0 };
  if (component.template === "pot") return { x: potKnobSide(component, pins) * 42, y: 33 };
  if (component.template === "buzzer") return { x: 0, y: -35 };
  if (component.template === "transistor") return { x: 42, y: 0 };
  if (component.template === "switch3") {
    const side = colIndex(component.origin.col) >= 15 ? -1 : 1;
    return { x: side * 42, y: 36 };
  }
  if (component.template === "capCyl" || component.template === "capChip") return { x: 34, y: 0 };
  if (component.template === "led") return { x: 34, y: 0 };
  return { x: 0, y: -18 };
}

function potKnobCenter(component, pins) {
  const center = pointsCenter(pins.map((pin) => pin.point));
  return {
    x: center.x + potKnobSide(component, pins) * 43,
    y: center.y,
  };
}

function potKnobSide(component, pins = []) {
  const col = pins[0]?.hole?.col || component.origin?.col || "A";
  return colIndex(col) >= 15 ? -1 : 1;
}

function normalizedKnob(value) {
  return clamp(Number(value ?? 50), 0, 100);
}

function potValueAngle(value) {
  return 135 + (normalizedKnob(value) / 100) * 270;
}

function polarPoint(center, angleDegrees, radius) {
  const radians = (angleDegrees * Math.PI) / 180;
  return {
    x: center.x + Math.cos(radians) * radius,
    y: center.y + Math.sin(radians) * radius,
  };
}

function drawInlineComponentLabel(g, p1, p2, label) {
  const mid = midpoint(p1, p2);
  const offset = Math.abs(p1.y - p2.y) < 0.5 ? -15 : 0;
  g.append(text(mid.x, mid.y + offset, label, { class: "component-label" }));
}

function drawPin(g, point, fill, label) {
  g.append(centeredRect(point.x, point.y, 16, 16, { class: "pin-dot", fill, rx: 2 }));
  if (label.length <= 3) {
    g.append(text(point.x, point.y, label, { class: "pin-label" }));
  }
}

function appendSpanSelection(g, p1, p2) {
  if (!g.classList.contains("selected")) return;
  const minX = Math.min(p1.x, p2.x) - 20;
  const minY = Math.min(p1.y, p2.y) - 20;
  const width = Math.abs(p1.x - p2.x) + 40;
  const height = Math.abs(p1.y - p2.y) + 40;
  g.append(rect(minX, minY, width, height, { class: "select-outline", rx: 6 }));
}

function appendFixedSelection(g, pins) {
  if (!g.classList.contains("selected")) return;
  const xs = pins.map((pin) => pin.point.x);
  const ys = pins.map((pin) => pin.point.y);
  const minX = Math.min(...xs) - 34;
  const minY = Math.min(...ys) - 34;
  const width = Math.max(...xs) - Math.min(...xs) + 68;
  const height = Math.max(...ys) - Math.min(...ys) + 68;
  g.append(rect(minX, minY, width, height, { class: "select-outline", rx: 6 }));
}

function spanPath(p1, p2, kind) {
  if (kind !== "jumper") return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  if (Math.abs(p1.x - p2.x) < 0.5 || Math.abs(p1.y - p2.y) < 0.5) {
    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  }
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.hypot(dx, dy);
  const bend = Math.min(72, Math.max(18, distance * 0.18));
  const cx = (p1.x + p2.x) / 2;
  const cy = (p1.y + p2.y) / 2 - bend;
  return `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
}

function endpointColor(kind) {
  return spanMeta[kind]?.color || "#64748b";
}

function displayName(component) {
  if (component.type === "span") return spanMeta[component.kind].display;
  return templates[component.template].display;
}

function nextLabel(base) {
  const used = new Set(components.map((component) => component.label));
  let index = 1;
  while (used.has(`${base}${index}`)) index += 1;
  return `${base}${index}`;
}

function makeId() {
  idCounter += 1;
  return `c${idCounter}`;
}

function posOf(col, row) {
  const index = colIndex(col);
  return {
    x: geom.left + index * geom.cell + Math.floor(index / 5) * geom.gap,
    y: geom.top + (row - 1) * geom.cell,
  };
}

function colIndex(col) {
  return COLS.indexOf(col);
}

function offsetHole(hole, dc, dr) {
  return {
    col: COLS[colIndex(hole.col) + dc],
    row: hole.row + dr,
  };
}

function isValidHole(hole) {
  return Boolean(hole && COLS.includes(hole.col) && hole.row >= 1 && hole.row <= 17);
}

function holeKey(hole) {
  return `${hole.col}${hole.row}`;
}

function sameHole(a, b) {
  return a.col === b.col && a.row === b.row;
}

function svgPoint(event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

function nearestHole(point) {
  let nearest = { col: "A", row: 1 };
  let best = Infinity;
  for (const col of COLS) {
    for (const row of ROWS) {
      const p = posOf(col, row);
      const d = Math.hypot(point.x - p.x, point.y - p.y);
      if (d < best) {
        best = d;
        nearest = { col, row };
      }
    }
  }
  return nearest;
}

function nearestHoleWithin(point, maxDistance) {
  const nearest = nearestHole(point);
  const p = posOf(nearest.col, nearest.row);
  return Math.hypot(point.x - p.x, point.y - p.y) <= maxDistance ? nearest : null;
}

function sameOptionalHole(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return sameHole(a, b);
}

function parseHoleKey(key) {
  return {
    col: key.slice(0, 1),
    row: Number(key.slice(1)),
  };
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function pointsCenter(points) {
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function group(className) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "g");
  if (className) element.setAttribute("class", className);
  return element;
}

function circle(cx, cy, r, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  return setAttrs(element, { cx, cy, r, ...attrs });
}

function rect(x, y, width, height, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  return setAttrs(element, { x, y, width, height, ...attrs });
}

function centeredRect(cx, cy, width, height, attrs = {}) {
  return rect(cx - width / 2, cy - height / 2, width, height, attrs);
}

function line(x1, y1, x2, y2, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "line");
  return setAttrs(element, { x1, y1, x2, y2, ...attrs });
}

function path(d, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "path");
  return setAttrs(element, { d, ...attrs });
}

function text(x, y, content, attrs = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", "text");
  element.textContent = content;
  return setAttrs(element, { x, y, ...attrs });
}

function setAttrs(element, attrs) {
  Object.entries(attrs).forEach(([key, value]) => {
    if (value !== undefined && value !== null) element.setAttribute(key, value);
  });
  return element;
}

class DisjointSet {
  constructor(keys) {
    this.parent = new Map(keys.map((key) => [key, key]));
  }

  find(key) {
    const parent = this.parent.get(key);
    if (parent === key) return key;
    const root = this.find(parent);
    this.parent.set(key, root);
    return root;
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) this.parent.set(rootB, rootA);
  }
}

setup();
render({ persist: false });
loadLayoutFile();
