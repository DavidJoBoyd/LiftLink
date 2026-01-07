// app/programs/[id].tsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPrograms, Program } from '@/db/programs';
import { getTemplateWorkoutsForProgram, Workout } from '@/db/workouts';

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams();
  const programId = Number(id);
  const router = useRouter();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [programName, setProgramName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!programId) return;

    const load = async () => {
      try {
        const programs = await getPrograms();
        const program = programs.find((p) => p.id === programId);
        if (program) setProgramName(program.name);
        const templateWorkouts = await getTemplateWorkoutsForProgram(programId);
        setWorkouts(templateWorkouts);
      } catch (err) {
        console.error('Failed to load program/workouts:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [programId]);

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
