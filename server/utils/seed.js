import bcrypt from "bcrypt";
import {
    Users,
    Companies,
    Jobs,
    Applicants,
    ApplicantStatusHistory,
    Notification,
    OrientationEvents,
} from "../models/index.js";
import Admins from "../models/Admin.js";
import { sequelize } from "../config/sequelize.js";

// =========================
// HELPERS
// =========================
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const now = new Date();

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const randomHours = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const nextTime = (base, minH, maxH) =>
    new Date(base.getTime() + randomHours(minH, maxH) * 60 * 60 * 1000);

const hash = await bcrypt.hash("Password@123", 10);

// =========================
// 1. ADMINS
// =========================
const seedAdmins = async () => {

    return await Admins.bulkCreate([
        {
            fullname: "Maria Santos",
            email: "hrmanager@revier.com",
            password: hash,
            role: "HR Manager",
        },
        {
            fullname: "John Dela Cruz",
            email: "hrassociate@revier.com",
            password: hash,
            role: "HR Associate",
        },
    ]);
};

// =========================
// 2. USERS (20 real names)
// =========================
const userNames = [
    "Juan Dela Cruz", "Maria Clara Reyes", "Mark Anthony Lopez", "Anna Marie Santos",
    "Jose Miguel Garcia", "Patricia Gomez", "Kevin Ramirez", "Angela Torres",
    "Paul Bautista", "Nicole Reyes", "Daniel Flores", "Sarah Lim",
    "Jasper Cruz", "Rhea Navarro", "Michael Tan", "Catherine Sy",
    "Erwin Castillo", "Lea Mendoza", "Bryan Villanueva", "Kristine Aquino"
];

const seedUsers = async () => {

    return await Users.bulkCreate(
        userNames.map((name, i) => ({
            fullname: name,
            email: `user${i + 1}@mail.com`,
            password: hash,
            phone: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
            isVerified: "yes",
        }))
    );
};

// =========================
// 3. COMPANIES (Cavite + Laguna Manufacturing)
// =========================
const companiesData = [
    ["Cavite Precision Tools Inc.", "Cavite City", 14.4791, 120.8988],
    ["Laguna Metal Works Corp.", "Calamba, Laguna", 14.2117, 121.1653],
    ["South Luzon Industrial Manufacturing", "Dasmariñas, Cavite", 14.3294, 120.9367],
    ["Greenfield Electronics Manufacturing", "Santa Rosa, Laguna", 14.2843, 121.0889],
    ["Cavite Auto Parts Assembly Co.", "Imus, Cavite", 14.4297, 120.9367],
    ["Laguna Packaging Solutions", "San Pedro, Laguna", 14.3595, 121.0473],
    ["Precision Plastics Cavite", "Bacoor, Cavite", 14.4626, 120.9645],
    ["Laguna Industrial Fabricators", "Biñan, Laguna", 14.3421, 121.0812],
    ["Philippine Circuit Manufacturing", "General Trias, Cavite", 14.3861, 120.8810],
    ["Laguna Food Processing Plant", "San Pablo, Laguna", 14.0683, 121.3256],
    ["Cavite Steel Works", "Trece Martires, Cavite", 14.2810, 120.8679],
    ["Laguna Textile Manufacturing", "Calamba, Laguna", 14.1870, 121.1250],
    ["Cavite Industrial Systems Corp.", "Naic, Cavite", 14.3180, 120.7680],
    ["Laguna Electronics Assembly", "Cabuyao, Laguna", 14.2478, 121.1240],
    ["Cavite Rubber Manufacturing", "Silang, Cavite", 14.2300, 120.9750],
    ["Laguna Machinery Works", "Los Baños, Laguna", 14.1690, 121.2430],
    ["Cavite Logistics Manufacturing Hub", "Tanza, Cavite", 14.3940, 120.8500],
    ["Laguna Automotive Parts Corp.", "Pila, Laguna", 14.2320, 121.3640],
    ["Cavite Heavy Equipment Works", "Maragondon, Cavite", 14.2730, 120.7300],
    ["Laguna Advanced Manufacturing Co.", "Victoria, Laguna", 14.2280, 121.3300],
];

const seedCompanies = async () => {
    return await Companies.bulkCreate(
        companiesData.map(([name, loc, lat, lng]) => ({
            companyName: name,
            industry: "manufacturing",
            location: loc,
            latitude: lat,
            longitude: lng,
        }))
    );
};

