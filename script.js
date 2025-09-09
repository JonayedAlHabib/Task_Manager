const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('search');
const filterStatus = document.getElementById('filterStatus');
const sortSelect = document.getElementById('sort');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  let filtered = tasks.filter(task =>
    task.title.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  // Filter by status
  filtered = filtered.filter(task => {
    if (filterStatus.value === 'completed') return task.completed;
    if (filterStatus.value === 'pending') return !task.completed && new Date(task.date) >= new Date();
    if (filterStatus.value === 'overdue') return !task.completed && new Date(task.date) < new Date();
    return true;
  });

  // Sorting
  if (sortSelect.value === 'date') {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortSelect.value === 'priority') {
    const order = { High: 1, Medium: 2, Low: 3 };
    filtered.sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (sortSelect.value === 'alpha') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  filtered.forEach((task, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <div class="task-info">
        <strong>${task.title}</strong> [${task.category}] - ${task.priority} - ${task.date}
        <br>Status: ${task.completed ? '✅ Completed' : '⏳ Pending'}
      </div>
      <div class="task-actions">
        <button class="complete-btn" onclick="toggleComplete(${index})">✔</button>
        <button class="edit-btn" onclick="editTask(${index})">✏</button>
        <button class="delete-btn" onclick="deleteTask(${index})">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const priority = document.getElementById('priority').value;
  const date = document.getElementById('date').value;

  tasks.push({ title, category, priority, date, completed: false });
  saveTasks();
  renderTasks();
  taskForm.reset();
});

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById('title').value = task.title;
  document.getElementById('category').value = task.category;
  document.getElementById('priority').value = task.priority;
  document.getElementById('date').value = task.date;
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

searchInput.addEventListener('input', renderTasks);
filterStatus.addEventListener('change', renderTasks);
sortSelect.addEventListener('change', renderTasks);

renderTasks();
