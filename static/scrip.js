document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const git title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('due-date').value;

        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, due_date: dueDate }),
        });

        if (response.ok) {
            const task = await response.json();
            addTaskToUI(task);
            taskForm.reset();
        } else {
            console.error("Your task couldn't. Do you mind retrying?");
        }
    });

    async function fetchTasks() {
        const response = await fetch('/tasks');
        if (response.ok) {
            const tasks = await response.json();
            tasks.forEach(addTaskToUI);
        }
    }

    fetchTasks();

    function addTaskToUI(task) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong>${task.title}</strong><br>${task.description}</span>
            <span>${task.due_date}</span>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        taskList.appendChild(li);

        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            const taskId = deleteBtn.getAttribute('data-id');
            const response = await fetch(`/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                li.remove();
            } else {
                console.error('Failed to delete task');
            }
        });
    }
});