// =========================
// 4. JOBS (20 unique)
// =========================
const jobTitles = [
    "Production Supervisor",
    "Quality Control Engineer",
    "Machine Operator",
    "Industrial Electrician",
    "Maintenance Technician",
    "Logistics Coordinator",
    "Warehouse Supervisor",
    "Manufacturing Engineer",
    "Process Technician",
    "Assembly Line Worker",
    "Safety Officer",
    "Supply Chain Analyst",
    "Mechanical Engineer",
    "Production Planner",
    "CNC Machine Operator",
    "Plant Supervisor",
    "Operations Manager",
    "Packaging Specialist",
    "Forklift Operator",
    "Quality Assurance Analyst",
];

const seedJobs = async (companies) => {
    return await Jobs.bulkCreate(
        jobTitles.map((title, i) => ({
            jobTitle: title,
            companyId: companies[i].id,
            type: "Full-Time",
            postedAt: now,
            education: "Bachelor's Degree or Technical Certification",
            experience: "1-3 years manufacturing experience",
            description: `${title} role responsible for optimizing manufacturing operations and ensuring production efficiency.`,
            payType: "Monthly",
            payMin: 20000,
            payMax: 45000,
            responsibilities: [
                "Monitor production output",
                "Ensure quality standards",
                "Coordinate with teams",
            ],
            requirements: [
                "Relevant experience",
                "Technical knowledge",
                "Problem-solving skills",
            ],
            benefitsAndPerks: [
                "SSS, PhilHealth, Pag-IBIG",
                "Overtime pay",
                "Health insurance",
            ],
            slot: 10,
        }))
    );
};

// =========================
// 5. ORIENTATION EVENTS
// =========================
const seedOrientationEvents = async () => {
    return await OrientationEvents.bulkCreate([
        {
            eventTitle: "Manufacturing Onboarding Batch 1",
            location: "Laguna Tech Center",
            eventAt: addDays(now, 10),
            note: "Bring valid ID and requirements",
        },
        {
            eventTitle: "Cavite Industrial Orientation",
            location: "Cavite Industrial Hall",
            eventAt: addDays(now, 12),
            note: "Safety briefing included",
        },
    ]);
};

