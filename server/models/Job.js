import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Jobs = sequelize.define("job", {
    jobTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM(
            "Full-Time",
            "Part-Time",
            "Contract",
            "Internship"
        ),
        allowNull: false,
    },
    postedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    education: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    experience: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    // ✅ ARRAY FIELDS (same pattern as Admins)
    responsibilities: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
            const raw = this.getDataValue("responsibilities");
            if (Array.isArray(raw)) return raw;

            try {
                return raw ? JSON.parse(raw) : [];
            } catch {
                return [];
            }
        },
        set(value) {
            this.setDataValue(
                "responsibilities",
                Array.isArray(value) ? value : []
            );
        },
    },

    requirements: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
            const raw = this.getDataValue("requirements");
            if (Array.isArray(raw)) return raw;

            try {
                return raw ? JSON.parse(raw) : [];
            } catch {
                return [];
            }
        },
        set(value) {
            this.setDataValue(
                "requirements",
                Array.isArray(value) ? value : []
            );
        },
    },

    benefitsAndPerks: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
            const raw = this.getDataValue("benefitsAndPerks");
            if (Array.isArray(raw)) return raw;

            try {
                return raw ? JSON.parse(raw) : [];
            } catch {
                return [];
            }
        },
        set(value) {
            this.setDataValue(
                "benefitsAndPerks",
                Array.isArray(value) ? value : []
            );
        },
    },
    status: {
        type: DataTypes.ENUM(
            "open",
            "closed"
        ),
        allowNull: false,
        defaultValue: "open"
    },
}, {
    paranoid: true,
});

export default Jobs;
