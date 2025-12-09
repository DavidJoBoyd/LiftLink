import { StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  
  const router = useRouter();

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
});
