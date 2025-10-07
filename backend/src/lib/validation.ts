import { z } from 'zod';
import { UserRole, CourseDifficulty, LessonType, QuestionType } from '@prisma/client';

// ============================================
// AUTH SCHEMAS
// ============================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.nativeEnum(UserRole).optional().default(UserRole.LEARNER),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ============================================
// USER SCHEMAS
// ============================================

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// ============================================
// COURSE SCHEMAS
// ============================================

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.nativeEnum(CourseDifficulty).default(CourseDifficulty.BEGINNER),
  thumbnail: z.string().url().optional(),
  estimatedDuration: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  isFree: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  learningPoints: z.array(z.string()).default([]),
});

export const updateCourseSchema = createCourseSchema.partial().extend({
  isPublished: z.boolean().optional(),
});

// ============================================
// MODULE SCHEMAS
// ============================================

export const createModuleSchema = z.object({
  courseId: z.string().cuid('Invalid course ID'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  order: z.number().int().positive(),
  isRequired: z.boolean().default(true),
  duration: z.number().int().positive().optional(),
});

export const updateModuleSchema = createModuleSchema.omit({ courseId: true }).partial();

// ============================================
// LESSON SCHEMAS
// ============================================

export const createLessonSchema = z.object({
  moduleId: z.string().cuid('Invalid module ID'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.any().optional(), // JSON content
  type: z.nativeEnum(LessonType).default(LessonType.TEXT),
  videoUrl: z.string().url().optional(),
  duration: z.number().int().positive().optional(),
  order: z.number().int().positive(),
  resources: z.any().optional(), // JSON array
  isLocked: z.boolean().default(false),
});

export const updateLessonSchema = createLessonSchema.omit({ moduleId: true }).partial();

// ============================================
// QUIZ SCHEMAS
// ============================================

export const createQuizSchema = z.object({
  lessonId: z.string().cuid('Invalid lesson ID'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  passingScore: z.number().int().min(0).max(100).default(70),
  timeLimit: z.number().int().positive().optional(),
  shuffleQuestions: z.boolean().default(false),
  maxAttempts: z.number().int().positive().default(3),
  showAnswers: z.boolean().default(true),
});

export const updateQuizSchema = createQuizSchema.omit({ lessonId: true }).partial();

export const createQuestionSchema = z.object({
  quizId: z.string().cuid('Invalid quiz ID'),
  question: z.string().min(3, 'Question must be at least 3 characters'),
  type: z.nativeEnum(QuestionType).default(QuestionType.MULTIPLE_CHOICE),
  options: z.any().optional(), // JSON array
  correctAnswer: z.any(), // JSON
  points: z.number().int().positive().default(1),
  explanation: z.string().optional(),
  order: z.number().int().positive(),
});

export const updateQuestionSchema = createQuestionSchema.omit({ quizId: true }).partial();

// ============================================
// ENROLLMENT SCHEMAS
// ============================================

export const enrollCourseSchema = z.object({
  courseId: z.string().cuid('Invalid course ID'),
});

// ============================================
// QUIZ ATTEMPT SCHEMAS
// ============================================

export const submitQuizSchema = z.object({
  quizId: z.string().cuid('Invalid quiz ID'),
  answers: z.any(), // JSON object with question IDs as keys
});

// ============================================
// DISCUSSION SCHEMAS
// ============================================

export const createDiscussionSchema = z.object({
  lessonId: z.string().cuid('Invalid lesson ID'),
  content: z.string().min(1, 'Content is required'),
  parentId: z.string().cuid().optional(),
});

export const updateDiscussionSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

// ============================================
// QUERY SCHEMAS
// ============================================

export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const courseQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  difficulty: z.nativeEnum(CourseDifficulty).optional(),
  isFree: z.string().transform((val) => val === 'true').optional(),
  isPublished: z.string().transform((val) => val === 'true').optional(),
  search: z.string().optional(),
  instructorId: z.string().cuid().optional(),
});

export const enrollmentQuerySchema = paginationSchema.extend({
  status: z.string().optional(),
  courseId: z.string().cuid().optional(),
  userId: z.string().cuid().optional(),
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate request body with Zod schema
 */
export async function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
  return schema.parseAsync(data);
}

/**
 * Validate query parameters with Zod schema
 */
export async function validateQuery<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
  return schema.parseAsync(data);
}
