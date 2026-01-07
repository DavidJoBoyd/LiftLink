import { getDb } from './connection';

export type Workout = {
  id: number;
  programId: number;
  name: string;
  isEntry: number;
  date: string | null;
};

// Create a template workout (isEntry=0)
export async function createWorkout(programId: number, name: string) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO workouts (programId, name, isEntry, date) VALUES (?, ?, 0, NULL)',
    programId,
    name.trim()
  );
}

// Create a user workout entry (isEntry=1)
export async function createWorkoutEntry(programId: number, name: string, date: Date = new Date()) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO workouts (programId, name, isEntry, date) VALUES (?, ?, 1, ?)',
    programId,
    name.trim(),
    date.toISOString()
  );
}

export async function getWorkoutsForProgram(programId: number): Promise<Workout[]> {
  const db = await getDb();
  return db.getAllAsync<Workout>(
    'SELECT id, programId, name, isEntry, date FROM workouts WHERE programId = ? ORDER BY id',
    programId
  );
}

export async function getTemplateWorkoutsForProgram(programId: number): Promise<Workout[]> {
  const db = await getDb();
  return db.getAllAsync<Workout>(
    'SELECT id, programId, name, isEntry, date FROM workouts WHERE programId = ? AND isEntry = 0 ORDER BY id',
    programId
  );
}

export async function getWorkoutById(id: number): Promise<Workout | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Workout>(
    'SELECT id, programId, name, isEntry, date FROM workouts WHERE id = ?',
    [id]
  );
  return row ?? null;
}

export async function getAllWorkoutEntries(): Promise<Workout[]> {
  const db = await getDb();
  return db.getAllAsync<Workout>('SELECT id, programId, name, isEntry, date FROM workouts WHERE isEntry = 1 ORDER BY id DESC');
}
