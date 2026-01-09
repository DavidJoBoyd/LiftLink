// app/create-program.tsx
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createProgram, getPrograms } from '@/db/programs';
import { createWorkout, getWorkoutsForProgram } from '@/db/workouts';
import { createSet } from '@/db/sets';
import { getExercises, findOrCreateExercise } from '@/db/exercises';
import { createProgramStyles as styles } from '../styles/pageStyles';

type NewSet = {
  id: string;
  exerciseName: string;
  weight: string;
  reps: string;
};

type NewWorkout = {
  id: string;
  name: string;
  sets: NewSet[];
};

export default function CreateProgramScreen() {
  const [programName, setProgramName] = useState('');
  const [workouts, setWorkouts] = useState<NewWorkout[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingProgram, setEditingProgram] = useState(false);
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const router = useRouter();

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const list = await getExercises();
        setExerciseOptions(list.map((e) => e.name));
      } catch (err) {
        console.error('Failed to load exercises:', err);
      }
    };
    loadExercises();
  }, []);

  const addWorkout = () => {
    setWorkouts((prev) => {
      const dayNumber = prev.length + 1;
      const newWorkout: NewWorkout = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        name: `Day ${dayNumber}`,
        sets: [],
      };
      return [...prev, newWorkout];
    });
  };

  const addSetToWorkout = (workoutId: string) => {
    setWorkouts((prev) =>
      prev.map((w) => {
        if (w.id !== workoutId) return w;
        const lastSet = w.sets[w.sets.length - 1];
        const newSet: NewSet = {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          exerciseName: lastSet ? lastSet.exerciseName : '',
          weight: lastSet ? lastSet.weight : '',
          reps: lastSet ? lastSet.reps : '',
        };
        return { ...w, sets: [...w.sets, newSet] };
      })
    );
  };

  const updateSetField = (
    workoutId: string,
    setId: string,
    field: keyof Omit<NewSet, 'id'>,
    value: string
  ) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === workoutId
          ? {
              ...w,
              sets: w.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
            }
          : w
      )
    );
  };

  const handleExerciseChange = (workoutId: string, setId: string, text: string) => {
    updateSetField(workoutId, setId, 'exerciseName', text);
    const q = text.trim().toLowerCase();
    if (!q) {
      setSuggestions((prev) => ({ ...prev, [setId]: [] }));
      return;
    }
    const matches = exerciseOptions.filter((n) => n.toLowerCase().includes(q)).slice(0, 6);
    setSuggestions((prev) => ({ ...prev, [setId]: matches }));
  };

  const selectSuggestion = (workoutId: string, setId: string, suggestion: string) => {
    updateSetField(workoutId, setId, 'exerciseName', suggestion);
    setSuggestions((prev) => ({ ...prev, [setId]: [] }));
  };

  const handleSaveProgram = async () => {
    const trimmedProgram = programName.trim();
    if (!trimmedProgram || saving) return;

    try {
      setSaving(true);
      await createProgram(trimmedProgram);
      const programs = await getPrograms();
      const program = programs[0];
      if (!program) throw new Error('Failed to create program');

      for (const workout of workouts) {
        const trimmedWorkoutName = workout.name.trim();
        if (!trimmedWorkoutName) continue;
        await createWorkout(program.id, trimmedWorkoutName);
        const workoutList = await getWorkoutsForProgram(program.id);
        const workoutObj = workoutList[workoutList.length - 1];
        if (!workoutObj) continue;

        for (const set of workout.sets) {
          const trimmedExercise = set.exerciseName.trim();
          if (!trimmedExercise) continue;
          const exercise = await findOrCreateExercise(trimmedExercise);
          if (!exercise) continue;
          const weightNum = parseFloat(set.weight || '0');
          const repsNum = parseInt(set.reps || '0', 10);
          if (Number.isNaN(weightNum) || Number.isNaN(repsNum)) continue;
          await createSet(workoutObj.id, exercise.id, exercise.name, weightNum, repsNum);
        }
      }

      router.push('/pages/my-programs');
    } catch (err) {
      console.error('Failed to save program:', err);
    } finally {
      setSaving(false);
    }
  };

  const removeSetFromWorkout = (workoutId: string, setId: string) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === workoutId ? { ...w, sets: w.sets.filter((s) => s.id !== setId) } : w))
    );
  };

  const removeWorkout = (workoutId: string) => {
    setWorkouts((prev) => {
      const remaining = prev.filter((w) => w.id !== workoutId);
      return remaining.map((w, index) => {
        const trimmed = w.name.trim();
        if (!trimmed || /^Day\s+\d+$/i.test(trimmed)) {
          return { ...w, name: `Day ${index + 1}` };
        }
        return w;
      });
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Create a Program' }} />

      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          {editingProgram ? (
            <TextInput
              style={[styles.inlineEditable, { fontSize: 18, fontWeight: '700' }]}
              placeholder="Program name (e.g. 4-Day Upper/Lower)"
              value={programName}
              onChangeText={setProgramName}
              autoFocus
              onBlur={() => setEditingProgram(false)}
              multiline={false}
              numberOfLines={1}
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingProgram(true)}>
              <ThemedText style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
                {programName || 'Program name (tap to edit)'}
              </ThemedText>
            </TouchableOpacity>
          )}

          {workouts.length === 0 && (
            <ThemedText style={styles.helperText}>
              Add your first workout to this program.
            </ThemedText>
          )}

          {workouts.map((workout, index) => (
            <View key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <ThemedText style={{ fontSize: 16, fontWeight: '600' }}>
                  {workout.name || `Day ${index + 1}`}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => removeWorkout(workout.id)}
                  style={styles.deleteWorkoutButton}
                  accessibilityLabel="Delete workout"
                >
                  <ThemedText style={styles.deleteWorkoutButtonText}>x</ThemedText>
                </TouchableOpacity>
              </View>

              {workout.sets.map((set) => (
                <View key={set.id} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginRight: 12 }}>
                      <View style={styles.setRow}>
                        <TextInput
                          style={[styles.input, styles.setInput, { flex: 2 }]}
                          placeholder="Exercise"
                          value={set.exerciseName}
                          onChangeText={(text) => handleExerciseChange(workout.id, set.id, text)}
                          onFocus={() => handleExerciseChange(workout.id, set.id, set.exerciseName)}
                        />
                        <TextInput
                          style={[styles.input, styles.setInput]}
                          placeholder="Weight"
                          keyboardType="numeric"
                          value={set.weight}
                          onChangeText={(text) =>
                            updateSetField(workout.id, set.id, 'weight', text)
                          }
                        />
                        <TextInput
                          style={[styles.input, styles.setInput]}
                          placeholder="Reps"
                          keyboardType="numeric"
                          value={set.reps}
                          onChangeText={(text) =>
                            updateSetField(workout.id, set.id, 'reps', text)
                          }
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => removeSetFromWorkout(workout.id, set.id)}
                      activeOpacity={0.8}
                      style={styles.deleteSetButton}
                    >
                      <MaterialIcons name="delete" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  {suggestions[set.id] && suggestions[set.id].length > 0 && (
                    <View
                      style={{
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#cbd5e1',
                        borderRadius: 8,
                        padding: 6,
                        marginTop: 6,
                      }}
                    >
                      {suggestions[set.id].map((s) => (
                        <TouchableOpacity
                          key={s}
                          onPress={() => selectSuggestion(workout.id, set.id, s)}
                          activeOpacity={0.7}
                        >
                          <ThemedText style={{ paddingVertical: 6 }}>{s}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              {/* Add Set button placed below all sets for this workout */}
              <View style={{ marginTop: 16}}>
                <TouchableOpacity
                  style={styles.smallButton}
                  onPress={() => addSetToWorkout(workout.id)}
                >
                  <ThemedText style={styles.smallButtonText}>+ Add Set</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Add Workout button placed below all workouts */}
          <View style={{ marginTop: 8 }}>
            <TouchableOpacity style={styles.smallButton} onPress={addWorkout}>
              <ThemedText style={styles.smallButtonText}>+ Add Workout</ThemedText>
            </TouchableOpacity>
          </View>

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
