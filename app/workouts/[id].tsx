// app/workouts/[id].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getSetsForWorkout, Set } from '@/db/sets';
import { getWorkoutById, Workout } from '@/db/workouts';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const workoutId = Number(id);

  const [sets, setSets] = useState<Set[]>([]);
  const [workoutName, setWorkoutName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workoutId) return;

    const load = async () => {
      try {
        const [workout, setRows] = await Promise.all([
          getWorkoutById(workoutId),
          getSetsForWorkout(workoutId),
        ]);

        if (workout) setWorkoutName(workout.name);
        setSets(setRows);
      } catch (err) {
        console.error('Failed to load workout/sets:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [workoutId]);

  const hasSets = sets.length > 0;

  return (
    <>
      <Stack.Screen options={{ title: workoutName || 'Workout' }} />

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          {workoutName || 'Workout'}
        </ThemedText>

        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : !hasSets ? (
          <ThemedText style={styles.emptyText}>
            This workout doesn’t have any sets yet.
          </ThemedText>
        ) : (
          <FlatList
            data={sets}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <ThemedView style={styles.card}>
                <ThemedText type="defaultSemiBold">
                  {item.exerciseName}
                </ThemedText>
                <ThemedText>
                  Set {index + 1}: {item.reps} reps @ {item.weight} lb
                </ThemedText>
              </ThemedView>
            )}
          />
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { marginBottom: 8 },
  emptyText: { opacity: 0.8 },
  listContent: { gap: 12, paddingTop: 4 },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
});
