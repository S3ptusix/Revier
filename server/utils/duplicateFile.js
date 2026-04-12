import fs from "fs/promises";
import path from "path";

const generateFileName = (fieldname, originalName) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(originalName);
    return `${fieldname}-${unique}${ext}`;
};

export const duplicateFileWithMeta = async ({
    oldPath,
    fieldname,
    originalname,
    destination
}) => {
    const filename = generateFileName(fieldname, originalname);
    const fullPath = path.join(destination, filename);

    // copy file
    await fs.copyFile(oldPath, fullPath);

    // get file stats (for size)
    const stats = await fs.stat(fullPath);

    // return multer-like object
    return {
        fieldname,
        originalname,
        encoding: "7bit",
        mimetype: getMimeType(originalname),
        destination,
        filename,
        path: fullPath,
        size: stats.size
    };
};

// simple mime helper (optional but useful)
const getMimeType = (filename) => {
    const ext = path.extname(filename).toLowerCase();

    switch (ext) {
        case ".pdf":
            return "application/pdf";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".png":
            return "image/png";
        default:
            return "application/octet-stream";
    }
};