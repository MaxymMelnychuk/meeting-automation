"use client"

import { TaskBoard } from "../../components/dashboard/TaskBoard"
import { PageHeader } from "../../components/ui/PageHeader"

export default function TasksPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Tasks"
        subtitle="Suggested from meetings, then the ones you keep"
      />
      <TaskBoard fullPage />
    </div>
  )
}
