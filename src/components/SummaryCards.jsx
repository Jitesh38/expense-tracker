import NumberFlow from "@number-flow/react";
import "./SummaryCards.css";

function SummaryCards({ totalIncome, totalExpense, balance }) {
  return (
    <div className="summary-cards stagger" id="summary-cards">
      <div className="summary-card summary-card--income" id="card-income">
        <div className="summary-card__icon">📈</div>
        <div className="summary-card__label">Total Income</div>
        <div className="summary-card__value">
          ₹<NumberFlow value={totalIncome} />
        </div>
      </div>

      <div className="summary-card summary-card--expense" id="card-expense">
        <div className="summary-card__icon">📉</div>
        <div className="summary-card__label">Total Expense</div>
        <div className="summary-card__value">
          ₹<NumberFlow value={totalExpense} />
        </div>
      </div>

      <div className="summary-card summary-card--balance" id="card-balance">
        <div className="summary-card__icon">💎</div>
        <div className="summary-card__label">Net Balance</div>
        <div className="summary-card__value">
          ₹<NumberFlow value={Math.abs(balance)} />
          {balance > 0 && <span className="summary-card__badge badge-profit">Profit</span>}
          {balance < 0 && <span className="summary-card__badge badge-loss">Loss</span>}
          {balance === 0 && <span className="summary-card__badge badge-equal">Equal</span>}
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
