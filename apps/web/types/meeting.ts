export type Participant = {
    name: string
    role: string | null
    evidence: string
    certainty: "explicit" | "inferred"
  }
  
  export type Topic = {
    title: string
    summary: string
    evidence: string
    certainty: "explicit" | "inferred"
  }
  
  export type DiscussionPoint = {
    topic: string
    summary: string
    evidence: string
    certainty: "explicit" | "inferred"
  }
  
  export type Decision = {
    description: string
    evidence: string
    certainty: "explicit" | "inferred"
  }
  
  export type Action = {
    description: string
    assignee: string | null
    deadline: string | null
    evidence: string
    certainty: "explicit" | "inferred"
  }
  
  export type Problem = {
    description: string
    evidence: string
    certainty: "explicit" | "inferred"
  }
  
  export type OpenQuestion = {
    question: string
    evidence: string
    certainty: "explicit" | "inferred"
  }
  
  export type ImportantInformation = {
    content: string
    evidence: string
    certainty: "explicit" | "inferred"
  }
  
  export type TimelineEvent = {
    date_or_reference: string
    event: string
    evidence: string
    certainty: "explicit" | "inferred"
  }
  
  export type MeetingAnalysis = {
    language: string
    summary: string
    topics: Topic[]
    participants: Participant[]
    discussion: DiscussionPoint[]
    decisions: Decision[]
    actions: Action[]
    problems: Problem[]
    open_questions: OpenQuestion[]
    important_information: ImportantInformation[]
    timeline: TimelineEvent[]
  }
  
  export type PreparedAction = {
    description: string
    assignee: string | null
    deadline: string | null
    status: "ready" | "needs_information"
  }
  
  export type UploadMeetingResponse = {
    filename: string
    transcript: string
    analysis: MeetingAnalysis
    actions: PreparedAction[]
  }