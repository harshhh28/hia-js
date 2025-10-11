import pool from "../config/database.js";

export class User {
  static async createTable() {
    const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                provider VARCHAR(20) CHECK (provider IN ('email', 'github', 'google')) NOT NULL,
                provider_id TEXT,
                password_hash TEXT,
                name TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            )
        `;
    try {
      await pool.query(query);
      console.log("Users table created successfully");
    } catch (error) {
      console.error("Error creating users table", error);
      throw error;
    }
  }

  static async create(userData) {
    const { email, provider, provider_id, password_hash, name } = userData;
    const query = `
        INSERT INTO users (email, provider, provider_id, password_hash, name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    try {
      const result = await pool.query(query, [
        email,
        provider,
        provider_id,
        password_hash,
        name,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user", error);
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";

    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByProviderId(provider, provider_id) {
    const query =
      "SELECT * FROM users WHERE provider = $1 AND provider_id = $2";

    try {
      const result = await pool.query(query, [provider, provider_id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = "SELECT * FROM users WHERE id = $1";

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmailAndProvider(email, provider) {
    const query = "SELECT * FROM users WHERE email = $1 AND provider = $2";

    try {
      const result = await pool.query(query, [email, provider]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(id, password_hash) {
    const query =
      "UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *";

    try {
      const result = await pool.query(query, [password_hash, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(id, updateData) {
    const { name, email } = updateData;
    const query =
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *";

    try {
      const result = await pool.query(query, [name, email, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = "DELETE FROM users WHERE id = $1 RETURNING *";

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    const query =
      "SELECT id, email, provider, name, created_at FROM users ORDER BY created_at DESC";

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}
