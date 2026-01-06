import { getDb } from './connection';

export type Program = {
  id: number;
  name: string;
  isCurrentProgram: number;
  currentWorkoutId: number | null;
};

export async function createProgram(name: string) {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO programs (name, isCurrentProgram) VALUES (?, 0)',
    name.trim()
  );
}

export async function getPrograms(): Promise<Program[]> {
  const db = await getDb();
  return db.getAllAsync<Program>(
    'SELECT id, name, isCurrentProgram, currentWorkoutId FROM programs ORDER BY id DESC'
  );
}

export async function getProgramById(id: number): Promise<Program | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Program>(
    'SELECT id, name, isCurrentProgram, currentWorkoutId FROM programs WHERE id = ?',
    [id]
  );
  return row ?? null;
}

export async function setCurrentProgram(id: number) {
  const db = await getDb();
  await db.runAsync('UPDATE programs SET isCurrentProgram = 0');
  await db.runAsync('UPDATE programs SET isCurrentProgram = 1 WHERE id = ?', id);
}

export async function setCurrentWorkoutForProgram(programId: number, workoutId: number | null) {
  const db = await getDb();
  await db.runAsync('UPDATE programs SET currentWorkoutId = ? WHERE id = ?', workoutId, programId);
}

export async function deleteProgram(id: number) {
  const db = await getDb();
  await db.runAsync('DELETE FROM programs WHERE id = ?', id);
}
