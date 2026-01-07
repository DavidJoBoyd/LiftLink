import { useLocalSearchParams, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { getWorkoutById, Workout } from '@/db/workouts';
import { getSetsForWorkout, Set } from '@/db/sets';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { workoutSessionStyles as styles } from '../styles/pageStyles';

export default function WorkoutSessionScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workoutId) return;
    const fetchEntry = async () => {
      setLoading(true);
      try {
        const entry = await getWorkoutById(Number(workoutId));
        setWorkout(entry);
        if (entry) {
          const allSets = await getSetsForWorkout(Number(workoutId));
          setSets(allSets.filter(s => s.isEntry === 1));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [workoutId]);

  return (
    <>
      <Stack.Screen options={{ title: 'Workout Session' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Workout Session</ThemedText>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : !workout ? (
          <ThemedText>No workout found.</ThemedText>
        ) : (
          <>
            <ThemedText style={styles.subtitle}>Workout: {workout.name}</ThemedText>
            <ThemedText style={styles.subtitle}>Date: {workout.date}</ThemedText>
            {sets.length === 0 ? (
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
          </>
        )}
      </ThemedView>
    </>
  );
}
