import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { getSetsForWorkout, Set } from '@/db/sets';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function WorkoutSessionScreen() {
  const { workoutId, date } = useLocalSearchParams<{ workoutId: string; date: string }>();
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workoutId || !date) return;
    const fetchSets = async () => {
      setLoading(true);
      try {
        const allSets = await getSetsForWorkout(Number(workoutId));
        // Only show sets for this session (date match)
        // If you want to filter by date, you need to add a date field to Set and filter here
        setSets(allSets); // Or filter if needed
      } finally {
        setLoading(false);
      }
    };
    fetchSets();
  }, [workoutId, date]);

  return (
    <>
      <Stack.Screen options={{ title: 'Workout Session' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Workout Session</ThemedText>
        <ThemedText style={styles.subtitle}>{date}</ThemedText>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : sets.length === 0 ? (
          <ThemedText>No sets found for this session.</ThemedText>
        ) : (
          <FlatList
            data={sets}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText type="defaultSemiBold">{item.exerciseName}</ThemedText>
                <ThemedText>Weight: {item.weight}</ThemedText>
                <ThemedText>Reps: {item.reps}</ThemedText>
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
  subtitle: { opacity: 0.8, marginBottom: 8 },
  listContent: { gap: 12, paddingTop: 4 },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
});
