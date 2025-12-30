import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPrograms, ProgramRow, setCurrentProgram } from '@/utils/database';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CurrentProgramScreen() {
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  // No need for local currentProgramId, use isCurrentProgram from DB
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      const allPrograms = await getPrograms();
      setPrograms(allPrograms);
      setLoading(false);
    };
    fetchPrograms();
  }, []);

  const handleSetCurrentProgram = async (id: number) => {
    setLoading(true);
    await setCurrentProgram(id);
    const allPrograms = await getPrograms();
    setPrograms(allPrograms);
    setLoading(false);
  };

  const currentProgram = programs.find(p => p.isCurrentProgram === 1) || null;
  const otherPrograms = programs.filter(p => p.isCurrentProgram !== 1);

  return (
    <>
      <Stack.Screen options={{ title: 'Current Program' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>
          Current Program
        </ThemedText>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : currentProgram ? (
          <View style={{ marginBottom: 24 }}>
            <ThemedText style={styles.subtitle}>{currentProgram.name}</ThemedText>
            {/* Add more summary info here if available */}
          </View>
        ) : (
          <ThemedText style={styles.emptyText}>
            You don’t have a current program set.
          </ThemedText>
        )}
        <ThemedText style={{ marginBottom: 8, fontWeight: '600' }}>
          All Programs
        </ThemedText>
        <FlatList
          data={otherPrograms}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.programItem}>
              <ThemedText>{item.name}</ThemedText>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSetCurrentProgram(item.id)}
              >
                <ThemedText style={styles.buttonText}>
                  Set as Current
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<ThemedText>No other programs found.</ThemedText>}
        />
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
    fontSize: 18,
    marginBottom: 4,
  },
  emptyText: {
    opacity: 0.8,
    marginBottom: 12,
  },
  programItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  button: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#22c55e',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    color: '#022c22',
  },
});
  // This file has been removed as requested.
