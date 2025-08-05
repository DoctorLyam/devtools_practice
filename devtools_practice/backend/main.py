from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # можно указать конкретные для продакшена
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    id: int
    question: str
    has_bug: bool

tasks = [
    Task(id=1, question="При клике на кнопку должен отправиться PUT-запрос со статусом 200.", has_bug=True),
    Task(id=2, question="При клике на кнопку должен отправиться POST-запрос со статусом 200.", has_bug=True),
    Task(id=3, question="При клике на кнопку должен отправиться GET-запрос с квери-параметром devtools=1.", has_bug=False),
    Task(id=4, question='При клике на кнопку должен отправиться POST-запрос с телом: {\n  "count": "1"\n}.', has_bug=True),
    Task(id=5, question="При клике на кнопку должен отправиться запрос с хедером x-api-key.", has_bug=True),
    Task(id=6, question="При клике на кнопку должен прийти ответ с хедером x-api-key.", has_bug=False),
    Task(id=7, question='При клике на кнопку значение, введенное в поле, сохраняется в session storage браузера с ключом age.', has_bug=True),
    Task(id=8, question="Цвет квадрата — #e8793e.", has_bug=True),
]

@app.get("/tasks", response_model=List[Task])
def get_tasks():
    return tasks

@app.api_route("/tasks/{task_id}", methods=["GET", "POST", "PUT"])
async def task_action(task_id: int, request: Request):
    # Тут добавим баги по коду и ответам:

    # Для задачи 2 — возвращаем 201, а не 200 (искусственный баг)
    if task_id == 2:
        return Response(status_code=201)

    # Для задачи 6 — ответ с хедером x-api-key
    if task_id == 6:
        headers = {"x-api-key": "12345"}
        return Response(status_code=200, headers=headers)

    # Для остальных просто 200
    return Response(status_code=200)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
