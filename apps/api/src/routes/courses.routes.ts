import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '@/lib/db';
import { authMiddleware, requireInstructor, requireAdmin } from '@/middleware/auth.middleware';
import { validateBody, validateQuery, createCourseSchema, updateCourseSchema, courseQuerySchema } from '@/lib/validation';
import type { AuthContext } from '@/middleware/auth.middleware';

const courses = new Hono<AuthContext>();

/**
 * GET /courses
 * Get all courses with filters and pagination
 */
courses.get('/', async (c) => {
  const query = await validateQuery(courseQuerySchema, c.req.query());

  const where: any = {};

  if (query.category) where.category = query.category;
  if (query.difficulty) where.difficulty = query.difficulty;
  if (query.isFree !== undefined) where.isFree = query.isFree;
  if (query.isPublished !== undefined) where.isPublished = query.isPublished;
  if (query.instructorId) where.instructorId = query.instructorId;
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [total, data] = await Promise.all([
    db.course.count({ where }),
    db.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
      },
      orderBy: query.sortBy
        ? { [query.sortBy]: query.sortOrder }
        : { createdAt: 'desc' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
  ]);

  return c.json({
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  });
});

/**
 * GET /courses/:id
 * Get course by ID
 */
courses.get('/:id', async (c) => {
  const id = c.req.param('id');

  const course = await db.course.findUnique({
    where: { id },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true,
        },
      },
      modules: {
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { order: 'asc' },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });

  if (!course) {
    throw new HTTPException(404, { message: 'Course not found' });
  }

  return c.json(course);
});

/**
 * POST /courses
 * Create new course (Instructor/Admin only)
 */
courses.post('/', authMiddleware, requireInstructor(), async (c: AuthContext) => {
  const user = c.get('user');
  const body = await validateBody(createCourseSchema, await c.req.json());

  const course = await db.course.create({
    data: {
      ...body,
      instructorId: user.userId,
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return c.json(course, 201);
});

/**
 * PATCH /courses/:id
 * Update course (Instructor/Admin only)
 */
courses.patch('/:id', authMiddleware, requireInstructor(), async (c: AuthContext) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const body = await validateBody(updateCourseSchema, await c.req.json());

  // Check if course exists and user owns it (or is admin)
  const existingCourse = await db.course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    throw new HTTPException(404, { message: 'Course not found' });
  }

  if (existingCourse.instructorId !== user.userId && user.role !== 'ADMIN') {
    throw new HTTPException(403, { message: 'Not authorized to update this course' });
  }

  const course = await db.course.update({
    where: { id },
    data: body,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return c.json(course);
});

/**
 * DELETE /courses/:id
 * Delete course (Instructor/Admin only)
 */
courses.delete('/:id', authMiddleware, requireInstructor(), async (c: AuthContext) => {
  const user = c.get('user');
  const id = c.req.param('id');

  // Check if course exists and user owns it (or is admin)
  const existingCourse = await db.course.findUnique({
    where: { id },
  });

  if (!existingCourse) {
    throw new HTTPException(404, { message: 'Course not found' });
  }

  if (existingCourse.instructorId !== user.userId && user.role !== 'ADMIN') {
    throw new HTTPException(403, { message: 'Not authorized to delete this course' });
  }

  await db.course.delete({
    where: { id },
  });

  return c.json({ message: 'Course deleted successfully' });
});

/**
 * POST /courses/:id/publish
 * Publish/unpublish course (Instructor/Admin only)
 */
courses.post('/:id/publish', authMiddleware, requireInstructor(), async (c: AuthContext) => {
  const user = c.get('user');
  const id = c.req.param('id');
  const { isPublished } = await c.req.json();

  const course = await db.course.findUnique({ where: { id } });

  if (!course) {
    throw new HTTPException(404, { message: 'Course not found' });
  }

  if (course.instructorId !== user.userId && user.role !== 'ADMIN') {
    throw new HTTPException(403, { message: 'Not authorized' });
  }

  const updatedCourse = await db.course.update({
    where: { id },
    data: { isPublished },
  });

  return c.json(updatedCourse);
});

/**
 * GET /courses/:id/students
 * Get enrolled students (Instructor/Admin only)
 */
courses.get('/:id/students', authMiddleware, requireInstructor(), async (c: AuthContext) => {
  const user = c.get('user');
  const id = c.req.param('id');

  const course = await db.course.findUnique({ where: { id } });

  if (!course) {
    throw new HTTPException(404, { message: 'Course not found' });
  }

  if (course.instructorId !== user.userId && user.role !== 'ADMIN') {
    throw new HTTPException(403, { message: 'Not authorized' });
  }

  const enrollments = await db.enrollment.findMany({
    where: { courseId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return c.json(enrollments);
});

export default courses;
