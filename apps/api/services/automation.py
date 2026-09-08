import json
from pathlib import Path

from apps.api.schemas.meeting import MeetingAnalysis


def prepare_actions(analysis: MeetingAnalysis):
    executable_actions = []

    for action in analysis.actions:
        status = "ready" if action.assignee is not None else "needs_information"

        executable_actions.append({
            "description": action.description,
            "assignee": action.assignee,
            "deadline": action.deadline,
            "status": status,
        })

    return executable_actions


def execute_actions(actions):
    output_path = Path("apps/api/actions.json")

    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(actions, file, ensure_ascii=False, indent=2)

    return str(output_path)