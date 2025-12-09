import { Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function StartWorkoutScreen() {
  const handleStartFromCurrent = () => {
    console.log('Start workout from current program');
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

        <ThemedText style={styles.subtitle}>
          Choose how you want to train today.
        </ThemedText>

        <ThemedView style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleStartFromCurrent}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
  },
  buttonGroup: {
    marginTop: 16,
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
