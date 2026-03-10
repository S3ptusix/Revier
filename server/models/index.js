import Applicants from "./Applicant.js";
import Companies from "./Company.js";
import Jobs from "./Job.js";
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


export { Companies, Jobs, Users, Applicants };
