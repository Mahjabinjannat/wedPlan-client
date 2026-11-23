// import { MongoClient } from "mongodb";
// import { attachDatabasePool } from "@vercel/functions";

// const uri = process.env.MONGODB_URI;

// if (!uri) {
//   throw new Error("MONGODB_URI is missing.");
// }

// // ==========================================
// // ONE SHARED MONGODB CLIENT
// // ==========================================
// // Reuse the same client in every environment (also on Vercel),
// // so each server instance keeps only one connection pool.

// const globalForMongo = globalThis as unknown as {
//   mongoClient?: MongoClient;
// };

// export const mongoClient =
//   globalForMongo.mongoClient ??
//   new MongoClient(uri, {
//     // Close unused connections quickly, so they don't go stale
//     // while Vercel pauses the server between requests.
//     maxIdleTimeMS: 5000,
//   });

// globalForMongo.mongoClient = mongoClient;

// // Lets Vercel clean up idle connections before it pauses the server.
// attachDatabasePool(mongoClient);

// // ==========================================
// // RECONNECT AFTER A FAILED CONNECTION
// // ==========================================
// // If the first connection fails (for example on a cold start),
// // the MongoDB driver closes the client and never tries again by itself.
// // Every request on that server would then fail with
// // "MongoTopologyClosedError: Topology is closed".
// // So when the connection closes, we connect again.
// // (This app never closes the client on purpose.)

// if (mongoClient.listenerCount("topologyClosed") === 0) {
//   mongoClient.on("topologyClosed", () => {
//     mongoClient.connect().catch((error) => {
//       console.error("MongoDB reconnect failed:", error);
//     });
//   });
// }

// export const db = mongoClient.db(process.env.DB_NAME || "wedplanDB");

// import { MongoClient } from "mongodb";
// import { attachDatabasePool } from "@vercel/functions";

// const uri = process.env.MONGODB_URI;

// if (!uri) {
//   throw new Error("MONGODB_URI is missing.");
// }

// const globalForMongo = globalThis as typeof globalThis & {
//   _mongoClient?: MongoClient;
// };

// export const mongoClient =
//   globalForMongo._mongoClient ??
//   new MongoClient(uri, {
//     maxPoolSize: 10,
//     maxIdleTimeMS: 60000,
//     serverSelectionTimeoutMS: 10000,
//     connectTimeoutMS: 10000,
//   });

// globalForMongo._mongoClient = mongoClient;

// // Register the pool with Vercel's lifecycle management.
// attachDatabasePool(mongoClient);

// export const db = mongoClient.db(
//   process.env.DB_NAME || "wedplanDB"
// );

import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

// ==========================================
// MONGODB ENVIRONMENT VARIABLES
// ==========================================

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing.");
}

const databaseName = process.env.DB_NAME || "wedplanDB";

// ==========================================
// GLOBAL MONGODB CLIENT
// ==========================================
// Reuse one MongoClient per server instance.
// This helps prevent unnecessary connection pools
// during development and Vercel function reuse.

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoPoolAttached?: boolean;
  _mongoDiagnosticsAttached?: boolean;
};

// ==========================================
// CREATE OR REUSE MONGODB CLIENT
// ==========================================

export const mongoClient =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

globalForMongo._mongoClient = mongoClient;

// ==========================================
// VERCEL DATABASE POOL MANAGEMENT
// ==========================================
// Register the MongoDB client with Vercel's
// serverless connection lifecycle management.

if (!globalForMongo._mongoPoolAttached) {
  attachDatabasePool(mongoClient);
  globalForMongo._mongoPoolAttached = true;
}

// ==========================================
// MONGODB CONNECTION DIAGNOSTICS
// ==========================================
// These events help investigate intermittent
// MongoDB connection failures in Vercel logs.
//
// IMPORTANT:
// Do not call mongoClient.connect() inside
// topologyClosed. This event is diagnostic,
// not a safe place to implement reconnection.

if (
  process.env.NODE_ENV === "production" &&
  !globalForMongo._mongoDiagnosticsAttached
) {
  globalForMongo._mongoDiagnosticsAttached = true;

  mongoClient.on("topologyOpening", () => {
    console.info("[MongoDB] Topology opening");
  });

  mongoClient.on("topologyClosed", () => {
    console.error("[MongoDB] Topology closed");
  });

  mongoClient.on("serverHeartbeatFailed", (event) => {
    console.error("[MongoDB] Server heartbeat failed:", event.failure);
  });

  mongoClient.on("connectionPoolCleared", () => {
    console.warn("[MongoDB] Connection pool cleared");
  });
}

// ==========================================
// DATABASE INSTANCE
// ==========================================
// MongoDB operations connect automatically
// when the client is usable.
//
// This does not guarantee recovery from an
// explicitly closed MongoClient.

export const db = mongoClient.db(databaseName);
