import multer from "multer";
import path from "path";

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/resumes"); // make sure folder exists
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + unique + ext);
    }
});

// File filter for PDF/DOCX only
const fileFilter = (req, file, cb) => {
    const allowedTypes = [".pdf", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and DOCX files are allowed"));
    }
};

// Max file size: 5MB
const limits = {
    fileSize: 5 * 1024 * 1024 // 5MB
};

// Export Multer middleware
export const upload = multer({ storage, fileFilter, limits });
