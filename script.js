// LeetCode: fetch real-time calendar data and render heatmap
const LEETCODE_USER = 'saymedgm';
const LEETCODE_API = `https://leetcode-api-pied.vercel.app/user/${LEETCODE_USER}/calendar?year=2025`;

async function fetchLeetCodeCalendar() {
  try {
    const res = await fetch(LEETCODE_API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.submissionCalendar || {};
  } catch (err) {
    console.warn('LeetCode calendar fetch failed:', err);
    return {};
  }
}

function timestampToGridPos(ts) {
  const date = new Date(ts * 1000);
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const daysDiff = Math.floor((date - startOfYear) / 86400000);
  const week = Math.floor(daysDiff / 7);
  const day = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return { week, day };
}

function renderLeetCodeGrid(calendar) {
  const lcGrid = document.querySelector('#leetcode');
  if (!lcGrid) return;

  const gridData = Array(53).fill(null).map(() => Array(7).fill(0));
  for (const [ts, count] of Object.entries(calendar)) {
    const { week, day } = timestampToGridPos(parseInt(ts));
    if (week >= 0 && week < 53) gridData[week][day] = count;
  }

  const maxCount = Math.max(...Object.values(calendar), 1);

  for (let week = 0; week < 53; week++) {
    for (let day = 0; day < 7; day++) {
      const cell = document.createElement('i');
      const count = gridData[week][day];
      if (count === 0) {
        cell.className = '';
      } else if (count >= maxCount * 0.75) cell.className = 'l4';
      else if (count >= maxCount * 0.5) cell.className = 'l3';
      else if (count >= maxCount * 0.25) cell.className = 'l2';
      else cell.className = 'l1';
      lcGrid.append(cell);
    }
  }
}

// Initialize LeetCode chart
(async () => {
  const calendar = await fetchLeetCodeCalendar();
  renderLeetCodeGrid(calendar);
})();

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('.theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
