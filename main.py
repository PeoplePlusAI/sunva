from fastapi import FastAPI
from core.db.init_db import init_db
from fastapi.responses import FileResponse
from core.api import stt, tts, user, language

app = FastAPI()

app.include_router(stt.router)
app.include_router(tts.router)
app.include_router(user.router)
app.include_router(language.router)

@app.get("/")
async def get():
    return FileResponse("static/index.html")


@app.get("/is-alive")
def is_alive():
    return {"status": "alive"}

@app.on_event("startup")
async def on_startup():
    await init_db()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)