import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('liftlink.db');
      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS programs (
          id   INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          isCurrentProgram INTEGER NOT NULL DEFAULT 0,
          currentWorkoutId INTEGER,
          FOREIGN KEY (currentWorkoutId) REFERENCES workout_entries(id) ON DELETE SET NULL
        );
        -- User data tables
        CREATE TABLE IF NOT EXISTS workout_entries (
          id        INTEGER PRIMARY KEY AUTOINCREMENT,
          programId INTEGER NOT NULL,
          name      TEXT NOT NULL,
          date      TEXT NOT NULL,
          FOREIGN KEY (programId) REFERENCES programs(id) ON DELETE CASCADE
        );
        -- Template tables
        CREATE TABLE IF NOT EXISTS workouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          programId INTEGER NOT NULL,
          name TEXT NOT NULL,
          FOREIGN KEY (programId) REFERENCES programs(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS sets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workoutId INTEGER NOT NULL,
          exerciseName TEXT NOT NULL,
          weight REAL NOT NULL,
          reps INTEGER NOT NULL,
          isEntry INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (workoutId) REFERENCES workouts(id) ON DELETE CASCADE
        );
      `);
      // Migration: add isEntry column if missing
      await db.execAsync('ALTER TABLE sets ADD COLUMN isEntry INTEGER NOT NULL DEFAULT 0;').catch(() => {});
      return db;
    })();
  }
  return dbPromise;
}
