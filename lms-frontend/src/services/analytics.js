/**
 * Basic Analytics Utility for LMS Stability
 */
export const trackEvent = (eventName, data = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[ANALYTICS] ${timestamp} - Event: ${eventName}`, data);
    
    // In production, this would send to Segment, Mixpanel, or custom backend
    // For now, we structure it for future backend logging
};

export const AL_EVENTS = {
    COURSE_START: 'course_start',
    LESSON_VIEW: 'lesson_view',
    LESSON_COMPLETE: 'lesson_complete',
    QUIZ_SUBMIT: 'quiz_submit',
    EXAM_SUBMIT: 'exam_submit',
    PAYMENT_CLICK: 'payment_click',
    DROP_OFF: 'drop_off'
};
