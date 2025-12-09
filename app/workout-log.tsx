import { Stack } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const dummyWorkouts = [
  // later you’ll replace this with real data
  // { id: '1', date: '2025-01-01', title: 'Upper Body', sets: 20 },
];

export default function WorkoutLogScreen() {
  const hasWorkouts = dummyWorkouts.length > 0;

  return (
    <>
      <Stack.Screen options={{ title: 'Workout Log' }} />

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Workout Log
        </ThemedText>

        {!hasWorkouts ? (
          <ThemedText style={styles.emptyText}>
            You haven’t logged any workouts yet.
            {'\n'}
            Start a workout to see it appear here.
          </ThemedText>
        ) : (
          <FlatList
            data={dummyWorkouts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText>{item.date}</ThemedText>
                <ThemedText>{item.sets} sets</ThemedText>
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
