import json
import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq

from apps.api.schemas.meeting import MeetingAnalysis


load_dotenv("apps/api/.env")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


PROMPT_PATH = Path(__file__).resolve().parent.parent / "prompts" / "meeting_analysis.txt"


def load_analysis_prompt() -> str:
    return PROMPT_PATH.read_text(encoding="utf-8")


def analyze_meeting(text: str) -> MeetingAnalysis:
    prompt = load_analysis_prompt()

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": prompt,
            },
            {
                "role": "user",
                "content": text,
            },
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "meeting_analysis",
                "strict": True,
                "schema": MeetingAnalysis.model_json_schema(),
            },
        },
    )

    result = json.loads(response.choices[0].message.content)

    return MeetingAnalysis.model_validate(result)