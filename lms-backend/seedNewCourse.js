require('dotenv').config()
const supabase = require('./supabaseClient')

async function seed() {
    console.log('🌱 Starting Supabase Seeding Script...')

    // 1. Define Course Parameters
    const courseTitle = 'Mindfulness & Patience Adventures'
    const slug = 'mindfulness-and-patience-adventures'
    
    // Check if course already exists to avoid duplication
    const { data: existingCourse } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .single()

    if (existingCourse) {
        console.log('⚠️ Course already exists! Cleaning old lessons and quizzes to re-seed...')
        await supabase.from('quizzes').delete().eq('course_id', existingCourse.id)
        await supabase.from('lessons').delete().eq('course_id', existingCourse.id)
        await supabase.from('courses').delete().eq('id', existingCourse.id)
    }

    // Insert Course
    const { data: course, error: cErr } = await supabase
        .from('courses')
        .insert([{
            title: courseTitle,
            slug: slug,
            description: 'A magical, sensory journey teaching children the superpower of calming their minds, practicing patience, sharing with others, and listening with their hearts.',
            short_description: 'Discover the superpower of calm minds, patience, and kindness in daily life! 🧩✨',
            instructor: 'Sunny Bunny 🐰',
            price: 199,
            discount_price: 99,
            category: 'Mindfulness',
            level: 'beginner',
            duration: '5 Hours',
            thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
            is_published: true
        }])
        .select()
        .single()

    if (cErr) {
        console.error('❌ Failed to insert course:', cErr)
        return
    }

    console.log(`✅ Created Course: "${course.title}" with ID: ${course.id}`)

    // 2. Define 5 Playful Lessons
    const lessonsData = [
        {
            title: 'The Whispering Wind',
            order_index: 1,
            story: 'Deep in the Whispering Woods, Wendy the Wind loved to rush. She wanted every flower to bloom instantly! But the wise old oak tree, Barnaby, whispered: "Beautiful things take time, Wendy. Breathe in, breathe out, and let the sun work its magic." Wendy closed her eyes, took a deep slow breath, and learned the wonderful joy of waiting with a happy smile.',
            learning_goals: '["Learn how to take deep calming breaths", "Understand that waiting can be peaceful", "Practice slowing down when feeling rushed"]',
            parent_tip: 'When your child feels impatient, practice Wendy\'s Wind Breath together: inhale slowly like smelling a flower, exhale gently like blowing a colorful dandelion.',
            quick_summary: null,
            moral_value: 'Patience is a magical superpower that turns waiting time into calm breathing time! 💨✨',
            is_free: true,
            content: '<h3>💨 Activity 1: Wendy\'s Calm Breath</h3><p>Let\'s stretch our hands high like Wendy! Take a big breath in... 1... 2... 3... and let it out like a gentle summer breeze... phew! Waiting is just extra time for fun dreams!</p>'
        },
        {
            title: 'The Sharing Squirrel',
            order_index: 2,
            story: 'Sammy the Squirrel had the biggest pile of golden acorns in the whole forest. He kept them locked in a hollow tree because he was afraid they would run out. But when he saw his friend Bella looking cold and hungry, Sammy took a deep breath and handed her his largest, shiniest acorn. Bella\'s eyes lit up with joy, and Sammy felt a warm, cozy sparkle inside his chest that was bigger than a thousand acorns!',
            learning_goals: '["Discover the joy of sharing with others", "Understand that sharing makes friends happy", "Recognize the warm feeling of generosity"]',
            parent_tip: 'Encourage sharing by praising the act: "Seeing you share your toy makes my heart feel so warm!"',
            quick_summary: null,
            moral_value: 'Sharing what we have spreads happiness and fills our hearts with golden friendship! 🐿️💝',
            is_free: false,
            content: '<h3>🌰 Activity 2: The Acorn Handout</h3><p>Sharing makes the world brighter! When we share, we double the smiles and build beautiful castles together.</p>'
        },
        {
            title: 'Listening with Your Heart',
            order_index: 3,
            story: 'Leo the Little Lion loved to roar! He roared when he was happy, and roared when he was excited. But one afternoon, his friend Pippa the Penguin sat silently by the pond, looking down. Instead of roaring his new song, Leo tucked his paws in, sat quietly beside Pippa, and listened to her talk about how much she missed her family. Pippa smiled and hugged Leo. Leo realized that quiet ears can be the most powerful helpers in the world.',
            learning_goals: '["Understand what active, quiet listening means", "Learn to notice when friends look sad", "Recognize that quiet ears build strong friendships"]',
            parent_tip: 'Play the "Quiet Ears Game" at dinner. Close your eyes for 30 seconds and share the quietest sound you heard.',
            quick_summary: null,
            moral_value: 'Listening with our ears and heart makes our friends feel loved, safe, and heard! 🦁❤️',
            is_free: false,
            content: '<h3>👂 Activity 3: Quiet Ears Challenge</h3><p>Close your eyes. What sounds can you hear in the room? The clock? A distant car? Beautiful! Listening is the secret key to caring.</p>'
        },
        {
            title: 'The Gentle Giant',
            order_index: 4,
            story: 'Gerry was a very big, very strong elephant. He could knock down trees! But Gerry loved the tiny butterflies that fluttered in the meadow. He walked with tiny, soft steps so he wouldn\'t shake the flowers, and let the butterflies rest on his trunk. The other animals realized that being strong doesn\'t mean being loud or rough; true strength is being soft, careful, and gentle to everyone.',
            learning_goals: '["Practice gentle touch and soft walking", "Understand that gentleness is a form of kindness", "Appreciate the fragile things around us"]',
            parent_tip: 'Have your child hold a soft feather or a flower petal to practice gentle, careful handling.',
            quick_summary: null,
            moral_value: 'True power is using our strength to be soft, careful, and gentle to all living things! 🐘🦋',
            is_free: false,
            content: '<h3>🐘 Activity 4: Elephant Footprints</h3><p>Let\'s walk around the room like Gerry the Elephant—make your footsteps as quiet as falling snow! Soft and gentle is the hero way.</p>'
        },
        {
            title: 'The Gratitude Tree',
            order_index: 5,
            story: 'Gigi the Giraffe had a favorite spot in the savanna, but one day she felt sad because she couldn\'t find any sweet berries. Her grandmother took her to the old Gratitude Tree. "For every leaf we touch, we say one thing we are thankful for," she said. Gigi touched a leaf: "I am thankful for the tall shade." She touched another: "I am thankful for my strong legs." Soon, Gigi was smiling and dancing! Her heart felt completely full of sunshine.',
            learning_goals: '["Learn how to name things we are thankful for", "Discover that gratitude makes us feel happy", "Practice saying thank you to people who help us"]',
            parent_tip: 'Create a mini "Gratitude Jar" at home where your child can drop colorful stones or papers representing happy moments.',
            quick_summary: null,
            moral_value: 'Gratitude opens our eyes to the beautiful gifts we already have all around us! 🦒🌳',
            is_free: false,
            content: '<h3>🦒 Activity 5: Leaf of Thanks</h3><p>Think of one beautiful thing in your room right now. Say "Thank you!" to it. Notice how warm and happy your heart feels!</p>'
        }
    ]

    const createdLessons = []
    for (const lData of lessonsData) {
        const { data: lesson, error: lErr } = await supabase
            .from('lessons')
            .insert([{
                course_id: course.id,
                title: lData.title,
                order_index: lData.order_index,
                story: lData.story,
                learning_goals: lData.learning_goals,
                parent_tip: lData.parent_tip,
                quick_summary: lData.quick_summary,
                moral_value: lData.moral_value,
                is_free: lData.is_free,
                content: lData.content
            }])
            .select()
            .single()

        if (lErr) {
            console.error(`❌ Failed to insert lesson ${lData.title}:`, lErr)
        } else {
            console.log(`  + Added Lesson ${lesson.order_index}: "${lesson.title}"`)
            createdLessons.push(lesson)
        }
    }

    // 3. Define 20 Final Exam Questions for table "quizzes"
    const finalExamQuestions = [
        {
            question: "What did Wendy the Wind learn from Barnaby the wise old oak tree?",
            option_a: "To blow down all the birds' nests",
            option_b: "That beautiful things take time, so be patient",
            option_c: "To run faster and faster",
            option_d: "To sleep all day",
            correct_answer: "B"
        },
        {
            question: "When Wendy felt rushed and impatient, what calm activity did she do?",
            option_a: "She screamed loudly",
            option_b: "She took a deep slow breath and smiled",
            option_c: "She hid under a big rock",
            option_d: "She chased the birds",
            correct_answer: "B"
        },
        {
            question: "Sammy the Squirrel used to keep his acorns locked up because:",
            option_a: "He was afraid they would run out",
            option_b: "He did not like Bella",
            option_c: "They were dirty",
            option_d: "He liked the lock",
            correct_answer: "A"
        },
        {
            question: "How did Sammy feel after sharing his biggest, shiniest acorn with Bella?",
            option_a: "Angry and sad",
            option_b: "Warm, cozy, and super happy inside",
            option_c: "Extremely tired",
            option_d: "Very cold",
            correct_answer: "B"
        },
        {
            question: "Sharing what we have is a wonderful way to spread:",
            option_a: "Noisy noises",
            option_b: "Sad feelings",
            option_c: "Golden friendship and smiles",
            option_d: "Dust and sand",
            correct_answer: "C"
        },
        {
            question: "Leo the Little Lion used to love to:",
            option_a: "Swim in the deep ocean",
            option_b: "Roar all the time",
            option_c: "Sleep under the grass",
            option_d: "Eat cold ice cream",
            correct_answer: "B"
        },
        {
            question: "When Leo saw Pippa the Penguin looking sad, what did he do?",
            option_a: "He roared as loud as he could to scare her",
            option_b: "He sat quietly beside her and listened to her heart",
            option_c: "He ran away to play soccer",
            option_d: "He climbed a tall tree",
            correct_answer: "B"
        },
        {
            question: "Active and quiet listening helps our friends feel:",
            option_a: "Scared and lonely",
            option_b: "Loved, safe, and heard",
            option_c: "Angry and frustrated",
            option_d: "Extremely bored",
            correct_answer: "B"
        },
        {
            question: "Gerry the Elephant was a very big giant, but he walked carefully because:",
            option_a: "He was afraid of butterflies",
            option_b: "He wanted to be soft and gentle to all flowers and insects",
            option_c: "He lost his shoes",
            option_d: "His feet were hurt",
            correct_answer: "B"
        },
        {
            question: "What does the story of the Gentle Elephant teach us about true strength?",
            option_a: "True strength is being loud and rough",
            option_b: "True strength is being soft, careful, and gentle",
            option_c: "Strength is only for lifting big trees",
            option_d: "Elephants are always stronger than birds",
            correct_answer: "B"
        },
        {
            question: "When walk-practicing like Gerry the Elephant, our footsteps should be:",
            option_a: "As quiet as falling snow",
            option_b: "Loud like thunder",
            option_c: "Heavy like bricks",
            option_d: "Extremely bouncy",
            correct_answer: "A"
        },
        {
            question: "Gigi the Giraffe was sad because she could not find sweet berries. What tree did she visit?",
            option_a: "The Magic Toy Tree",
            option_b: "The Old Gratitude Tree",
            option_c: "The Sleepy Tree",
            option_d: "The Tall Palm Tree",
            correct_answer: "B"
        },
        {
            question: "How did Gigi use the Old Gratitude Tree to feel happy again?",
            option_a: "She climbed to the very top",
            option_b: "She touched leaves and named things she was thankful for",
            option_c: "She shook all the leaves off",
            option_d: "She slept under its shade",
            correct_answer: "B"
        },
        {
            question: "Practicing gratitude helps us open our eyes to:",
            option_a: "The things we don't have",
            option_b: "The beautiful gifts and love already all around us",
            option_c: "Only sugar candies",
            option_d: "Fairy tales",
            correct_answer: "B"
        },
        {
            question: "If a friend is waiting patiently for a toy, the kindest thing to do is:",
            option_a: "Keep it forever",
            option_b: "Share and invite them to play together",
            option_c: "Hide it in your bag",
            option_d: "Throw it away",
            correct_answer: "B"
        },
        {
            question: "When you listen with your heart, you are practicing:",
            option_a: "Active roaring",
            option_b: "Empathy and care",
            option_c: "Fast running",
            option_d: "High jumping",
            correct_answer: "B"
        },
        {
            question: "Which of the following is a gentle action?",
            option_a: "Slamming the door",
            option_b: "Stroking a puppy softly",
            option_c: "Pulling a flower's petals off",
            option_d: "Stomping on leaves",
            correct_answer: "B"
        },
        {
            question: "If you feel super impatient and want your parents to buy a toy now, what should you do?",
            option_a: "Take a deep 'wind breath' and wait calmly",
            option_b: "Cry on the floor",
            option_c: "Throw a tantrum",
            option_d: "Run away",
            correct_answer: "A"
        },
        {
            question: "Gratitude means saying 'Thank you' to:",
            option_a: "Only when you get a giant toy",
            option_b: "The sun, parents, teachers, and simple good things",
            option_c: "No one at all",
            option_d: "Only yourself",
            correct_answer: "B"
        },
        {
            question: "Moral values like patience, sharing, listening, and gentleness are:",
            option_a: "Seeds of kindness that help our brain and heart grow",
            option_b: "Only for old oak trees",
            option_c: "Boring school lessons",
            option_d: "Games to play",
            correct_answer: "A"
        }
    ]

    console.log('🎮 Seeding 20-Question Final Exam into "quizzes" table...')

    for (let i = 0; i < finalExamQuestions.length; i++) {
        const q = finalExamQuestions[i]
        const { error: qErr } = await supabase
            .from('quizzes')
            .insert([{
                course_id: course.id,
                question: q.question,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c,
                option_d: q.option_d,
                correct_answer: q.correct_answer,
                is_final_exam: true,
                order_index: i + 1
            }])

        if (qErr) {
            console.error(`❌ Failed to insert exam question ${i + 1}:`, qErr)
        }
    }

    console.log(`✅ Completed Seeding 20-Question Final Assessment in quizzes!`)
    console.log('\n🌟 Seeding Completed Successfully! 🌟')
    console.log(`Run the frontend and search for the "${course.title}" course inside /courses!`)
}

seed()
