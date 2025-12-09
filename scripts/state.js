// -----------------------------
// STATE STRUCTURE
// -----------------------------
export let state = {
  habits: [],
  entriesByDate: {} // ex: { "2025-01-23": { completedHabits: [], mood: "🙂" } }
};

// -----------------------------
// HELPERS
// -----------------------------
export function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getTodayEntry() {
  const today = getToday();
  if (!state.entriesByDate[today]) {
    state.entriesByDate[today] = { completedHabits: [], mood: "🙂" };
  }
  return state.entriesByDate[today];
}

// -----------------------------
// HABIT LOGIC
// -----------------------------
export function addHabit(name) {
  if (!name.trim()) return;
  const habit = { id: Date.now(), name };
  state.habits.push(habit);
}

export function toggleHabit(habitId) {
  const entry = getTodayEntry();
  const index = entry.completedHabits.indexOf(habitId);

  if (index === -1) entry.completedHabits.push(habitId);
  else entry.completedHabits.splice(index, 1);
}

// -----------------------------
// MOOD LOGIC
// -----------------------------
export function setMood(mood) {
  const entry = getTodayEntry();
  entry.mood = mood;
}

// -----------------------------
// SUMMARY LOGIC
// -----------------------------
export function getTodaySummary() {
  const entry = getTodayEntry();
  return {
    completedCount: entry.completedHabits.length,
    mood: entry.mood
  };
}

export function getWeeklySummary() {
  const dates = Object.keys(state.entriesByDate).slice(-7);
  let totalHabits = 0;
  let totalCompleted = 0;

  const moodCount = {};

  for (const d of dates) {
    const entry = state.entriesByDate[d];
    totalCompleted += entry.completedHabits.length;
    totalHabits += state.habits.length;

    // count moods
    moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
  }

  const percentage = totalHabits ? Math.round((totalCompleted / totalHabits) * 100) : 0;

  const commonMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "🙂";

  return { percentage, commonMood };
}
export function getStreaks() {
  const dates = Object.keys(state.entriesByDate).sort();

  let currentStreak = 0;
  let longestStreak = 0;

  let prevDate = null;

  for (const date of dates) {
    const entry = state.entriesByDate[date];
    const completed = entry.completedHabits.length > 0;

    if (completed) {
      if (prevDate) {
        const diff =
          (new Date(date) - new Date(prevDate)) / (1000 * 60 * 60 * 24);

        if (diff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }

    prevDate = date;
  }

  return { currentStreak, longestStreak };
}

export function getHeatmapData() {
  const entries = state.entriesByDate;

  return Object.entries(entries).map(([date, entry]) => ({
    date,
    count: entry.completedHabits.length,
  }));
}
