import { Admins } from "../models/index.js";

/**
 * Determines whether a given admin's data access should be restricted to
 * specific companies, and returns a ready-to-spread Sequelize `where` clause.
 *
 * - HR Manager (or any non-restricted role) → unrestricted access, empty where clause.
 * - HR Associate → restricted to their `holdCompanies` list.
 *   - If they have zero assigned companies, `empty: true` is returned so the
 *     caller can short-circuit and skip the query entirely.
 *
 * @param {string} role - the admin's role, e.g. "HR Manager" | "HR Associate"
 * @param {number|string} adminId
 * @returns {Promise<{
 *   restricted: boolean,
 *   empty: boolean,
 *   error?: string,
 *   companyWhere: object
 * }>}
 */
export const getCompanyScope = async (role, adminId) => {
    // Unrestricted roles (HR Manager, or any future role you add here)
    if (role !== "HR Associate") {
        return {
            restricted: false,
            empty: false,
            companyWhere: {},
        };
    }

    const admin = await Admins.findByPk(adminId, {
        attributes: ["holdCompanies"],
    });

    if (!admin) {
        return {
            restricted: true,
            empty: true,
            error: "Admin not found.",
            companyWhere: {},
        };
    }

    const holdCompanies = admin.holdCompanies || [];

    if (holdCompanies.length === 0) {
        return {
            restricted: true,
            empty: true,
            companyWhere: {},
        };
    }

    return {
        restricted: true,
        empty: false,
        companyWhere: { id: holdCompanies },
    };
};