
import os
import tempfile

from fastapi import APIRouter, UploadFile, File

from services.transcription import transcribe_audio
from services.analysis import analyze_meeting
from services.automation import prepare_actions


router = APIRouter()


@router.post("/meetings/upload")
async def upload_meeting(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename or "")[1] or ".mp3"

    with tempfile.NamedTemporaryFile(
        suffix=suffix,
        dir="/tmp",
        delete=False
    ) as buffer:
        file_path = buffer.name
        buffer.write(await file.read())

    try:
        text = transcribe_audio(file_path)
        analysis = analyze_meeting(text)
        actions = prepare_actions(analysis)

        return {
            "filename": file.filename,
            "transcript": text,
            "analysis": analysis.model_dump(),
            "actions": actions,
        }
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
