import { z } from 'zod'

export const joinMeetingSchema = z.object({
  roomId: z
    .string()
    .trim()
    .min(1, 'Meeting ID is required'),
})