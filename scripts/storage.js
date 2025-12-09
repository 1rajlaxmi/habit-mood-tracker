import { state } from "./state.js";

const KEY = "habit_mood_data";

export function saveState() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadState() {
  const saved = localStorage.getItem(KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed); // merge saved data into state
  }
}
