const Razorpay = require('razorpay')
const crypto = require('crypto')
const supabase = require('../supabaseClient')

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})

// POST /api/payments/initiate
exports.initiatePayment = async (req, res) => {
    try {
        const { courseId } = req.body
        console.log(`[PAYMENT] Initiating for Course: ${courseId} User: ${req.user?.id}`)
        
        // 1. Fetch course from Supabase
        const { data: course, error: cErr } = await supabase
            .from('courses')
            .select('*')
            .or(`id.eq.${courseId},slug.eq.${courseId}`)
            .single()

        if (cErr || !course) {
            console.error('[PAYMENT_ERROR] Course look up failed:', cErr)
            return res.status(404).json({ message: 'Course not found in Supabase database.' })
        }

        const amount = (course.discount_price || course.price) * 100 // paise
        console.log(`[PAYMENT] Course found: ${course.title}, Price: ${amount/100}`)

        // 2. Free course: auto-enroll
        if (amount === 0) {
            const { error: eErr } = await supabase
                .from('enrollments')
                .upsert({ 
                    student_id: req.user.id, 
                    course_id: course.id,
                    progress: 0 
                }, { onConflict: 'student_id,course_id' })
            
            if (eErr) throw eErr
            return res.json({ free: true, message: 'Enrolled for free!' })
        }

        // 3. Create Razorpay Order
        const order = await razorpay.orders.create({ 
            amount, 
            currency: 'INR', 
            receipt: `rcpt_${Date.now()}` 
        })
        console.log(`[PAYMENT] Razorpay Order created: ${order.id}`)

        // 4. Save payment attempt in Supabase
        const { error: pErr } = await supabase
            .from('payments')
            .insert({ 
                student_id: req.user.id, 
                course_id: course.id, 
                amount: course.discount_price || course.price, 
                razorpay_order_id: order.id,
                status: 'pending'
            })
        
        if (pErr) {
            console.error('[PAYMENT_ERROR] Failed to save record to Supabase "payments" table:', pErr)
            throw new Error(`Database error: ${pErr.message}. Make sure the "payments" table exists!`)
        }
        
        return res.json({ orderId: order.id, amount })
    } catch (err) {
        console.error(`[PAYMENT_CRITICAL_ERROR] ${err.message}`)
        return res.status(500).json({ message: err.message })
    }
}

// POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body
        const body = razorpay_order_id + '|' + razorpay_payment_id
        const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(body).digest('hex')
        
        if (expectedSig !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid signature detected.' })
        }

        // Update payment status in Supabase
        const { error: pErr } = await supabase
            .from('payments')
            .update({ status: 'success', razorpay_payment_id, paid_at: new Date() })
            .eq('razorpay_order_id', razorpay_order_id)

        if (pErr) throw pErr

        // Create enrollment in Supabase
        const { error: eErr } = await supabase
            .from('enrollments')
            .upsert({ 
                student_id: req.user.id, 
                course_id: courseId,
                status: 'active'
            }, { onConflict: 'student_id,course_id' })

        if (eErr) throw eErr

        res.json({ message: 'Payment verified, enrolled successfully!' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/payments/history
exports.getMyPayments = async (req, res) => {
    try {
        const { data: payments, error } = await supabase
            .from('payments')
            .select('*, courses(title, thumbnail)')
            .eq('student_id', req.user.id)
            .order('created_at', { ascending: false })

        if (error) throw error
        res.json({ payments })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// GET /api/payments/all (admin)
exports.getAllPayments = async (req, res) => {
    try {
        const { data: payments, error } = await supabase
            .from('payments')
            .select('*, courses(title), profiles:student_id(email)')
            .order('created_at', { ascending: false })

        if (error) throw error
        res.json({ payments })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
