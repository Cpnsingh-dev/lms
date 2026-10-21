import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

// api controler function to manage clerk User with database
export const clerkWebHooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })

        const { data, type } = req.body;

        switch (type) {
            case 'user.created':
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url || "",
                }
                await User.create(userData);
                res.json({ success: true, message: "User created successfully" })
                break;

            case 'user.updated':
                const updateUserData = {
                    name: `${data.first_name} ${data.last_name}`,
                    imageUrl: data.image_url || "",
                }
                await User.findByIdAndUpdate(data.id, updateUserData)
                res.json({ success: true, message: "User updated successfully" })
                break;

            case 'user.deleted':
                await User.findByIdAndDelete(data.id)
                res.json({ success: true, message: "User deleted successfully" })
                break;

            default:
                res.json({ success: true, message: "Unknown event" })
                break;
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Internal server error" })
    }
}


// Helper function to fulfill purchase and enroll student
export const fulfillPurchase = async (purchaseId) => {
    if (!purchaseId) {
        console.log("No purchaseId provided for fulfillment");
        return;
    }

    const purchasedData = await Purchase.findById(purchaseId);
    if (!purchasedData) {
        console.log(`Purchase not found with ID: ${purchaseId}`);
        return;
    }

    if (purchasedData.status === "Completed") {
        console.log(`Purchase ${purchaseId} is already marked as Completed`);
        return;
    }

    const userData = await User.findById(purchasedData.userId);
    const courseData = await Course.findById(purchasedData.courseId);

    if (userData && courseData) {
        const studentId = userData._id.toString();
        const courseId = courseData._id;

        const isStudentEnrolled = courseData.enrolledStudents.some(
            id => id?.toString() === studentId
        );
        if (!isStudentEnrolled) {
            courseData.enrolledStudents.push(studentId);
            await courseData.save();
        }

        const isCourseInUser = userData.enrolledCourses.some(
            id => id?.toString() === courseId.toString()
        );
        if (!isCourseInUser) {
            userData.enrolledCourses.push(courseId);
            await userData.save();
        }
    }

    purchasedData.status = "Completed";
    await purchasedData.save();

    console.log(`Purchase ${purchaseId} successfully completed and student enrolled.`);
};

//function to handle webhooks
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Stripe Webhook Signature Verification Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                const purchaseId = session.metadata?.purchaseId;
                await fulfillPurchase(purchaseId);
                break;
            }
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                let purchaseId = paymentIntent.metadata?.purchaseId;

                if (!purchaseId) {
                    const session = await stripeInstance.checkout.sessions.list({ payment_intent: paymentIntent.id });
                    purchaseId = session.data?.[0]?.metadata?.purchaseId;
                }

                await fulfillPurchase(purchaseId);
                break;
            }
            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                let purchaseId = paymentIntent.metadata?.purchaseId;

                if (!purchaseId) {
                    const session = await stripeInstance.checkout.sessions.list({ payment_intent: paymentIntent.id });
                    purchaseId = session.data?.[0]?.metadata?.purchaseId;
                }
                if (purchaseId) {
                    const purchasedData = await Purchase.findById(purchaseId);
                    if (purchasedData) {
                        purchasedData.status = "Failed";
                        await purchasedData.save();
                        console.log(`Payment failed for purchase: ${purchaseId}`);
                    }
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        return res.json({ received: true });
    } catch (error) {
        console.error("Error processing Stripe webhook:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}