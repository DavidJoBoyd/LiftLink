import { getDb } from './connection';

export type Workout = {
  id: number;
  programId: number;
  name: string;
};

export type WorkoutEntry = {
  id: number;
  programId: number;
  name: string;
  date: string;
};

// Workout (template) CRUD
export async function createWorkout(programId: number, name: string) {
  const db = await getDb();
  await db.runAsync('INSERT INTO workouts (programId, name) VALUES (?, ?)', programId, name.trim());
}

export async function getWorkoutsForProgram(programId: number): Promise<Workout[]> {
  const db = await getDb();
  return db.getAllAsync<Workout>('SELECT id, programId, name FROM workouts WHERE programId = ? ORDER BY id', programId);
}

export async function getWorkoutById(id: number): Promise<Workout | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Workout>('SELECT id, programId, name FROM workouts WHERE id = ?', [id]);
  return row ?? null;
}

// WorkoutEntry (user data) CRUD
export async function createWorkoutEntry(programId: number, name: string, date: Date = new Date()) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO workout_entries (programId, name, date) VALUES (?, ?, ?)',
    programId,
    name.trim(),
    date.toISOString()
  );
}

export async function getWorkoutEntriesForProgram(programId: number): Promise<WorkoutEntry[]> {
  const db = await getDb();
  return db.getAllAsync<WorkoutEntry>(
    'SELECT id, programId, name, date FROM workout_entries WHERE programId = ? ORDER BY id',
    programId
  );
}

export async function getWorkoutEntryById(id: number): Promise<WorkoutEntry | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<WorkoutEntry>(
    'SELECT id, programId, name, date FROM workout_entries WHERE id = ?',
    [id]
  );
  return row ?? null;
}

export async function getAllWorkoutEntries(): Promise<WorkoutEntry[]> {
  const db = await getDb();
  return db.getAllAsync<WorkoutEntry>('SELECT id, programId, name, date FROM workout_entries ORDER BY id DESC');
}
