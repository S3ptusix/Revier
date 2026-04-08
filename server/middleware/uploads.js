import multer from "multer";
import path from "path";

// storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "resume") {
            cb(null, "uploads/resumes");
        } else if (file.fieldname === "validId") {
            cb(null, "uploads/validIds");
        }
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + unique + ext);
    }
});

// PDF only
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});