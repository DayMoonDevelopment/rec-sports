import { z } from "zod";

export const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  from_email: z.string().optional(), // honeypot field
});

export type WaitlistForm = z.infer<typeof waitlistSchema>;