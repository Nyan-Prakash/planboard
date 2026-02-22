import { pgTable, uuid, text, timestamp, integer, jsonb, boolean, unique } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // matches auth.users.id
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const generationRequests = pgTable("generation_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  gradeLevel: text("grade_level").notNull(),
  subject: text("subject").notNull(),
  activityType: text("activity_type").notNull(),
  lessonInfo: text("lesson_info").notNull(),
  learningObjectives: text("learning_objectives").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  generationRequestId: uuid("generation_request_id")
    .references(() => generationRequests.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  summary: text("summary").notNull(),
  content: jsonb("content").notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  gradeLevel: text("grade_level").notNull(),
  subject: text("subject").notNull(),
  activityType: text("activity_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
  id: uuid("id").defaultRandom().primaryKey(),
  activityId: uuid("activity_id").references(() => activities.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  suitability: integer("suitability").notNull(),
  goalAchievement: integer("goal_achievement").notNull(),
  recommendation: integer("recommendation").notNull(),
  overallRating: integer("overall_rating"),
  reviewText: text("review_text"),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  unique("ratings_user_activity_unique").on(table.userId, table.activityId),
]);

export const saves = pgTable("saves", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  activityId: uuid("activity_id").references(() => activities.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  unique("saves_user_activity_unique").on(table.userId, table.activityId),
]);
