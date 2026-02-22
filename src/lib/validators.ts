import { z } from "zod";

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

export type GenerateInput = z.infer<typeof generateSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
