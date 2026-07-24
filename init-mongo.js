// MongoDB initialization script
// Creates indexes and sample data

db = db.getSiblingDB('byt_education');

// Create collections
db.createCollection('users');
db.createCollection('schools');
db.createCollection('lessons');
db.createCollection('quizzes');
db.createCollection('quiz_results');
db.createCollection('student_progress');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ school_id: 1 });

db.lessons.createIndex({ lesson_type: 1, grade_level: 1 });
db.lessons.createIndex({ is_published: 1 });
db.lessons.createIndex({ module_number: 1, lesson_number: 1 });

db.quizzes.createIndex({ lesson_id: 1 }, { unique: true });

db.quiz_results.createIndex({ student_id: 1, lesson_id: 1 });
db.quiz_results.createIndex({ quiz_id: 1 });
db.quiz_results.createIndex({ completed_at: -1 });

db.student_progress.createIndex({ student_id: 1, lesson_id: 1 }, { unique: true });
db.student_progress.createIndex({ student_id: 1, status: 1 });

print('✅ Database initialized with indexes');

// Sample admin user (password: admin123)
db.users.insertOne({
  email: 'admin@byt.education',
  full_name: 'Platform Administrator',
  password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5BEcLZBIl1jIa',
  role: 'admin',
  created_at: new Date(),
  is_active: true
});

print('✅ Sample admin user created (admin@byt.education / admin123)');
