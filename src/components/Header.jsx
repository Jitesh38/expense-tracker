import "./Header.css";

function Header({ onClearAll, hasData }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="header" id="app-header">
      <div className="header-left">
        <h1 className="header-title">💰 Expense Tracker</h1>
        <p className="header-subtitle">{today}</p>
      </div>
      <div className="header-actions">
        {hasData && (
          <button
            className="btn-clear"
            onClick={onClearAll}
            id="btn-clear-all"
            title="Clear all data"
          >
            🗑️ Clear All
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
