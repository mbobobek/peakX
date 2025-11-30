export const getISODate = (date) => date.toISOString().split('T')[0];

export const getToday = () => getISODate(new Date());

export const getLast7Days = () => getLastNDays(7);

export const getLastNDays = (n) => {
  const days = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(getISODate(d));
  }
  return days;
};

export const getMonthMatrix = (year, month) => {
  // month is 0-based
  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7)); // start on Monday-like grid (Mon=0)

  const weeks = [];
  for (let w = 0; w < 6; w += 1) {
    const row = [];
    for (let d = 0; d < 7; d += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + w * 7 + d);
      row.push(getISODate(current));
    }
    weeks.push(row);
  }
  return weeks;
};

export const isConsecutive = (dateA, dateB) => {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diff = (b - a) / (1000 * 60 * 60 * 24);
  return diff === 1;
};

export const isBetween = (date, start, end) => {
  if (!date || !start || !end) return false;
  const d = new Date(date);
  const s = new Date(start);
  const e = new Date(end);
  return d >= s && d <= e;
};

export const daysBetween = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return diff >= 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
};

export const dateRange = (start, end) => {
  if (!start || !end) return [];
  const result = [];
  let current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    result.push(getISODate(current));
    current.setDate(current.getDate() + 1);
  }
  return result;
};
