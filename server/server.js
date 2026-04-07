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
import applicantsRouter from './routes/applicantsRoutes.js';
import orientationsRouter from './routes/orientationsRoutes.js';
import hiredRouter from './routes/hiredRoutes.js';
import rejectedBlacklistedRouter from './routes/rejectedBlacklistedRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';
import reportsRouter from './routes/reportsRoutes.js';
import path from "path";

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

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/admin', adminRouter);
app.use('/api/company', companyRouter);
app.use('/api/job', jobRouter);
app.use('/api/user', userRouter);
app.use('/api/otp', otpRouter);
app.use('/api/applicants', applicantsRouter);
app.use('/api/orientations', orientationsRouter);
app.use('/api/hired', hiredRouter);
app.use('/api/rejectedBlacklisted', rejectedBlacklistedRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportsRouter);

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