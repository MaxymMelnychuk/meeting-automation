from fastapi import FastAPI
from apps.api.routes.meetings import router

app = FastAPI()

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Meeting Automation API"}