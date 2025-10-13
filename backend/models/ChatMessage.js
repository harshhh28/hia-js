import pool from "../config/database.js";

export class ChatMessage {
  static async createTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS chat_messages (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                role VARCHAR(20) CHECK (role IN ('user', 'assistant')) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `;
    try {
      await pool.query(query);
      console.log("Chat messages table created successfully");
    } catch (error) {
      console.error("Error creating chat messages table", error);
      throw error;
    }
  }

  static async create(messageData) {
    const { session_id, content, role } = messageData;
    const query = `
        INSERT INTO chat_messages (session_id, content, role)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    try {
      const result = await pool.query(query, [session_id, content, role]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating chat message", error);
      throw error;
    }
  }

  static async getBySessionId(session_id) {
    const query = "SELECT * FROM chat_messages WHERE session_id = $1";
    try {
      const result = await pool.query(query, [session_id]);
      return result.rows;
    } catch (error) {
      console.error("Error getting chat messages by session ID", error);
      throw error;
    }
  }

  static async findById(id) {
    const query = "SELECT * FROM chat_messages WHERE id = $1";
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error("Error getting chat message by ID", error);
      throw error;
    }
  }

  static async getAll() {
    const query = "SELECT * FROM chat_messages ORDER BY created_at DESC";
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error getting all chat messages", error);
      throw error;
    }
  }

  static async deleteById(id) {
    const query = "DELETE FROM chat_messages WHERE id = $1";
    try {
      await pool.query(query, [id]);
    } catch (error) {
      console.error("Error deleting chat message by ID", error);
      throw error;
    }
  }
}
