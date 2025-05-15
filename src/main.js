const apiUrl = "http://localhost:3000/api/todos";

const form = document.querySelector("form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");

// Fetch and render all todos
async function fetchTodos() {
  const res = await fetch(apiUrl);
  const todos = await res.json();
  list.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="check" data-id="${todo.id}" ${todo.completed ? "checked" : ""} />
      <span contenteditable="true" class="todo-text" data-id="${todo.id}">${todo.text}</span>
      <button data-id="${todo.id}" class="delete">Delete</button>
    `;
    list.appendChild(li);
  });

  // Add event listeners for checkboxes (completed toggle)
  document.querySelectorAll(".check").forEach((checkbox) => {
    checkbox.addEventListener("change", async (e) => {
      const id = e.target.dataset.id;
      const completed = e.target.checked;
      await fetch(`${apiUrl}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      // Optionally re-fetch or update UI here
      fetchTodos();
    });
  });

  // Add event listeners for inline text editing (on blur)
  document.querySelectorAll(".todo-text").forEach((span) => {
    span.addEventListener("blur", async (e) => {
      const id = e.target.dataset.id;
      const text = e.target.innerText.trim();
      if (text.length === 0) return; // skip empty updates
      await fetch(`${apiUrl}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    });
  });
}

// Create new todo on form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  input.value = "";
  fetchTodos();
});

// Delete todo on button click
list.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    fetchTodos();
  }
});

fetchTodos();
