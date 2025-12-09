import { state, getTodaySummary, getWeeklySummary } from "./state.js";

// -----------------------------
// RENDER HABITS
// -----------------------------
export function renderHabitList(onToggle) {
  const container = document.getElementById("habit-list");
  container.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const entry = state.entriesByDate[today] || { completedHabits: [] };

  state.habits.forEach(habit => {
    const isDone = entry.completedHabits.includes(habit.id);

    const div = document.createElement("div");
    div.className =
      "flex items-center justify-between bg-slate-700 px-3 py-2 rounded-lg";

    div.innerHTML = `
      <p>${habit.name}</p>
      <button class="px-3 py-1 rounded-lg ${isDone ? "bg-green-600" : "bg-blue-600"}">
        ${isDone ? "Done" : "Mark"}
      </button>
    `;

    div.querySelector("button").addEventListener("click", () => onToggle(habit.id));

    container.appendChild(div);
  });
}

// -----------------------------
// RENDER MOOD BUTTONS
// -----------------------------
export function renderMoods(selectedMood, onSelect) {
  const buttons = document.querySelectorAll(".mood-btn");

  buttons.forEach(btn => {
    const mood = btn.textContent.trim();

    btn.className =
      `mood-btn text-3xl transition p-1 rounded ${
        mood === selectedMood ? "bg-blue-600" : "bg-slate-700"
      }`;

    btn.onclick = () => onSelect(mood);
  });
}

// -----------------------------
// RENDER SUMMARY (TODAY)
// -----------------------------
export function renderTodaySummary() {
  const summary = getTodaySummary();
  document.getElementById("completed-count").textContent = summary.completedCount;
  document.getElementById("today-mood").textContent = summary.mood;
}

// -----------------------------
// RENDER WEEKLY DASHBOARD
// -----------------------------
export function renderWeeklyDashboard() {
  const { percentage, commonMood } = getWeeklySummary();
  document.getElementById("weekly-habit-progress").style.width = percentage + "%";
  document.getElementById("common-mood").textContent = commonMood;
}

import { getStreaks, getHeatmapData } from "./state.js";

export function renderStreaks() {
  const { currentStreak, longestStreak } = getStreaks();
  
  document.getElementById("current-streak").textContent = currentStreak;
  document.getElementById("longest-streak").textContent = longestStreak;
}

export function renderHistoryList() {
  const container = document.getElementById("history-list");
  container.innerHTML = "";

  const dates = Object.keys(state.entriesByDate).sort().reverse();

  dates.forEach(date => {
    const entry = state.entriesByDate[date];
    const completed = entry.completedHabits.length;

    const div = document.createElement("div");
    div.className =
      "flex justify-between bg-slate-700 px-3 py-2 rounded-lg";

    div.innerHTML = `
      <p>${date}</p>
      <p>${entry.mood}</p>
      <p class="font-bold">${completed} ✨</p>
    `;

    container.appendChild(div);
  });
}

export function renderHeatmap() {
  const container = document.getElementById("heatmap");
  container.innerHTML = "";

  const data = getHeatmapData();

  data.forEach(entry => {
    const intensity = Math.min(entry.count, 4); // cap color levels

    const colors = [
      "bg-slate-700",
      "bg-green-700",
      "bg-green-600",
      "bg-green-500",
      "bg-green-400"
    ];

    const div = document.createElement("div");
    div.className = `w-6 h-6 rounded ${colors[intensity]} tooltip`;
    div.title = `${entry.date}: ${entry.count} habits completed`;

    container.appendChild(div);
  });
}
