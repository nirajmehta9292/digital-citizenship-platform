"""
Seed sample lessons and quizzes into the database
Run with: python seed_lessons.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson import ObjectId

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "byt_education"

sample_lessons = [
    {
        "title": "Creating Strong Passwords",
        "description": "Learn how to create secure passwords that protect your accounts",
        "lesson_type": "digital_safety",
        "grade_level": "grade_4",
        "module_number": 1,
        "lesson_number": 1,
        "duration_minutes": 15,
        "story_content": """
Byte was setting up his first email account. His friend Glitch suggested using "password123" because it was easy to remember. But Spark stepped in with some important advice.

"Wait!" said Spark. "That password is way too simple. Anyone could guess it!"

Byte was confused. "But how will I remember a complicated password?"

Spark explained, "A strong password is like a secret recipe. You mix different ingredients: uppercase letters, lowercase letters, numbers, and symbols. And it should be at least 12 characters long."

Byte thought about his favorite things: pizza, basketball, and his dog Max. He created: "Pizza&Max#2024!"

"Perfect!" said Spark. "Now that's a password that's hard to guess but easy for you to remember because it's based on things you love."

Byte learned that:
- Strong passwords use a mix of characters
- They should be at least 12 characters long
- Never use the same password for different accounts
- Never share passwords with anyone (except trusted adults like parents)

From that day on, Byte made sure all his accounts had strong, unique passwords.
        """,
        "learning_objectives": [
            "Understand what makes a password strong",
            "Learn to create memorable yet secure passwords",
            "Recognize weak password patterns to avoid",
            "Understand the importance of unique passwords for each account"
        ],
        "standards_alignment": {
            "ISTE": ["1.2.a - Students demonstrate an understanding of how personal information can be protected"],
            "CASEL": ["Self-management - Demonstrate personal and collective agency"],
            "UNESCO": ["Digital Safety 2.1 - Protecting personal data and privacy"]
        },
        "is_published": True,
        "created_at": datetime.utcnow(),
        "published_at": datetime.utcnow()
    },
    {
        "title": "Understanding AI Assistants",
        "description": "Discover how AI assistants work and how to use them responsibly",
        "lesson_type": "responsible_ai",
        "grade_level": "grade_5",
        "module_number": 1,
        "lesson_number": 1,
        "duration_minutes": 15,
        "story_content": """
Byte was amazed when he asked his phone's AI assistant about dinosaurs and got instant answers. "How does it know everything?" he wondered.

Glitch explained, "The AI doesn't actually 'know' things like we do. It's been trained on millions of pieces of information from the internet."

"So it's like a super smart computer?" asked Byte.

"Sort of," said Spark, "but it's important to understand that AI can make mistakes. It learns from the data it's given, and sometimes that data can be wrong or biased."

Byte tested this. He asked the AI: "What's the best pizza topping?" 
The AI said: "Pepperoni is the most popular topping."

"See?" said Spark. "It gave you a popular answer, but 'best' is subjective. AI can't really understand opinions or feelings like humans can."

Byte learned important lessons about AI:
- AI learns from data created by humans
- AI can be helpful but isn't perfect
- Always think critically about AI answers
- Use AI as a tool to help you learn, not replace your thinking
- Never share personal information with AI assistants

"AI is like a really smart calculator," Byte concluded. "It's a tool that helps us, but we're still the ones who need to understand and make decisions!"
        """,
        "learning_objectives": [
            "Understand how AI assistants work at a basic level",
            "Recognize that AI has limitations and can make mistakes",
            "Learn to use AI tools responsibly and safely",
            "Develop critical thinking when using AI-generated information"
        ],
        "standards_alignment": {
            "ISTE": ["1.3.a - Students understand how technologies work"],
            "CASEL": ["Responsible decision-making"],
            "UNESCO": ["AI Literacy 1.1 - Understanding AI systems"]
        },
        "is_published": True,
        "created_at": datetime.utcnow(),
        "published_at": datetime.utcnow()
    },
    {
        "title": "Digital Footprint Basics",
        "description": "Learn what information you leave online and how to manage it",
        "lesson_type": "digital_safety",
        "grade_level": "grade_3",
        "module_number": 2,
        "lesson_number": 1,
        "duration_minutes": 15,
        "story_content": """
