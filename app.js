const grid = document.querySelector("#week-grid");
const count = document.querySelector("#run-count");
const form = document.querySelector("#run-form");
const noteInput = document.querySelector("#run-note");
const hint = document.querySelector("#form-hint");
const today = new Date();
const monday = new Date(today);
const dayOffset = (today.getDay() + 6) % 7;
monday.setDate(today.getDate() - dayOffset);
monday.setHours(0, 0, 0, 0);
const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const week = Array.from({ length: 7 }, (_, index) => {
  const date = new Date(monday);
  date.setDate(monday.getDate() + index);
  return date;
});
const storageKey = `run-better-${dateKey(monday)}`;
let runs = JSON.parse(localStorage.getItem(storageKey) || "{}");
const shortDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
function render() {
  grid.replaceChildren();
  week.forEach((date, index) => {
    const key = dateKey(date);
    const card = document.createElement("div");
    card.className = `day-card${key === dateKey(today) ? " today" : ""}`;
    const dayName = document.createElement("span");
    dayName.className = "day-name";
    dayName.textContent = shortDays[index];
    const dayDate = document.createElement("span");
    dayDate.className = "day-date";
    dayDate.textContent = date.getDate();
    card.append(dayName, dayDate);
    if (runs[key]) {
      const dot = document.createElement("span");
      dot.className = "run-dot";
      dot.textContent = "✓";
      dot.title = runs[key];
      dot.setAttribute("aria-label", `Run logged: ${runs[key] || "well done"}`);
      card.append(dot);
    }
    grid.append(card);
  });
  count.textContent = Object.keys(runs).length;
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const key = dateKey(today);
  if (runs[key]) {
    hint.textContent = "You already logged a run for today. Come back after your next one.";
    return;
  }
  runs[key] = noteInput.value.trim();
  localStorage.setItem(storageKey, JSON.stringify(runs));
  noteInput.value = "";
  hint.textContent = "Run logged. Nice work showing up for yourself.";
  render();
});
render();
