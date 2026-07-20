require('dotenv').config()
const supabase = require('./supabaseClient')

const mainCourseIds = [
    'c0f56f18-c5b2-42dd-acbc-059823ef2efd', // Main 10-lesson course
    '96458231-31f3-4e56-8da5-9ab4c964795c'  // Secondary course copy
];

const examQuestions = [
    {
        question: "What should Maya do when she sees Mr. Jenkins looking sad and his garden full of weeds?",
        option_a: "Ignore him and go home to play video games",
        option_b: "Help him pull weeds and plant beautiful flowers",
        option_c: "Scream loudly to get attention",
        option_d: "Hide behind a tree and wait for him to leave",
        correct_answer: "B"
    },
    {
        question: "If a friend drops their lunch at school, what is the kindest thing to do?",
        option_a: "Laugh and point at their spilled food",
        option_b: "Help them clean up and share your own delicious food",
        option_c: "Run away with their water bottle",
        option_d: "Keep eating your own lunch without looking",
        correct_answer: "B"
    },
    {
        question: "Alex accidentally broke a flower vase while playing ball inside. What should he do?",
        option_a: "Blame it on the cat to avoid getting scolded",
        option_b: "Tell Mom immediately and explain what happened honestly",
        option_c: "Hide under the table and stay quiet",
        option_d: "Pretend he wasn't even in the room",
        correct_answer: "B"
    },
    {
        question: "When you tell the truth even when it's hard, what do you build?",
        option_a: "Big sandcastles that wash away",
        option_b: "Golden bridges of trust and respect with others",
        option_c: "Noisy toy airplanes",
        option_d: "Messy and disorganized rooms",
        correct_answer: "B"
    },
    {
        question: "Riya is the soccer captain. To show she is responsible, she should:",
        option_a: "Sleep all day and miss the team game",
        option_b: "Arrive early, prepare the equipment, and help her team play their best",
        option_c: "Complain about the referee and rules",
        option_d: "Cry and walk off the field when they lose",
        correct_answer: "B"
    },
    {
        question: "What is a great way to show responsibility in your own bedroom?",
        option_a: "Throwing all your toys on the floor",
        option_b: "Cleaning up your toys and putting them in the toy box",
        option_c: "Waiting for your parents to clean up the room",
        option_d: "Drawing pictures on the walls",
        correct_answer: "B"
    },
    {
        question: "When a classmate is wearing traditional clothes and others are teasing them, respect means:",
        option_a: "Joining the teasing to fit in",
        option_b: "Sitting next to them, being friendly, and treating them with respect",
        option_c: "Ignoring them completely so you don't get involved",
        option_d: "Pointing at them and whispering to your friends",
        correct_answer: "B"
    },
    {
        question: "How do we show respect to a teacher or parent who is speaking to us?",
        option_a: "Roaring loudly like a little lion",
        option_b: "Looking at them, listening quietly, and waiting for our turn to speak",
        option_c: "Running around the room and waving our hands",
        option_d: "Covering our ears and humming a song",
        correct_answer: "B"
    },
    {
        question: "When Jana falls off her bicycle and feels like giving up, she should:",
        option_a: "Leave the bicycle on the road and walk home crying",
        option_b: "Take a deep breath, get back up, and try again slowly",
        option_c: "Throw the bicycle into the bushes",
        option_d: "Wait for someone to carry her all the way home",
        correct_answer: "B"
    },
    {
        question: "If a jigsaw puzzle is very hard to complete, perseverance means:",
        option_a: "Throwing the puzzle pieces on the floor in anger",
        option_b: "Trying again patiently, taking a deep breath, and matching pieces one by one",
        option_c: "Asking someone else to do the whole puzzle for you",
        option_d: "Hiding the puzzle under your bed",
        correct_answer: "B"
    },
    {
        question: "Meera sees Rihan sitting alone in the playground because he cannot run. What should she do?",
        option_a: "Run as fast as she can around him to show off",
        option_b: "Invite him to play a board game or a sit-down game together",
        option_c: "Tell him to go home because he can't play",
        option_d: "Laugh at him with other children",
        correct_answer: "B"
    },
    {
        question: "Your friend is crying because they lost their favorite colored pencil. You can show empathy by:",
        option_a: "Telling them it's just a pencil and ignoring their tears",
        option_b: "Sitting with them, giving them a warm hug, and helping them look for it",
        option_c: "Taking their remaining pencils for yourself",
        option_d: "Laughing at them for being sad",
        correct_answer: "B"
    },
    {
        question: "Gigi the Giraffe visits the Gratitude Tree. How does she make her heart happy?",
        option_a: "By eating all the sweet green leaves",
        option_b: "By touching leaves and naming things she is thankful for",
        option_c: "By sleeping under the tree's shade all day",
        option_d: "By breaking the branches with her neck",
        correct_answer: "B"
    },
    {
        question: "What is a wonderful daily habit to practice gratitude?",
        option_a: "Thinking of three simple things you are thankful for, like family or sunshine",
        option_b: "Asking for ten new toys every single morning",
        option_c: "Complaining about the weather when it rains",
        option_d: "Crying for candy at the supermarket",
        correct_answer: "A"
    },
    {
        question: "Arjun is scared to stand on stage for the play. True courage means:",
        option_a: "Running away and hiding in the bathroom",
        option_b: "Taking a deep breath and trying his best even though he is scared",
        option_c: "Waiting until he feels 100% brave and not scared at all",
        option_d: "Crying loudly so the teacher sends him home",
        correct_answer: "B"
    },
    {
        question: "If you see someone being lonely or teased on the playground, courage is:",
        option_a: "Joining the teasers so they like you",
        option_b: "Standing up for them and inviting them to play with you",
        option_c: "Staying silent and walking away quickly",
        option_d: "Hiding behind the slide to watch",
        correct_answer: "B"
    },
    {
        question: "Diya finds a beautiful toy left on the playground when no one is watching. She should:",
        option_a: "Put it in her pocket and take it home secretly",
        option_b: "Take it to the teacher or the lost-and-found so the owner can find it",
        option_c: "Hide it under the grass so she can play with it later",
        option_d: "Keep it for herself because finders keepers",
        correct_answer: "B"
    },
    {
        question: "Doing the right thing even when no one is watching is called:",
        option_a: "Speed running",
        option_b: "Integrity and strong character",
        option_c: "Heavy sleeping",
        option_d: "Fast eating",
        correct_answer: "B"
    },
    {
        question: "When you win a big trophy in a sports race, a humble winner:",
        option_a: "Brags to everyone that they are the best ever and no one can beat them",
        option_b: "Thanks their teammates, coaches, and family for their wonderful support",
        option_c: "Tells everyone else they are bad players and should quit",
        option_d: "Throws the trophy away to show it doesn't matter",
        correct_answer: "B"
    },
    {
        question: "Being a 'lifelong learner' means:",
        option_a: "Pretending to know everything so people respect you",
        option_b: "Staying humble, curious, and open to learning new things every day",
        option_c: "Stopping school early because you know enough",
        option_d: "Never asking questions because questions make you look silly",
        correct_answer: "B"
    }
];

