import { useState } from "react";
import { CATEGORY_ICONS } from "../utils/storage";
import "./TransactionList.css";

function TransactionList({ transactions, onDelete }) {
  const [removingId, setRemovingId] = useState(null);

  const handleDelete = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      onDelete(id);
      setRemovingId(null);
    }, 300);
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return dateStr;
    }
  };

  if (!transactions.length) {
    return (
      <div className="txn-list">
        <h3 className="txn-list__title">📋 Transaction History</h3>
        <div className="txn-empty">
          <div className="txn-empty__icon">📭</div>
          <div className="txn-empty__title">No transactions yet</div>
          <div className="txn-empty__subtitle">Add your first income or expense above</div>
        </div>
      </div>
    );
  }

  return (
    <div className="txn-list" id="transaction-list">
      <h3 className="txn-list__title">📋 Transaction History</h3>
      <div className="txn-list__items">
        {transactions.map((txn) => (
          <div
            key={txn.id}
            className={`txn-item ${removingId === txn.id ? "txn-item--removing" : ""}`}
            id={`txn-${txn.id}`}
          >
            <div className={`txn-item__icon txn-item__icon--${txn.type}`}>
              {CATEGORY_ICONS[txn.category] || "📌"}
            </div>
            <div className="txn-item__details">
              <div className="txn-item__name">{txn.name}</div>
              <div className="txn-item__meta">
                <span className="txn-item__meta-tag">📅 {formatDate(txn.date)}</span>
                <span className="txn-item__meta-tag">🏷️ {txn.category}</span>
                <span className="txn-item__meta-tag">👤 {txn.person}</span>
              </div>
            </div>
            <div className={`txn-item__amount txn-item__amount--${txn.type}`}>
              {txn.type === "income" ? "+" : "-"}₹{txn.amount.toLocaleString("en-IN")}
            </div>
            <button
              className="txn-item__delete"
              onClick={() => handleDelete(txn.id)}
              title="Delete transaction"
              id={`btn-delete-${txn.id}`}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;
