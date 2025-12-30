// app/my-programs.tsx
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPrograms, setCurrentProgram, type ProgramRow } from '@/utils/database';

export default function MyProgramsScreen() {
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const rows = await getPrograms();
        setPrograms(rows);
      } catch (err) {
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const hasPrograms = programs.length > 0;
  const [settingCurrent, setSettingCurrent] = useState<number|null>(null);

  const handleSetCurrentProgram = async (id: number) => {
    setSettingCurrent(id);
    await setCurrentProgram(id);
    const rows = await getPrograms();
    setPrograms(rows);
    setSettingCurrent(null);
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
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/programs/${item.id}`)}
              >
                <ThemedText type="defaultSemiBold">
                  {item.name}
                  {item.isCurrentProgram === 1 && (
                    <ThemedText style={styles.currentIndicator}>  (Current)</ThemedText>
                  )}
                </ThemedText>
                  {item.isCurrentProgram !== 1 && (
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
              </TouchableOpacity>
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
  currentIndicator: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
    setCurrentButton: {
      marginTop: 8,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: '#22c55e',
      alignItems: 'center',
    },
    setCurrentButtonText: {
      fontWeight: '600',
      color: '#022c22',
    },
});