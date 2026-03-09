import multer from 'multer';
export const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        cb(
            allowedTypes.includes(file.mimetype)
                ? null
                : new Error("Only PDF or Word files are allowed"),
            allowedTypes.includes(file.mimetype)
        );
    }
});