Spark was walking on a muddy trail when she noticed something interesting - her footprints followed her everywhere she went!

"Just like these footprints," Glitch explained, "everything you do online leaves a digital footprint too."

Byte was curious. "You mean like when I play games online?"

"Exactly!" said Spark. "When you post a comment, share a photo, or even just visit a website, you're leaving digital footprints. And unlike mud that dries and disappears, digital footprints can stay online forever!"

The friends made a list of digital footprints:
- Photos and videos you post
- Comments you write
- Websites you visit
- Games you play
- Things you search for

"The important thing," Spark explained, "is to make sure your digital footprints are positive. Before you post something, ask yourself: Would I want my teacher or parents to see this? Would I want this online in five years?"

Byte realized he needed to be more careful. He decided to:
- Think before posting anything
- Only share appropriate photos and comments
- Keep personal information private
- Create a positive digital footprint he'd be proud of

"Your digital footprint is like your online reputation," Spark concluded. "Make it a good one!"
        """,
        "learning_objectives": [
            "Understand what a digital footprint is",
            "Identify different types of digital footprints",
            "Recognize that online actions can have lasting effects",
            "Learn to make positive choices about online activity"
        ],
        "standards_alignment": {
            "ISTE": ["1.2.d - Students manage their digital identity"],
            "CASEL": ["Self-awareness - Recognize personal traits"],
            "UNESCO": ["Digital Safety 3.1 - Managing digital identity"]
        },
        "is_published": True,
        "created_at": datetime.utcnow(),
        "published_at": datetime.utcnow()
    }
]

sample_quizzes = [
    {
        "lesson_title": "Creating Strong Passwords",
        "questions": [
            {
                "question_text": "What makes a password strong?",
                "options": [
                    "Using a mix of uppercase, lowercase, numbers, and symbols",
                    "Using your name and birthday",
                    "Using 'password123'",
                    "Using the same password for everything"
                ],
                "correct_answer_index": 0,
                "explanation": "A strong password uses a variety of character types (uppercase, lowercase, numbers, and symbols) to make it harder to guess."
            },
            {
                "question_text": "How long should a strong password be?",
                "options": [
                    "At least 5 characters",
                    "At least 8 characters",
                    "At least 12 characters",
                    "It doesn't matter"
                ],
                "correct_answer_index": 2,
                "explanation": "A strong password should be at least 12 characters long. Longer passwords are harder to crack."
            },
            {
                "question_text": "Should you use the same password for different accounts?",
                "options": [
                    "Yes, it's easier to remember",
                    "No, each account should have a unique password",
                    "Only for important accounts",
                    "It doesn't matter"
                ],
                "correct_answer_index": 1,
                "explanation": "Each account should have a unique password. If one account is hacked, your other accounts stay safe."
            },
            {
                "question_text": "Who should you share your password with?",
                "options": [
                    "Your best friend",
                    "Your classmates",
                    "Only trusted adults like parents",
                    "Everyone"
                ],
                "correct_answer_index": 2,
                "explanation": "You should only share passwords with trusted adults like your parents. Never share them with friends or classmates."
            }
        ],
        "passing_score": 75
    },
    {
        "lesson_title": "Understanding AI Assistants",
        "questions": [
            {
                "question_text": "How does an AI assistant learn?",
                "options": [
                    "It goes to school like humans",
                    "It's trained on data from the internet",
                    "It already knows everything",
                    "It asks other AI assistants"
                ],
                "correct_answer_index": 1,
                "explanation": "AI assistants are trained on large amounts of data from the internet and other sources. They learn patterns from this data."
            },
            {
                "question_text": "Can AI make mistakes?",
                "options": [
                    "No, AI is always perfect",
                    "Yes, AI can make mistakes or give wrong information",
                    "Only when it's old",
                    "AI never makes mistakes with numbers"
                ],
                "correct_answer_index": 1,
                "explanation": "Yes! AI can make mistakes because it learns from data created by humans, which can sometimes be wrong or biased."
            },
            {
                "question_text": "Should you share personal information with AI assistants?",
                "options": [
                    "Yes, always",
                    "No, never share personal information",
                    "Only on weekends",
                    "Only if the AI asks nicely"
                ],
                "correct_answer_index": 1,
                "explanation": "You should never share personal information like your address, phone number, or school name with AI assistants."
            },
            {
                "question_text": "What's the best way to use AI?",
                "options": [
                    "Let AI do all your homework",
                    "Copy everything AI says without thinking",
                    "Use it as a helpful tool while still thinking critically",
                    "Never use AI at all"
                ],
                "correct_answer_index": 2,
                "explanation": "AI is best used as a helpful tool. Always think critically about the information it provides and use your own judgment."
            }
        ],
        "passing_score": 75
    },
    {
        "lesson_title": "Digital Footprint Basics",
        "questions": [
            {
                "question_text": "What is a digital footprint?",
                "options": [
                    "Footprints you make while walking",
                    "The trace of your online activities",
                    "A special type of shoe",
                    "A game you play online"
                ],
                "correct_answer_index": 1,
                "explanation": "A digital footprint is the trail of data you leave behind when you use the internet - like posts, comments, and photos."
            },
            {
                "question_text": "How long can digital footprints last?",
                "options": [
                    "Just one day",
                    "One week",
                    "Forever",
                    "They disappear automatically"
                ],
                "correct_answer_index": 2,
                "explanation": "Digital footprints can last forever! Once something is posted online, it can be very difficult to completely remove it."
            },
            {
                "question_text": "Before posting something online, you should ask yourself:",
                "options": [
                    "Will this get lots of likes?",
                    "Would I want my parents and teachers to see this?",
                    "Is this the funniest thing ever?",
                    "Will my friends think this is cool?"
                ],
                "correct_answer_index": 1,
                "explanation": "Before posting, think: 'Would I want my parents or teachers to see this?' This helps you make good decisions about what to share."
            },
            {
                "question_text": "Which of these creates a positive digital footprint?",
                "options": [
                    "Posting mean comments about others",
                    "Sharing helpful and kind messages",
                    "Posting inappropriate photos",
                    "Sharing personal information publicly"
                ],
                "correct_answer_index": 1,
                "explanation": "Sharing helpful and kind messages creates a positive digital footprint that you can be proud of!"
            }
        ],
        "passing_score": 75
    }
]


async def seed_data():
    """Seed sample lessons and quizzes into the database"""
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("🌱 Seeding sample lessons and quizzes...")
    print("=" * 50)
    
    # Insert lessons
    lesson_ids = {}
    for lesson in sample_lessons:
        result = await db.lessons.insert_one(lesson)
        lesson_ids[lesson["title"]] = str(result.inserted_id)
        print(f"✅ Created lesson: {lesson['title']}")
    
    print()
    
    # Insert quizzes
    for quiz_data in sample_quizzes:
        lesson_title = quiz_data["lesson_title"]
        if lesson_title in lesson_ids:
            quiz = {
                "lesson_id": lesson_ids[lesson_title],
                "questions": quiz_data["questions"],
                "passing_score": quiz_data["passing_score"],
                "created_at": datetime.utcnow()
            }
            await db.quizzes.insert_one(quiz)
            print(f"✅ Created quiz for: {lesson_title}")
    
    print()
    print("=" * 50)
    print("🎉 Sample data seeded successfully!")
    print(f"📚 {len(sample_lessons)} lessons created")
    print(f"❓ {len(sample_quizzes)} quizzes created")
    print()
    print("🚀 You can now log in and explore the lessons!")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_data())
