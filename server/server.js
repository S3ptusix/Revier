import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/sequelize.js';
import adminRouter from './routes/adminRoutes.js';
import companyRouter from './routes/companyRoutes.js';
import jobRouter from './routes/jobRoutes.js';
import userRouter from './routes/userRoutes.js';
import "./cron/otpCleaner.js";
import otpRouter from './routes/otpRoutes.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 8001;

app.use(express.json());

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(
            new Error("CORS policy does not allow access from this origin"),
            false
        );
    },
    credentials: true,
    exposedHeaders: [
        "RateLimit-Reset",
        "RateLimit-Remaining",
        "RateLimit-Limit"
    ]
}));

app.use(cookieParser());

app.use('/api/admin', adminRouter);
app.use('/api/company', companyRouter);
app.use('/api/job', jobRouter);
app.use('/api/user', userRouter);
app.use('/api/otp', otpRouter);

// TEST
app.get('/', (req, res) => {
    res.send("API Working")
})

// START SERVER
const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            console.log(`Server running on PORT: ${port}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

startServer();


app.listen(3000);