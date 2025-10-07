// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh'
  },
  COURSES: {
    LIST: '/api/courses',
    DETAIL: (id: string) => `/api/courses/${id}`,
    CREATE: '/api/courses',
    UPDATE: (id: string) => `/api/courses/${id}`,
    DELETE: (id: string) => `/api/courses/${id}`,
    PUBLISH: (id: string) => `/api/courses/${id}/publish`
  },
  MODULES: {
    LIST: (courseId: string) => `/api/courses/${courseId}/modules`,
    DETAIL: (courseId: string, moduleId: string) =>
      `/api/courses/${courseId}/modules/${moduleId}`,
    CREATE: (courseId: string) => `/api/courses/${courseId}/modules`,
    UPDATE: (courseId: string, moduleId: string) =>
      `/api/courses/${courseId}/modules/${moduleId}`,
    DELETE: (courseId: string, moduleId: string) =>
      `/api/courses/${courseId}/modules/${moduleId}`
  },
  LESSONS: {
    LIST: (moduleId: string) => `/api/modules/${moduleId}/lessons`,
    DETAIL: (moduleId: string, lessonId: string) =>
      `/api/modules/${moduleId}/lessons/${lessonId}`,
    CREATE: (moduleId: string) => `/api/modules/${moduleId}/lessons`,
    UPDATE: (moduleId: string, lessonId: string) =>
      `/api/modules/${moduleId}/lessons/${lessonId}`,
    DELETE: (moduleId: string, lessonId: string) =>
      `/api/modules/${moduleId}/lessons/${lessonId}`
  },
  ENROLLMENTS: {
    LIST: '/api/enrollments',
    ENROLL: (courseId: string) => `/api/courses/${courseId}/enroll`,
    UNENROLL: (courseId: string) => `/api/courses/${courseId}/unenroll`
  },
  PROGRESS: {
    GET: (lessonId: string) => `/api/lessons/${lessonId}/progress`,
    UPDATE: (lessonId: string) => `/api/lessons/${lessonId}/progress`
  }
} as const

// Storage Paths
export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  THUMBNAILS: 'thumbnails',
  VIDEOS: 'videos',
  CERTIFICATES: 'certificates'
} as const

// Limits
export const LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_VIDEO_SIZE: 500 * 1024 * 1024, // 500MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  }
} as const

// Cache Keys
export const CACHE_KEYS = {
  USER: (id: string) => `user:${id}`,
  COURSE: (id: string) => `course:${id}`,
  COURSES_LIST: (page: number, filter: string) => `courses:${page}:${filter}`,
  USER_ENROLLMENTS: (userId: string) => `enrollments:${userId}`,
  COURSE_REVIEWS: (courseId: string) => `reviews:${courseId}`
} as const

// Cache TTL (in seconds)
export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400 // 24 hours
} as const
