import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getExercises, createExercise, Exercise } from '@/db/exercises';
import { myProgramsStyles as styles } from '../styles/pageStyles';

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const list = await getExercises();
        setExercises(list);
      } catch (err) {
        console.error('Failed to load exercises', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const ex = await createExercise(newName.trim());
      if (ex) setExercises((prev) => [ex, ...prev]);
      setNewName('');
    } catch (err) {
      console.error('Failed to create exercise', err);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Exercises' }} />

      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>Exercises</ThemedText>
        <View style={{ marginBottom: 12 }}>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="New exercise name"
            style={{ borderWidth: 1, borderRadius: 8, padding: 8 }}
          />
          <TouchableOpacity onPress={handleAdd} style={[styles.setCurrentButton, { marginTop: 8 }]}> 
            <ThemedText style={styles.setCurrentButtonText}>Add Exercise</ThemedText>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : exercises.length === 0 ? (
          <ThemedText style={styles.emptyText}>No exercises yet.</ThemedText>
        ) : (
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText>{item.name}</ThemedText>
              </ThemedView>
            )}
          />
        )}
      </ThemedView>
    </>
  );
}
