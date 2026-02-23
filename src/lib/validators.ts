import { z } from "zod";

export const profileSchema = z.object({
  subject: z.string().min(2, "Subject must be at least 2 characters").max(100, "Subject must be at most 100 characters"),
  grade_level: z.string().min(1, "Grade level is required").max(50, "Grade level must be at most 50 characters"),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const generateSchema = z.object({
  gradeLevel: z.enum(["primary", "middle_school", "high_school"]),
  subject: z.string().min(1, "Subject is required"),
  activityType: z.enum(["educational", "assessment"]),
  lessonInfo: z.string().min(10, "Lesson information must be at least 10 characters"),
  learningObjectives: z.string().min(10, "Learning objectives must be at least 10 characters"),
});

export const ratingSchema = z.object({
  activityId: z.string().uuid(),
  suitability: z.number().min(1).max(5),
  goalAchievement: z.number().min(1).max(5),
  recommendation: z.number().min(1).max(5),
  overallRating: z.number().min(1).max(5).optional(),
  reviewText: z.string().max(2000).optional(),
  comment: z.string().optional(),
});

export const waitlistSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address").max(255, "Email is too long"),
});

export type GenerateInput = z.infer<typeof generateSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