async function seed() {
    console.log('🌱 Seeding 20-Question Final Exams for Character Builders courses...');
    
    for (const courseId of mainCourseIds) {
        // Verify course exists
        const { data: course, error: cErr } = await supabase
            .from('courses')
            .select('title')
            .eq('id', courseId)
            .single();
            
        if (cErr || !course) {
            console.log(`⚠️ Course with ID ${courseId} not found. Skipping.`);
            continue;
        }
        
        console.log(`Clearing existing final exam questions for course: "${course.title}" (${courseId})`);
        await supabase
            .from('quizzes')
            .delete()
            .eq('course_id', courseId)
            .eq('is_final_exam', true);
            
        console.log(`Inserting 20 fresh final exam questions...`);
        for (let i = 0; i < examQuestions.length; i++) {
            const q = examQuestions[i];
            const { error: qErr } = await supabase
                .from('quizzes')
                .insert([{
                    course_id: courseId,
                    question: q.question,
                    option_a: q.option_a,
                    option_b: q.option_b,
                    option_c: q.option_c,
                    option_d: q.option_d,
                    correct_answer: q.correct_answer,
                    is_final_exam: true,
                    order_index: i + 1
                }]);
                
            if (qErr) {
                console.error(`❌ Failed to insert question ${i + 1} for course ${courseId}:`, qErr);
            }
        }
        console.log(`✅ Successfully seeded 20 questions for "${course.title}"!`);
    }
    
    console.log('🌟 Seeding Completed! 🌟');
}

seed();
