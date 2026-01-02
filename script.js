const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const columns = document.querySelectorAll(".column");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* ---------- Core Logic ---------- */

function addTask(text) {
  const task = {
    id: Date.now(),
    text,
    status: "todo",
  };

  tasks.push(task);
  saveAndRender();
}

function moveTask(id, direction) {
  const task = tasks.find((t) => t.id === id);
  const order = ["todo", "progress", "done"];
  const index = order.indexOf(task.status);
  const newIndex = index + direction;

  // ⛔ prevent invalid movement
  if (newIndex < 0 || newIndex >= order.length) return;

  task.status = order[newIndex];
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveAndRender();
}

/* ---------- Render ---------- */

function renderTasks() {
  columns.forEach((col) => (col.querySelector(".task-list").innerHTML = ""));

  tasks.forEach((task) => {
    const taskEl = document.createElement("div");
    taskEl.className = "task";
    taskEl.innerHTML = `
      <span>${task.text}</span>
      <div>
        ${task.status !== "todo" ? `<button data-left>◀</button>` : ""}
        ${task.status !== "done" ? `<button data-right>▶</button>` : ""}
        <button data-delete>✖</button>
      </div>
    `;

    taskEl.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-left")) {
        moveTask(task.id, -1);
      }

      if (e.target.hasAttribute("data-right")) {
        moveTask(task.id, 1);
      }

      if (e.target.hasAttribute("data-delete")) {
        deleteTask(task.id);
      }
    });

    document
      .querySelector(`[data-status="${task.status}"] .task-list`)
      .appendChild(taskEl);
  });
}

/* ---------- Helpers ---------- */

function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

/* ---------- Events ---------- */

addTaskBtn.addEventListener("click", () => {
  if (!taskInput.value.trim()) return;
  addTask(taskInput.value.trim());
  taskInput.value = "";
});

/* ---------- Init ---------- */

renderTasks();
