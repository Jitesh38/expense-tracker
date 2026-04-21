const STORAGE_KEY = "expense_tracker_data";
const OLD_KEY = "obj";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export const CATEGORY_ICONS = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "📄",
  Entertainment: "🎬",
  Salary: "💼",
  Freelance: "💻",
  Investment: "📈",
  Other: "📌",
};

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function migrateOldData(oldData) {
  if (!Array.isArray(oldData)) return [];
  return oldData.map((item) => {
    // Old format: [type, event, amount, date]
    const [type, name, amount, dateStr] = item;
    // Parse old date format "21-4" to ISO
    let isoDate;
    try {
      const parts = dateStr.split("-");
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = new Date().getFullYear();
      isoDate = `${year}-${month}-${day}`;
    } catch {
      isoDate = new Date().toISOString().split("T")[0];
    }

    return {
      id: generateId(),
      type: type.toLowerCase(),
      name: name || "Unknown",
      category: "Other",
      amount: Number(amount) || 0,
      date: isoDate,
      person: "General",
    };
  });
}

export function loadTransactions() {
  // Check for new format first
  const newData = localStorage.getItem(STORAGE_KEY);
  if (newData) {
    try {
      return JSON.parse(newData);
    } catch {
      return [];
    }
  }

  // Check for old format and migrate
  const oldData = localStorage.getItem(OLD_KEY);
  if (oldData) {
    try {
      const parsed = JSON.parse(oldData);
      const migrated = migrateOldData(parsed);
      // Save in new format
      saveTransactions(migrated);
      // Remove old key
      localStorage.removeItem(OLD_KEY);
      return migrated;
    } catch {
      return [];
    }
  }

  return [];
}

export function saveTransactions(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearAllTransactions() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(OLD_KEY);
}
