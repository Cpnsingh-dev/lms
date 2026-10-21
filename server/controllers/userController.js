import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import Stripe from "stripe";
import { fulfillPurchase } from "./webhooks.js";

//api to get usetData
export const getUserData = async (req, res) => {

    try {

        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth?.userId || req.headers['user-id'];

        if (!userId) {
            return res.json({ success: false, message: "user not found" })
        }

        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        return res.json({
            success: true,
            message: "user fetched successfully",
            user: user
        })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }

}

//api to get userEnrolled Coiurses
export const getUserEnrolledCourses = async (req, res) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth?.userId || req.headers['user-id'];

        if (!userId) {
            return res.json({ success: false, message: "user not found" })
        }

        // Auto-reconcile pending purchases for this user if Stripe checkout already completed
        try {
            const pendingPurchases = await Purchase.find({ userId, status: "Pending" });
            if (pendingPurchases.length > 0) {
                const StripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
                const sessions = await StripeInstance.checkout.sessions.list({ limit: 25 });
                for (const purchase of pendingPurchases) {
                    const matchingSession = sessions.data.find(
                        s => s.metadata?.purchaseId === purchase._id.toString() &&
                            (s.payment_status === 'paid' || s.status === 'complete')
                    );
                    if (matchingSession) {
                        await fulfillPurchase(purchase._id);
                    }
                }
            }
        } catch (reconcileError) {
            console.error("Auto-reconcile error:", reconcileError);
        }

        const userData = await User.findById(userId).populate("enrolledCourses")

        if (!userData) {
            return res.json({ success: false, message: "user not found" })
        }

        return res.json({
            success: true,
            message: "user enrolled courses fetched successfully",
            enrolledCourses: userData.enrolledCourses
        })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

//funstion to purchase any course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        const { origin } = req.headers;
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth?.userId || req.headers['user-id'];
        const userData = await User.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "user not found" })
        }

        const courseData = await Course.findById(courseId)

        if (!courseData) {
            return res.json({ success: false, message: "course not found" })
        }

        const discount = Number(courseData.discount) || 0;
        const price = Number(courseData.coursePrice) || 0;
        const finalAmount = Number((price - (discount * price) / 100).toFixed(2));

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: finalAmount,
        }

        const newPurchase = await Purchase.create(purchaseData);

        //stripe gateway initialise
        const StripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = (process.env.CURRENCY || 'usd').trim().toLowerCase();

        //creating line itme for stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: { name: courseData.courseTitle },
                unit_amount: Math.round(newPurchase.amount * 100)
            },
            quantity: 1
        }]

        const originUrl = origin || "http://localhost:5173";

        //stripe session
        const session = await StripeInstance.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${originUrl}/loading/my-enrollments?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${originUrl}`,
            metadata: {
                purchaseId: newPurchase._id.toString(),
            },
            payment_intent_data: {
                metadata: {
                    purchaseId: newPurchase._id.toString(),
                }
            }
        })

        return res.json({
            success: true,
            message: "session created successfully",
            session_url: session.url
        })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

// Function to verify purchase status
export const verifyPurchase = async (req, res) => {
    try {
        const { sessionId, purchaseId } = req.body;
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth?.userId || req.headers['user-id'];

        const StripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        if (sessionId) {
            const session = await StripeInstance.checkout.sessions.retrieve(sessionId);
            if (session && (session.payment_status === 'paid' || session.status === 'complete')) {
                const targetPurchaseId = session.metadata?.purchaseId || purchaseId;
                if (targetPurchaseId) {
                    await fulfillPurchase(targetPurchaseId);
                    return res.json({ success: true, message: "Purchase verified and completed" });
                }
            }
        } else if (purchaseId) {
            const purchase = await Purchase.findById(purchaseId);
            if (purchase) {
                if (purchase.status === "Completed") {
                    return res.json({ success: true, message: "Purchase already completed" });
                }
                const sessions = await StripeInstance.checkout.sessions.list({ limit: 20 });
                const matchingSession = sessions.data.find(
                    s => s.metadata?.purchaseId === purchaseId.toString() &&
                        (s.payment_status === 'paid' || s.status === 'complete')
                );
                if (matchingSession) {
                    await fulfillPurchase(purchaseId);
                    return res.json({ success: true, message: "Purchase verified and completed" });
                }
            }
        }

        return res.json({ success: false, message: "Payment not verified or still pending" });
    } catch (error) {
        console.error("verifyPurchase error:", error);
        return res.json({ success: false, message: error.message });
    }
};