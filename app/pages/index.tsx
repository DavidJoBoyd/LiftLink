import { TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { homeStyles as styles } from '../styles/pageStyles';

export default function HomeScreen() {
  const router = useRouter();
  const handleCreateProgram = () => router.push('/pages/create-program');
  const handleStartWorkout = () => router.push('/pages/start-workout');
  const handleWorkoutLog = () => router.push('/pages/workout-log');
  const handleMyPrograms = () => router.push('/pages/my-programs');
  const handleExercises = () => router.push('/pages/exercises');

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
             onPress={handleExercises}
             >
            <ThemedText style={styles.secondaryButtonText}>My Exercises</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleCreateProgram}
          >
            <ThemedText style={styles.primaryButtonText}>Create a Program</ThemedText>
          </TouchableOpacity>

        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
