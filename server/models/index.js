import Admins from "./Admin.js";
import AdminLog from "./AdminLog.js";
import Applicants from "./Applicant.js";
import Companies from "./Company.js";
import HomeContent from "./HomeContent.js";
import HowItWorksStep from "./HowItWorksStep.js";
import Jobs from "./Job.js";
import Notification from "./Notification.js";
import OrientationEvents from "./OrientationEvent.js";
import Users from "./User.js";

Companies.hasMany(Jobs, {
    foreignKey: "companyId",
    as: "jobs",
    onDelete: "CASCADE",
});

Jobs.belongsTo(Companies, {
    foreignKey: "companyId",
    as: "company",
});

Jobs.hasMany(Applicants, {
    foreignKey: "jobId",
    as: "applicants",
    onDelete: "CASCADE",
});

Applicants.belongsTo(Jobs, {
    foreignKey: "jobId",
    as: "job",
});

Users.hasMany(Applicants, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Applicants.belongsTo(Users, {
    foreignKey: "userId",
});

OrientationEvents.hasMany(Applicants, {
    foreignKey: "orientationId",
    onDelete: "CASCADE",
});

Applicants.belongsTo(OrientationEvents, {
    foreignKey: "orientationId",
});

Users.hasMany(Notification, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Notification.belongsTo(Users, {
    foreignKey: "userId",
});

Admins.hasMany(AdminLog, {
    foreignKey: "adminId",
    onDelete: "CASCADE",
});

AdminLog.belongsTo(Admins, {
    foreignKey: "adminId",
});

Admins.hasMany(Applicants, {
    foreignKey: "blacklistedBy",
    onDelete: "SET NULL"
});

Applicants.belongsTo(Admins, {
    foreignKey: "blacklistedBy",
});

HomeContent.hasMany(HowItWorksStep, {
    foreignKey: "homeContentId",
    as: "steps",
    onDelete: "CASCADE"
});
HowItWorksStep.belongsTo(HomeContent, {
    foreignKey: "homeContentId",
    as: "homeContent"
});


export {
    Companies,
    Jobs,
    Users,
    Applicants,
    OrientationEvents,
    Notification,
    AdminLog,
    HomeContent,
    HowItWorksStep
};
