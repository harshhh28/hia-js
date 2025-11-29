import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {} from "dotenv/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Upload a PDF file to Cloudinary
   * @param {string} filePath - Local path to the PDF file
   * @param {string} folder - Cloudinary folder to store the file
   * @returns {Promise<{url: string, publicId: string, secureUrl: string}>}
   */
  static async uploadPDF(filePath, folder = "medical-reports") {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "raw", // Required for PDF files
        folder: folder,
        access_mode: "authenticated", // Private access for medical files
        type: "private", // Private upload for security
      });

      return {
        url: result.url,
        secureUrl: result.secure_url,
        publicId: result.public_id,
        bytes: result.bytes,
        format: result.format,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
    }
  }

  /**
   * Delete a file from Cloudinary
   * @param {string} publicId - Cloudinary public ID of the file
   * @returns {Promise<{result: string}>}
   */
  static async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
        type: "private",
      });
      return result;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
    }
  }

  /**
   * Generate a signed URL for private file access
   * @param {string} publicId - Cloudinary public ID
   * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
   * @returns {string} Signed URL
   */
  static getSignedUrl(publicId, expiresIn = 3600) {
    try {
      const timestamp = Math.floor(Date.now() / 1000) + expiresIn;

      const signedUrl = cloudinary.url(publicId, {
        resource_type: "raw",
        type: "private",
        sign_url: true,
        expires_at: timestamp,
      });

      return signedUrl;
    } catch (error) {
      console.error("Cloudinary signed URL error:", error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  /**
   * Check if Cloudinary is properly configured
   * @returns {boolean}
   */
  static isConfigured() {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }
}

export default CloudinaryService;
