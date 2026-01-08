import { StyleSheet } from 'react-native';

export const createProgramStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 48,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  sectionHeader: {
    marginTop: 12,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helperText: {
    opacity: 0.7,
    marginBottom: 4,
  },
  workoutCard: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  setRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  setInput: {
    flex: 1,
    marginBottom: 0,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: '#2563eb', // brighter blue for visibility
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Longer variant of the small button used for add-set to match add-workout size
  smallButtonFull: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
  },
  smallButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#0ea5e9', // changed to blue
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontWeight: '600',
    color: '#ffffff', // white on blue
  },
  inlineEditable: {
    borderWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginBottom: 8,
  },
});

export const doWorkoutStyles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  scrollContent: { gap: 16, paddingBottom: 48 },
  title: { marginBottom: 4 },
  subtitle: { marginBottom: 12, opacity: 0.8 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  exerciseName: { minWidth: 80, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, padding: 8, minWidth: 60 },
  completeButton: { marginTop: 24, paddingVertical: 14, borderRadius: 999, backgroundColor: '#0ea5e9', alignItems: 'center' },
  completeButtonDisabled: { opacity: 0.5 },
  completeButtonText: { fontWeight: '600', color: '#ffffff' },
});

export const myProgramsStyles = StyleSheet.create({
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

export const startWorkoutStyles = StyleSheet.create({
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
    backgroundColor: '#0ea5e9', // changed to blue
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  primaryButtonText: {
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
});

export const workoutLogStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  emptyText: {
    opacity: 0.8,
  },
  listContent: {
    gap: 12,
    paddingTop: 4,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
});

export const workoutSessionStyles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { marginBottom: 8 },
  subtitle: { opacity: 0.8, marginBottom: 8 },
  listContent: { gap: 12, paddingTop: 4 },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
});

export const homeStyles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 24,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  buttonGroup: {
    marginTop: 8,
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
    backgroundColor: '#0ea5e9', // changed to blue
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  primaryButtonText: {
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
