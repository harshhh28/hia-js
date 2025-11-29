import pool from "../config/database.js";

export class MedicalReport {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS medical_reports (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
        filename VARCHAR(255) NOT NULL,
        original_filename VARCHAR(255) NOT NULL,
        file_path TEXT NOT NULL,
        extracted_text TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        cloudinary_public_id VARCHAR(255),
        cloudinary_url TEXT,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    try {
      await pool.query(query);
      // Add cloudinary columns if they don't exist (for existing tables)
      await pool.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'medical_reports' AND column_name = 'cloudinary_public_id') THEN
            ALTER TABLE medical_reports ADD COLUMN cloudinary_public_id VARCHAR(255);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'medical_reports' AND column_name = 'cloudinary_url') THEN
            ALTER TABLE medical_reports ADD COLUMN cloudinary_url TEXT;
          END IF;
        END $$;
      `);
    } catch (error) {
      console.error("Error creating medical reports table", error);
      throw error;
    }
  }

  static async create(reportData) {
    const {
      session_id,
      filename,
      original_filename,
      file_path,
      extracted_text,
      file_size,
      cloudinary_public_id = null,
      cloudinary_url = null,
    } = reportData;

    const query = `
      INSERT INTO medical_reports (
        session_id, filename, original_filename, file_path, 
        extracted_text, file_size, cloudinary_public_id, cloudinary_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [
        session_id,
        filename,
        original_filename,
        file_path,
        extracted_text,
        file_size,
        cloudinary_public_id,
        cloudinary_url,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating medical report", error);
      throw error;
    }
  }

  static async findBySessionId(session_id) {
    const query = "SELECT * FROM medical_reports WHERE session_id = $1";
    try {
      const result = await pool.query(query, [session_id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting medical report by session ID", error);
      throw error;
    }
  }

  static async findById(id) {
    const query = "SELECT * FROM medical_reports WHERE id = $1";
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting medical report by ID", error);
      throw error;
    }
  }

  static async delete(id) {
    const query = "DELETE FROM medical_reports WHERE id = $1 RETURNING *";
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting medical report", error);
      throw error;
    }
  }

  static async deleteBySessionId(session_id) {
    const query =
      "DELETE FROM medical_reports WHERE session_id = $1 RETURNING *";
    try {
      const result = await pool.query(query, [session_id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting medical report by session ID", error);
      throw error;
    }
  }
}
