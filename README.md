# AI Meeting Automation

AI Meeting Automation is an application designed to transform meeting content into useful information and concrete actions.

The idea is simple: meetings contain a huge amount of important information, but a large part of it can be forgotten, poorly documented, or require manual work after the meeting.

The application uses artificial intelligence to understand the meeting as a whole, identify what matters, and help transform the discussion into work that can actually be acted upon.

## Why?

After a meeting, people often need to go back through their notes, find what was decided, remember which tasks need to be completed, check who is responsible for what, or prepare the next meeting.

This work can take time and become particularly difficult when meetings are frequent or involve multiple people and projects.

AI Meeting Automation aims to reduce this workload by making it possible to move directly from the conversation to a clear view of what should be remembered and what needs to be done.

The goal is therefore not simply to generate a summary.

The application aims to understand the overall context of a meeting in order to identify:

* topics discussed;
* decisions made;
* actions to be completed;
* problems or blockers;
* open questions;
* important information;
* timeline-related elements;
* relationships between the different elements of the meeting.

When information is not clear enough, it should not be invented. The system must preserve the available information while indicating what remains uncertain or needs clarification.

## Who is it for?

The application can be useful in many contexts where meetings play an important role in the way people work.

It can be used by:

* product teams;
* marketing and communication teams;
* sales teams;
* agencies;
* technical teams;
* project managers;
* managers;
* freelancers;
* students working on team projects;
* any organization that needs to keep track of work discussed during meetings.

It can be used for internal meetings, client meetings, project meetings, team check-ins, follow-up meetings, or any other professional conversation that requires ongoing follow-up.

## From Meetings to Work

The core idea behind the project is:

**Meeting → Understanding → Actions → Follow-up**

An audio recording is first transcribed.

The artificial intelligence then analyzes the entire transcript in order to understand the context of the conversation rather than processing each sentence independently.

Important information is then structured so that it can be easily reviewed and understood.

Identified actions can then be prepared for automation.

The goal is to keep a human validation step before any real-world action is performed: the AI can propose and organize information, while the user remains in control of what should actually be executed.

## Beyond a Single Meeting

The value of the project does not necessarily stop when a meeting ends.

By keeping the context of previous meetings, the system can progressively help track:

* tasks that are still incomplete;
* problems that have not yet been resolved;
* decisions that need to be followed up;
* topics that should be discussed again;
* ongoing goals;
* important points to address during the next meeting.

The goal is to reduce the work required to prepare a meeting and make it possible to start a new discussion with a clear understanding of what happened previously.

## Controlled Automation

Automation is an important part of the project, but it is not intended to replace human decision-making.

The principle is:

**AI understands → User validates → Automation executes.**

Python plays an important role as the orchestration engine, turning validated information into concrete actions.

This makes it possible to connect the system with different services depending on the context: task management tools, calendars, project management platforms, notifications, or other services used by teams on a daily basis.

## Technology

The project uses an architecture that separates the frontend and backend.

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Backend

* Python
* FastAPI
* Pydantic

### Artificial Intelligence

* Groq
* Whisper for audio transcription
* Large language model for meeting analysis and understanding

## Project Status

The project is currently under development.

A first functional version can already transform a meeting recording into a transcript, analyze the transcript, and extract important information and identified actions.

The interface also allows users to review the results of this analysis.

The project is continuously being improved to make meeting understanding more reliable, uncertainty handling more relevant, and action automation more complete.

The goal is to progressively turn it into a real meeting follow-up and automation assistant, capable of understanding an team's context over time rather than simply analyzing isolated meetings.
