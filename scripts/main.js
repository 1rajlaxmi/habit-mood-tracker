import {
  state,
  addHabit,
  toggleHabit,
  setMood,
  getToday,
} from "./state.js";

import {
  saveState,
  loadState
} from "./storage.js";

import {
  renderHabitList,
  renderMoods,
  renderTodaySummary,
  renderWeeklyDashboard,
} from "./ui.js";

// -----------------------------
// INIT
// -----------------------------
loadState();

document.getElementById("current-date").textContent = getToday();

// initial render
refreshUI();

// -----------------------------
// EVENT: ADD HABIT
// -----------------------------
document.getElementById("add-habit-btn").onclick = () => {
  const input = document.getElementById("habit-input");
  addHabit(input.value);
  input.value = "";
  saveAndRender();
};

// -----------------------------
// HANDLE UI UPDATES
// -----------------------------
function refreshUI() {
  // habits
  renderHabitList(id => {
    toggleHabit(id);
    saveAndRender();
  });

  // moods
  const today = getToday();
  const mood = state.entriesByDate[today]?.mood || "🙂";
  renderMoods(mood, m => {
    setMood(m);
    saveAndRender();
  });

  renderTodaySummary();
  renderWeeklyDashboard();
}

function saveAndRender() {
  saveState();
  refreshUI();
}
