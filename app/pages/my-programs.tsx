// app/my-programs.tsx
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPrograms, setCurrentProgram, Program } from '@/db/programs';

export default function MyProgramsScreen() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [currentProgramId, setCurrentProgramId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingCurrent, setSettingCurrent] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const programs = await getPrograms();
        setPrograms(programs);
        const current = programs.find(p => p.isCurrentProgram === 1);
        setCurrentProgramId(current ? current.id : null);
      } catch (err) {
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const hasPrograms = programs.length > 0;

  const handleSetCurrentProgram = async (programId: number) => {
    setSettingCurrent(programId);
    try {
      await setCurrentProgram(programId);
      const programs = await getPrograms();
      setPrograms(programs);
      const current = programs.find(p => p.isCurrentProgram === 1);
      setCurrentProgramId(current ? current.id : null);
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
          <ThemedText style={styles.emptyText}>Loading...</ThemedText>
        ) : !hasPrograms ? (
          <ThemedText style={styles.emptyText}>
            You don’t have any programs yet.{"\n"}
            Create your first one from the home screen.
          </ThemedText>
        ) : (
          <FlatList
            data={programs}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isCurrent = item.id === currentProgramId;
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