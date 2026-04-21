import { useState, useEffect, useMemo, useCallback } from "react";
import {
  loadTransactions,
  saveTransactions,
  clearAllTransactions,
} from "./utils/storage";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import FilterBar from "./components/FilterBar";
import TransactionList from "./components/TransactionList";
import Charts from "./components/Charts";
import PersonHistory from "./components/PersonHistory";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    category: "all",
    person: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Load data on mount
  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  // Save whenever data changes
  useEffect(() => {
    if (transactions.length > 0) {
      saveTransactions(transactions);
    }
  }, [transactions]);

  // --- Computed totals ---
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach((t) => {
      if (t.type === "income") inc += t.amount;
      else exp += t.amount;
    });
    return { totalIncome: inc, totalExpense: exp, balance: inc - exp };
  }, [transactions]);

  // --- Filtered transactions ---
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filters.type !== "all" && t.type !== filters.type) return false;
        if (filters.category !== "all" && t.category !== filters.category)
          return false;
        if (filters.person !== "all" && t.person !== filters.person)
          return false;
        if (
          filters.search &&
          !t.name.toLowerCase().includes(filters.search.toLowerCase())
        )
          return false;
        if (filters.dateFrom && t.date < filters.dateFrom) return false;
        if (filters.dateTo && t.date > filters.dateTo) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filters]);

  // --- Handlers ---
  const handleAdd = useCallback((transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  }, []);

  const handleDelete = useCallback((id) => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to delete all transactions?")) {
      clearAllTransactions();
      setTransactions([]);
    }
  }, []);

  return (
    <div className="app" id="expense-tracker-app">
      <Header onClearAll={handleClearAll} hasData={transactions.length > 0} />

      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
      />

      <div className="dashboard">
        <div className="dashboard-left">
          <TransactionForm onAdd={handleAdd} />

          {transactions.length > 0 && (
            <FilterBar
              transactions={transactions}
              filters={filters}
              onFilterChange={setFilters}
              filteredCount={filteredTransactions.length}
            />
          )}

          <TransactionList
            transactions={filteredTransactions}
            onDelete={handleDelete}
          />
        </div>

        <div className="dashboard-right">
          <Charts transactions={transactions} />
          <PersonHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default App;
