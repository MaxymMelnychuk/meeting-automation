from pydantic import BaseModel, ConfigDict


class Participant(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    role: str | None
    evidence: str


class Topic(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    summary: str
    evidence: str


class DiscussionPoint(BaseModel):
    model_config = ConfigDict(extra="forbid")

    topic: str
    summary: str
    evidence: str


class Decision(BaseModel):
    model_config = ConfigDict(extra="forbid")

    description: str
    evidence: str


class Action(BaseModel):
    model_config = ConfigDict(extra="forbid")

    description: str
    assignee: str | None
    deadline: str | None
    evidence: str


class Problem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    description: str
    evidence: str


class OpenQuestion(BaseModel):
    model_config = ConfigDict(extra="forbid")

    question: str
    evidence: str


class ImportantInformation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    content: str
    evidence: str


class TimelineEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    date_or_reference: str
    event: str
    evidence: str


class MeetingAnalysis(BaseModel):
    model_config = ConfigDict(extra="forbid")

    language: str
    summary: str
    topics: list[Topic]
    participants: list[Participant]
    discussion: list[DiscussionPoint]
    decisions: list[Decision]
    actions: list[Action]
    problems: list[Problem]
    open_questions: list[OpenQuestion]
    important_information: list[ImportantInformation]
    timeline: list[TimelineEvent]