import { getPrograms } from '@/db/programs';
import { getWorkoutsForProgram } from '@/db/workouts';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { startWorkoutStyles as styles } from '@/styles/pageStyles';

export default function StartWorkoutScreen() {
  const [currentProgram, setCurrentProgram] = useState<{ id: number; name: string; isCurrentProgram: number } | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<{ id: number; programId: number; name: string } | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrent = async () => {
      setLoading(true);
      try {
        const programs = await getPrograms();
        const current = programs.find(p => p.isCurrentProgram === 1) || null;
        setCurrentProgram(current);
        if (current) {
          const workouts = await getWorkoutsForProgram(current.id);
          const currentWorkout = workouts.find(w => w.id === current.currentWorkoutId) || null;
          setCurrentWorkout(currentWorkout);
        } else {
          setCurrentWorkout(null);
        }
      } catch (err) {
        setCurrentProgram(null);
        setCurrentWorkout(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrent();
  }, []);

  const handleStartFromCurrent = () => {
    router.push('/pages/do-workout');
  };

  const handleQuickWorkout = () => {
    console.log('Start quick workout');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Start Workout' }} />

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Start Workout
        </ThemedText>

        {loading ? (
          <ThemedText style={styles.subtitle}>Loading current program...</ThemedText>
        ) : currentProgram ? (
          <>
            <ThemedText style={styles.subtitle}>
              Current Program: <ThemedText style={{ fontWeight: 'bold' }}>{currentProgram.name}</ThemedText>
            </ThemedText>
            {currentWorkout ? (
              <ThemedText style={styles.subtitle}>
                Current Workout: <ThemedText style={{ fontWeight: 'bold' }}>{currentWorkout.name}</ThemedText>
              </ThemedText>
            ) : (
              <ThemedText style={styles.subtitle}>No workouts found for this program.</ThemedText>
            )}
          </>
        ) : (
          <ThemedText style={styles.subtitle}>No current program selected.</ThemedText>
        )}

        <ThemedView style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleStartFromCurrent}
            disabled={!currentProgram || !currentWorkout}
          >
            <ThemedText style={styles.primaryButtonText}>
              Use Current Program
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleQuickWorkout}
          >
            <ThemedText style={styles.secondaryButtonText}>
              Quick Workout
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </>
  );
}
