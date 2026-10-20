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


//function to handle webhooks
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const paymentId = paymentIntent.id
            const session = await stripeInstance.checkout.sessions.list({ payment_intent: paymentId });
            const { purchaseId } = session.data[0].metadata;
            const purchasedData = await Purchase.findById(purchaseId);

            const userData = await User.findById(purchasedData.userId);

            const courseData = await Course.findById(purchasedData.courseId.toString());

            courseData.enrolledStudents.push(userData);
            await courseData.save();

            userData.enrolledCourses.push(courseData._id);
            await userData.save();

            purchasedData.status = "Completed"
            await purchasedData.save();

            console.log("Payment completed successfully");
            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentId = paymentIntent.id
            const session = await stripeInstance.checkout.sessions.list({ payment_intent: paymentId });
            const { purchaseId } = session.data[0].metadata;
            const purchasedData = await Purchase.findById(purchaseId);

            purchasedData.status = "Failed"
            await purchasedData.save();

            console.log("Payment failed");
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
}