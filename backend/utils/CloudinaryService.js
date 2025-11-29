import { v2 as cloudinary } from "cloudinary";
import {} from "dotenv/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Upload a PDF buffer to Cloudinary
   * @param {Buffer} buffer - PDF file buffer
   * @param {string} filename - Original filename
   * @returns {Promise<{url: string, publicId: string, secureUrl: string}>}
   */
  static async uploadPDF(buffer, filename) {
    // Get folder from env or use default
    const folder = process.env.UPLOAD_DIR || "medical-reports";
    try {
      if (!buffer || buffer.length === 0) {
        throw new Error("Buffer is empty");
      }

      // Convert buffer to base64 data URI for Cloudinary upload
      const base64Data = buffer.toString("base64");
      const dataUri = `data:application/pdf;base64,${base64Data}`;

      // Generate unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const uniqueFilename = `medical-report-${uniqueSuffix}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        resource_type: "raw", // Required for PDF files
        folder: folder, // Store in medical-reports folder
        public_id: uniqueFilename,
        overwrite: true,
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
      });
      return result;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
    }
  }

  /**
   * Get the URL for a file
   * @param {string} publicId - Cloudinary public ID
   * @returns {string} File URL
   */
  static getFileUrl(publicId) {
    try {
      const url = cloudinary.url(publicId, {
        resource_type: "raw",
        secure: true,
      });
      return url;
    } catch (error) {
      console.error("Cloudinary URL error:", error);
      throw new Error(`Failed to generate URL: ${error.message}`);
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
