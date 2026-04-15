// Pushes the Prisma schema DDL to the remote Turso database
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN");
  process.exit(1);
}

const adapter = new PrismaLibSQL({ url, authToken });
const prisma = new PrismaClient({ adapter });

const statements = [
  `CREATE TABLE IF NOT EXISTS "users" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "name" TEXT NOT NULL, "role" TEXT NOT NULL DEFAULT 'TOURIST', "avatar" TEXT, "bio" TEXT, "preferences" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS "destinations" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "country" TEXT NOT NULL, "description" TEXT NOT NULL, "coverImage" TEXT NOT NULL, "latitude" REAL NOT NULL, "longitude" REAL NOT NULL, "highlights" TEXT, "featured" BOOLEAN NOT NULL DEFAULT false, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS "activities" ("id" TEXT NOT NULL PRIMARY KEY, "title" TEXT NOT NULL, "slug" TEXT NOT NULL, "description" TEXT NOT NULL, "category" TEXT NOT NULL, "price" REAL NOT NULL, "currency" TEXT NOT NULL DEFAULT 'EUR', "duration" INTEGER NOT NULL, "difficulty" TEXT, "maxGroupSize" INTEGER NOT NULL DEFAULT 20, "images" TEXT NOT NULL, "latitude" REAL NOT NULL, "longitude" REAL NOT NULL, "included" TEXT, "highlights" TEXT, "rating" REAL NOT NULL DEFAULT 0, "reviewCount" INTEGER NOT NULL DEFAULT 0, "featured" BOOLEAN NOT NULL DEFAULT false, "status" TEXT NOT NULL DEFAULT 'ACTIVE', "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, "destinationId" TEXT NOT NULL, "operatorId" TEXT NOT NULL, CONSTRAINT "activities_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "activities_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "time_slots" ("id" TEXT NOT NULL PRIMARY KEY, "date" DATETIME NOT NULL, "startTime" TEXT NOT NULL, "endTime" TEXT NOT NULL, "capacity" INTEGER NOT NULL, "bookedCount" INTEGER NOT NULL DEFAULT 0, "status" TEXT NOT NULL DEFAULT 'AVAILABLE', "activityId" TEXT NOT NULL, CONSTRAINT "time_slots_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "bookings" ("id" TEXT NOT NULL PRIMARY KEY, "participants" INTEGER NOT NULL, "totalPrice" REAL NOT NULL, "status" TEXT NOT NULL DEFAULT 'CONFIRMED', "notes" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT NOT NULL, "activityId" TEXT NOT NULL, "timeSlotId" TEXT NOT NULL, CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "bookings_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "bookings_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "time_slots" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "favorites" ("id" TEXT NOT NULL PRIMARY KEY, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT NOT NULL, "activityId" TEXT NOT NULL, CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "favorites_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "reviews" ("id" TEXT NOT NULL PRIMARY KEY, "rating" INTEGER NOT NULL, "comment" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT NOT NULL, "activityId" TEXT NOT NULL, "bookingId" TEXT, CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "reviews_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "reviews_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings" ("id") ON DELETE SET NULL ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "trips" ("id" TEXT NOT NULL PRIMARY KEY, "name" TEXT NOT NULL, "startDate" DATETIME NOT NULL, "endDate" DATETIME NOT NULL, "budget" REAL, "status" TEXT NOT NULL DEFAULT 'PLANNING', "preferences" TEXT, "summary" TEXT, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL, "userId" TEXT NOT NULL, "destinationId" TEXT NOT NULL, CONSTRAINT "trips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE, CONSTRAINT "trips_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS "trip_activities" ("id" TEXT NOT NULL PRIMARY KEY, "dayNumber" INTEGER NOT NULL, "orderIndex" INTEGER NOT NULL, "startTime" TEXT, "notes" TEXT, "timeOfDay" TEXT, "tripId" TEXT NOT NULL, "activityId" TEXT NOT NULL, CONSTRAINT "trip_activities_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "trip_activities_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "destinations_slug_key" ON "destinations"("slug")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "activities_slug_key" ON "activities"("slug")`,
  `CREATE INDEX IF NOT EXISTS "activities_destinationId_idx" ON "activities"("destinationId")`,
  `CREATE INDEX IF NOT EXISTS "activities_operatorId_idx" ON "activities"("operatorId")`,
  `CREATE INDEX IF NOT EXISTS "activities_category_idx" ON "activities"("category")`,
  `CREATE INDEX IF NOT EXISTS "activities_status_idx" ON "activities"("status")`,
  `CREATE INDEX IF NOT EXISTS "time_slots_activityId_idx" ON "time_slots"("activityId")`,
  `CREATE INDEX IF NOT EXISTS "time_slots_date_idx" ON "time_slots"("date")`,
  `CREATE INDEX IF NOT EXISTS "bookings_userId_idx" ON "bookings"("userId")`,
  `CREATE INDEX IF NOT EXISTS "bookings_activityId_idx" ON "bookings"("activityId")`,
  `CREATE INDEX IF NOT EXISTS "bookings_status_idx" ON "bookings"("status")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "favorites_userId_activityId_key" ON "favorites"("userId", "activityId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "reviews_bookingId_key" ON "reviews"("bookingId")`,
  `CREATE INDEX IF NOT EXISTS "reviews_activityId_idx" ON "reviews"("activityId")`,
  `CREATE INDEX IF NOT EXISTS "trips_userId_idx" ON "trips"("userId")`,
  `CREATE INDEX IF NOT EXISTS "trip_activities_tripId_idx" ON "trip_activities"("tripId")`,
];

async function main() {
  for (const sql of statements) {
    const label = sql.substring(0, 60);
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log("OK:", label + "...");
    } catch (e) {
      console.error("FAIL:", label, e.message);
    }
  }
  console.log("\nSchema push complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
