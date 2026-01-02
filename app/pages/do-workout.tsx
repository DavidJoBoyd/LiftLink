import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { addSetToWorkout, getProgramTemplates, getSetTemplatesForWorkout, getWorkoutTemplatesForProgram, ProgramTemplateRow, SetTemplateRow, WorkoutTemplateRow } from '@/utils/database';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function DoWorkoutScreen() {
  const [currentProgramTemplate, setCurrentProgramTemplate] = useState<ProgramTemplateRow | null>(null);
  const [currentWorkoutTemplate, setCurrentWorkoutTemplate] = useState<WorkoutTemplateRow | null>(null);
  const [sets, setSets] = useState<SetTemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const programTemplates = await getProgramTemplates();
        const programTemplate = programTemplates.length > 0 ? programTemplates[0] : null;
        setCurrentProgramTemplate(programTemplate);
        if (programTemplate) {
          const workoutTemplates = await getWorkoutTemplatesForProgram(programTemplate.id);
          const workoutTemplate = workoutTemplates.length > 0 ? workoutTemplates[0] : null;
          setCurrentWorkoutTemplate(workoutTemplate);
          if (workoutTemplate) {
            const setTemplates = await getSetTemplatesForWorkout(workoutTemplate.id);
            setSets(setTemplates);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateSetField = (setId: number, field: keyof Omit<SetTemplateRow, 'id' | 'workoutTemplateId'>, value: string) => {
    setSets(prev => prev.map(s =>
      s.id === setId ? { ...s, [field]: value } : s
    ));
  };

  const handleCompleteWorkout = async () => {
    if (!currentWorkoutTemplate) return;
    setSaving(true);
    try {
      for (const set of sets) {
        await addSetToWorkout(
          currentWorkoutTemplate.id,
          set.exerciseName,
          parseFloat(set.weight.toString()),
          parseInt(set.reps.toString(), 10),
          new Date(),
          false // isTemplate = false
        );
      }
      router.push('/workout-log');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Do Workout' }} />
      <ThemedView style={styles.container}>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : !currentProgramTemplate || !currentWorkoutTemplate ? (
          <ThemedText>No current program or workout found.</ThemedText>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedText type="title" style={styles.title}>{currentProgramTemplate.name}</ThemedText>
            <ThemedText style={styles.subtitle}>{currentWorkoutTemplate.name}</ThemedText>
            {sets.map(set => (
              <View key={set.id} style={styles.setRow}>
                <ThemedText style={styles.exerciseName}>{set.exerciseName}</ThemedText>
                <TextInput
                  style={styles.input}
                  value={set.weight.toString()}
                  keyboardType="numeric"
                  onChangeText={text => updateSetField(set.id, 'weight', text)}
                  placeholder="Weight"
                />
                <TextInput
                  style={styles.input}
                  value={set.reps.toString()}
                  keyboardType="numeric"
                  onChangeText={text => updateSetField(set.id, 'reps', text)}
                  placeholder="Reps"
                />
              </View>
            ))}
            <TouchableOpacity
              style={[styles.completeButton, saving && styles.completeButtonDisabled]}
              onPress={handleCompleteWorkout}
              disabled={saving}
            >
              <ThemedText style={styles.completeButtonText}>
                {saving ? 'Saving...' : 'Complete Workout'}
              </ThemedText>
            </TouchableOpacity>
          </ScrollView>
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  scrollContent: { gap: 16, paddingBottom: 48 },
  title: { marginBottom: 4 },
  subtitle: { marginBottom: 12, opacity: 0.8 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  exerciseName: { minWidth: 80, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, padding: 8, minWidth: 60 },
  completeButton: { marginTop: 24, paddingVertical: 14, borderRadius: 999, backgroundColor: '#22c55e', alignItems: 'center' },
  completeButtonDisabled: { opacity: 0.5 },
  completeButtonText: { fontWeight: '600', color: '#022c22' },
});
