import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

const habitsCol = (userId) => collection(db, 'users', userId, 'habits');

export async function createHabit(userId, habitData) {
  if (!userId) throw new Error('Missing userId');
  const payload = {
    title: habitData.title,
    category: habitData.category || 'General',
    frequency: habitData.frequency || 'daily',
    createdAt: Date.now(),
    history: {},
    userId,
  };
  const ref = await addDoc(habitsCol(userId), payload);
  return { id: ref.id, ...payload };
}

export async function getHabits(userId) {
  if (!userId) throw new Error('Missing userId');
  const snap = await getDocs(habitsCol(userId));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateHabit(userId, habitId, updatedData) {
  if (!userId || !habitId) throw new Error('Missing userId or habitId');
  const ref = doc(db, 'users', userId, 'habits', habitId);
  await updateDoc(ref, updatedData);
  return true;
}

export async function deleteHabit(userId, habitId) {
  if (!userId || !habitId) throw new Error('Missing userId or habitId');
  const ref = doc(db, 'users', userId, 'habits', habitId);
  await deleteDoc(ref);
  return true;
}

export async function updateHabitHistory(userId, habitId, dateString, status) {
  if (!userId || !habitId || !dateString || !status) throw new Error('Missing params');
  const ref = doc(db, 'users', userId, 'habits', habitId);
  await updateDoc(ref, {
    [`history.${dateString}`]: status,
  });
  return true;
}
