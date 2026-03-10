import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  function addTransaction() {
    if (!desc.trim() || !amount || parseFloat(amount) <= 0) {
      alert("Please enter valid description and amount!");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      desc,
      amount: parseFloat(amount),
      type,
    };

    setTransactions([...transactions, newTransaction]);
    setDesc("");
    setAmount("");
  }

  function deleteTransaction(id) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((t) =>
    filter === "all" ? true : t.type === filter
  );

  return (
    <div className="container">
      <h1>💰 Finance Tracker</h1>

      {/* Balance Box */}
      <div className="balance-box">
        <p>Total Balance</p>
        <h2 style={{ color: balance >= 0 ? "#4caf50" : "#f44336" }}>
          ₹{balance.toLocaleString()}
        </h2>
      </div>

      {/* Summary */}
      <div className="summary">
        <div className="income-box">
          <p>Income</p>
          <h3>₹{totalIncome.toLocaleString()}</h3>
        </div>
        <div className="expense-box">
          <p>Expense</p>
          <h3>₹{totalExpense.toLocaleString()}</h3>
        </div>
      </div>

      {/* Form */}
      <div className="form-box">
        <input
          type="text"
          placeholder="Description (e.g. Salary)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount (e.g. 5000)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="income"
              checked={type === "income"}
              onChange={() => setType("income")}
            />
            Income
          </label>
          <label>
            <input
              type="radio"
              value="expense"
              checked={type === "expense"}
              onChange={() => setType("expense")}
            />
            Expense
          </label>
        </div>
        <button onClick={addTransaction}>Add Transaction</button>
      </div>

      {/* Filter + Transaction List */}
      <div className="transaction-list">
        <h3>Transactions</h3>
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "income" ? "active" : ""}
            onClick={() => setFilter("income")}
          >
            Income
          </button>
          <button
            className={filter === "expense" ? "active" : ""}
            onClick={() => setFilter("expense")}
          >
            Expense
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="empty">No transactions found!</p>
        ) : (
          <ul>
            {filteredTransactions.map((t) => (
              <li key={t.id} className={t.type}>
                <span>{t.desc}</span>
                <span className="amount">
                  {t.type === "income" ? "+" : "-"} ₹{t.amount.toLocaleString()}
                </span>
                <button
                  className="del-btn"
                  onClick={() => deleteTransaction(t.id)}
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}