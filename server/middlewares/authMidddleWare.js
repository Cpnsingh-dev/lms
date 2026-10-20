import { clerkClient } from "@clerk/express";

//middlware to protect educator route
export const protectEducator = async (req, res, next) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : req.auth;
        const userId = auth?.userId || req.headers['user-id'];

        if (!userId) {
            return res.json({ 
                success: false, 
                message: "Unauthorized: Missing authentication. Provide a Clerk Bearer Token in Authorization header or a user-id header for testing." 
            });
        }

        const response = await clerkClient.users.getUser(userId);
        const userRole = response.publicMetadata?.role;

        if (userRole !== "educator") {
            return res.json({ success: false, message: "you are not educator" })
        }

        next();

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}