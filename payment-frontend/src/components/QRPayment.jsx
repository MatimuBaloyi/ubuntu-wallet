// src/components/QRPayment.jsx
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
//import "./QRPayment.css";

const QRPayment = ({
  currentUser,
  users,
  updateUserBalance,
  addTransaction,
  addNotification
}) => {
  const [amount, setAmount] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGenerateQR = () => {
    if (!amount || !recipientPhone) {
      alert("Please enter recipient phone number and amount.");
      return;
    }

    setGenerated(true);
  };

  const handleScanPayment = () => {
    const recipient = users.find(u => u.phone === recipientPhone);

    if (!recipient) {
      alert("Recipient not found.");
      return;
    }

    const amountNum = parseFloat(amount);

    if (currentUser.balance < amountNum) {
      alert("Insufficient balance.");
      return;
    }

    // Update balances
    updateUserBalance(currentUser.id, currentUser.balance - amountNum);
    updateUserBalance(recipient.id, recipient.balance + amountNum);

    // Add transaction to history
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      from: currentUser.phone,
      to: recipient.phone,
      amount: amountNum,
      status: "Completed"
    };

    addTransaction(transaction);

    // Notify recipient
    addNotification({
      id: Date.now(),
      message: `You received R${amountNum} from ${currentUser.name}`,
      type: "success"
    });

    // Reset
    setGenerated(false);
    setAmount("");
    setRecipientPhone("");
    alert("QR payment completed!");
  };

  return (
    <div className="qr-payment">
      <h2>QR Code Payment</h2>
      <input
        type="text"
        placeholder="Recipient Phone Number"
        value={recipientPhone}
        onChange={(e) => setRecipientPhone(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (R)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleGenerateQR}>Generate QR Code</button>

      {generated && (
        <div className="qr-section">
          <QRCodeCanvas
            value={JSON.stringify({
              from: currentUser.phone,
              to: recipientPhone,
              amount
            })}
            size={200}
          />
          <button onClick={handleScanPayment}>Simulate Scan & Pay</button>
        </div>
      )}
    </div>
  );
};

export default QRPayment;