const seedApplicants = async (users, jobs, events) => {
    const history = [];
    const notifications = [];

    let userIndex = 0;

    const pushHistory = (id, status, time) => {
        history.push({
            applicantId: id,
            applicantStatus: status,
            createdAt: time,
            updatedAt: time,
        });
    };

    const pushNotif = (userId, msg, type, time) => {
        notifications.push({
            userId,
            message: msg,
            type,
            createdAt: time,
            updatedAt: time,
        });
    };

    const randomHours = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const nextTime = (base, min, max) =>
        new Date(base.getTime() + randomHours(min, max) * 60 * 60 * 1000);

    const chance = (p) => Math.random() < p;

    const getStage = () => {
        const r = Math.random();
        if (r < 0.3) return "New";
        if (r < 0.55) return "Interview";
        if (r < 0.75) return "Orientation";
        if (r < 0.9) return "Hired";
        return "Rejected";
    };

    for (let i = 0; i < 120; i++) {
        const user = users[userIndex++ % users.length];
        const job = rand(jobs);

        const finalStage = getStage();
        let time = addDays(now, -Math.floor(Math.random() * 30));

        const applicant = await Applicants.create({
            jobId: job.id,
            userId: user.id,
            fullname: user.fullname,
            phone: user.phone,
            resume: "resume.pdf",
            validId: "validid.pdf",
            applicantStatus: "New",
            interviewStatus: "Pending",
            orientationStatus: "Pending",
            isRejected: "No",
            canApplyAgainAt: addDays(now, 30),
        });

        // =========================
        // NEW
        // =========================
        pushHistory(applicant.id, "New", time);
        pushNotif(user.id, "Application submitted", "info", time);

        // =========================
        // INTERVIEW
        // =========================
        if (["Interview", "Orientation", "Hired"].includes(finalStage)) {
            time = nextTime(time, 6, 72);

            const scheduled = chance(0.7);
            let passed = true;

            if (scheduled) {
                passed = Math.random() > 0.2;

                await applicant.update({
                    applicantStatus: "Interview",
                    interviewStatus: passed ? "Passed" : "Failed",
                    interviewAt: time,
                    interviewMode: "In-Person",
                    interviewLocation: "Company HQ",
                    interviewNotes: "Auto-evaluated",
                });
            } else {
                await applicant.update({
                    applicantStatus: "Interview",
                    interviewStatus: "Pending",
                    interviewAt: null,
                    interviewMode: null,
                    interviewLocation: null,
                    interviewNotes: null,
                });
            }

            pushHistory(applicant.id, "Interview", time);

            pushNotif(
                user.id,
                scheduled
                    ? passed
                        ? "Passed interview"
                        : "Failed interview"
                    : "Interview pending scheduling",
                scheduled
                    ? passed
                        ? "success"
                        : "error"
                    : "info",
                time
            );

            if (scheduled && !passed) {
                await applicant.update({
                    isRejected: "Yes"
                });

                pushHistory(applicant.id, "Rejected", time);
                pushNotif(user.id, "Rejected after interview", "error", time);
                continue;
            }
        }

        // =========================
        // ORIENTATION
        // =========================
        if (["Orientation", "Hired"].includes(finalStage)) {
            time = nextTime(time, 24, 120);

            const assigned = chance(0.7);
            const future = chance(0.3);
            let attended = true;

            if (assigned) {
                const event = rand(events);

                if (future && finalStage !== "Hired") {
                    // 🟡 scheduled but not yet attended
                    await applicant.update({
                        applicantStatus: "Orientation",
                        orientationId: event.id,
                        orientationStatus: "Pending",
                    });

                    pushHistory(applicant.id, "Orientation", time);
                    pushNotif(user.id, "Orientation scheduled (upcoming)", "info", time);

                } else {
                    attended = finalStage === "Hired" ? true : Math.random() > 0.2;

                    if (!attended) {
                        // 🔴 ABSENT → REJECTED
                        await applicant.update({
                            applicantStatus: "Orientation",
                            orientationId: event.id,
                            orientationStatus: "Absent",
                            isRejected: "Yes"
                        });

                        pushHistory(applicant.id, "Orientation", time);
                        pushNotif(user.id, "Absent in orientation", "warning", time);

                        pushHistory(applicant.id, "Rejected", time);
                        pushNotif(user.id, "Rejected after orientation", "error", time);

                        continue;
                    }

                    // ✅ PRESENT → MUST BE HIRED
                    time = nextTime(time, 1, 24);

                    await applicant.update({
                        applicantStatus: "Hired",
                        orientationId: event.id,
                        orientationStatus: "Present",
                    });

                    pushHistory(applicant.id, "Orientation", time);
                    pushNotif(user.id, "Completed orientation", "success", time);

                    pushHistory(applicant.id, "Hired", time);
                    pushNotif(user.id, "Congratulations! You are hired", "success", time);

                    continue;
                }
            } else {
                // 🔵 NOT SCHEDULED
                await applicant.update({
                    applicantStatus: "Orientation",
                    orientationId: null,
                    orientationStatus: "Pending",
                });

                pushHistory(applicant.id, "Orientation", time);
                pushNotif(user.id, "Waiting for orientation schedule", "info", time);
            }
        }

        // =========================
        // HIRED (SAFE)
        // =========================
        if (finalStage === "Hired") {
            time = nextTime(time, 24, 72);

            let orientationId = applicant.orientationId;

            if (!orientationId) {
                const event = rand(events);
                orientationId = event.id;
            }

            const fail = chance(0.15);

            if (fail) {
                await applicant.update({
                    applicantStatus: "Hired",
                    orientationId,
                    orientationStatus: "Present",
                    isRejected: "Yes"
                });

                pushHistory(applicant.id, "Hired", time);
                pushNotif(user.id, "Offer revoked after hiring", "error", time);

                time = nextTime(time, 1, 24);

                pushHistory(applicant.id, "Rejected", time);
                pushNotif(user.id, "Employment cancelled", "error", time);

                continue;
            }

            await applicant.update({
                applicantStatus: "Hired",
                orientationId,
                orientationStatus: "Present",
            });

            pushHistory(applicant.id, "Hired", time);
            pushNotif(user.id, "Congratulations! You are hired", "success", time);
        }
    }

    await ApplicantStatusHistory.bulkCreate(history);
    await Notification.bulkCreate(notifications);
};

// =========================
// MAIN SEED RUNNER
// =========================
export const seed = async () => {
    try {
        await sequelize.sync({ force: true });

        const admins = await seedAdmins();
        const users = await seedUsers();
        const companies = await seedCompanies();
        const jobs = await seedJobs(companies);
        const events = await seedOrientationEvents();

        await seedApplicants(users, jobs, events);

        console.log("✅ FULL ATS SEED COMPLETED");
        process.exit();
    } catch (err) {
        console.error("❌ SEED ERROR:", err);
        process.exit(1);
    }
};