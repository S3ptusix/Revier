import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "./uploadToCloudinary.js";

// =========================
// UPLOAD FILE
// =========================
export const uploadFile = async (file, folder) => {
    if (!file?.buffer) {
        throw new Error("Invalid file");
    }

    const uploaded = await uploadToCloudinary(file.buffer, folder);

    if (!uploaded) {
        throw new Error("Upload failed");
    }

    return {
        url: uploaded.secure_url,
        publicId: uploaded.public_id
    };
};

// =========================
// DELETE FILE (PUBLIC ID)
// =========================
export const deleteFileByPublicId = async (publicId) => {
    if (!publicId) return;

    try {
        // try image first
        let result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "image"
        });

        // if not found → try raw
        if (result.result === "not found") {
            result = await cloudinary.uploader.destroy(publicId, {
                resource_type: "raw"
            });
        }

        console.log("Delete result:", result);

    } catch (error) {
        console.error("Delete failed:", error.message);
    }
};

// =========================
// REPLACE FILE (SAFE)
// =========================
export const replaceFile = async (newFile, oldPublicId, folder) => {
    let uploaded = null;

    try {
        // validate file
        if (!newFile?.buffer) {
            throw new Error("Invalid file");
        }

        // upload first
        uploaded = await uploadFile(newFile, folder);

        if (!uploaded?.url) {
            throw new Error("Upload failed");
        }

        // delete old (non-blocking)
        if (oldPublicId) {
            deleteFileByPublicId(oldPublicId).catch(console.error);
        }

        return {
            url: uploaded.url,
            publicId: uploaded.publicId
        };

    } catch (error) {
        console.error("replaceFile error:", error.message);

        // cleanup uploaded file if something failed
        if (uploaded?.publicId) {
            await cloudinary.uploader.destroy(uploaded.publicId, {
                resource_type: "auto"
            });
        }

        throw new Error("File replacement failed");
    }
};

// DUPLICATE FILE FROM URL (Cloudinary → Cloudinary)
export const duplicateFileFromUrl = async (url, folder) => {
    if (!url) return null;

    const result = await cloudinary.uploader.upload(url, {
        folder,
        resource_type: "auto"
    });

    return {
        url: result.secure_url,
        publicId: result.public_id
    };
};