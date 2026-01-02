// app/create-program.tsx
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getDb } from '@/utils/database';


type NewSet = {
  id: string;
  weight: string;
  reps: string;
};

type NewExercise = {
  id: string;
  name: string;
  sets: NewSet[];
};

type NewWorkout = {
  id: string;
  name: string;
  exercises: NewExercise[];
};

export default function CreateProgramScreen() {
  const [programName, setProgramName] = useState('');
  const [workouts, setWorkouts] = useState<NewWorkout[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();


  const addWorkout = () => {
    const newWorkout: NewWorkout = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: '',
      exercises: [],
    };
    setWorkouts((prev) => [...prev, newWorkout]);
  };


  const updateWorkoutName = (workoutId: string, name: string) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId ? { ...w, name } : w
      )
    );
  };

  const addExerciseToWorkout = (workoutId: string) => {
    const newExercise: NewExercise = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: '',
      sets: [],
    };
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId ? { ...w, exercises: [...w.exercises, newExercise] } : w
      )
    );
  };

  const updateExerciseName = (workoutId: string, exerciseId: string, name: string) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              exercises: w.exercises.map((e) =>
                e.id === exerciseId ? { ...e, name } : e
              ),
            }
          : w
      )
    );
  };

  const addSetToExercise = (workoutId: string, exerciseId: string) => {
    const newSet: NewSet = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      weight: '',
      reps: '',
    };
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              exercises: w.exercises.map((e) =>
                e.id === exerciseId ? { ...e, sets: [...e.sets, newSet] } : e
              ),
            }
          : w
      )
    );
  };

  const updateSetField = (
    workoutId: string,
    exerciseId: string,
    setId: string,
    field: keyof Omit<NewSet, 'id'>,
    value: string
  ) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              exercises: w.exercises.map((e) =>
                e.id === exerciseId
                  ? {
                      ...e,
                      sets: e.sets.map((s) =>
                        s.id === setId ? { ...s, [field]: value } : s
                      ),
                    }
                  : e
              ),
            }
          : w
      )
    );
  };


  const handleSaveProgram = async () => {
    const trimmedProgram = programName.trim();
    if (!trimmedProgram || saving) return;

    try {
      setSaving(true);
      const db = await getDb();

      // Start: insert program
      const programResult = await db.runAsync(
        'INSERT INTO programs (name) VALUES (?)',
        trimmedProgram
      );
      const programId = programResult.lastInsertRowId as number;

      // For each workout, insert and then insert its exercises/sets
      for (const workout of workouts) {
        const trimmedWorkoutName = workout.name.trim();
        if (!trimmedWorkoutName) continue;

        const workoutResult = await db.runAsync(
          'INSERT INTO workouts (programId, name) VALUES (?, ?)',
          programId,
          trimmedWorkoutName
        );
        const workoutId = workoutResult.lastInsertRowId as number;

        for (const exercise of workout.exercises) {
          const trimmedExercise = exercise.name.trim();
          if (!trimmedExercise) continue;

          for (const set of exercise.sets) {
            const weightNum = parseFloat(set.weight || '0');
            const repsNum = parseInt(set.reps || '0', 10);
            if (Number.isNaN(weightNum) || Number.isNaN(repsNum)) continue;

            await db.runAsync(
              `INSERT INTO sets (workoutId, exerciseName, weight, reps, date, isTemplate)
               VALUES (?, ?, ?, ?, ?, ?)`,
              workoutId,
              trimmedExercise,
              weightNum,
              repsNum,
              new Date().toISOString(),
              1 // isTemplate = true while building the program
            );
          }
        }
      }

      // After saving everything, go to My Programs
      router.push('/my-programs');
    } catch (err) {
      console.error('Failed to save program with workouts/sets:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Create a Program' }} />

      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Program header */}
          <ThemedText type="title" style={styles.title}>
            Create a Program
          </ThemedText>

          <ThemedText style={styles.label}>Program Name</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="e.g. 4-Day Upper/Lower"
            value={programName}
            onChangeText={setProgramName}
          />

          {/* Workouts section */}
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold">Workouts</ThemedText>
            <TouchableOpacity style={styles.smallButton} onPress={addWorkout}>
              <ThemedText style={styles.smallButtonText}>+ Add Workout</ThemedText>
            </TouchableOpacity>
          </View>

          {workouts.length === 0 && (
            <ThemedText style={styles.helperText}>
              Add your first workout to this program.
            </ThemedText>
          )}

          {workouts.map((workout) => (
            <View key={workout.id} style={styles.workoutCard}>
              <ThemedText style={styles.label}>Workout Name</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g. Upper 1"
                value={workout.name}
                onChangeText={(text) => updateWorkoutName(workout.id, text)}
              />

              <View style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">Exercises</ThemedText>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => addExerciseToWorkout(workout.id)}
                >
                  <ThemedText style={styles.smallButtonText}>+ Add Exercise</ThemedText>
                </TouchableOpacity>
              </View>

              {workout.exercises.length === 0 && (
                <ThemedText style={styles.helperText}>
                  Add your first exercise to this workout.
                </ThemedText>
              )}

              {workout.exercises.map((exercise) => (
                <View key={exercise.id} style={{ marginBottom: 12 }}>
                  <ThemedText style={styles.label}>Exercise Name</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Bench Press"
                    value={exercise.name}
                    onChangeText={(text) => updateExerciseName(workout.id, exercise.id, text)}
                  />

                  <View style={styles.sectionHeader}>
                    <ThemedText type="defaultSemiBold">Sets</ThemedText>
                    <TouchableOpacity
                      style={styles.smallButton}
                      onPress={() => addSetToExercise(workout.id, exercise.id)}
                    >
                      <ThemedText style={styles.smallButtonText}>+ Add Set</ThemedText>
                    </TouchableOpacity>
                  </View>

                  {exercise.sets.length === 0 && (
                    <ThemedText style={styles.helperText}>
                      Add sets for this exercise (weight, reps).
                    </ThemedText>
                  )}

                  {exercise.sets.map((set) => (
                    <View key={set.id} style={styles.setRow}>
                      <TextInput
                        style={[styles.input, styles.setInput]}
                        placeholder="Weight"
                        keyboardType="numeric"
                        value={set.weight}
                        onChangeText={(text) =>
                          updateSetField(workout.id, exercise.id, set.id, 'weight', text)
                        }
                      />
                      <TextInput
                        style={[styles.input, styles.setInput]}
                        placeholder="Reps"
                        keyboardType="numeric"
                        value={set.reps}
                        onChangeText={(text) =>
                          updateSetField(workout.id, exercise.id, set.id, 'reps', text)
                        }
                      />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}

          {/* Save button */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!programName.trim() || saving) && styles.saveButtonDisabled,
            ]}
            onPress={handleSaveProgram}
            disabled={!programName.trim() || saving}
          >
            <ThemedText style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Program'}
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  sectionHeader: {
    marginTop: 12,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperText: {
    opacity: 0.7,
    marginBottom: 4,
  },
  workoutCard: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  setRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  setInput: {
    flex: 1,
    marginBottom: 0,
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#374151',
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#22c55e',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontWeight: '600',
    color: '#022c22',
  },
});
