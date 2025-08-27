// utils/dates.js
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  // Return YYYY-MM-DD string
  return new Date(date).toISOString().split("T")[0];
}

module.exports = { addDays, formatDate };
