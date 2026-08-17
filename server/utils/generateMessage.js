export const generateContactAdminMessage = (admin) => {
    const adminName = `${admin?.firstName || ""} ${admin?.lastName || ""}`.trim();
    const adminEmail = admin?.email || "";

    return `If you have any questions or need further assistance, please feel free to contact ${adminName} at [${adminEmail}](https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(adminEmail)}).`;
};