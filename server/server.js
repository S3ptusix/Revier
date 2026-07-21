import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/sequelize.js';
import adminRouter from './routes/adminRoutes.js';
import companyRouter from './routes/companyRoutes.js';
import jobRouter from './routes/jobRoutes.js';
import userRouter from './routes/userRoutes.js';
import otpRouter from './routes/otpRoutes.js';
import applicantsRouter from './routes/applicantsRoutes.js';
import orientationsRouter from './routes/orientationsRoutes.js';
import hiredRouter from './routes/hiredRoutes.js';
import rejectedRouter from './routes/rejectedRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';
import reportsRouter from './routes/reportsRoutes.js';
import "./cron/otpCleaner.js";
import path from "path";
import { seed } from './utils/seed.js'
import resignedCRouter from './routes/resignedRoutes.js';
import newRouter from './routes/newRoutes.js';
import reportsAnalyticsRouter from './routes/reportsAnalyticsRoutes.js';
import { createServer } from "http";
import { Server } from "socket.io";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

dotenv.config();

const app = express();

const port = process.env.PORT || 8001;

app.use(express.json());

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL];
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

const server = createServer(app);

export const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
        credentials: true
    }
})

io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    // ✅ JOIN ROOM
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User joined: ${room}`);
    });

    // ✅ SEND MESSAGE
    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ Disconnected:", socket.id);
    });
});

app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/admin', adminRouter);
app.use('/api/company', companyRouter);
app.use('/api/job', jobRouter);
app.use('/api/user', userRouter);
app.use('/api/otp', otpRouter);
app.use('/api/applicants', applicantsRouter);
app.use('/api/new', newRouter);
app.use('/api/orientations', orientationsRouter);
app.use('/api/hired', hiredRouter);
app.use('/api/rejected', rejectedRouter);
app.use('/api/resigned', resignedCRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/reports-analytics', reportsAnalyticsRouter);

// TEST
app.get('/', (req, res) => {
    res.send("API Working")
})

// START SERVER
const startServer = async () => {
    try {
        if (process.env.SEED_DATA === 'true') {
            console.log('🌱 Running seed data...');
            await seed();
        }

        await connectToDatabase();
        server.listen(port, () => {
            console.log(`Server running on PORT: ${port}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

startServer();