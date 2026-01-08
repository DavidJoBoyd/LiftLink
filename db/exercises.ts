import { getDb } from './connection';

export type Exercise = {
  id: number;
  name: string;
};

export async function createExercise(name: string): Promise<Exercise | null> {
  const db = await getDb();
  const trimmed = name.trim();
  if (!trimmed) return null;

  // Insert if not exists
  await db.runAsync('INSERT OR IGNORE INTO exercises (name) VALUES (?)', trimmed);

  const row = await db.getFirstAsync<Exercise>(
    'SELECT id, name FROM exercises WHERE name = ?',
    [trimmed]
  );
  return row ?? null;
}

export async function getExercises(): Promise<Exercise[]> {
  const db = await getDb();
  return db.getAllAsync<Exercise>('SELECT id, name FROM exercises ORDER BY name');
}

export async function getExerciseById(id: number): Promise<Exercise | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Exercise>('SELECT id, name FROM exercises WHERE id = ?', [id]);
  return row ?? null;
}

export async function getExerciseByName(name: string): Promise<Exercise | null> {
  const db = await getDb();
  const trimmed = name.trim();
  if (!trimmed) return null;
  const row = await db.getFirstAsync<Exercise>('SELECT id, name FROM exercises WHERE name = ?', [trimmed]);
  return row ?? null;
}

export async function findOrCreateExercise(name: string): Promise<Exercise | null> {
  const existing = await getExerciseByName(name);
  if (existing) return existing;
  return createExercise(name);
}
