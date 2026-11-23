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


import { MongoClient } from "mongodb";
import { attachDatabasePool } from "@vercel/functions";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing.");
}

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
};

export const mongoClient =
  globalForMongo._mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    maxIdleTimeMS: 60000,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });

globalForMongo._mongoClient = mongoClient;

// Register the pool with Vercel's lifecycle management.
attachDatabasePool(mongoClient);

export const db = mongoClient.db(
  process.env.DB_NAME || "wedplanDB"
);
