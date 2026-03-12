import Applicants from "./Applicant.js";
import ApplicantStatusHistory from "./ApplicantStatusHistory.js";
import Companies from "./Company.js";
import Jobs from "./Job.js";
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

Applicants.hasMany(ApplicantStatusHistory, {
    foreignKey: "applicantId",
    onDelete: "CASCADE",
});

ApplicantStatusHistory.belongsTo(ApplicantStatusHistory, {
    foreignKey: "applicantId",
});

OrientationEvents.hasMany(Applicants, {
    foreignKey: "orientationId",
    onDelete: "CASCADE",
});

Applicants.belongsTo(OrientationEvents, {
    foreignKey: "orientationId",
});


export { Companies, Jobs, Users, Applicants, ApplicantStatusHistory, OrientationEvents };
