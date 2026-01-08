import * as SQLite from 'expo-sqlite';
import { DEFAULT_EXERCISES } from './defaultExercises';

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
          FOREIGN KEY (currentWorkoutId) REFERENCES workouts(id) ON DELETE SET NULL
        );
        CREATE TABLE IF NOT EXISTS workouts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          programId INTEGER NOT NULL,
          name TEXT NOT NULL,
          isEntry INTEGER NOT NULL DEFAULT 0,
          date TEXT,
          FOREIGN KEY (programId) REFERENCES programs(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE
        );
        CREATE TABLE IF NOT EXISTS sets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          workoutId INTEGER NOT NULL,
          exerciseId INTEGER NOT NULL,
          exerciseName TEXT NOT NULL,
          weight REAL NOT NULL,
          reps INTEGER NOT NULL,
          isEntry INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (workoutId) REFERENCES workouts(id) ON DELETE CASCADE,
          FOREIGN KEY (exerciseId) REFERENCES exercises(id)
        );
      `);

      await seedDefaultExercises(db);

      return db;
    })();
  }
  return dbPromise;
}

async function seedDefaultExercises(db: SQLite.SQLiteDatabase) {
  for (const name of DEFAULT_EXERCISES) {
    await db.runAsync('INSERT OR IGNORE INTO exercises (name) VALUES (?)', name);
  }
}
