import { useState, useMemo } from "react";
import { CATEGORY_ICONS } from "../utils/storage";
import "./PersonHistory.css";

function PersonHistory({ transactions }) {
  const [expandedPerson, setExpandedPerson] = useState(null);

  const personData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      if (!map[t.person]) {
        map[t.person] = { income: 0, expense: 0, transactions: [] };
      }
      if (t.type === "income") map[t.person].income += t.amount;
      else map[t.person].expense += t.amount;
      map[t.person].transactions.push(t);
    });

    return Object.entries(map)
      .map(([name, data]) => ({
        name,
        ...data,
        net: data.income - data.expense,
        transactions: data.transactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        ),
      }))
      .sort((a, b) => b.transactions.length - a.transactions.length);
  }, [transactions]);

  if (!transactions.length) {
    return (
      <div className="person-history" id="person-history">
        <h3 className="person-history__title">👥 Expense by Person</h3>
        <div className="person-history__empty">
          No person data to display yet
        </div>
      </div>
    );
  }

  const getInitials = (name) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="person-history" id="person-history">
      <h3 className="person-history__title">👥 Expense by Person</h3>
      <div className="person-history__list">
        {personData.map((person) => {
          const isExpanded = expandedPerson === person.name;
          const total = person.income + person.expense;
          const incomePct = total > 0 ? (person.income / total) * 100 : 50;
          const expensePct = total > 0 ? (person.expense / total) * 100 : 50;

          return (
            <div key={person.name} className="person-card" id={`person-${person.name}`}>
              <div
                className="person-card__header"
                onClick={() =>
                  setExpandedPerson(isExpanded ? null : person.name)
                }
              >
                <div className="person-card__avatar">
                  {getInitials(person.name)}
                </div>
                <div className="person-card__info">
                  <div className="person-card__name">{person.name}</div>
                  <div className="person-card__stats">
                    <span className="person-card__stat--income">
                      ↑ ₹{person.income.toLocaleString("en-IN")}
                    </span>
                    <span className="person-card__stat--expense">
                      ↓ ₹{person.expense.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
                <div
                  className={`person-card__net ${
                    person.net >= 0
                      ? "person-card__net--positive"
                      : "person-card__net--negative"
                  }`}
                >
                  {person.net >= 0 ? "+" : "-"}₹
                  {Math.abs(person.net).toLocaleString("en-IN")}
                </div>
                <span
                  className={`person-card__chevron ${
                    isExpanded ? "person-card__chevron--open" : ""
                  }`}
                >
                  ▼
                </span>
              </div>

              {isExpanded && (
                <div className="person-card__body">
                  <div className="person-card__bar">
                    <div
                      className="person-card__bar-fill--income"
                      style={{ width: `${incomePct}%` }}
                    />
                    <div
                      className="person-card__bar-fill--expense"
                      style={{ width: `${expensePct}%` }}
                    />
                  </div>
                  <div className="person-card__txn-list">
                    {person.transactions.slice(0, 8).map((txn) => (
                      <div key={txn.id} className="person-card__txn">
                        <span className="person-card__txn-name">
                          {CATEGORY_ICONS[txn.category] || "📌"} {txn.name}
                        </span>
                        <span
                          className={`person-card__txn-amount--${txn.type}`}
                        >
                          {txn.type === "income" ? "+" : "-"}₹
                          {txn.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                    {person.transactions.length > 8 && (
                      <div
                        className="person-card__txn"
                        style={{ color: "var(--text-muted)", fontStyle: "italic" }}
                      >
                        +{person.transactions.length - 8} more transactions
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PersonHistory;
