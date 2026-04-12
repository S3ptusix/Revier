import bcrypt from "bcrypt";
import {
    Users,
    Companies,
    Jobs,
    OrientationEvents,
    Applicants,
    ApplicantStatusHistory,
} from "../models/index.js";
import Admins from "../models/Admin.js";

// =========================
// HELPERS
// =========================
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const maybe = (chance = 0.5) => Math.random() < chance;

const randomDate = (start, end) =>
    new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const now = new Date();
const past = new Date();
past.setMonth(past.getMonth() - 6);

const future = new Date();
future.setMonth(future.getMonth() + 3);

const interviewModes = ["In-Person", "Virtual (Video Call)", "Phone Call"];

const interviewNotesPool = [
    "Excellent communication",
    "Needs improvement",
    "Strong technical skills",
    "Average performance",
];

const locationPool = ["Makati", "BGC", "QC", "Zoom", "Google Meet"];

// =========================
// SEED FUNCTION
// =========================
export const seedDatabase = async () => {
    try {
        console.log("🌱 Seeding database...");

        if ((await Users.count()) > 0) {
            console.log("⚠️ Already seeded.");
            return;
        }

        const hashed = await bcrypt.hash("Password@123", 10);

        // =========================
        // USERS
        // =========================
        const users = await Users.bulkCreate(
            Array.from({ length: 20 }, (_, i) => ({
                fullname: `Test User ${i + 1}`,
                email: `testuser${i + 1}@example.com`,
                password: hashed,
                phone: `091700000${String(i + 1).padStart(2, "0")}`,
                isVerified: "yes",
            }))
        );

        // =========================
        // ADMINS
        // =========================
        await Admins.bulkCreate([
            {
                fullname: "Maria Santos",
                email: "hrmanager@example.com",
                password: hashed,
                role: "HR Manager",
            },
            {
                fullname: "Mark Garcia",
                email: "hrassociate@example.com",
                password: hashed,
                role: "HR Associate",
            },
        ]);

        // =========================
        // COMPANIES
        // =========================
        const companies = await Companies.bulkCreate(
            Array.from({ length: 20 }, (_, i) => ({
                companyName: `Company ${i + 1}`,
                industry: "it",
                location: randomItem(["Manila", "Cebu", "Davao", "QC"]),
            }))
        );

        // =========================
        // JOBS
        // =========================
        const jobs = await Jobs.bulkCreate(
            companies.map((c) => ({
                jobTitle: randomItem([
                    "Frontend Developer",
                    "Backend Developer",
                    "Full Stack Developer",
                    "Software Engineer",
                    "UI/UX Designer",
                    "Data Analyst",
                    "DevOps Engineer",
                    "QA Engineer",
                    "Mobile Developer",
                    "System Analyst",
                ]),
                companyId: c.id,
                type: randomItem(["Full-Time", "Part-Time", "Contract", "Internship"]),
                slot: Math.floor(Math.random() * 5) + 1,
                postedAt: randomDate(past, now),

                education: "Bachelor's Degree in IT or related field",
                experience: `${Math.floor(Math.random() * 5) + 1} years`,

                description: `Join ${c.companyName} and become part of a dynamic team building scalable and modern software solutions. You will collaborate with engineers, designers, and stakeholders to deliver high-quality applications and improve system performance.`,

                responsibilities: ["Develop features", "Fix bugs", "Team collaboration"],
                requirements: ["Problem solving", "Communication skills", "Technical knowledge"],
                benefitsAndPerks: ["Health insurance", "WFH setup", "13th month pay"],

                status: randomItem(["open", "open", "open", "closed"]),
            }))
        );

        // =========================
        // ORIENTATIONS
        // =========================
        const orientations = await OrientationEvents.bulkCreate(
            companies.map((c) => ({
                eventTitle: `Orientation - ${c.companyName}`,
                location: c.location,
                eventAt: randomDate(now, future),
            }))
        );

        const orientationIds = orientations.map((o) => o.id);

        // =========================
        // APPLICATIONS
        // =========================
        const baseStatuses = ["New", "Interview", "Orientation", "Hired"];

        for (let i = 0; i < 100; i++) {
            const user = users[i % users.length];
            const job = jobs[i % jobs.length];

            const baseStatus = randomItem(baseStatuses);
            const isRejected = maybe(0.3);

            let applicantStatus = baseStatus;

            let interviewAt = null;
            let interviewMode = null;
            let interviewLocation = null;
            let interviewNotes = null;

            let orientationId = null;

            let interviewStatus = "Pending";
            let orientationStatus = "Pending";

            // =========================
            // INTERVIEW DATA
            // =========================
            if (["Interview", "Orientation", "Hired"].includes(baseStatus)) {
                if (baseStatus !== "Interview" || maybe(0.7)) {
                    interviewAt = randomDate(past, now);
                    interviewMode = randomItem(interviewModes);
                    interviewLocation = randomItem(locationPool);
                    interviewNotes = randomItem(interviewNotesPool);
                }
            }

            // =========================
            // ORIENTATION DATA
            // =========================
            if (["Orientation", "Hired"].includes(baseStatus)) {
                if (baseStatus === "Hired" || maybe(0.7)) {
                    orientationId = randomItem(orientationIds);
                }
            }
            if (isRejected) {
                if (baseStatus === "Interview") {
                    interviewStatus = "Failed";
                }

                if (baseStatus === "Orientation") {
                    interviewStatus = "Passed";
                    orientationStatus = "Absent";
                }

                if (baseStatus === "Hired") {
                    interviewStatus = "Passed";
                    orientationStatus = "Absent";
                }

                applicantStatus = baseStatus;
            } else {
                applicantStatus = baseStatus;

                if (baseStatus === "Interview") {
                    interviewStatus = "Pending";
                }

                if (baseStatus === "Orientation") {
                    interviewStatus = "Passed";
                }

                if (baseStatus === "Hired") {
                    interviewStatus = "Passed";
                    orientationStatus = "Present";
                    orientationId = orientationId || randomItem(orientationIds);
                }
            }

            // =========================
            // CREATE APPLICATION
            // =========================
            const app = await Applicants.create({
                jobId: job.id,
                userId: user.id,
                fullname: user.fullname,
                phone: user.phone,

                resume: "defaultResume.pdf",
                validId: "defaultValidId.pdf",

                applicantStatus, // ✅ ALWAYS VALID ENUM

                interviewAt,
                interviewMode,
                interviewLocation,
                interviewNotes,

                interviewStatus,
                orientationStatus,
                orientationId,

                isRejected: isRejected ? "Yes" : "No",
                canApplyAgainAt: randomDate(now, future),
            });

            // =========================
            // HISTORY
            // =========================
            let history = ["New"];

            if (baseStatus === "Interview") history.push("Interview");
            if (baseStatus === "Orientation") history.push("Interview", "Orientation");
            if (baseStatus === "Hired") history.push("Interview", "Orientation", "Hired");

            if (isRejected) {
                history = ["New", "Interview", "Rejected"];
            }

            await ApplicantStatusHistory.bulkCreate(
                history.map((h) => ({
                    applicantId: app.id,
                    applicantStatus: h,
                }))
            );
        }

        console.log("✅ SEED COMPLETE - NO INVALID ENUM VALUES");
    } catch (err) {
        console.error("❌ ERROR:", err);
    }
};