import { getDb } from './connection';

export type Set = {
  id: number;
  workoutId: number;
  exerciseId: number;
  exerciseName: string;
  weight: number;
  reps: number;
  isEntry: number;
};

export async function createSet(workoutId: number, exerciseId: number, exerciseName: string, weight: number, reps: number, isEntry: boolean = false) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO sets (workoutId, exerciseId, exerciseName, weight, reps, isEntry) VALUES (?, ?, ?, ?, ?, ?)',    
    workoutId,
    exerciseId,
    exerciseName.trim(),
    weight,
    reps,
    isEntry ? 1 : 0
  );
}

export async function getSetsForWorkout(workoutId: number): Promise<Set[]> {
  const db = await getDb();
  return db.getAllAsync<Set>(
    `SELECT s.id, s.workoutId, s.exerciseId, COALESCE(e.name, s.exerciseName) AS exerciseName, s.weight, s.reps, s.isEntry
     FROM sets s
     LEFT JOIN exercises e ON e.id = s.exerciseId
     WHERE s.workoutId = ?
     ORDER BY s.id`,
    workoutId
  );
}

export async function getSetById(id: number): Promise<Set | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Set>(
    `SELECT s.id, s.workoutId, s.exerciseId, COALESCE(e.name, s.exerciseName) AS exerciseName, s.weight, s.reps, s.isEntry
     FROM sets s
     LEFT JOIN exercises e ON e.id = s.exerciseId
     WHERE s.id = ?`,
    [id]
  );
  return row ?? null;
}
