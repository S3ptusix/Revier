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

Users.hasMany(Applicants, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Applicants.belongsTo(Users, {
    foreignKey: "userId",
});

export { Companies, Jobs, Users, Applicants };
