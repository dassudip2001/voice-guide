import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { con: null, promise: null };
}

/**
 * Establishes a connection to the MongoDB database.
 *
 * It first checks if there's already a connection or a promise to a connection
 * in the cache. If there is, it just returns that. If not, it creates a new
 * promise to connect to the database and stores that in the cache, then waits
 * for that promise to resolve and returns the connection.
 *
 * If the promise rejects, it removes the promise from the cache and re-throws
 * the error.
 */
export async function connectToDatabase() {
  if (cached.con) {
    return cached.con;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.con = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.con;
}