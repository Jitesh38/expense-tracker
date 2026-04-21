import { useState } from "react";
import { CATEGORIES, generateId } from "../utils/storage";
import "./TransactionForm.css";

function TransactionForm({ onAdd }) {
  const [type, setType] = useState("income");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [amount, setAmount] = useState("");
  const [person, setPerson] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) {
      return;
    }

    const transaction = {
      id: generateId(),
      type,
      name: name.trim(),
      category,
      amount: Number(amount),
      date: new Date().toISOString().split("T")[0],
      person: person.trim() || "General",
    };

    onAdd(transaction);
    setName("");
    setAmount("");
    setPerson("");
  };

  return (
    <form className="txn-form" onSubmit={handleSubmit} id="transaction-form">
      <h2 className="txn-form__title">➕ Add Transaction</h2>

      <div className="txn-form__type-toggle">
        <button
          type="button"
          className={`txn-form__type-btn ${type === "income" ? "txn-form__type-btn--active-income" : ""}`}
          onClick={() => setType("income")}
          id="btn-type-income"
        >
          📈 Income
        </button>
        <button
          type="button"
          className={`txn-form__type-btn ${type === "expense" ? "txn-form__type-btn--active-expense" : ""}`}
          onClick={() => setType("expense")}
          id="btn-type-expense"
        >
          📉 Expense
        </button>
      </div>

      <div className="txn-form__grid">
        <div className="txn-form__group">
          <label className="txn-form__label" htmlFor="txn-name">Transaction Name</label>
          <input
            className="txn-form__input"
            type="text"
            id="txn-name"
            placeholder="e.g. Groceries, Salary..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="txn-form__group">
          <label className="txn-form__label" htmlFor="txn-category">Category</label>
          <select
            className="txn-form__select"
            id="txn-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="txn-form__group">
          <label className="txn-form__label" htmlFor="txn-amount">Amount (₹)</label>
          <input
            className="txn-form__input"
            type="number"
            id="txn-amount"
            placeholder="0"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="txn-form__group">
          <label className="txn-form__label" htmlFor="txn-person">Person</label>
          <input
            className="txn-form__input"
            type="text"
            id="txn-person"
            placeholder="Who made this?"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`txn-form__submit txn-form__submit--${type}`}
          id="btn-add-transaction"
        >
          Add {type === "income" ? "Income" : "Expense"}
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;
