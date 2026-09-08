from typing import Literal

from pydantic import BaseModel, ConfigDict


class Participant(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    role: str | None
    evidence: str
    certainty: Literal["explicit", "inferred"]


class Topic(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    summary: str
    evidence: str
    certainty: Literal["explicit", "inferred"]


class DiscussionPoint(BaseModel):
    model_config = ConfigDict(extra="forbid")

    topic: str
    summary: str
    evidence: str
    certainty: Literal["explicit", "inferred"]


class Decision(BaseModel):
    model_config = ConfigDict(extra="forbid")

    description: str
    evidence: str
    certainty: Literal["explicit", "inferred"]


class Action(BaseModel):
    model_config = ConfigDict(extra="forbid")

    description: str
    assignee: str | None
    deadline: str | None
    evidence: str
    certainty: Literal["explicit", "inferred"]


class Problem(BaseModel):
    model_config = ConfigDict(extra="forbid")

    description: str
    evidence: str
    certainty: Literal["explicit", "inferred"]


class OpenQuestion(BaseModel):
    model_config = ConfigDict(extra="forbid")

    question: str
    evidence: str
    certainty: Literal["explicit", "inferred"]


class ImportantInformation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    content: str
    evidence: str
    certainty: Literal["explicit", "inferred"]


class TimelineEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    date_or_reference: str
    event: str
    evidence: str
    certainty: Literal["explicit", "inferred"]


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