import { z } from 'zod'

// User Schemas
export const userRegisterSchema = z.object({
  email: z.string().email('Email tidak valid'),
  username: z
    .string()
    .min(3, 'Username minimal 3 karakter')
    .max(20, 'Username maksimal 20 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh berisi huruf, angka, dan underscore'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
  fullName: z.string().optional()
})

export const userLoginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email atau username harus diisi'),
  password: z.string().min(1, 'Password harus diisi')
})

export const updateUserSchema = z.object({
  fullName: z.string().optional(),
  avatar: z.string().url().optional()
})

// Course Schemas
export const createCourseSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  categoryId: z.string(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  price: z.number().min(0, 'Harga tidak boleh negatif'),
  thumbnail: z.string().url().optional()
})

export const updateCourseSchema = createCourseSchema.partial()

// Module Schemas
export const createModuleSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
  order: z.number().int().min(0)
})

export const updateModuleSchema = createModuleSchema.partial()

// Lesson Schemas
export const createLessonSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  content: z.string(),
  type: z.enum(['VIDEO', 'TEXT', 'QUIZ', 'INTERACTIVE']),
  duration: z.number().int().min(0),
  order: z.number().int().min(0),
  videoUrl: z.string().url().optional(),
  isPreview: z.boolean().default(false)
})

export const updateLessonSchema = createLessonSchema.partial()

// Quiz Schemas
export const createQuizSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().optional(),
  passingScore: z.number().int().min(0).max(100)
})

export const createQuestionSchema = z.object({
  question: z.string().min(3, 'Pertanyaan minimal 3 karakter'),
  options: z.array(z.string()).min(2, 'Minimal 2 pilihan').max(6, 'Maksimal 6 pilihan'),
  correctAnswer: z.string(),
  explanation: z.string().optional(),
  order: z.number().int().min(0)
})

// Review Schema
export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating minimal 1').max(5, 'Rating maksimal 5'),
  comment: z.string().optional()
})

// Progress Schema
export const updateProgressSchema = z.object({
  isCompleted: z.boolean().optional(),
  timeSpent: z.number().int().min(0).optional(),
  lastPosition: z.number().int().min(0).optional()
})

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10)
})

// Export types from schemas
export type UserRegisterInput = z.infer<typeof userRegisterSchema>
export type UserLoginInput = z.infer<typeof userLoginSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
export type CreateModuleInput = z.infer<typeof createModuleSchema>
export type UpdateModuleInput = z.infer<typeof updateModuleSchema>
export type CreateLessonInput = z.infer<typeof createLessonSchema>
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>
export type CreateQuizInput = z.infer<typeof createQuizSchema>
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
