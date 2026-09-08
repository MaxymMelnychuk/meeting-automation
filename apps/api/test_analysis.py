from apps.api.services.analysis import analyze_meeting
from apps.api.services.automation import prepare_actions, execute_actions


with open("apps/api/test_meeting.txt", "r", encoding="utf-8") as file:
    transcript = file.read()


analysis = analyze_meeting(transcript)

actions = prepare_actions(analysis)

output_path = execute_actions(actions)

print(f"Actions exécutées : {output_path}")

for action in actions:
    print(action)