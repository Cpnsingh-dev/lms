import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebHooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoute.js';
import { clerkMiddleware } from '@clerk/express';
import { connectCloudinary } from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';

//initialise express
const app = express();

//connect to database
await connectDB()
await connectCloudinary();

// Stripe Webhook needs the raw body for signature verification - MUST be defined before express.json()
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

//middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

//route
app.get('/', (req, res) => res.send("Api is working"));
app.post('/clerk', clerkWebHooks);
app.use('/api/educator', educatorRouter);
app.use('/api/course', courseRouter);
app.use('/api/user', userRouter);

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
