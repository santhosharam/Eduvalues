const mongoose = require('mongoose')
const softDeletePlugin = require('../utils/softDeletePlugin')

// Register global soft delete plugin
mongoose.plugin(softDeletePlugin)

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;
        let isMemoryDB = false;

        // Support for running without a local MongoDB installation
        if (uri === 'memory') {
            isMemoryDB = true;
            console.log('⏳ Starting embedded MongoDB Server...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        const conn = await mongoose.connect(uri)
        console.log(`✅ MongoDB connected: ${conn.connection.host}`)

        // Auto-seed the memory database so you can log in immediately
        if (isMemoryDB) {
            console.log('🌱 Seeding memory database...');
            const User = require('../models/User');
            const Course = require('../models/Course');
            const Lesson = require('../models/Lesson');

            if (await User.countDocuments() === 0) {
                await User.create({
                    name: 'Site Administrator',
                    email: 'admin@learnhub.com',
                    password: 'password123',
                    role: 'admin'
                });
                console.log('✅ Admin account seeded (admin@learnhub.com / password123)');
            }

            if (await Course.countDocuments() === 0) {
                const courses = [
                    {
                        title: 'Character Builders: Essential Life Values for Kids',
                        description: 'A character education course designed for children that teaches important life values such as kindness, honesty, responsibility, respect, perseverance, empathy, gratitude, courage, integrity, and humility through engaging stories and activities.',
                        shortDescription: 'Learn kindness, honesty, courage, gratitude, and responsibility through engaging stories.',
                        slug: 'essential-life-values-for-kids',
                        category: 'Values',
                        level: 'beginner',
                        price: 500,
                        discountPrice: 500,
                        instructor: 'Santhosh Ram',
                        duration: '10 Lessons',
                        thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
                    }
                ];

                for (const c of courses) {
                    const course = await Course.create(c);
                    let lessons = [];
                    if (c.title === 'Character Builders: Essential Life Values for Kids') {
                        const lessonsData = {
                            'Kindness': `
                                <div class="lesson-content">
                                    <section class="story-section">
                                        <h2 style="color: #FF6B6B;">Story: The Kindness Garden</h2>
                                        <p>In 'The Kindness Garden,' Maya learns that small acts of kindness are like seeds that grow into beautiful flowers, spreading joy throughout her neighborhood.</p>
                                        <p>In a small neighborhood, there lived a girl named Maya. Maya loved flowers and dreamed of having a beautiful garden. One day, she noticed that her elderly neighbor, Mr. Jenkins, looked sad. His garden, once vibrant with colorful flowers, was now overgrown with weeds.</p>
                                        <p>Maya decided to help. Every day after school, she spent a little time pulling weeds and planting new flowers in Mr. Jenkins' garden. Other neighborhood children saw what Maya was doing and joined her. Soon, they were not only helping Mr. Jenkins but also other neighbors who needed assistance with their gardens. As they worked together, the entire neighborhood started to bloom, not just with flowers, but with friendship and joy. Maya realized that acts of kindness, like seeds, grow into beautiful things when planted and nurtured.</p>
                                    </section>
                                    
                                    <section class="learn-section" style="background: #FFF5F5; padding: 20px; border-radius: 15px; margin: 20px 0;">
                                        <h3 style="color: #FF6B6B;">What You'll Learn:</h3>
                                        <ul>
                                            <li>How small acts of kindness make a big difference</li>
                                            <li>Why being kind helps others and makes you feel good too</li>
                                            <li>Creative ways to show kindness every day</li>
                                        </ul>
                                        <div class="parent-tip" style="border-left: 4px solid #FF6B6B; padding-left: 15px; margin-top: 15px;">
                                            <strong>Parent Tip:</strong> After reading this story, ask your child how they could practice similar kindness in their own life.
                                        </div>
                                    </section>

                                    <section class="qa-section">
                                        <h3 style="color: #FF6B6B;">Q&A</h3>
                                        <div class="qa-item"><strong>What does kindness mean?</strong><p>Kindness means being friendly, generous, and considerate to others. It's about treating people with care and respect, and doing nice things without expecting anything in return.</p></div>
                                        <div class="qa-item"><strong>Why is kindness important?</strong><p>Kindness is important because it helps create a positive and supportive community. When we're kind to others, we make them feel good, and that kindness often spreads.</p></div>
                                    </section>

                                    <section class="todo-section" style="background: #E8F5E9; padding: 20px; border-radius: 15px; margin-top: 20px;">
                                        <h3 style="color: #2E7D32;">Kindness To-Do List</h3>
                                        <ul>
                                            <li><strong>Say One Kind Thing:</strong> Tell a friend or family member something nice.</li>
                                            <li><strong>Help Someone Out:</strong> Look for ways to help without being asked.</li>
                                            <li><strong>Kindness Journal:</strong> Write about a kind act you did today.</li>
                                        </ul>
                                    </section>
                                </div>
                            `,
                            'Honesty': `
                                <div class="lesson-content">
                                    <section class="story-section">
                                        <h2 style="color: #4A90E2;">Story: The Broken Vase</h2>
                                        <p>Alex was playing with a ball inside the house, even though Mom had told him not to. As he tossed the ball high, it bounced off the ceiling and knocked over Mom's favorite vase. The vase shattered into pieces on the floor.</p>
                                        <p>Alex felt terrible. He thought about hiding the broken pieces and pretending he didn't know what happened. "Maybe I can say the cat did it," he thought. But something inside told him that wouldn't be right.</p>
                                        <p>When Mom came home, Alex was waiting at the door. "Mom, I have something to tell you," he said, his voice shaking. "I was playing ball in the house and broke your special vase. I'm really sorry." Mom was quiet for a moment, then gave Alex a hug. "I'm sad about my vase," she said, "but I'm proud of you for telling the truth. That was brave."</p>
                                    </section>
                                    
                                    <section class="learn-section" style="background: #EBF5FF; padding: 20px; border-radius: 15px; margin: 20px 0;">
                                        <h3 style="color: #4A90E2;">What You'll Learn:</h3>
                                        <ul>
                                            <li>The courage it takes to tell the truth</li>
                                            <li>How honesty builds trust</li>
                                            <li>Why facing consequences is better than hiding the truth</li>
                                        </ul>
                                    </section>

                                    <section class="qa-section">
                                        <h3 style="color: #4A90E2;">Q&A</h3>
                                        <div class="qa-item"><strong>What does honesty mean?</strong><p>Honesty means telling the truth and being straightforward with others. It's about being trustworthy and not deceiving people.</p></div>
                                    </section>

                                    <section class="todo-section" style="background: #FFF9C4; padding: 20px; border-radius: 15px; margin-top: 20px;">
                                        <h3 style="color: #FBC02D;">Honesty To-Do List</h3>
                                        <ul>
                                            <li><strong>Tell the Truth:</strong> Practice telling the truth even when it's difficult.</li>
                                            <li><strong>Keep Your Promises:</strong> If you say you'll do something, make sure you do it.</li>
                                        </ul>
                                    </section>
                                </div>
                            `,
                            'Responsibility': `
                                <div class="lesson-content">
                                    <section class="story-section">
                                        <h2 style="color: #FF9F43;">Story: The Soccer Team Captain</h2>
                                        <p>Riya was thrilled when her coach chose her to be the captain. "Being captain means you have responsibilities," her coach explained. "You need to arrive early to help set up, lead warm-ups, and make sure everyone feels included."</p>
                                        <p>The first game day arrived, and Riya hit snooze. When she arrived late, the team had to rush, and they lost. The next week, Riya remembered her promise. She got up early, helped set up, and cheered for everyone. Her team played better than ever. "Great leadership today, Riya," her coach said. Riya realized that being responsible was about being someone others could count on.</p>
                                    </section>

                                    <section class="learn-section" style="background: #FFF4E5; padding: 20px; border-radius: 15px; margin: 20px 0;">
                                        <h3 style="color: #FF9F43;">What You'll Learn:</h3>
                                        <ul>
                                            <li>How responsibility impacts others</li>
                                            <li>The importance of keeping commitments</li>
                                            <li>How being responsible builds respect</li>
                                        </ul>
                                    </section>

                                    <section class="qa-section">
                                        <h3 style="color: #FF9F43;">Q&A</h3>
                                        <div class="qa-item"><strong>What does responsibility mean?</strong><p>Responsibility means being accountable for your actions and obligations. It's about doing what you're supposed to do.</p></div>
                                    </section>

                                    <section class="todo-section" style="background: #E3F2FD; padding: 20px; border-radius: 15px; margin-top: 20px;">
                                        <h3 style="color: #1976D2;">Responsibility To-Do List</h3>
                                        <ul>
                                            <li><strong>Explain the Value:</strong> Talk to people who violate responsibility.</li>
                                            <li><strong>Do Service:</strong> Help elders or educate younger ones.</li>
                                        </ul>
                                    </section>
                                </div>
                            `
                        };

                        const quizzesData = {
                            'Kindness': [
                                {
                                    question: "Maya sees Mr. Jenkins looking sad and his garden is full of weeds. What should she do?",
                                    options: [
                                        { text: "Go home and play video games", correct: false, feedback: "Oh no! That doesn't help Mr. Jenkins smile. 🎮" },
                                        { text: "Help him pull weeds and plant flowers", correct: true, feedback: "YES! You're a Kindness Superhero! 🌸✨" },
                                        { text: "Wait for someone else to do it", correct: false, feedback: "Maya wants to be the one to plant seeds of joy! 🌱" }
                                    ]
                                },
                                {
                                    question: "If a friend drops their lunch, what is the kindest thing to do?",
                                    options: [
                                        { text: "Laugh and point", correct: false, feedback: "That might hurt their feelings. 😔" },
                                        { text: "Help them clean up and share some of yours", correct: true, feedback: "Sharing is caring! You're amazing! 🍎" },
                                        { text: "Ignore it and keep eating", correct: false, feedback: "Kindness means helping friends in need! 🤝" }
                                    ]
                                },
                                {
                                    question: "How can you spread kindness at home?",
                                    options: [
                                        { text: "Say 'Thank you' and help with chores", correct: true, feedback: "Moms and dads love kindness too! 🏠✨" },
                                        { text: "Leave your toys everywhere", correct: false, feedback: "Cleaning up is a great way to be kind! 🧸" },
                                        { text: "Ask for things without saying please", correct: false, feedback: "Politeness and thank yous are kindness magic! ✨" }
                                    ]
                                }
                            ],
                            'Honesty': [
                                {
                                    question: "Alex accidentally broke a vase while playing. What should he do?",
                                    options: [
                                        { text: "Hide the pieces and stay quiet", correct: false, feedback: "The truth always feels better! 🏺" },
                                        { text: "Tell Mom exactly what happened", correct: true, feedback: "Brave choice! Honesty builds trust. ⭐" },
                                        { text: "Blame it on the cat", correct: false, feedback: "The cat didn't do it! Alex knows the truth. 🐱" }
                                    ]
                                },
                                {
                                    question: "Why is it important to tell the truth even when it's hard?",
                                    options: [
                                        { text: "To avoid getting in trouble temporarily", correct: false, feedback: "Lying usually leads to more trouble later! 🛑" },
                                        { text: "Because people trust you when you are honest", correct: true, feedback: "Exactly! Trust is like a bridge. 🌉" },
                                        { text: "To make yourself look better", correct: false, feedback: "Real honesty is about being real, not looking perfect. ✨" }
                                    ]
                                },
                                {
                                    question: "You find a toy that doesn't belong to you at school. What do you do?",
                                    options: [
                                        { text: "Keep it for yourself", correct: false, feedback: "It belongs to someone else! 🧸" },
                                        { text: "Give it to the teacher and help find the owner", correct: true, feedback: "That's being honest and kind! 🍎" },
                                        { text: "Ignore it and walk away", correct: false, feedback: "Helping find the owner is the honest way! 🤝" }
                                    ]
                                }
                            ],
                            'Responsibility': [
                                {
                                    question: "Riya is the soccer captain but she oversleeps. What should she have done?",
                                    options: [
                                        { text: "Blame her alarm clock", correct: false, feedback: "Taking responsibility means owning your actions! ⏰" },
                                        { text: "Set multiple alarms and be ready early", correct: true, feedback: "Yes! A leader is always ready. ⚽" },
                                        { text: "Ask someone else to be captain instead", correct: false, feedback: "Responsibility means finishing what you start! 💪" }
                                    ]
                                },
                                {
                                    question: "How can you show responsibility at school?",
                                    options: [
                                        { text: "Wait for the teacher to clean your desk", correct: false, feedback: "Cleaning your own space is responsible! 🧹" },
                                        { text: "Finish your homework on time", correct: true, feedback: "Great job! That shows you care about your learning. 📚" },
                                        { text: "Let your partner do all the work", correct: false, feedback: "Teamwork means everyone is responsible! 🤝" }
                                    ]
                                },
                                {
                                    question: "What does being 'accountable' mean?",
                                    options: [
                                        { text: "Doing whatever you want", correct: false, feedback: "Accountability means answering for your choices. 🛑" },
                                        { text: "Owning your mistakes and fixing them", correct: true, feedback: "Spot on! That's true responsibility. 🛠️" },
                                        { text: "Pretending nothing happened", correct: false, feedback: "Facing things is being responsible! ✨" }
                                    ]
                                }
                            ],
                            'Respect': [
                                {
                                    question: "Zach sees Mei being teased for her traditional clothes. What should he do?",
                                    options: [
                                        { text: "Join in the teasing", correct: false, feedback: "That's not respectful! ❌" },
                                        { text: "Sit with her and show she is welcome", correct: true, feedback: "Spot on! Respect is about inclusion. 🤝" },
                                        { text: "Ignore it and walk away", correct: false, feedback: "Being a friend is the respectful choice! ✨" }
                                    ]
                                },
                                {
                                    question: "How can you show respect to your teacher?",
                                    options: [
                                        { text: "Listen carefully while they are speaking", correct: true, feedback: "Listening is a great way to show respect! 👂✨" },
                                        { text: "Talk loudly while they are teaching", correct: false, feedback: "Teachers feel respected when we listen. 🍎" },
                                        { text: "Ignore the classroom rules", correct: false, feedback: "Rules are there to keep everyone safe and respected! 🛡️" }
                                    ]
                                },
                                {
                                    question: "If someone has a different opinion than you, what is the respectful thing to do?",
                                    options: [
                                        { text: "Tell them they are wrong and walk away", correct: false, feedback: "Everyone's opinion matters! 🌍" },
                                        { text: "Listen and try to understand their point of view", correct: true, feedback: "Yes! Respect means valuing differences. 🤝" },
                                        { text: "Laugh at their ideas", correct: false, feedback: "Being kind to others' ideas is being respectful! 🌟" }
                                    ]
                                }
                            ],
                            'Perseverance': [
                                {
                                    question: "Jana falls off her bike and feels like giving up. What should she do?",
                                    options: [
                                        { text: "Leave the bike and walk home", correct: false, feedback: "Try one more time! 🚲" },
                                        { text: "Get back up and try again slowly", correct: true, feedback: "Yes! That's perseverance! 💪" },
                                        { text: "Cry and wait for Dad to carry her", correct: false, feedback: "Jana is strong and can keep going! ✨" }
                                    ]
                                },
                                {
                                    question: "If a puzzle is really hard and you can't find the pieces, what do you do?",
                                    options: [
                                        { text: "Throw the puzzle on the floor", correct: false, feedback: "Patience and trying again is the key! 🧩" },
                                        { text: "Take a deep breath and keep looking", correct: true, feedback: "That's it! Perseverance means not giving up. 🌟" },
                                        { text: "Ask someone else to do it for you", correct: false, feedback: "You can do it if you keep trying! 💪" }
                                    ]
                                },
                                {
                                    question: "What does 'Perseverance' mean?",
                                    options: [
                                        { text: "Doing things perfectly the first time", correct: false, feedback: "No one is perfect! It's about trying again. ❌" },
                                        { text: "Continuing to try even when things are difficult", correct: true, feedback: "Spot on! You have the heart of a winner. 🏆" },
                                        { text: "Only doing the easy stuff", correct: false, feedback: "The hard stuff is where we grow the most! ✨" }
                                    ]
                                }
                            ],
                            'Empathy': [
                                {
                                    question: "Meera sees Rihan sitting alone because he can't run. What does she do?",
                                    options: [
                                        { text: "Tell him he should have tried harder", correct: false, feedback: "Empathy means understanding others. ❌" },
                                        { text: "Organize a game everyone can play", correct: true, feedback: "Beautiful! Including everyone is empathy. ❤️" },
                                        { text: "Keep running and winning races", correct: false, feedback: "Winning is fun, but friendship is better! ✨" }
                                    ]
                                },
                                {
                                    question: "Your friend is crying because they lost their favorite pencil. What do you do?",
                                    options: [
                                        { text: "Tell them it's just a pencil and to stop crying", correct: false, feedback: "Their feelings are important! 😔" },
                                        { text: "Sit with them and help them look for it", correct: true, feedback: "That's empathy in action! You're a great friend. 🤝" },
                                        { text: "Laugh at them", correct: false, feedback: "Kindness and empathy go hand in hand. ❤️" }
                                    ]
                                },
                                {
                                    question: "What is 'Empathy'?",
                                    options: [
                                        { text: "Feeling sorry for someone", correct: false, feedback: "Empathy is more than just feeling sorry; it's understanding. 🧠" },
                                        { text: "Understanding and sharing the feelings of another", correct: true, feedback: "Exactly! It's like feeling with your heart. ❤️" },
                                        { text: "Doing exactly what everyone else is doing", correct: false, feedback: "Empathy is about connection, not just following. ✨" }
                                    ]
                                }
                            ],
                            'Gratitude': [
                                {
                                    question: "Aarav is bored with his toys. What did his grandfather teach him?",
                                    options: [
                                        { text: "To ask for even more toys", correct: false, feedback: "More things don't always mean more happy. ❌" },
                                        { text: "To appreciate what he already has", correct: true, feedback: "Yes! Gratitude turns what we have into enough. 🌟" },
                                        { text: "To give all his toys away", correct: false, feedback: "Being thankful for what you have is the key! ✨" }
                                    ]
                                },
                                {
                                    question: "What is a good way to practice gratitude every day?",
                                    options: [
                                        { text: "Complain about what you don't have", correct: false, feedback: "Complaining makes the heart feel heavy. 😔" },
                                        { text: "Think of 3 things you are thankful for", correct: true, feedback: "That's a wonderful habit! It makes the heart happy. 🌸" },
                                        { text: "Wait for someone to give you a gift", correct: false, feedback: "You can be grateful for simple things like sunshine! ☀️" }
                                    ]
                                },
                                {
                                    question: "How does saying 'Thank You' make others feel?",
                                    options: [
                                        { text: "Confused", correct: false, feedback: "Everyone loves to feel appreciated! ✨" },
                                        { text: "Appreciated and happy", correct: true, feedback: "Yes! Your gratitude is like a gift to them. 🎁" },
                                        { text: "Sad", correct: false, feedback: "Thank yous bring smiles! 😊" }
                                    ]
                                }
                            ],
                            'Courage': [
                                {
                                    question: "Arjun is scared to perform in the class play. What is true courage?",
                                    options: [
                                        { text: "Doing it even though he is afraid", correct: true, feedback: "Exactly! Courage is facing your fear. 🦁" },
                                        { text: "Waiting until he is not scared anymore", correct: false, feedback: "Sometimes we have to be brave while scared! ✨" },
                                        { text: "Asking someone else to take his place", correct: false, feedback: "Arjun can do it! He is brave. 💪" }
                                    ]
                                },
                                {
                                    question: "Is it courageous to ask for help when you are stuck?",
                                    options: [
                                        { text: "No, it shows you are weak", correct: false, feedback: "Asking for help is a sign of STRENGTH! 💪" },
                                        { text: "Yes, it takes courage to admit you need help", correct: true, feedback: "You got it! Bravery comes in many forms. 🌟" },
                                        { text: "Only if you have no other choice", correct: false, feedback: "Being honest about needing help is always brave. ✨" }
                                    ]
                                },
                                {
                                    question: "Which of these shows courage?",
                                    options: [
                                        { text: "Standing up for a friend who is being teased", correct: true, feedback: "That's a huge act of courage! You're a hero. 🦸‍♂️" },
                                        { text: "Doing what everyone else is doing so you don't stand out", correct: false, feedback: "Being yourself takes more courage! 🌟" },
                                        { text: "Staying quiet when you see something wrong", correct: false, feedback: "Speaking up is the courageous choice. 📢" }
                                    ]
                                }
                            ],
                            'Integrity': [
                                {
                                    question: "Diya sees a test answer when the teacher isn't looking. What does she do?",
                                    options: [
                                        { text: "Copy the answer to get a better grade", correct: false, feedback: "Integrity is doing right when no one sees. ❌" },
                                        { text: "Focus on her own work and be honest", correct: true, feedback: "Perfect! That is true integrity. ⭐" },
                                        { text: "Tell her friends the answer later", correct: false, feedback: "Doing your own work is the right choice! ✨" }
                                    ]
                                },
                                {
                                    question: "What does 'character' mean, according to Diya's father?",
                                    options: [
                                        { text: "Being the best at everything", correct: false, feedback: "Character is more important than being first! ❌" },
                                        { text: "Who you are when no one is watching", correct: true, feedback: "Exactly! That is the heart of integrity. 💖" },
                                        { text: "Having many friends", correct: false, feedback: "Character is about your own choices! ✨" }
                                    ]
                                },
                                {
                                    question: "If you find a toy on the playground and no one is looking, what do you do?",
                                    options: [
                                        { text: "Keep it because no one saw you find it", correct: false, feedback: "Integrity means doing the right thing anyway! ❌" },
                                        { text: "Take it to the lost and found", correct: true, feedback: "Yes! Your heart knows what's right. 🌟" },
                                        { text: "Hide it so you can find it later", correct: false, feedback: "Being honest is the path of integrity. ✨" }
                                    ]
                                }
                            ],
                            'Humility': [
                                {
                                    question: "If you win a big trophy, what is the humble thing to do?",
                                    options: [
                                        { text: "Brag to everyone about how great you are", correct: false, feedback: "Humility means being modest. ❌" },
                                        { text: "Thank your team and teachers for their help", correct: true, feedback: "Yes! Sharing the credit is humility. 🌱" },
                                        { text: "Hide the trophy so no one sees it", correct: false, feedback: "You can be proud, but be kind and modest too! ✨" }
                                    ]
                                },
                                {
                                    question: "What did Rohan learn after losing the chess match to the grandmaster?",
                                    options: [
                                        { text: "That he is a bad player", correct: false, feedback: "He learned that there is always more to learn! ♟️" },
                                        { text: "That even the best players can learn from others", correct: true, feedback: "Exactly! Humility opens the door to wisdom. 🌟" },
                                        { text: "That he should stop playing chess", correct: false, feedback: "Losing is just another way to grow! 💪" }
                                    ]
                                },
                                {
                                    question: "Why is it important to be a 'lifelong learner'?",
                                    options: [
                                        { text: "Because you can never know everything", correct: true, feedback: "Yes! Staying humble means staying curious. 🧠✨" },
                                        { text: "So you can win more trophies", correct: false, feedback: "Learning is for your mind and heart, not just prizes! 🏆" },
                                        { text: "Because the teacher said so", correct: false, feedback: "It's because the world is full of wonders to discover! 🌍" }
                                    ]
                                }
                            ]
                        };

                        const comicLessons = require('../data/comicLessons');

                        const values = [
                            'Kindness', 'Honesty', 'Responsibility', 'Respect', 'Perseverance',
                            'Empathy', 'Gratitude', 'Courage', 'Integrity', 'Humility'
                        ];
                        lessons = values.map((val, idx) => ({
                            title: val,
                            description: `Learn the importance of ${val.toLowerCase()} through engaging stories and reflective play.`,
                            content: lessonsData[val] || `<div class="lesson-content"><h3>Exploring ${val}</h3><p>Coming soon: engaging stories and activities about ${val.toLowerCase()}.</p></div>`,
                            isFree: idx === 0,
                            order: idx + 1,
                            courseId: course._id,
                            quiz: quizzesData[val] || [],
                            panels: comicLessons[val] || []
                        }));
                    } else {
                        lessons = [
                            { title: 'Introduction', content: 'Basics...', isFree: true, order: 1, courseId: course._id }
                        ];
                    }
                    const createdLessons = await Lesson.insertMany(lessons);
                    course.lessons = createdLessons.map(l => l._id);
                    await course.save();
                }
                const Enrollment = require('../models/Enrollment');
                
                // Seed a Student
                let student;
                if (await User.countDocuments({ role: 'student' }) === 0) {
                    student = await User.create({
                        name: 'John Student',
                        email: 'student@example.com',
                        password: 'password123',
                        role: 'student'
                    });
                    console.log('✅ Student account seeded (student@example.com / password123)');
                } else {
                    student = await User.findOne({ role: 'student' });
                }

                // Enroll student in all seeded courses
                if (student) {
                    const courses = await Course.find();
                    for (const course of courses) {
                        const exists = await Enrollment.findOne({ student: student._id, courseId: course._id });
                        if (!exists) {
                            await Enrollment.create({
                                student: student._id,
                                courseId: course._id,
                                progress: 0
                            });
                        }
                    }
                    console.log('✅ Student enrolled in seeded courses');
                }
                
                console.log('✅ Database seeded successfully');
            }
        }
    } catch (err) {
        console.error('❌ MongoDB connection error:', err)
        process.exit(1)
    }
}

module.exports = connectDB
