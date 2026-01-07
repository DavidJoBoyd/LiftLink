import { Stack, useRouter } from 'expo-router';
import { FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';

import { getAllWorkoutEntries, Workout } from '@/db/workouts';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { workoutLogStyles as styles } from '@/styles/pageStyles';

export default function WorkoutLogScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLog = async () => {
      setLoading(true);
      try {
        const log = await getAllWorkoutEntries();
        setWorkouts(log);
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, []);

  const handlePressLog = (workoutId: number) => {
    router.push({
      pathname: '/pages/workout-session',
      params: {
        workoutId: workoutId.toString(),
      },
    });
  };

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
            You haven’t logged any workouts yet.{"\n"}
            Start a workout to see it appear here.
          </ThemedText>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handlePressLog(item.id)}>
                <ThemedView style={styles.card}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        )}
      </ThemedView>
    </>
  );
}
