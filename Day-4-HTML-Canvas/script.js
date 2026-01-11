console.log("HTML Canvas Simple Drawing App Loaded");

const colorInput = document.getElementById("colorInput");
const colorButton = document.getElementById("colorButton");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// const colorInput = document.getElementById("color");
const sizeInput = document.getElementById("size");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const controlPanel = document.querySelector(".control-panel");

// When custom button is clicked, trigger hidden color input
colorButton.addEventListener("click", () => {
  colorInput.click();
});

// When color changes, update button and text
colorInput.addEventListener("input", () => {
  const selectedColor = colorInput.value;
  colorButton.style.background = selectedColor;
});

/* ===============================
   BASIC SETUP
================================ */

// To detect mobile position
function getPointerPosition(e) {
  if (e.touches) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }
  return {
    x: e.offsetX,
    y: e.offsetY,
  };
}

/* HiDPI support */
function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  ctx.scale(ratio, ratio);
}
resizeCanvas();

/* ===============================
   DRAWING STATE
================================ */

let isDrawing = false;
let currentPath = [];
let paths = [];
let redoStack = [];
let mode = "draw"; // "draw" or "erase"

ctx.lineCap = "round";
ctx.lineJoin = "round";

/* ===============================
   DRAWING LOGIC
================================ */

function startDrawing(e) {
  e.preventDefault();
  isDrawing = true;
  redoStack = [];
  const { x, y } = getPointerPosition(e);

  currentPath = [
    {
      x,
      y,
      color: colorInput.value,
      size: Number(sizeInput.value),
      mode,
    },
  ];
}

function draw(e) {
  e.preventDefault();
  if (!isDrawing) return;
  const { x, y } = getPointerPosition(e);
  const point = {
    x,
    y,
    color: colorInput.value,
    size: Number(sizeInput.value),
    mode,
  };

  currentPath.push(point);

  ctx.strokeStyle = point.color;
  ctx.lineWidth = point.size;

  ctx.globalCompositeOperation =
    point.mode === "erase" ? "destination-out" : "source-over";

  ctx.beginPath();
  const prev = currentPath[currentPath.length - 2];
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  paths.push(currentPath);
}

/* ===============================
   REDRAW ALL PATHS
================================ */

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  paths.forEach((path) => {
    ctx.beginPath();

    path.forEach((p, i) => {
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.globalCompositeOperation =
        p.mode === "erase" ? "destination-out" : "source-over";

      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });

    ctx.stroke();
  });
}

/* ===============================
   UNDO / REDO
================================ */

function undo() {
  if (!paths.length) return;
  redoStack.push(paths.pop());
  redraw();
}

function redo() {
  if (!redoStack.length) return;
  paths.push(redoStack.pop());
  redraw();
}

/* ===============================
   CLEAR
================================ */

clearBtn.addEventListener("click", () => {
  paths = [];
  redoStack = [];
  redraw();
});

/* ===============================
   EXPORT PDF
================================ */

exportBtn.addEventListener("click", () => {
  const image = canvas.toDataURL("image/png");

  const pdf = new jspdf.jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(image, "PNG", 0, 0);
  pdf.save("drawing.pdf");
});

/* ===============================
   KEYBOARD SHORTCUTS FOR UNDO/REDO & MODE SWITCHING
================================ */

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") undo();
  if (e.ctrlKey && e.key === "y") redo();
  if (e.key === "e") mode = "erase";
  if (e.key === "b") mode = "draw";
});

/*==============================
BUTTON EVENTS FOR UNDO/REDO Mobile & Desktop
================================*/
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

/* ===============================
   MOUSE EVENTS FOR DESKTOP
================================ */

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

/*==============================
TOUCH EVENTS FOR MOBILE
================================*/
canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

/* ===============================
   DRAGGABLE CONTROL PANEL For DESKTOP
================================ */

let isDragging = false;
let offsetX, offsetY;

controlPanel.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - controlPanel.offsetLeft;
  offsetY = e.clientY - controlPanel.offsetTop;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  controlPanel.style.left = `${e.clientX - offsetX}px`;
  controlPanel.style.top = `${e.clientY - offsetY}px`;
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});
/*
==============================
DRAGGABLE CONTROL PANEL FOR MOBILE
==============================
*/
controlPanel.addEventListener("touchstart", (e) => {
  isDragging = true;
  offsetX = e.clientX - controlPanel.offsetLeft;
  offsetY = e.clientY - controlPanel.offsetTop;
});

window.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  controlPanel.style.left = `${e.clientX - offsetX}px`;
  controlPanel.style.top = `${e.clientY - offsetY}px`;
});

window.addEventListener("touchend", () => {
  isDragging = false;
});
