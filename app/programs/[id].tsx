// app/programs/[id].tsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
    getProgramTemplates,
    getWorkoutTemplatesForProgram,
    type WorkoutTemplateRow,
} from '@/utils/database';

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams();
  const programTemplateId = Number(id);
  const router = useRouter();

  const [workouts, setWorkouts] = useState<WorkoutTemplateRow[]>([]);
  const [programName, setProgramName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!programTemplateId) return;

    const load = async () => {
      try {
        const [programTemplates, workoutTemplates] = await Promise.all([
          getProgramTemplates(),
          getWorkoutTemplatesForProgram(programTemplateId),
        ]);

        const program = programTemplates.find((p) => p.id === programTemplateId);
        if (program) setProgramName(program.name);
        setWorkouts(workoutTemplates);
      } catch (err) {
        console.error('Failed to load program/workouts:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [programTemplateId]);

  const hasWorkouts = workouts.length > 0;

  return (
    <>
      <Stack.Screen options={{ title: programName || 'Program' }} />

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          {programName || 'Program'}
        </ThemedText>

        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : !hasWorkouts ? (
          <ThemedText style={styles.emptyText}>
            This program doesn’t have any workouts yet.
          </ThemedText>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
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
  emptyText: { opacity: 0.8 },
  listContent: { gap: 12, paddingTop: 4 },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
});
