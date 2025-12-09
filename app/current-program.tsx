import { Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function CurrentProgramScreen() {
  // later you’ll load the “active” program from storage
  const hasCurrentProgram = false;

  return (
    <>
      <Stack.Screen options={{ title: 'Current Program' }} />

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Current Program
        </ThemedText>

        {hasCurrentProgram ? (
          <>
            <ThemedText style={styles.subtitle}>
              {/* Placeholder for program name */}
              4-Day Upper/Lower
            </ThemedText>

            {/* Placeholder: summary info */}
            <ThemedText>4 days per week</ThemedText>
            <ThemedText>Next workout: Upper 1</ThemedText>
          </>
        ) : (
          <>
            <ThemedText style={styles.emptyText}>
              You don’t have a current program set.
            </ThemedText>
            <TouchableOpacity style={styles.button} onPress={() => {}}>
              <ThemedText style={styles.buttonText}>
                Choose a Program
              </ThemedText>
            </TouchableOpacity>
          </>
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
  subtitle: {
    fontWeight: '600',
  },
  emptyText: {
    opacity: 0.8,
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#22c55e',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    color: '#022c22',
  },
});
