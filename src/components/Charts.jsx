import { useState, useMemo } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { CATEGORIES, CATEGORY_ICONS } from "../utils/storage";
import "./Charts.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

const chartColors = {
  income: "rgba(22, 163, 74, 0.8)",
  incomeBg: "rgba(22, 163, 74, 0.12)",
  expense: "rgba(239, 68, 68, 0.8)",
  expenseBg: "rgba(239, 68, 68, 0.12)",
  accent: "rgba(249, 115, 22, 0.9)",
  accentBg: "rgba(249, 115, 22, 0.12)",
};

const categoryColors = [
  "rgba(249, 115, 22, 0.8)",
  "rgba(239, 68, 68, 0.75)",
  "rgba(250, 204, 21, 0.8)",
  "rgba(22, 163, 74, 0.75)",
  "rgba(56, 189, 248, 0.75)",
  "rgba(139, 92, 246, 0.75)",
  "rgba(236, 72, 153, 0.75)",
  "rgba(168, 162, 158, 0.75)",
  "rgba(99, 102, 241, 0.75)",
];

const lightThemeOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      labels: {
        color: "#4a5568",
        font: { family: "Inter", size: 12 },
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      titleColor: "#1a1a2e",
      bodyColor: "#4a5568",
      borderColor: "rgba(0,0,0,0.1)",
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      titleFont: { family: "Inter", weight: "600" },
      bodyFont: { family: "Inter" },
    },
  },
  scales: {
    x: {
      ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } },
      grid: { color: "rgba(0,0,0,0.04)" },
    },
    y: {
      ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } },
      grid: { color: "rgba(0,0,0,0.04)" },
    },
  },
};

function Charts({ transactions }) {
  const [activeTab, setActiveTab] = useState("doughnut");

  // --- Category breakdown ---
  const categoryData = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    const labels = Object.keys(map);
    const data = Object.values(map);
    return {
      labels: labels.map((l) => `${CATEGORY_ICONS[l] || ""} ${l}`),
      datasets: [
        {
          data,
          backgroundColor: labels.map(
            (_, i) => categoryColors[i % categoryColors.length]
          ),
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    };
  }, [transactions]);

  // --- Monthly income vs expense bar ---
  const monthlyData = useMemo(() => {
    const months = {};
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7); // "2026-04"
      if (!months[month]) months[month] = { income: 0, expense: 0 };
      if (t.type === "income") months[month].income += t.amount;
      else months[month].expense += t.amount;
    });
    const sorted = Object.keys(months).sort();
    return {
      labels: sorted.map((m) => {
        const [y, mo] = m.split("-");
        return new Date(y, Number(mo) - 1).toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        });
      }),
      datasets: [
        {
          label: "Income",
          data: sorted.map((m) => months[m].income),
          backgroundColor: chartColors.income,
          borderRadius: 6,
        },
        {
          label: "Expense",
          data: sorted.map((m) => months[m].expense),
          backgroundColor: chartColors.expense,
          borderRadius: 6,
        },
      ],
    };
  }, [transactions]);

  // --- Balance trend line ---
  const trendData = useMemo(() => {
    const sortedTxns = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    let balance = 0;
    const points = sortedTxns.map((t) => {
      balance += t.type === "income" ? t.amount : -t.amount;
      return { date: t.date, balance };
    });
    return {
      labels: points.map((p) =>
        new Date(p.date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        })
      ),
      datasets: [
        {
          label: "Balance",
          data: points.map((p) => p.balance),
          borderColor: chartColors.accent,
          backgroundColor: chartColors.accentBg,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: chartColors.accent,
        },
      ],
    };
  }, [transactions]);

  if (!transactions.length) {
    return (
      <div className="charts" id="charts-panel">
        <div className="charts__header">
          <h3 className="charts__title">📊 Analytics</h3>
        </div>
        <div className="charts__empty">
          Add transactions to see your financial analytics
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "doughnut", label: "🍩 Categories" },
    { key: "bar", label: "📊 Monthly" },
    { key: "line", label: "📈 Trend" },
  ];

  return (
    <div className="charts" id="charts-panel">
      <div className="charts__header">
        <h3 className="charts__title">📊 Analytics</h3>
        <div className="charts__tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`charts__tab ${activeTab === tab.key ? "charts__tab--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
              id={`chart-tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="charts__canvas">
        {activeTab === "doughnut" && (
          <Doughnut
            data={categoryData}
            options={{
              ...lightThemeOptions,
              cutout: "60%",
              scales: undefined,
            }}
          />
        )}
        {activeTab === "bar" && (
          <Bar data={monthlyData} options={lightThemeOptions} />
        )}
        {activeTab === "line" && (
          <Line data={trendData} options={lightThemeOptions} />
        )}
      </div>
    </div>
  );
}

export default Charts;
