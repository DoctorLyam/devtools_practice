let tasks = [];
let answers = {};

const API_BASE = 'http://localhost:8000';

async function loadTasks() {
    try {
        const res = await fetch(`${API_BASE}/tasks`);
        if (!res.ok) throw new Error(`Ошибка загрузки: ${res.status}`);
        tasks = await res.json();
        renderTasks();
    } catch (err) {
        console.error("Ошибка загрузки заданий:", err);
        document.getElementById('tasks-container').innerHTML = `
            <p style="color: red;">Ошибка загрузки заданий: ${err.message}</p>
        `;
    }
}

function renderTasks() {
    const container = document.getElementById('tasks-container');
    container.innerHTML = '';

    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.id = `task-${task.id}`;

        // Для задания 7 — поле ввода
        let inputHtml = '';
        if (task.id === 7) {
            inputHtml = `<input id="input-age" placeholder="Введите значение для age" />`;
        }

        // Для задания 8 — квадрат
        let squareHtml = '';
        if (task.id === 8) {
            squareHtml = `<div id="color-square"></div>`;
        }

        // Для задания 8 убираем кнопку действия
        const actionButton = task.id !== 8
            ? `<button onclick="simulateAction(${task.id})">Выполнить действие</button>`
            : '';

        taskDiv.innerHTML = `
            <p><strong>Задание ${task.id}:</strong> ${task.question}</p>
            ${inputHtml}
            <button onclick="answerTask(${task.id}, true)">Работает с ошибкой</button>
            <button onclick="answerTask(${task.id}, false)">Работает правильно</button>
            ${actionButton}
            ${squareHtml}
        `;

        container.appendChild(taskDiv);
    });
}

function answerTask(taskId, userAnswer) {
    answers[taskId] = userAnswer;

    const taskDiv = document.getElementById(`task-${taskId}`);
    const buttons = taskDiv.querySelectorAll('button');
    buttons.forEach(btn => btn.classList.remove('selected'));

    if (userAnswer) {
        buttons[0].classList.add('selected');
    } else {
        buttons[1].classList.add('selected');
    }
}

async function simulateAction(taskId) {
    try {
        switch (taskId) {
            case 1:
                await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'POST' });
                break;
            case 2:
                await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'POST' });
                break;
            case 3:
                await fetch(`${API_BASE}/tasks/${taskId}?devtools=1`);
                break;
            case 4:
                await fetch(`${API_BASE}/tasks/${taskId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ count: 1 }),
                });
                break;
            case 5:
                await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'GET' });
                break;
            case 6:
                const res = await fetch(`${API_BASE}/tasks/${taskId}`);
                console.log('x-api-key:', res.headers.get('x-api-key'));
                break;
            case 7:
                const val = document.getElementById('input-age')?.value;
                if (val !== undefined && val !== '') {
                    sessionStorage.setItem('kek', val);
                }
                break;
            default:
                break;
        }
    } catch (err) {
        console.error('Ошибка при выполнении действия:', err);
    }
}

function resetAnswers() {
    answers = {};
    document.getElementById('final-message').innerText = '';
    renderTasks();
}

function submitAnswers() {
    const allAnswered = tasks.every(task => answers.hasOwnProperty(task.id));
    if (!allAnswered) {
        document.getElementById('final-message').innerText = 'Ответьте на все задания.';
        return;
    }

    const allCorrect = tasks.every(task => answers[task.id] === task.has_bug);

    if (allCorrect) {
        document.getElementById('final-message').innerText =
            'Вставь это в ответ к задаче: "QA - сила, баги - могила"';
    } else {
        document.getElementById('final-message').innerText = 'Есть ошибки.';
    }
}

loadTasks();
