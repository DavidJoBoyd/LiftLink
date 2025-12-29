// utils/database.ts
import * as SQLite from 'expo-sqlite';

/** Row types as stored in the DB */
export type ProgramRow = {
  id: number;
  name: string;
  isCurrentProgram: number; // 0 or 1
};

export type WorkoutRow = {
  id: number;
  programId: number;
  name: string;
};

export type SetRow = {
  id: number;
  workoutId: number;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;     // ISO string, e.g. "2025-12-09T14:32:00.000Z"
  isTemplate: number; // 0 or 1 in DB
};

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Open DB once and make sure tables exist */
export async function getDb() {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('liftlink.db');

      await db.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS programs (
          id   INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS workouts (
          id        INTEGER PRIMARY KEY AUTOINCREMENT,
          programId INTEGER NOT NULL,
          name      TEXT NOT NULL,
          FOREIGN KEY (programId) REFERENCES programs(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS sets (
          id           INTEGER PRIMARY KEY AUTOINCREMENT,
          workoutId    INTEGER NOT NULL,
          exerciseName TEXT NOT NULL,
          weight       REAL NOT NULL,
          reps         INTEGER NOT NULL,
          date         TEXT NOT NULL,
          isTemplate   INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (workoutId) REFERENCES workouts(id) ON DELETE CASCADE
        );
      `);


      return db;
    })();
  }

  return dbPromise;
}

/* ---------- PROGRAMS ---------- */

export async function createProgram(name: string) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO programs (name, isCurrentProgram) VALUES (?, 0)',
    name.trim()
  );
}

export async function getPrograms(): Promise<ProgramRow[]> {
  const db = await getDb();
  return db.getAllAsync<ProgramRow>(
    'SELECT id, name, isCurrentProgram FROM programs ORDER BY id DESC'
  );
}

/* ---------- WORKOUTS ---------- */

export async function createWorkout(programId: number, name: string) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO workouts (programId, name) VALUES (?, ?)',
    programId,
    name.trim()
  );
}

export async function getWorkoutsForProgram(
  programId: number
): Promise<WorkoutRow[]> {
  const db = await getDb();
  return db.getAllAsync<WorkoutRow>(
    'SELECT id, programId, name FROM workouts WHERE programId = ? ORDER BY id',
    programId
  );
}

/* ---------- SETS ---------- */

export async function addSetToWorkout(
  workoutId: number,
  exerciseName: string,
  weight: number,
  reps: number,
  date: Date,
  isTemplate: boolean
) {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO sets (workoutId, exerciseName, weight, reps, date, isTemplate)
     VALUES (?, ?, ?, ?, ?, ?)`,
    workoutId,
    exerciseName.trim(),
    weight,
    reps,
    date.toISOString(),
    isTemplate ? 1 : 0
  );
}

export async function getSetsForWorkout(
  workoutId: number
): Promise<SetRow[]> {
  const db = await getDb();
  return db.getAllAsync<SetRow>(
    `SELECT id, workoutId, exerciseName, weight, reps, date, isTemplate
     FROM sets
     WHERE workoutId = ?
     ORDER BY id`,
    workoutId
  );
}

export async function getProgramById(id: number): Promise<ProgramRow | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<ProgramRow>(
    'SELECT id, name, isCurrentProgram FROM programs WHERE id = ?',
    [id]
  );
  return row ?? null;
}
/** Set the current program by id, and unset all others */
export async function setCurrentProgram(id: number) {
  const db = await getDb();
  await db.runAsync('UPDATE programs SET isCurrentProgram = 0');
  await db.runAsync('UPDATE programs SET isCurrentProgram = 1 WHERE id = ?', id);
}

export async function getWorkoutById(id: number): Promise<WorkoutRow | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<WorkoutRow>(
    'SELECT id, programId, name FROM workouts WHERE id = ?',
    [id]
  );

  return row ?? null;
}

/* ---------- PERSONAL RECORDS ---------- */

export type PersonalRecord = {
  exerciseName: string;
  maxWeight: number;
  reps: number;
  date: string;
};

export async function getPersonalRecords(): Promise<PersonalRecord[]> {
  const db = await getDb();
  return db.getAllAsync<PersonalRecord>(
    `SELECT 
      s1.exerciseName,
      s1.weight as maxWeight,
      s1.reps,
      s1.date
    FROM sets s1
    INNER JOIN (
      SELECT exerciseName, MAX(weight) as maxWeight
      FROM sets
      WHERE isTemplate = 0
      GROUP BY exerciseName
    ) s2 ON s1.exerciseName = s2.exerciseName AND s1.weight = s2.maxWeight
    WHERE s1.isTemplate = 0
    GROUP BY s1.exerciseName
    ORDER BY maxWeight DESC, s1.exerciseName`
  );
}