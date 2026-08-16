import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.js";

/**
 * HomeContent
 * ------------
 * Singleton table (id = 1) holding the flattened Hero / How-It-Works /
 * Contact fields. "How It Works" steps live in a separate table
 * (HowItWorksStep) since they're a variable-length ordered list.
 */
class HomeContent extends Model {
    static async getSingleton() {
        const [instance] = await HomeContent.findOrCreate({
            where: { id: 1 },
            defaults: { id: 1 }
        });
        return instance;
    }
}

HomeContent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false,
            defaultValue: 1
        },

        // Hero Section
        heroTitle: { type: DataTypes.STRING(255), allowNull: true },
        heroSubTitle: { type: DataTypes.TEXT, allowNull: true },
        heroButton: { type: DataTypes.STRING(100), allowNull: true },
        heroImage1Url: { type: DataTypes.STRING(500), allowNull: true },
        heroImage1PublicId: { type: DataTypes.STRING(255), allowNull: true },
        heroImage2Url: { type: DataTypes.STRING(500), allowNull: true },
        heroImage2PublicId: { type: DataTypes.STRING(255), allowNull: true },

        // How It Works Section
        howItWorksTitle: { type: DataTypes.STRING(255), allowNull: true },
        howItWorksImageUrl: { type: DataTypes.STRING(500), allowNull: true },
        howItWorksImagePublicId: { type: DataTypes.STRING(255), allowNull: true },

        // Contact Section
        contactTitle: { type: DataTypes.STRING(255), allowNull: true },
        contactSubTitle: { type: DataTypes.TEXT, allowNull: true },
        contactEmail: { type: DataTypes.STRING(255), allowNull: true, validate: { isEmail: true } },
        contactPhone: { type: DataTypes.STRING(50), allowNull: true },
        contactLocation: { type: DataTypes.STRING(500), allowNull: true },
        contactImageUrl: { type: DataTypes.STRING(500), allowNull: true },
        contactImagePublicId: { type: DataTypes.STRING(255), allowNull: true }
    },
    {
        sequelize,
        tableName: "home_content",
        timestamps: true
    }
);

export default HomeContent;
