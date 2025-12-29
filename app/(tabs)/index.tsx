import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPersonalRecords, type PersonalRecord } from '@/utils/database';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  
  const router = useRouter();
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [loadingPrs, setLoadingPrs] = useState(true);

  useEffect(() => {
    const loadPrs = async () => {
      try {
        const records = await getPersonalRecords();
        setPrs(records);
      } catch (err) {
        console.error('Failed to load PRs:', err);
      } finally {
        setLoadingPrs(false);
      }
    };
    loadPrs();
  }, []);

  const handleCreateProgram = () => router.push('/create-program');
  const handleStartWorkout = () => router.push('/start-workout');
  const handleWorkoutLog = () => router.push('/workout-log');
  const handleMyPrograms = () => router.push('/my-programs');
  const handleCurrentProgram = () => router.push('/current-program');
  
  return (
  <ParallaxScrollView
    headerBackgroundColor={{ light: '#0f172a', dark: '#020617' }}
    headerImage={<></>}
  >
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Lift Link
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Your training hub for building and tracking workouts.
        </ThemedText>

        <ThemedView style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleCreateProgram}
          >
            <ThemedText style={styles.primaryButtonText}>Create a Program</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleStartWorkout}
          >
            <ThemedText style={styles.primaryButtonText}>Start Workout</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleWorkoutLog}
          >
            <ThemedText style={styles.secondaryButtonText}>Workout Log</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleMyPrograms}
          >
            <ThemedText style={styles.secondaryButtonText}>My Programs</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCurrentProgram}
          >
            <ThemedText style={styles.secondaryButtonText}>Current Program</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.prsSection}>
          <ThemedText type="subtitle" style={styles.prsTitle}>
            Personal Records
          </ThemedText>
          {loadingPrs ? (
            <ThemedText style={styles.emptyText}>Loading PRs...</ThemedText>
          ) : prs.length === 0 ? (
            <ThemedText style={styles.emptyText}>
              No personal records yet. Start logging workouts to see your PRs here!
            </ThemedText>
          ) : (
            <ThemedView style={styles.prsList}>
              {prs.map((pr, index) => (
                <ThemedView key={index} style={styles.prCard}>
                  <ThemedView style={styles.prCardHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.prExerciseName}>
                      {pr.exerciseName}
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={styles.prWeight}>
                      {pr.maxWeight} lb
                    </ThemedText>
                  </ThemedView>
                  <ThemedText style={styles.prDetails}>
                    {pr.reps} reps
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  buttonGroup: {
    marginTop: 8,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#22c55e',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  primaryButtonText: {
    fontWeight: '600',
    color: '#022c22',
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
  prsSection: {
    marginTop: 32,
    gap: 16,
  },
  prsTitle: {
    marginBottom: 8,
  },
  prsList: {
    gap: 10,
  },
  prCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  prCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  prExerciseName: {
    flex: 1,
  },
  prWeight: {
    fontSize: 18,
    color: '#22c55e',
  },
  prDetails: {
    opacity: 0.7,
    fontSize: 14,
  },
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
