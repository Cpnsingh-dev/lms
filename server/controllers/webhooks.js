import { Webhook } from "svix";
import User from "../models/User.js";

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