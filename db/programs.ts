import { getDb } from './connection';
import { getTemplateWorkoutsForProgram } from './workouts';

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

  const templateWorkouts = await getTemplateWorkoutsForProgram(id);
  const firstWorkoutId = templateWorkouts.length > 0 ? templateWorkouts[0].id : null;
  if (firstWorkoutId != null) {
    try {
      await setCurrentWorkoutForProgram(id, firstWorkoutId);
      return;
    } catch (error) {
      console.warn('Failed to link first workout as current, resetting to null', error);
    }
  }

  await setCurrentWorkoutForProgram(id, null);
}

export async function setCurrentWorkoutForProgram(programId: number, workoutId: number | null) {
  const db = await getDb();
  await db.runAsync('UPDATE programs SET currentWorkoutId = ? WHERE id = ?', workoutId, programId);
}

export async function advanceCurrentWorkoutForProgram(programId: number) {
  const program = await getProgramById(programId);
  if (!program || program.currentWorkoutId == null) {
    console.log('No current program or currentWorkoutId set.');
    return null;
  }
  const templateWorkouts = await getTemplateWorkoutsForProgram(programId);
  console.log('Template workouts:', templateWorkouts);
  const currentIndex = templateWorkouts.findIndex(w => w.id === program.currentWorkoutId);
  console.log('Current workoutId:', program.currentWorkoutId, 'Current index:', currentIndex);
  let nextWorkoutId = null;
  if (currentIndex !== -1 && templateWorkouts.length > 0) {
    if (currentIndex + 1 < templateWorkouts.length) {
      nextWorkoutId = templateWorkouts[currentIndex + 1].id;
    } else {
      nextWorkoutId = templateWorkouts[0].id;
    }
    console.log('Advancing to next workoutId:', nextWorkoutId);
    await setCurrentWorkoutForProgram(programId, nextWorkoutId);
    // Log the updated program
    const updatedProgram = await getProgramById(programId);
    console.log('Updated program after advancing:', updatedProgram);
  } else {
    console.log('No valid current workout or no template workouts.');
  }
  return nextWorkoutId;
}

export async function deleteProgram(id: number) {
  const db = await getDb();
  await db.runAsync('DELETE FROM programs WHERE id = ?', id);
}
