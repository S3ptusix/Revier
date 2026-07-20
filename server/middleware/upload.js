import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedFields = ["resume", "validId"];

        // ignore non-file fields safely
        if (!allowedFields.includes(file.fieldname)) {
            return cb(null, false);
        }

        const isPDF =
            file.mimetype === "application/pdf" &&
            file.originalname.toLowerCase().endsWith(".pdf");

        if (!isPDF) {
            return cb(new Error("Only PDF files are allowed"), false);
        }

        cb(null, true);
    }
});

export default upload;