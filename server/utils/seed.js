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
    "Production Supervisor",
    "Quality Control Engineer",
    "Machine Operator",
];

const seedJobs = async (companies) => {
    return await Jobs.bulkCreate(
        jobTitles.map((title, i) => ({
            jobTitle: title,
            companyId: companies[i % companies.length].id,
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
// ORIENTATION EVENTS (FIXED)
// =========================
const seedOrientationEvents = async () => {
    return await OrientationEvents.bulkCreate([
        {
            eventTitle: "Batch 1",
            eventMode: "In-Person",
            location: "Laguna",
            note: "Initial batch for new hires",
            eventAt: addDays(now, 10),
        },
        {
            eventTitle: "Batch 2",
            eventMode: "In-Person",
            location: "Cavite",
            note: "Second batch for new hires",
            eventAt: addDays(now, 12),
        },
    ]);
};

// =========================
// APPLICANTS (UPDATED)
// =========================
const seedApplicants = async (users, jobs, events) => {
    let userIndex = 0;


    const interviewModes = ["In-Person", "Virtual (Video Call)", "Phone Call"];
    const locations = ["Office HQ", "Zoom", "Google Meet", "Phone"];

    const interviewFailReasons = [
        { reason: "Failed Interview", note: "Poor technical performance" },
        { reason: "Not Qualified", note: "Lacks required experience" },
        { reason: "Incomplete Requirements", note: "Missing documents" }
    ];

    for (let i = 0; i < 80; i++) {
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
            canApplyAgainAt: addDays(now, 30),

            createdAt: time,
            updatedAt: time
        });

        // Stay in New
        if (Math.random() < 0.4) continue;

        // INTERVIEW
        time = nextTime(time, 24, 72);

        await applicant.update({
            applicantStatus: "Interview",
            interviewAt: time,
            interviewMode: rand(interviewModes),
            interviewLocation: rand(locations),
            interviewNotes: "Initial interview",
            updatedAt: time
        });

        if (Math.random() < 0.4) continue;

        const passedInterview = Math.random() > 0.3;

        await applicant.update({
            interviewStatus: passedInterview ? "Passed" : "Failed",
            updatedAt: time
        });

        if (!passedInterview) {
            const selected = rand(interviewFailReasons);

            await applicant.update({
                isRejected: true,
                rejectedReason: selected.reason,
                rejectedReasonNote: selected.note,
                rejectedAt: time,
                updatedAt: time
            });
            continue;
        }

        // ORIENTATION
        time = nextTime(time, 48, 120);
        const event = rand(events);

        await applicant.update({
            applicantStatus: "Orientation",
            orientationId: event.id,
            updatedAt: time
        });

        if (Math.random() < 0.4) continue;

        const attended = Math.random() > 0.3;

        await applicant.update({
            orientationStatus: attended ? "Present" : "Absent",
            updatedAt: time
        });

        if (!attended) {
            await applicant.update({
                isRejected: true,
                rejectedReason: "No Show",
                rejectedReasonNote: "Did not attend orientation",
                rejectedAt: time,
                updatedAt: time
            });
            continue;
        }

        // HIRED
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
