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
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    try {
      await pool.query(query);
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
    } = reportData;

    const query = `
      INSERT INTO medical_reports (
        session_id, filename, original_filename, file_path, 
        extracted_text, file_size
      )
      VALUES ($1, $2, $3, $4, $5, $6)
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
