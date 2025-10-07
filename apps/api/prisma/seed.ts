import { PrismaClient, UserRole, CourseDifficulty, LessonType, QuestionType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.quizAttempt.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@microlearn.com',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366F1&color=fff',
      bio: 'Platform administrator',
    },
  });

  const instructor1 = await prisma.user.create({
    data: {
      email: 'sarah.johnson@microlearn.com',
      password: hashedPassword,
      name: 'Sarah Johnson',
      role: UserRole.INSTRUCTOR,
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff',
      bio: 'Senior Vue.js Developer with 8+ years of experience',
    },
  });

  const instructor2 = await prisma.user.create({
    data: {
      email: 'mike.chen@microlearn.com',
      password: hashedPassword,
      name: 'Mike Chen',
      role: UserRole.INSTRUCTOR,
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=F59E0B&color=fff',
      bio: 'TypeScript expert and technical writer',
    },
  });

  const instructor3 = await prisma.user.create({
    data: {
      email: 'emma.wilson@microlearn.com',
      password: hashedPassword,
      name: 'Emma Wilson',
      role: UserRole.INSTRUCTOR,
      avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=8B5CF6&color=fff',
      bio: 'UI/UX Designer and Frontend Developer',
    },
  });

  const learner1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: UserRole.LEARNER,
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff',
    },
  });

  const learner2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: UserRole.LEARNER,
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=EF4444&color=fff',
    },
  });

  console.log('✅ Created 6 users');

  // ============================================
  // COURSE 1: Advanced Vue.js Development
  // ============================================
  console.log('📚 Creating Course 1: Advanced Vue.js Development...');

  const course1 = await prisma.course.create({
    data: {
      title: 'Advanced Vue.js Development',
      description: 'Master Vue 3 with Composition API, TypeScript, and modern best practices. Build production-ready applications with confidence.',
      category: 'Web Development',
      difficulty: CourseDifficulty.ADVANCED,
      instructorId: instructor1.id,
      isPublished: true,
      estimatedDuration: 720, // 12 hours
      price: 99.99,
      isFree: false,
      tags: ['Vue.js', 'JavaScript', 'Frontend', 'TypeScript', 'Composition API'],
      requirements: [
        'Basic understanding of JavaScript (ES6+)',
        'Familiarity with HTML and CSS',
        'Node.js and npm installed',
        'A code editor (VS Code recommended)',
      ],
      learningPoints: [
        'Master Vue 3 Composition API and understand its advantages',
        'Build type-safe applications with TypeScript integration',
        'Create reusable and maintainable component architecture',
        'Implement state management with Pinia',
        'Optimize performance with modern Vue techniques',
        'Deploy production-ready Vue applications',
      ],
    },
  });

  // Module 1.1: Introduction
  const module1_1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to Vue 3',
      description: 'Get started with Vue 3 and understand the new features',
      order: 1,
      isRequired: true,
      duration: 120,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        moduleId: module1_1.id,
        title: 'Welcome to Vue 3',
        content: { type: 'html', body: '<h1>Welcome to Vue 3</h1><p>Learn about the exciting new features in Vue 3...</p>' },
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/videos/vue3-intro.mp4',
        duration: 15,
        order: 1,
      },
      {
        moduleId: module1_1.id,
        title: 'Setup Development Environment',
        content: { type: 'html', body: '<h1>Setup Guide</h1><p>Step-by-step guide to setup your Vue 3 environment...</p>' },
        type: LessonType.TEXT,
        duration: 20,
        order: 2,
        resources: [
          { name: 'VS Code Extensions', url: 'https://example.com/vscode-extensions.pdf', type: 'pdf' },
          { name: 'Starter Template', url: 'https://github.com/example/vue3-starter', type: 'github' },
        ],
      },
      {
        moduleId: module1_1.id,
        title: 'Vue 3 Overview Quiz',
        type: LessonType.QUIZ,
        duration: 10,
        order: 3,
        content: { type: 'html', body: '<p>Test your knowledge of Vue 3 basics</p>' },
      },
    ],
  });

  // Create quiz for lesson 3
  const lesson1_3 = await prisma.lesson.findFirst({
    where: { moduleId: module1_1.id, order: 3 },
  });

  if (lesson1_3) {
    const quiz1 = await prisma.quiz.create({
      data: {
        lessonId: lesson1_3.id,
        title: 'Vue 3 Fundamentals Quiz',
        description: 'Test your understanding of Vue 3 basics',
        passingScore: 70,
        timeLimit: 10,
        shuffleQuestions: true,
        maxAttempts: 3,
      },
    });

    await prisma.question.createMany({
      data: [
        {
          quizId: quiz1.id,
          question: 'What is the Composition API in Vue 3?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            'A new way to write components using setup function',
            'A library for API calls',
            'A CSS framework',
            'A testing tool',
          ],
          correctAnswer: 'A new way to write components using setup function',
          points: 1,
          explanation: 'The Composition API is a set of APIs that allows us to author Vue components using imported functions instead of declaring options.',
          order: 1,
        },
        {
          quizId: quiz1.id,
          question: 'Vue 3 is backward compatible with Vue 2',
          type: QuestionType.TRUE_FALSE,
          correctAnswer: false,
          points: 1,
          explanation: 'While many features are similar, Vue 3 has breaking changes and is not fully backward compatible.',
          order: 2,
        },
        {
          quizId: quiz1.id,
          question: 'What are the main benefits of using Vue 3 over Vue 2?',
          type: QuestionType.MULTIPLE_CHOICE,
          options: [
            'Better performance, improved TypeScript support, Composition API',
            'Only better styling options',
            'Only backward compatibility',
            'Smaller community',
          ],
          correctAnswer: 'Better performance, improved TypeScript support, Composition API',
          points: 1,
          order: 3,
        },
      ],
    });
  }

  // Module 1.2: Composition API
  const module1_2 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Composition API Deep Dive',
      description: 'Master the Composition API and reactive programming',
      order: 2,
      isRequired: true,
      duration: 180,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        moduleId: module1_2.id,
        title: 'Understanding Reactivity',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/videos/reactivity.mp4',
        duration: 30,
        order: 1,
        content: { type: 'html', body: '<h1>Reactivity in Vue 3</h1>' },
      },
      {
        moduleId: module1_2.id,
        title: 'Refs and Reactive',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/videos/refs-reactive.mp4',
        duration: 25,
        order: 2,
        content: { type: 'html', body: '<h1>Refs vs Reactive</h1>' },
      },
      {
        moduleId: module1_2.id,
        title: 'Computed Properties and Watchers',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/videos/computed-watch.mp4',
        duration: 30,
        order: 3,
        content: { type: 'html', body: '<h1>Computed and Watch</h1>' },
      },
    ],
  });

  // ============================================
  // COURSE 2: TypeScript for Beginners
  // ============================================
  console.log('📚 Creating Course 2: TypeScript for Beginners...');

  const course2 = await prisma.course.create({
    data: {
      title: 'TypeScript for Beginners',
      description: 'Learn TypeScript from scratch and build type-safe applications. Perfect for JavaScript developers.',
      category: 'Programming',
      difficulty: CourseDifficulty.BEGINNER,
      instructorId: instructor2.id,
      isPublished: true,
      estimatedDuration: 480, // 8 hours
      price: 49.99,
      isFree: false,
      tags: ['TypeScript', 'JavaScript', 'Programming'],
      requirements: [
        'Basic JavaScript knowledge',
        'Understanding of functions and objects',
        'Node.js installed',
      ],
      learningPoints: [
        'Understand TypeScript basics and type system',
        'Use interfaces and types effectively',
        'Work with generics and advanced types',
        'Integrate TypeScript with existing projects',
        'Configure TypeScript compiler',
      ],
    },
  });

  const module2_1 = await prisma.module.create({
    data: {
      courseId: course2.id,
      title: 'Getting Started with TypeScript',
      description: 'Introduction to TypeScript and setup',
      order: 1,
      duration: 120,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        moduleId: module2_1.id,
        title: 'What is TypeScript?',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/videos/ts-intro.mp4',
        duration: 15,
        order: 1,
        content: { type: 'html', body: '<h1>Introduction to TypeScript</h1>' },
      },
      {
        moduleId: module2_1.id,
        title: 'Setting Up TypeScript',
        type: LessonType.TEXT,
        duration: 20,
        order: 2,
        content: {
          type: 'html',
          body: '<h1>TypeScript Setup</h1><p>Install TypeScript globally: npm install -g typescript</p>'
        },
      },
      {
        moduleId: module2_1.id,
        title: 'Basic Types',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/videos/ts-basic-types.mp4',
        duration: 30,
        order: 3,
        content: { type: 'html', body: '<h1>TypeScript Basic Types</h1>' },
      },
    ],
  });

  // ============================================
  // COURSE 3: UI/UX Design Principles
  // ============================================
  console.log('📚 Creating Course 3: UI/UX Design Principles...');

  const course3 = await prisma.course.create({
    data: {
      title: 'UI/UX Design Principles',
      description: 'Create beautiful and intuitive user interfaces. Learn design thinking and modern UI/UX practices.',
      category: 'Design',
      difficulty: CourseDifficulty.INTERMEDIATE,
      instructorId: instructor3.id,
      isPublished: true,
      estimatedDuration: 600, // 10 hours
      isFree: true,
      tags: ['Design', 'UI/UX', 'User Experience', 'Interface Design'],
      requirements: [
        'Basic understanding of web design',
        'Figma account (free)',
        'Creative mindset',
      ],
      learningPoints: [
        'Understand fundamental design principles',
        'Create user-centered designs',
        'Master color theory and typography',
        'Build responsive and accessible interfaces',
        'Use Figma for professional designs',
      ],
    },
  });

  const module3_1 = await prisma.module.create({
    data: {
      courseId: course3.id,
      title: 'Design Fundamentals',
      description: 'Core principles of good design',
      order: 1,
      duration: 150,
    },
  });

  await prisma.lesson.createMany({
    data: [
      {
        moduleId: module3_1.id,
        title: 'Introduction to UI/UX',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/videos/uiux-intro.mp4',
        duration: 20,
        order: 1,
        content: { type: 'html', body: '<h1>What is UI/UX Design?</h1>' },
      },
      {
        moduleId: module3_1.id,
        title: 'Design Thinking Process',
        type: LessonType.TEXT,
        duration: 25,
        order: 2,
        content: {
          type: 'html',
          body: '<h1>Design Thinking</h1><p>Empathize → Define → Ideate → Prototype → Test</p>'
        },
      },
      {
        moduleId: module3_1.id,
        title: 'Color Theory Basics',
        type: LessonType.INTERACTIVE,
        duration: 30,
        order: 3,
        content: { type: 'html', body: '<h1>Understanding Colors</h1>' },
      },
    ],
  });

  console.log('✅ Created 3 courses with modules and lessons');

  // ============================================
  // ENROLLMENTS
  // ============================================
  console.log('📝 Creating enrollments...');

  await prisma.enrollment.create({
    data: {
      userId: learner1.id,
      courseId: course1.id,
      progress: 65,
      enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: learner1.id,
      courseId: course2.id,
      progress: 30,
      enrolledAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: learner1.id,
      courseId: course3.id,
      progress: 90,
      enrolledAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: learner2.id,
      courseId: course1.id,
      progress: 45,
      enrolledAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Created enrollments');

  // ============================================
  // LESSON PROGRESS
  // ============================================
  console.log('📊 Creating lesson progress...');

  const course1Lessons = await prisma.lesson.findMany({
    where: { module: { courseId: course1.id } },
    take: 3,
  });

  for (const lesson of course1Lessons.slice(0, 2)) {
    await prisma.lessonProgress.create({
      data: {
        userId: learner1.id,
        lessonId: lesson.id,
        status: 'COMPLETED',
        timeSpent: 900, // 15 minutes
        completedAt: new Date(),
        lastAccessedAt: new Date(),
      },
    });
  }

  if (course1Lessons[2]) {
    await prisma.lessonProgress.create({
      data: {
        userId: learner1.id,
        lessonId: course1Lessons[2].id,
        status: 'IN_PROGRESS',
        timeSpent: 300,
        lastAccessedAt: new Date(),
      },
    });
  }

  console.log('✅ Created lesson progress');

  // ============================================
  // DISCUSSIONS
  // ============================================
  console.log('💬 Creating discussions...');

  if (course1Lessons[0]) {
    const discussion1 = await prisma.discussion.create({
      data: {
        lessonId: course1Lessons[0].id,
        userId: learner1.id,
        content: 'Great introduction to Vue 3! The examples are very clear.',
        likes: 5,
      },
    });

    await prisma.discussion.create({
      data: {
        lessonId: course1Lessons[0].id,
        userId: instructor1.id,
        content: 'Thank you! Glad you found it helpful. Let me know if you have any questions.',
        parentId: discussion1.id,
        likes: 2,
      },
    });
  }

  console.log('✅ Created discussions');

  // ============================================
  // NOTIFICATIONS
  // ============================================
  console.log('🔔 Creating notifications...');

  await prisma.notification.createMany({
    data: [
      {
        userId: learner1.id,
        type: 'ENROLLMENT_CONFIRMED',
        title: 'Welcome to Advanced Vue.js Development',
        message: 'You have successfully enrolled in the course. Start learning now!',
        isRead: true,
      },
      {
        userId: learner1.id,
        type: 'DISCUSSION_REPLY',
        title: 'New reply to your comment',
        message: 'Sarah Johnson replied to your comment in "Welcome to Vue 3"',
        isRead: false,
      },
      {
        userId: learner1.id,
        type: 'COURSE_UPDATE',
        title: 'New lesson added',
        message: 'A new lesson has been added to TypeScript for Beginners',
        isRead: false,
      },
    ],
  });

  console.log('✅ Created notifications');

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📊 Summary:');
  console.log('  👥 Users: 6 (1 admin, 3 instructors, 2 learners)');
  console.log('  📚 Courses: 3');
  console.log('  📖 Modules: 4');
  console.log('  📝 Lessons: 9');
  console.log('  ❓ Quizzes: 1');
  console.log('  📝 Enrollments: 4');
  console.log('  💬 Discussions: 2');
  console.log('  🔔 Notifications: 3');
  console.log('');
  console.log('🔐 Test Accounts:');
  console.log('  Admin: admin@microlearn.com');
  console.log('  Instructor: sarah.johnson@microlearn.com');
  console.log('  Learner: john.doe@example.com');
  console.log('  Password (all): password123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
