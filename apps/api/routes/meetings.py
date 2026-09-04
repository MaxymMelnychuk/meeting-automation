from fastapi import APIRouter, UploadFile, File

from apps.api.services.transcription import transcribe_audio
from apps.api.services.analysis import analyze_meeting


router = APIRouter()


@router.post("/meetings/upload")
async def upload_meeting(file: UploadFile = File(...)):
    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    text = transcribe_audio(file_path)
    analysis = analyze_meeting(text)

    return {
        "filename": file.filename,
        "transcript": text,
        "analysis": analysis.model_dump(),
    }