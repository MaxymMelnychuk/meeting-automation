import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv("apps/api/.env")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def transcribe_audio(file_path: str):
    with open(file_path, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-large-v3",
            file=audio_file,
        )

    return transcription.text