import pool from "../config/database.js";

export class VectorEmbedding {
  static async createTable() {
    // Enable pgvector extension
    const enableExtensionQuery = `CREATE EXTENSION IF NOT EXISTS vector`;

    const query = `
      CREATE TABLE IF NOT EXISTS vector_embeddings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        embedding vector(384),
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    try {
      await pool.query(enableExtensionQuery);
      await pool.query(query);
    } catch (error) {
      console.error("Error creating vector embeddings table", error);
      throw error;
    }
  }

  static async create(embeddingData) {
    const { session_id, content, embedding, metadata = {} } = embeddingData;

    // Format embedding for PostgreSQL vector extension
    // Convert array to string format that PostgreSQL vector expects
    const formattedEmbedding = Array.isArray(embedding)
      ? `[${embedding.join(",")}]`
      : embedding;

    const query = `
      INSERT INTO vector_embeddings (session_id, content, embedding, metadata)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    try {
      const result = await pool.query(query, [
        session_id,
        content,
        formattedEmbedding,
        JSON.stringify(metadata),
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating vector embedding", error);
      throw error;
    }
  }

  static async findBySessionId(session_id) {
    const query =
      "SELECT * FROM vector_embeddings WHERE session_id = $1 ORDER BY created_at ASC";
    try {
      const result = await pool.query(query, [session_id]);
      return result.rows;
    } catch (error) {
      console.error("Error getting vector embeddings by session ID", error);
      throw error;
    }
  }

  static async findSimilar(queryEmbedding, session_id, limit = 5) {
    // Format query embedding for PostgreSQL vector extension
    const formattedQueryEmbedding = Array.isArray(queryEmbedding)
      ? `[${queryEmbedding.join(",")}]`
      : queryEmbedding;

    const query = `
      SELECT *, embedding <-> $1 AS distance
      FROM vector_embeddings 
      WHERE session_id = $2
      ORDER BY embedding <-> $1
      LIMIT $3
    `;
    try {
      const result = await pool.query(query, [
        formattedQueryEmbedding,
        session_id,
        limit,
      ]);
      return result.rows;
    } catch (error) {
      console.error("Error finding similar embeddings", error);
      throw error;
    }
  }

  static async deleteBySessionId(session_id) {
    const query = "DELETE FROM vector_embeddings WHERE session_id = $1";
    try {
      await pool.query(query, [session_id]);
    } catch (error) {
      console.error("Error deleting vector embeddings by session ID", error);
      throw error;
    }
  }
}
