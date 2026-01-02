// app/my-programs.tsx
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  getProgramTemplates,
  ProgramTemplateRow,
  getWorkoutTemplatesForProgram,
  getSetTemplatesForWorkout,
  createProgram,
  createWorkout,
  addSetToWorkout,
  setCurrentProgram,
  getPrograms,
  getWorkoutsForProgram,
} from '@/utils/database';

export default function MyProgramsScreen() {
  const [programs, setPrograms] = useState<ProgramTemplateRow[]>([]);
  const [currentProgramName, setCurrentProgramName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingCurrent, setSettingCurrent] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const [templates, realPrograms] = await Promise.all([
          getProgramTemplates(),
          getPrograms(),
        ]);
        setPrograms(templates);
        const current = realPrograms.find(p => p.isCurrentProgram === 1);
        setCurrentProgramName(current ? current.name : null);
      } catch (err) {
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hasPrograms = programs.length > 0;

  const instantiateTemplateProgram = async (programTemplateId: number): Promise<number> => {
    // Copy template to real tables and return new program id
    const programTemplates = await getProgramTemplates();
    const template = programTemplates.find((p) => p.id === programTemplateId);
    if (!template) throw new Error('Template not found');
    await createProgram(template.name);
    const programs = await getPrograms();
    const newProgram = programs.find((p) => p.name === template.name);
    if (!newProgram) throw new Error('Failed to create program');
    const workoutTemplates = await getWorkoutTemplatesForProgram(programTemplateId);
    for (const workoutTemplate of workoutTemplates) {
      await createWorkout(newProgram.id, workoutTemplate.name);
      const workouts = await getWorkoutsForProgram(newProgram.id);
      const newWorkout = workouts.find((w) => w.name === workoutTemplate.name);
      if (!newWorkout) continue;
      const setTemplates = await getSetTemplatesForWorkout(workoutTemplate.id);
      for (const setTemplate of setTemplates) {
        await addSetToWorkout(
          newWorkout.id,
          setTemplate.exerciseName,
          setTemplate.weight,
          setTemplate.reps,
          new Date(),
          true // isTemplate = true for initial sets
        );
      }
    }
    return newProgram.id;
  };

  const handleSetCurrentProgram = async (templateId: number) => {
    setSettingCurrent(templateId);
    try {
      const newProgramId = await instantiateTemplateProgram(templateId);
      await setCurrentProgram(newProgramId);
      // Refresh both templates and real programs to update UI
      const [templates, realPrograms] = await Promise.all([
        getProgramTemplates(),
        getPrograms(),
      ]);
      setPrograms(templates);
      const current = realPrograms.find(p => p.isCurrentProgram === 1);
      setCurrentProgramName(current ? current.name : null);
    } catch (err) {
      console.error('Failed to set current program:', err);
    } finally {
      setSettingCurrent(null);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'My Programs' }} />

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          My Programs
        </ThemedText>

        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : !hasPrograms ? (
          <ThemedText style={styles.emptyText}>
            You don’t have any programs yet.{'\n'}
            Create your first one from the home screen.
          </ThemedText>
        ) : (
          <FlatList
            data={programs}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isCurrent = item.name === currentProgramName;
              return (
                <ThemedView style={styles.card}>
                  <TouchableOpacity
                    onPress={() => router.push(`/programs/${item.id}`)}
                  >
                    <ThemedText type="defaultSemiBold">
                      {item.name}
                      {isCurrent && (
                        <ThemedText style={styles.currentIndicator}>  (Current)</ThemedText>
                      )}
                    </ThemedText>
                  </TouchableOpacity>
                  {!isCurrent && (
                    <TouchableOpacity
                      style={styles.setCurrentButton}
                      onPress={() => handleSetCurrentProgram(item.id)}
                      disabled={settingCurrent === item.id}
                    >
                      <ThemedText style={styles.setCurrentButtonText}>
                        {settingCurrent === item.id ? 'Setting...' : 'Set as Current'}
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </ThemedView>
              );
            }}
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
    marginBottom: 4,
  },
  setCurrentButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  setCurrentButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  currentIndicator: {
    fontSize: 14,
    color: '#4caf50',
  },
});