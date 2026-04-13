import bcrypt from "bcrypt";
import {
    Users,
    Companies,
    Jobs,
    OrientationEvents,
    Applicants,
    ApplicantStatusHistory,
    Notification,
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
const locationPool = ["Makati", "BGC", "QC", "Zoom"];

// =========================
// SEED
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
                ]),
                companyId: c.id,
                type: randomItem(["Full-Time", "Part-Time"]),
                slot: 5,
                postedAt: randomDate(past, now),
                education: "Bachelor's Degree",
                experience: "1-3 years",
                description: `Join ${c.companyName} and build scalable applications in a collaborative environment. You will work with cross-functional teams to deliver high-quality software solutions and continuously improve system performance.`,
                responsibilities: ["Develop features", "Fix bugs", "Collaborate with team"],
                requirements: ["Problem solving", "Teamwork", "Technical skills"],
                benefitsAndPerks: ["Health insurance", "WFH", "13th month pay"],
                status: "open",
            }))
        );

        // =========================
        // ORIENTATION EVENTS
        // =========================
        const orientations = await OrientationEvents.bulkCreate(
            companies.map((c) => ({
                eventTitle: `Orientation - ${c.companyName}`,
                location: c.location,
                eventAt: randomDate(now, future),
            }))
        );

        const orientationIds = orientations.map(o => o.id);

        // =========================
        // APPLICATION LOGIC
        // =========================
        for (const user of users) {
            const appliedJobs = jobs
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 4) + 3);

            for (const job of appliedJobs) {

                // prevent duplicate active application
                const existing = await Applicants.findOne({
                    where: {
                        userId: user.id,
                        jobId: job.id,
                        isRejected: "No",
                        applicantStatus: ["New", "Interview", "Orientation"],
                    },
                });

                if (existing) continue;

                const flowType = randomItem([
                    "new",
                    "interview",
                    "orientation",
                    "hired",
                    "rejected",
                ]);

                let applicantStatus = "New";
                let isRejected = "No";

                let interviewAt = null;
                let interviewMode = null;
                let interviewLocation = null;
                let interviewStatus = "Pending";

                let orientationId = null;
                let orientationStatus = "Pending";

                let history = ["New"];

                // =========================
                // FLOW LOGIC
                // =========================

                if (["interview", "orientation", "hired", "rejected"].includes(flowType)) {
                    applicantStatus = "Interview";
                    history.push("Interview");

                    if (maybe(0.7)) {
                        interviewAt = randomDate(past, now);
                        interviewMode = randomItem(interviewModes);
                        interviewLocation = randomItem(locationPool);
                    }
                }

                if (["orientation", "hired"].includes(flowType)) {
                    applicantStatus = "Orientation";
                    history.push("Orientation");

                    interviewStatus = "Passed";

                    if (maybe(0.7)) {
                        orientationId = randomItem(orientationIds);
                    }
                }

                if (flowType === "hired") {
                    applicantStatus = "Hired";
                    history.push("Hired");

                    interviewStatus = "Passed";
                    orientationStatus = "Present";
                    orientationId = orientationId || randomItem(orientationIds);
                }

                if (flowType === "rejected") {
                    isRejected = "Yes";

                    if (applicantStatus === "Interview") {
                        interviewStatus = "Failed";
                    }

                    if (applicantStatus === "Orientation") {
                        orientationStatus = "Absent";
                    }

                    history.push("Rejected");
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

                    applicantStatus,
                    interviewAt,
                    interviewMode,
                    interviewLocation,
                    interviewStatus,
                    orientationId,
                    orientationStatus,

                    isRejected,
                    canApplyAgainAt: randomDate(now, future),
                });

                // =========================
                // HISTORY
                // =========================
                let historyRecords = history.map((status) => ({
                    applicantId: app.id,
                    applicantStatus: status,
                    createdAt: randomDate(past, now),
                    updatedAt: new Date(),
                }));

                // sort timeline
                historyRecords.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );

                await ApplicantStatusHistory.bulkCreate(historyRecords);

                // =========================
                // NOTIFICATIONS
                // =========================
                const notificationMessages = {
                    New: "Your application has been successfully submitted.",
                    Interview: "You have been shortlisted for an interview.",
                    Orientation: "You are invited to attend the orientation.",
                    Hired: "Congratulations! You are officially hired.",
                    Rejected: "We regret to inform you that your application was not successful.",
                };

                await Notification.bulkCreate(
                    historyRecords.map((record) => ({
                        userId: user.id,
                        message: `${job.jobTitle} - ${notificationMessages[record.applicantStatus]}`,
                        type:
                            record.applicantStatus === "Hired"
                                ? "success"
                                : record.applicantStatus === "Rejected"
                                ? "error"
                                : "info",
                        createdAt: record.createdAt,
                        updatedAt: new Date(),
                    }))
                );
            }
        }

        console.log("✅ SEED COMPLETE");
    } catch (err) {
        console.error("❌ ERROR:", err);
    }
};