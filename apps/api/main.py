
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.meetings import router

app = FastAPI(
    title="Meeting Automation API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://meeting-automation-six.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {"message": "Meeting Automation API"}


@app.get("/health")
def health():
    return {"status": "ok"}
