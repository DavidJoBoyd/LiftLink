import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPrograms } from '@/db/programs';
import { getWorkoutsForProgram, createWorkoutEntry, getAllWorkoutEntries, Workout } from '@/db/workouts';
import { getSetsForWorkout, createSet, Set } from '@/db/sets';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function DoWorkoutScreen() {
  const [currentProgram, setCurrentProgram] = useState<{ id: number; name: string } | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const programs = await getPrograms();
        const program = programs.find(p => p.isCurrentProgram === 1) || null;
        setCurrentProgram(program);
        if (program) {
          // Only use template workouts (isEntry=0) for selection
          const workouts = (await getWorkoutsForProgram(program.id)).filter(w => w.isEntry === 0);
          const workout = workouts.length > 0 ? workouts[0] : null;
          setCurrentWorkout(workout);
          if (workout) {
            const workoutSets = await getSetsForWorkout(workout.id);
            setSets(workoutSets);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateSetField = (setId: number, field: keyof Omit<Set, 'id' | 'workoutId' | 'isEntry'>, value: string) => {
    setSets(prev => prev.map(s =>
      s.id === setId ? { ...s, [field]: value } : s
    ));
  };

  const handleCompleteWorkout = async () => {
    if (!currentWorkout || !currentProgram) return;
    setSaving(true);
    try {
      // Create a new workout entry (isEntry=1)
      await createWorkoutEntry(currentProgram.id, currentWorkout.name, new Date());
      // Get the latest workout entry for this program
      const entries = await getAllWorkoutEntries();
      const newEntry = entries.find(e => e.programId === currentProgram.id && e.name === currentWorkout.name);
      if (!newEntry) throw new Error('Failed to create workout entry');
      // Add performed sets to sets table with isEntry=1
      for (const set of sets) {
        await createSet(
          newEntry.id,
          set.exerciseName,
          parseFloat(set.weight.toString()),
          parseInt(set.reps.toString(), 10),
          true // isEntry = true
        );
      }
      router.push('/workout-log');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Do Workout' }} />
      <ThemedView style={styles.container}>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : !currentProgram || !currentWorkout ? (
          <ThemedText>No current program or workout found.</ThemedText>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedText type="title" style={styles.title}>{currentProgram.name}</ThemedText>
            <ThemedText style={styles.subtitle}>{currentWorkout.name}</ThemedText>
            {sets.map(set => (
              <View key={set.id} style={styles.setRow}>
                <ThemedText style={styles.exerciseName}>{set.exerciseName}</ThemedText>
                <TextInput
                  style={styles.input}
                  value={set.weight.toString()}
                  keyboardType="numeric"
                  onChangeText={text => updateSetField(set.id, 'weight', text)}
                  placeholder="Weight"
                />
                <TextInput
                  style={styles.input}
                  value={set.reps.toString()}
                  keyboardType="numeric"
                  onChangeText={text => updateSetField(set.id, 'reps', text)}
                  placeholder="Reps"
                />
              </View>
            ))}
            <TouchableOpacity
              style={[styles.completeButton, saving && styles.completeButtonDisabled]}
              onPress={handleCompleteWorkout}
              disabled={saving}
            >
              <ThemedText style={styles.completeButtonText}>
                {saving ? 'Saving...' : 'Complete Workout'}
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  scrollContent: { gap: 16, paddingBottom: 48 },
  title: { marginBottom: 4 },
  subtitle: { marginBottom: 12, opacity: 0.8 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  exerciseName: { minWidth: 80, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, padding: 8, minWidth: 60 },
  completeButton: { marginTop: 24, paddingVertical: 14, borderRadius: 999, backgroundColor: '#22c55e', alignItems: 'center' },
  completeButtonDisabled: { opacity: 0.5 },
  completeButtonText: { fontWeight: '600', color: '#022c22' },
});
