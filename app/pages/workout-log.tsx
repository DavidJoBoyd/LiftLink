import { Stack } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

import { getWorkoutLog, type WorkoutLogEntry } from '@/utils/database';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WorkoutLogScreen() {
  const [workouts, setWorkouts] = useState<WorkoutLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      try {
        const log = await getWorkoutLog();
        setWorkouts(log);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, []);

  const hasWorkouts = workouts.length > 0;

  return (
    <>
      <Stack.Screen options={{ title: 'Workout Log' }} />

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Workout Log
        </ThemedText>

        {loading ? (
          <ThemedText style={styles.emptyText}>Loading...</ThemedText>
        ) : !hasWorkouts ? (
          <ThemedText style={styles.emptyText}>
            You haven’t logged any workouts yet.
            {'\n'}
            Start a workout to see it appear here.
          </ThemedText>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText type="defaultSemiBold">{item.workoutName}</ThemedText>
                <ThemedText>{item.date}</ThemedText>
                <ThemedText>{item.setCount} sets</ThemedText>
              </ThemedView>
            )}
          />
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  emptyText: {
    opacity: 0.8,
  },
  listContent: {
    gap: 12,
    paddingTop: 4,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
});
