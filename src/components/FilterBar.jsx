import { useMemo } from "react";
import { CATEGORIES } from "../utils/storage";
import "./FilterBar.css";

function FilterBar({ transactions, filters, onFilterChange, filteredCount }) {
  // Get unique persons from data
  const persons = useMemo(() => {
    const set = new Set(transactions.map((t) => t.person));
    return [...set].sort();
  }, [transactions]);

  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      type: "all",
      category: "all",
      person: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.person !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="filter-bar" id="filter-bar">
      <div className="filter-bar__row">
        <div className="filter-bar__search-wrap">
          <span className="filter-bar__search-icon">🔍</span>
          <input
            className="filter-bar__search"
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            id="filter-search"
          />
        </div>

        <div className="filter-bar__pills">
          {["all", "income", "expense"].map((t) => (
            <button
              key={t}
              className={`filter-bar__pill ${filters.type === t ? "filter-bar__pill--active" : ""}`}
              onClick={() => updateFilter("type", t)}
              id={`filter-type-${t}`}
            >
              {t === "all" ? "All" : t === "income" ? "📈 Income" : "📉 Expense"}
            </button>
          ))}
        </div>

        <select
          className="filter-bar__select"
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
          id="filter-category"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="filter-bar__select"
          value={filters.person}
          onChange={(e) => updateFilter("person", e.target.value)}
          id="filter-person"
        >
          <option value="all">All Persons</option>
          {persons.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <input
          className="filter-bar__date"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => updateFilter("dateFrom", e.target.value)}
          title="From date"
          id="filter-date-from"
        />
        <input
          className="filter-bar__date"
          type="date"
          value={filters.dateTo}
          onChange={(e) => updateFilter("dateTo", e.target.value)}
          title="To date"
          id="filter-date-to"
        />

        {hasActiveFilters && (
          <button className="filter-bar__clear" onClick={clearFilters} id="filter-clear">
            ✕ Clear
          </button>
        )}

        <span className="filter-bar__count" id="filter-count">
          {filteredCount} result{filteredCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

export default FilterBar;
