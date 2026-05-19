# Eduvalues LMS Architecture & Flow

## 1. Administrative Curriculum Control
The Admin Panel is fully equipped to architect courses visually.

*   **Manage Courses:** The Admin initiates a course in `/admin/courses`. They set pricing, descriptions, and publish status.
*   **Final Exam Builder:** Also accessed in `ManageCourses` via the green checkmark button, ensuring the overarching 20-question Final Exam is built for the course.
*   **Manage Lessons:** The admin can inject an unlimited number of sequential lessons into a course via `/admin/lessons`. 
*   **Tabbed Lesson Builder:** The `TabbedLessonForm` creates a visually aligned experience:
    *   **Reading Time:** Title, Duration, Core Story Content, and Comic Panels.
    *   **Quick Summary:** Key takeaways and Parent Tips.
    *   **Moral Value:** Dynamic Text Q&A arrays and To-Do lists.
    *   **Brain Challenge (MCQs):** A direct bridge to the Quiz Builder to inject the mandatory 5 MCQs per lesson.

## 2. Secure User Authentication & Identity
*   **Supabase Auth Integration:** User accounts are handled by Supabase JWTs.
*   **Token Persistence:** The `AuthContext` mirrors Supabase sessions into `localStorage` (`lms_token`).
*   **Middleware Armor:** Every backend route passes through `authMiddleware.js`, verifying the JWT before permitting data access.

## 3. Financial Gateway & Course Unlocking
*   **Razorpay Engine:** `Checkout.jsx` triggers the Razorpay modal.
*   **Backend Verification:** `paymentController.js` validates the signature cryptographically.
*   **Access Grant:** Upon validation, a record is struck in the `enrollments` table with `status: 'active'`.
*   **Free Courses:** 100% discount courses elegantly bypass the Razorpay gateway and directly grant access to the `enrollments` table.

## 4. The Learning Journey (Sequential Enforcement)
*   **My Courses:** Once enrolled, students access courses via their Dashboard.
*   **The Lock Mechanism:** `LessonPage.jsx` mathematically strictly enforces progression.
    *   `idx === 0` is unlocked automatically.
    *   Lesson `idx` unlocks ONLY if `completedLessons.includes(prevLessonIdStr)`.
*   **Quiz Progression Barrier:** To add a lesson to the `completedLessons` array, the student must achieve a >= 60% score (3 out of 5) on the lesson's Brain Challenge.

## 5. Certification & Final Assessment
*   **The 20-Question Requirement:** Once all lessons are passed, the student is permitted to enter the Final Assessment (`FinalExamPage.jsx`).
*   **The Calculation:** The backend `courseController.submitFinalExam` evaluates the submitted 20 questions.
*   **Certificate Generation:** If passed, the system mints a row in the `certificates` table tied directly to the student's ID.
*   **Reward:** The student downloads their final, personalized Certificate from their Dashboard!

## Summary of Cleanup
*   Purged unused `resetAdmin.js` script.
*   Removed empty `config` directory in the backend as the database connection has shifted exclusively to the serverless-ready Supabase architecture.
*   Verified that all remaining frontend React Components are actively woven into the React Router tree and serve a purpose.
