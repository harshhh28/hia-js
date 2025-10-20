import pool from "../config/database.js";

export class ChatSession {
  static async createTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS chat_sessions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                has_medical_report BOOLEAN DEFAULT FALSE,
                medical_analysis TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `;
    try {
      await pool.query(query);
    } catch (error) {
      console.error("Error creating chat sessions table", error);
      throw error;
    }
  }

  static async create(sessionData) {
    const { user_id, title } = sessionData;

    // Auto-generate title if not provided
    let sessionTitle = title;
    if (!sessionTitle) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = String(now.getFullYear()).slice(-2);
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      sessionTitle = `${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;
    }

    const query = `
        INSERT INTO chat_sessions (user_id, title)
        VALUES ($1, $2)
        RETURNING *
    `;
    try {
      const result = await pool.query(query, [user_id, sessionTitle]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating chat session", error);
      throw error;
    }
  }

  static async getAll() {
    const query = "SELECT * FROM chat_sessions ORDER BY created_at DESC";
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error getting all chat sessions", error);
      throw error;
    }
  }

  static async getByUserId(user_id) {
    const query =
      "SELECT * FROM chat_sessions WHERE user_id = $1 ORDER BY created_at DESC";
    try {
      const result = await pool.query(query, [user_id]);
      return result.rows;
    } catch (error) {
      console.error("Error getting chat sessions by user ID", error);
      throw error;
    }
  }

  static async findById(id) {
    const query = "SELECT * FROM chat_sessions WHERE id = $1";
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting chat session by ID", error);
      throw error;
    }
  }

  static async updateMedicalAnalysis(id, medical_analysis) {
    const query = `
      UPDATE chat_sessions 
      SET medical_analysis = $1, has_medical_report = TRUE 
      WHERE id = $2 
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [medical_analysis, id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating medical analysis", error);
      throw error;
    }
  }

  static async delete(id) {
    const query = "DELETE FROM chat_sessions WHERE id = $1 RETURNING *";
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting chat session", error);
      throw error;
    }
  }
}
