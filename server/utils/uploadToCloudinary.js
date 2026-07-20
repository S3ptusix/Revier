import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto"
            },
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error("Upload failed"));
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};