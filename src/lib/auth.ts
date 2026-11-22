// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";

// const client = new MongoClient(process.env.MONGODB_URI as string);
// const db = client.db("wedplanDB");

// export const auth = betterAuth({
//   emailAndPassword: {
//     enabled: true,
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
//   database: mongodbAdapter(db, {
//     client,
//   }),
// });

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";

import { db, mongoClient } from "@/lib/mongodb";

// ==========================================
// BETTER AUTH CONFIGURATION
// ==========================================

export const auth = betterAuth({
  // Application name
  appName: "WedPlan",

  // Authentication base URL
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Secret for signing authentication data
  secret: process.env.BETTER_AUTH_SECRET,

  // ==========================================
  // MONGODB DATABASE
  // ==========================================

  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  // ==========================================
  // EMAIL AND PASSWORD AUTHENTICATION
  // ==========================================

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // ==========================================
  // USER ROLES
  // ==========================================

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
    },
  },

  // ==========================================
  // GOOGLE AUTHENTICATION
  // ==========================================

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  // ==========================================
  // NEXT.JS COOKIE SUPPORT
  // ==========================================

  // jwt() signs tokens for the Express API (/api/auth/token)
  // and publishes the public keys at /api/auth/jwks.
  // nextCookies() must stay last.
  plugins: [jwt(), nextCookies()],
});
