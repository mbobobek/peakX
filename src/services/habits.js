import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

const habitsCollection = (userId) => collection(db, 'users', userId, 'habits');

export async function getHabits(userId) {
  if (!userId) throw new Error('Missing userId');
  try {
    const snap = await getDocs(habitsCollection(userId));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[habits.js] getHabits error:', error);
    throw error;
  }
}

export async function createHabit(userId, habit) {
  if (!userId) throw new Error('Missing userId');
  try {
    const payload = {
      title: habit.title,
      category: habit.category,
      frequency: habit.frequency,
      createdAt: serverTimestamp(),
      history: {},
    };
    if (habit.frequency === 'custom') {
      if (habit.startDate) payload.startDate = habit.startDate;
      if (habit.endDate) payload.endDate = habit.endDate;
    }
    const ref = await addDoc(habitsCollection(userId), payload);
    return { id: ref.id, ...payload };
  } catch (error) {
    console.error('[habits.js] createHabit error:', error);
    throw error;
  }
}

export async function deleteHabit(userId, habitId) {
  if (!userId) throw new Error('Missing userId');
  if (!habitId) throw new Error('Missing habitId');
  try {
    await deleteDoc(doc(db, 'users', userId, 'habits', habitId));
  } catch (error) {
    console.error('[habits.js] deleteHabit error:', error);
    throw error;
  }
}

export async function updateHabit(userId, habitId, fields) {
  if (!userId) throw new Error('Missing userId');
  if (!habitId) throw new Error('Missing habitId');
  try {
    const ref = doc(db, 'users', userId, 'habits', habitId);
    await updateDoc(ref, fields);
  } catch (error) {
    console.error('[habits.js] updateHabit error:', error);
    throw error;
  }
}

export async function updateHabitHistory(userId, habitId, dateISO, status) {
  if (!userId) throw new Error('Missing userId');
  if (!habitId) throw new Error('Missing habitId');
  if (!dateISO) throw new Error('Missing dateISO');
  if (!status) throw new Error('Missing status');
  try {
    const ref = doc(db, 'users', userId, 'habits', habitId);
    await updateDoc(ref, { [`history.${dateISO}`]: status });
  } catch (error) {
    console.error('[habits.js] updateHabitHistory error:', error);
    throw error;
  }
}
