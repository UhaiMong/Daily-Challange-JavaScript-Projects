/* =========================
   STATE
========================= */
const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNoteBtn");

let notes = JSON.parse(localStorage.getItem("sticky-notes")) || [];
let highestZ = notes.reduce((max, n) => Math.max(max, n.zIndex), 1);
let stickyX = 0;
let stickyY = 0;
/* =========================
   UTILITIES
========================= */
function saveNotes() {
  localStorage.setItem("sticky-notes", JSON.stringify(notes));
}

function generateId() {
  return crypto.randomUUID();
}

function getPointerPosition(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }
  return { x: e.clientX, y: e.clientY };
}

/* =========================
   CREATE NOTE
========================= */
function createNote(stickyColor) {
  const note = {
    id: generateId(),
    x: (stickyX += 60),
    y: (stickyY += 40),
    title: "",
    content: "",
    color: stickyColor || "#ffeb3b",
    zIndex: ++highestZ,
  };

  notes.push(note);
  saveNotes();
  renderNotes();
}

/* =========================
   DELETE NOTE
========================= */
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  renderNotes();
}

/* =========================
   RENDER
========================= */
function renderNotes() {
  notesContainer.innerHTML = "";

  notes.forEach((note) => {
    const el = document.createElement("div");
    el.className = "note";
    el.style.transform = `translate3d(${note.x}px, ${note.y}px, 0)`;

    el.style.zIndex = note.zIndex;
    el.style.background = note.color;

    el.innerHTML = `
    <div class="note-drag-handle"></div>
    <div class="note-header">
        <input placeholder="Title" class="note-title" value="${note.title}" />
        <button class="delete-btn">✕</button>
      </div>
      <textarea placeholder="Your note..." class="note-content">${note.content}</textarea>
    `;

    enableDragging(el, note);
    enableEditing(el, note);

    el.querySelector(".delete-btn").onclick = () => deleteNote(note.id);

    el.addEventListener("pointerdown", () => bringToFront(note, el));

    notesContainer.appendChild(el);
  });
}

/* =========================
   BRING TO FRONT
========================= */
function bringToFront(note, el) {
  note.zIndex = ++highestZ;
  el.style.zIndex = note.zIndex;
  saveNotes();
}

/* =========================
   EDITING
========================= */
function enableEditing(el, note) {
  const titleInput = el.querySelector(".note-title");
  const contentArea = el.querySelector(".note-content");

  titleInput.oninput = () => {
    note.title = titleInput.value;
    saveNotes();
  };

  contentArea.oninput = () => {
    note.content = contentArea.value;
    saveNotes();
  };
}

/* =========================
   DRAGGING (DESKTOP + MOBILE)
========================= */
function enableDragging(el, note) {
  const handle = el.querySelector(".note-drag-handle");

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let rafId = null;
  let lastX = 0;
  let lastY = 0;

  el.style.willChange = "transform";

  function start(e) {
    if (e.target.closest("input, textarea")) return;

    e.preventDefault();
    isDragging = true;

    bringToFront(note, el);

    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  }

  function move(e) {
    if (!isDragging) return;

    lastX = e.clientX - offsetX;
    lastY = e.clientY - offsetY;

    if (!rafId) {
      rafId = requestAnimationFrame(update);
    }
  }

  function update() {
    note.x = lastX;
    note.y = lastY;
    el.style.transform = `translate3d(${note.x}px, ${note.y}px, 0)`;
    rafId = null;
  }

  function end() {
    isDragging = false;

    cancelAnimationFrame(rafId);
    rafId = null;

    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);

    saveNotes(); // ✅ ALWAYS fires on mobile
  }

  handle.addEventListener("pointerdown", start);
}

/* =========================
   INIT
========================= */
addNoteBtn.addEventListener("click", () => {
  const colors = ["#ffeb3b", "#8bc34a", "#03a9f4"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  createNote(randomColor);
});

renderNotes();
