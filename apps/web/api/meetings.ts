import type { UploadMeetingResponse } from "@/types/meeting"

export async function uploadMeeting(
  file: File,
): Promise<UploadMeetingResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/meetings/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload meeting")
  }

  return response.json()
}