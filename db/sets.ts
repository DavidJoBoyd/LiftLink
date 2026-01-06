import { getDb } from './connection';

export type Set = {
  id: number;
  workoutId: number;
  exerciseName: string;
  weight: number;
  reps: number;
  isEntry: number;
};

export async function createSet(workoutId: number, exerciseName: string, weight: number, reps: number, isEntry: boolean = false) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO sets (workoutId, exerciseName, weight, reps, isEntry) VALUES (?, ?, ?, ?, ?)',    
    workoutId,
    exerciseName.trim(),
    weight,
    reps,
    isEntry ? 1 : 0
  );
}

export async function getSetsForWorkout(workoutId: number): Promise<Set[]> {
  const db = await getDb();
  return db.getAllAsync<Set>(
    'SELECT id, workoutId, exerciseName, weight, reps, isEntry FROM sets WHERE workoutId = ? ORDER BY id',
    workoutId
  );
}

export async function getSetById(id: number): Promise<Set | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Set>(
    'SELECT id, workoutId, exerciseName, weight, reps, isEntry FROM sets WHERE id = ?',
    [id]
  );
  return row ?? null;
}
