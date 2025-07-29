// src/components/TransactionHistory.jsx
import React, { useEffect, useState } from "react";
//import "./TransactionHistory.css";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Simulated fetch - replace with real API later
    const fetchTransactions = async () => {
      const res = await fetch("http://localhost:5000/api/payments/history");
      const data = await res.json();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>To/From</th>
            <th>Amount (R)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.to || tx.from}</td>
              <td>{tx.amount}</td>
              <td>{tx.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
