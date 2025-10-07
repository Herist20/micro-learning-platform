// User Types
export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string
  email: string
  username: string
  fullName?: string
  avatar?: string
  role: UserRole
  emailVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Course Types
export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string
  thumbnail?: string
  categoryId: string
  instructorId: string
  level: CourseLevel
  duration: number
  isPublished: boolean
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  createdAt: Date
  updatedAt: Date
}

// Module & Lesson Types
export interface Module {
  id: string
  title: string
  description?: string
  order: number
  courseId: string
  createdAt: Date
  updatedAt: Date
}

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
  INTERACTIVE = 'INTERACTIVE'
}

export interface Lesson {
  id: string
  title: string
  content: string
  type: LessonType
  duration: number
  order: number
  videoUrl?: string
  moduleId: string
  isPreview: boolean
  createdAt: Date
  updatedAt: Date
}

// Enrollment & Progress Types
export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED'
}

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: EnrollmentStatus
  enrolledAt: Date
  completedAt?: Date
  progress: number
}

export interface Progress {
  id: string
  userId: string
  lessonId: string
  isCompleted: boolean
  timeSpent: number
  lastPosition: number
  createdAt: Date
  updatedAt: Date
}

// Quiz Types
export interface Quiz {
  id: string
  title: string
  description?: string
  lessonId: string
  passingScore: number
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
  quizId: string
  order: number
  createdAt: Date
  updatedAt: Date
}

// Certificate Type
export interface Certificate {
  id: string
  userId: string
  courseName: string
  issuedAt: Date
  certificateUrl: string
}

// Review Type
export interface Review {
  id: string
  userId: string
  courseId: string
  rating: number
  comment?: string
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
