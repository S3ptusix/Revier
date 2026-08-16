import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.js";

/**
 * HowItWorksStep
 * ---------------
 * One row per step, FK to HomeContent, ordered. Kept relational
 * (rather than a JSON column) so an admin UI can add/remove/reorder
 * steps individually.
 */
const HowItWorksStep = sequelize.define(
    "HowItWorksStep",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        homeContentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        subTitle: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        tableName: "how_it_works_steps",
        timestamps: true
    }
);

export default HowItWorksStep;