import { state, getTodaySummary, getWeeklySummary } from "./state.js";

// -----------------------------
// RENDER HABITS
// -----------------------------
export function renderHabitList(onToggle, onDelete) {
  const container = document.getElementById("habit-list");
  container.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const entry = state.entriesByDate[today] || { completedHabits: [] };

  state.habits.forEach((habit) => {
    const isDone = entry.completedHabits.includes(habit.id);

    const div = document.createElement("div");
    div.className =
      "flex items-center justify-between bg-slate-700 px-3 py-2 rounded-lg";

    div.innerHTML = `
  <p>${habit.name}</p>
  
  <div class="flex items-center gap-2">
    <button class="mark-btn px-3 py-1 rounded-lg ${
      isDone ? "bg-green-600" : "bg-blue-600"
    }">
      ${isDone ? "Done" : "Mark"}
    </button>

    <button class="delete-btn px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700">
      ✖
    </button>
  </div>
`;

    // Mark habit event
    div
      .querySelector(".mark-btn")
      .addEventListener("click", () => onToggle(habit.id));

    // Delete habit event
    div
      .querySelector(".delete-btn")
      .addEventListener("click", () => onDelete(habit.id));

    container.appendChild(div);
  });
}

// -----------------------------
// RENDER MOOD BUTTONS
// -----------------------------
export function renderMoods(selectedMood, onSelect) {
  const buttons = document.querySelectorAll(".mood-btn");

  buttons.forEach((btn) => {
   const mood = btn.querySelector("img").src;

   btn.className =
  `mood-btn mood-hover text-3xl p-1 rounded ${
    mood === selectedMood ? "bg-blue-600 mood-selected" : "bg-slate-700"
  }`;

    btn.onclick = () => onSelect(mood);
  });
}

// -----------------------------
// RENDER SUMMARY (TODAY)
// -----------------------------
export function renderTodaySummary() {
  const summary = getTodaySummary();
  document.getElementById("completed-count").textContent =
    summary.completedCount;
  document.getElementById("today-mood").innerHTML =
  summary.mood
    ? `<img src="${summary.mood}" class="w-7 h-7 inline-block">`
    : `<span class="text-slate-500">No mood</span>`;


}

// -----------------------------
// RENDER WEEKLY DASHBOARD
// -----------------------------
export function renderWeeklyDashboard() {
  const { percentage, commonMood } = getWeeklySummary();
  document.getElementById("weekly-habit-progress").style.width =
    percentage + "%";
  document.getElementById("common-mood").innerHTML =
  commonMood
    ? `<img src="${commonMood}" class="w-8 h-8 inline-block">`
    : `<span class="text-slate-500">--</span>`;


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

  dates.forEach((date) => {
    const entry = state.entriesByDate[date];
    const completed = entry.completedHabits.length;

    const div = document.createElement("div");
    div.className = "flex justify-between bg-slate-700 px-3 py-2 rounded-lg";

    div.innerHTML = `
      <p>${date}</p>
      <p><img src="${entry.mood}" class="w-6 h-6"></p>

      <p class="font-bold">${completed} ✨</p>
    `;

    container.appendChild(div);
  });
}

export function renderHeatmap() {
  const container = document.getElementById("heatmap");
  container.innerHTML = "";

  const data = getHeatmapData();

  data.forEach((entry) => {
    const intensity = Math.min(entry.count, 4); // cap color levels

    const colors = [
      "bg-slate-700",
      "bg-green-700",
      "bg-green-600",
      "bg-green-500",
      "bg-green-400",
    ];

    const div = document.createElement("div");
    div.className = `w-6 h-6 rounded ${colors[intensity]} tooltip`;
   const moodName = entry.mood.split("/").pop().replace(".svg", "");
div.title = `${entry.date} — ${moodName} — ${entry.count} habits`;

    container.appendChild(div);
  });
}
