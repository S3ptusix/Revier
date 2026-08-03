import bcrypt from "bcrypt";
import {
    Users,
    Companies,
    Jobs,
    Applicants,
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
// ADMINS
// =========================
const seedAdmins = async () => {
    return await Admins.bulkCreate([
        {
            firstName: "Maria",
            lastName: "Santos",
            sex: "Female",
            email: "hrmanager@revier.com",
            password: hash,
            role: "HR Manager",
            isVerified: "yes",
        },
        {
            firstName: "John",
            lastName: "Dela Cruz",
            sex: "Male",
            email: "hrassociate@revier.com",
            password: hash,
            role: "HR Associate",
            isVerified: "yes",
        },
    ]);
};

// =========================
// USERS
// =========================
const usersData = [
    { firstName: "Juan", lastName: "Dela Cruz", sex: "Male" },
    { firstName: "Maria Clara", lastName: "Reyes", sex: "Female" },
    { firstName: "Mark Anthony", lastName: "Lopez", sex: "Male" },
    { firstName: "Anna Marie", lastName: "Santos", sex: "Female" },
    { firstName: "Jose Miguel", lastName: "Garcia", sex: "Male" },
    { firstName: "Patricia", lastName: "Gomez", sex: "Female" },
    { firstName: "Kevin", lastName: "Ramirez", sex: "Male" },
    { firstName: "Angela", lastName: "Torres", sex: "Female" },
    { firstName: "Paul", lastName: "Bautista", sex: "Male" },
    { firstName: "Nicole", lastName: "Reyes", sex: "Female" },
    { firstName: "Daniel", lastName: "Flores", sex: "Male" },
    { firstName: "Sarah", lastName: "Lim", sex: "Female" },
    { firstName: "Jasper", lastName: "Cruz", sex: "Male" },
    { firstName: "Rhea", lastName: "Navarro", sex: "Female" },
    { firstName: "Michael", lastName: "Tan", sex: "Male" },
    { firstName: "Catherine", lastName: "Sy", sex: "Female" },
    { firstName: "Erwin", lastName: "Castillo", sex: "Male" },
    { firstName: "Lea", lastName: "Mendoza", sex: "Female" },
    { firstName: "Bryan", lastName: "Villanueva", sex: "Male" },
    { firstName: "Kristine", lastName: "Aquino", sex: "Female" },
];

const seedUsers = async () => {
    return await Users.bulkCreate(
        usersData.map((user, i) => ({
            firstName: user.firstName,
            lastName: user.lastName,
            sex: user.sex,
            email: `user${i + 1}@mail.com`,
            password: hash,
            phone: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
            isVerified: "yes",
        }))
    );
};

// =========================
// COMPANIES
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
// JOBS
// =========================
const jobTitles = [
    "Production Supervisor", "Quality Control Engineer", "Machine Operator", "Industrial Electrician",
    "Maintenance Technician", "Logistics Coordinator", "Warehouse Supervisor", "Manufacturing Engineer",
    "Process Technician", "Assembly Line Worker", "Safety Officer", "Supply Chain Analyst",
    "Mechanical Engineer", "Production Planner", "CNC Machine Operator", "Plant Supervisor",
    "Operations Manager", "Packaging Specialist", "Forklift Operator", "Quality Assurance Analyst",
];

const seedJobs = async (companies) => {
    return await Jobs.bulkCreate(
        jobTitles.map((title, i) => ({
            jobTitle: title,
            companyId: companies[i].id,
            type: "Full-Time",
            postedAt: now,
            education: "Bachelor's Degree",
            experience: "1-3 years",
            description: `${title} role in manufacturing.`,
            payType: "Monthly",
            payMin: 20000,
            payMax: 45000,
            responsibilities: ["Monitor production"],
            requirements: ["Experience"],
            benefitsAndPerks: ["SSS", "Insurance"],
            slot: 10,
        }))
    );
};

// =========================
// ORIENTATION
// =========================
const seedOrientationEvents = async () => {
    return await OrientationEvents.bulkCreate([
        { eventTitle: "Batch 1", eventMode: "In-Person", location: "Laguna", notes: "Initial batch for new hires", eventAt: addDays(now, 10) },
        { eventTitle: "Batch 2", eventMode: "In-Person", location: "Cavite", notes: "Second batch for new hires", eventAt: addDays(now, 12) },
    ]);
};

// =========================
// APPLICANTS
// =========================
const seedApplicants = async (users, jobs, events) => {
    let userIndex = 0;

    const interviewModes = ["In-Person", "Virtual (Video Call)", "Phone Call"];
    const locations = ["Office HQ", "Zoom", "Google Meet", "Phone"];

    const rejectionReasons = {
        interview: [
            "Failed interview",
            "Lack of required skills",
            "Poor communication skills"
        ],
        orientation: [
            "Did not attend orientation",
            "Failed orientation requirements"
        ]
    };

    for (let i = 0; i < 120; i++) {
        const user = users[userIndex++ % users.length];
        const job = rand(jobs);

        let time = addDays(now, -Math.floor(Math.random() * 30));

        const applicant = await Applicants.create({
            jobId: job.id,
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            sex: user.sex,
            phone: user.phone,
            resume: "resume.pdf",
            validId: "validid.pdf",

            applicantStatus: "New",
            interviewStatus: null,
            orientationStatus: null,

            isRejected: false,
            rejectedReason: null,
            rejectedAt: null,
            hiredAt: null,

            canApplyAgainAt: addDays(now, 30),

            createdAt: time,
            updatedAt: time
        });

        // ================= STAY IN NEW =================
        if (Math.random() < 0.4) continue;

        // ================= INTERVIEW =================
        time = nextTime(time, 24, 72);

        // ✅ ALWAYS SET REQUIRED INTERVIEW FIELDS
        await applicant.update({
            applicantStatus: "Interview",
            interviewAt: time,
            interviewMode: rand(interviewModes),
            interviewLocation: rand(locations),
            interviewNotes: "Initial interview",
            updatedAt: time
        });

        // 🟡 STAY IN INTERVIEW (ongoing, not rejected)
        if (Math.random() < 0.4) {
            await applicant.update({
                interviewStatus: null
            });
            continue;
        }

        // FINALIZE INTERVIEW
        const passedInterview = Math.random() > 0.2;

        await applicant.update({
            interviewStatus: passedInterview ? "Passed" : "Failed",
            updatedAt: time
        });

        // ❌ REJECTED AFTER INTERVIEW
        if (!passedInterview) {
            await applicant.update({
                isRejected: true,
                rejectedReason: rand(rejectionReasons.interview),
                rejectedAt: time,
                updatedAt: time
            });
            continue;
        }

        // ================= ORIENTATION =================
        time = nextTime(time, 48, 120);

        const event = rand(events);

        // ✅ ALWAYS SET REQUIRED ORIENTATION FIELDS
        await applicant.update({
            applicantStatus: "Orientation",
            orientationId: event.id,
            updatedAt: time
        });

        // 🟡 STAY IN ORIENTATION (ongoing)
        if (Math.random() < 0.4) {
            await applicant.update({
                orientationStatus: null
            });
            continue;
        }

        // FINALIZE ORIENTATION
        const attended = Math.random() > 0.2;

        await applicant.update({
            orientationStatus: attended ? "Present" : "Absent",
            updatedAt: time
        });

        // ❌ REJECTED AFTER ORIENTATION
        if (!attended) {
            await applicant.update({
                isRejected: true,
                rejectedReason: rand(rejectionReasons.orientation),
                rejectedAt: time,
                updatedAt: time
            });
            continue;
        }

        // ================= HIRED =================
        time = nextTime(time, 24, 72);

        await applicant.update({
            applicantStatus: "Hired",
            interviewStatus: "Passed",
            orientationStatus: "Present",
            hiredAt: time,
            updatedAt: time
        });
    }
};

// =========================
// RUN
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

        console.log("✅ SEED COMPLETED");
        process.exit();
    } catch (err) {
        console.error("❌ SEED ERROR:", err);
        process.exit(1);
    }
};