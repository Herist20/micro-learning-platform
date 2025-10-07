import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { db } from '@/lib/db';
import { authMiddleware } from '@/middleware/auth.middleware';
import { validateBody, enrollCourseSchema } from '@/lib/validation';
import type { AuthContext } from '@/middleware/auth.middleware';

const enrollments = new Hono<AuthContext>();

/**
 * GET /enrollments
 * Get user's enrollments
 */
enrollments.get('/', authMiddleware, async (c: AuthContext) => {
  const user = c.get('user');

  const userEnrollments = await db.enrollment.findMany({
    where: { userId: user.userId },
    include: {
      course: {
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
              modules: true,
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return c.json(userEnrollments);
});

/**
 * POST /enrollments
 * Enroll in a course
 */
enrollments.post('/', authMiddleware, async (c: AuthContext) => {
  const user = c.get('user');
  const body = await validateBody(enrollCourseSchema, await c.req.json());

  // Check if course exists and is published
  const course = await db.course.findUnique({
    where: { id: body.courseId },
  });

  if (!course) {
    throw new HTTPException(404, { message: 'Course not found' });
  }

  if (!course.isPublished) {
    throw new HTTPException(400, { message: 'Course is not published' });
  }

  // Check if already enrolled
  const existingEnrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.userId,
        courseId: body.courseId,
      },
    },
  });

  if (existingEnrollment) {
    throw new HTTPException(409, { message: 'Already enrolled in this course' });
  }

  const enrollment = await db.enrollment.create({
    data: {
      userId: user.userId,
      courseId: body.courseId,
    },
    include: {
      course: {
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  // Create notification
  await db.notification.create({
    data: {
      userId: user.userId,
      type: 'ENROLLMENT_CONFIRMED',
      title: `Welcome to ${course.title}`,
      message: 'You have successfully enrolled in the course. Start learning now!',
    },
  });

  return c.json(enrollment, 201);
});

/**
 * GET /enrollments/:courseId/progress
 * Get course progress
 */
enrollments.get('/:courseId/progress', authMiddleware, async (c: AuthContext) => {
  const user = c.get('user');
  const courseId = c.req.param('courseId');

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.userId,
        courseId,
      },
    },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: {
                include: {
                  progresses: {
                    where: { userId: user.userId },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enrollment) {
    throw new HTTPException(404, { message: 'Enrollment not found' });
  }

  return c.json(enrollment);
});

/**
 * DELETE /enrollments/:courseId
 * Unenroll from course
 */
enrollments.delete('/:courseId', authMiddleware, async (c: AuthContext) => {
  const user = c.get('user');
  const courseId = c.req.param('courseId');

  const enrollment = await db.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.userId,
        courseId,
      },
    },
  });

  if (!enrollment) {
    throw new HTTPException(404, { message: 'Enrollment not found' });
  }

  await db.enrollment.update({
    where: {
      userId_courseId: {
        userId: user.userId,
        courseId,
      },
    },
    data: {
      status: 'DROPPED',
    },
  });

  return c.json({ message: 'Successfully unenrolled from course' });
});

export default enrollments;
