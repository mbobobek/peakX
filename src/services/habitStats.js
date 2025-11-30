import { isConsecutive, getToday } from '../utils/dateUtils';

export const calculateStreak = (history = {}) => {
  const today = getToday();
  const dates = Object.keys(history)
    .filter((d) => history[d] === 'done')
    .sort((a, b) => new Date(a) - new Date(b));

  if (dates.length === 0) return 0;

  let streak = 0;
  let currentDay = today;

  while (history[currentDay] === 'done') {
    streak += 1;
    const prev = new Date(currentDay);
    prev.setDate(prev.getDate() - 1);
    currentDay = prev.toISOString().split('T')[0];
  }

  return streak;
};

export const calculateLongestStreak = (history = {}) => {
  const doneDates = Object.keys(history)
    .filter((d) => history[d] === 'done')
    .sort((a, b) => new Date(a) - new Date(b));

  if (doneDates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < doneDates.length; i += 1) {
    if (isConsecutive(doneDates[i - 1], doneDates[i])) {
      current += 1;
    } else {
      longest = Math.max(longest, current);
      current = 1;
    }
  }
  longest = Math.max(longest, current);
  return longest;
};

export const calculateSuccessRate = (history = {}) => {
  const entries = Object.values(history);
  if (!entries.length) return 0;
  const doneCount = entries.filter((v) => v === 'done').length;
  return Math.round((doneCount / entries.length) * 100);
};
