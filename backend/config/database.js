import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import pkg from "pg";
import {} from "dotenv/config";

const { Pool } = pkg;

// Helper to resolve hostname to IPv4 (dns.lookupSync exists in Node 18.4+)
function resolveToIPv4(hostname) {
  if (typeof dns.lookupSync !== "function") {
    return hostname; // Older Node: use hostname, rely on setDefaultResultOrder
  }
  try {
    const result = dns.lookupSync(hostname, { family: 4 });
    return result.address;
  } catch (error) {
    console.warn(`Failed to resolve ${hostname} to IPv4, using hostname:`, error.message);
    return hostname;
  }
}

// Get connection config with IPv4-resolved hostname
function getConnectionConfig() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    const hostname = url.hostname;
    const ipv4Address = resolveToIPv4(hostname);
    
    // Replace hostname with IPv4 in connection string
    const modifiedUrl = process.env.DATABASE_URL.replace(hostname, ipv4Address);
    
    return {
      connectionString: modifiedUrl,
      ssl: { rejectUnauthorized: false },
    };
  } else {
    const hostname = process.env.DB_HOST;
    const ipv4Address = resolveToIPv4(hostname);
    
    return {
      host: ipv4Address,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    };
  }
}

const pool = new Pool(getConnectionConfig());

// Test connection
pool.on("connect", () => {
  console.log("✅ Database connected successfully");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
  process.exit(1);
});

export default pool;
