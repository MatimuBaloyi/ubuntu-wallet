import React, { useState } from 'react';

const SendMoney = ({ currentUser, users, updateUserBalance, addTransaction, addNotification, setCurrentView }) => {
  const [sendForm, setSendForm] = useState({
    phone: '',
    amount: '',
    message: ''
  });
  const [recipient, setRecipient] = useState(null);
  const [step, setStep] = useState('enter'); // enter, confirm, success
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhoneChange = (phone) => {
    setSendForm({ ...sendForm, phone });
    const foundRecipient = users.find(u => u.phone === phone && u.id !== currentUser.id);
    setRecipient(foundRecipient || null);
  };

  const handleAmountChange = (amount) => {
    // Only allow numbers and decimal point
    const numericAmount = amount.replace(/[^0-9.]/g, '');
    setSendForm({ ...sendForm, amount: numericAmount });
  };

  const validateTransaction = () => {
    const amount = parseFloat(sendForm.amount);
    
    if (!sendForm.phone) {
      alert('Please enter a phone number');
      return false;
    }
    
    if (!recipient) {
      alert('Recipient not found. Please check the phone number.');
      return false;
    }
    
    if (!sendForm.amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return false;
    }
    
    if (amount > currentUser.balance) {
      alert('Insufficient balance');
      return false;
    }
    
    if (amount < 1) {
      alert('Minimum transaction amount is R1.00');
      return false;
    }

    return true;
  };

  const handleConfirm = () => {
    if (!validateTransaction()) return;
    setStep('confirm');
  };

  const handleSendMoney = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const amount = parseFloat(sendForm.amount);
      const transactionId = Date.now().toString();
      
      // Update balances
      updateUserBalance(currentUser.id, currentUser.balance - amount);
      updateUserBalance(recipient.id, recipient.balance + amount);
      
      // Create transaction record
      const transaction = {
        id: transactionId,
        type: 'sent',
        amount: amount,
        senderName: currentUser.name,
        senderId: currentUser.id,
        recipientName: recipient.name,
        recipientId: recipient.id,
        phone: recipient.phone,
        message: sendForm.message,
        date: new Date().toLocaleString(),
        timestamp: Date.now(),
        status: 'completed'
      };
      
      addTransaction(transaction);
      
      // Add notification for sender
      addNotification({
        id: Date.now(),
        type: 'success',
        message: `Successfully sent R${amount.toFixed(2)} to ${recipient.name}`
      });
      
      // Add notification for recipient (simulated)
      addNotification({
        id: Date.now() + 1,
        type: 'info',
        message: `${recipient.name} received R${amount.toFixed(2)} from you`
      });
      
      setStep('success');
      
    } catch (error) {
      alert('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSendForm({ phone: '', amount: '', message: '' });
    setRecipient(null);
    setStep('enter');
  };

  const renderEnterDetails = () => (
    <div className="send-form">
      <div className="form-header">
        <h3>Send Money</h3>
        <p>Send money instantly to any registered user</p>
      </div>

      <div className="balance-display">
        <span>Available Balance: </span>
        <strong>R{currentUser.balance.toFixed(2)}</strong>
      </div>

      <div className="form-group">
        <label>Recipient Phone Number</label>
        <input
          type="tel"
          value={sendForm.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="+27123456789"
          className="form-input"
        />
        {sendForm.phone && !recipient && (
          <div className="error-message">Recipient not found</div>
        )}
        {recipient && (
          <div className="recipient-info">
            <div className="recipient-card">
              <div className="recipient-avatar">👤</div>
              <div className="recipient-details">
                <div className="recipient-name">{recipient.name}</div>
                <div className="recipient-phone">{recipient.phone}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Amount (R)</label>
        <div className="amount-input-container">
          <span className="currency-symbol">R</span>
          <input
            type="text"
            value={sendForm.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.00"
            className="amount-input"
          />
        </div>
        {sendForm.amount && parseFloat(sendForm.amount) > currentUser.balance && (
          <div className="error-message">Insufficient balance</div>
        )}
      </div>

      <div className="quick-amounts">
        <span>Quick amounts:</span>
        <div className="quick-amount-buttons">
          {[50, 100, 200, 500].map(amount => (
            <button
              key={amount}
              onClick={() => setSendForm({ ...sendForm, amount: amount.toString() })}
              className="quick-amount-btn"
              disabled={amount > currentUser.balance}
            >
              R{amount}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Message (Optional)</label>
        <textarea
          value={sendForm.message}
          onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
          placeholder="Add a message..."
          className="form-textarea"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button onClick={handleConfirm} className="confirm-btn">
          Continue
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="confirmation-screen">
      <div className="confirmation-header">
        <h3>Confirm Transaction</h3>
        <p>Please review the details before sending</p>
      </div>

      <div className="transaction-summary">
        <div className="summary-card">
          <div className="summary-row">
            <span>From:</span>
            <span>{currentUser.name}</span>
          </div>
          <div className="summary-row">
            <span>To:</span>
            <span>{recipient.name}</span>
          </div>
          <div className="summary-row">
            <span>Phone:</span>
            <span>{recipient.phone}</span>
          </div>
          <div className="summary-row highlight">
            <span>Amount:</span>
            <span>R{parseFloat(sendForm.amount).toFixed(2)}</span>
          </div>
          {sendForm.message && (
            <div className="summary-row">
              <span>Message:</span>
              <span>{sendForm.message}</span>
            </div>
          )}
          <div className="summary-row">
            <span>New Balance:</span>
            <span>R{(currentUser.balance - parseFloat(sendForm.amount)).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={() => setStep('enter')} className="back-btn">
          Back
        </button>
        <button 
          onClick={handleSendMoney} 
          className="send-btn"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Send Money'}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="success-screen">
      <div className="success-icon">✅</div>
      <h3>Transaction Successful!</h3>
      <p>Money sent successfully</p>
      
      <div className="success-details">
        <div className="detail-row">
          <span>Amount Sent:</span>
          <span>R{parseFloat(sendForm.amount).toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span>To:</span>
          <span>{recipient.name}</span>
        </div>
        <div className="detail-row">
          <span>New Balance:</span>
          <span>R{(currentUser.balance - parseFloat(sendForm.amount)).toFixed(2)}</span>
        </div>
        <div className="detail-row">
          <span>Date:</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={resetForm} className="new-transaction-btn">
          Send Another
        </button>
        <button onClick={() => setCurrentView('home')} className="home-btn">
          Go Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="send-money">
      {step === 'enter' && renderEnterDetails()}
      {step === 'confirm' && renderConfirmation()}
      {step === 'success' && renderSuccess()}

      <style jsx>{`
        .send-money {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .send-form, .confirmation-screen, .success-screen {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .form-header, .confirmation-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .form-header h3, .confirmation-header h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .form-header p, .confirmation-header p {
          margin: 0;
          color: #666;
        }

        .balance-display {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 25px;
          color: #333;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-input, .amount-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .form-input:focus, .amount-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .amount-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .currency-symbol {
          position: absolute;
          left: 16px;
          font-weight: 600;
          color: #333;
          z-index: 1;
        }

        .amount-input {
          padding-left: 40px;
        }

        .error-message {
          color: #ef4444;
          font-size: 14px;
          margin-top: 5px;
        }

        .recipient-info {
          margin-top: 10px;
        }

        .recipient-card {
          display: flex;
          align-items: center;
          padding: 15px;
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 8px;
        }

        .recipient-avatar {
          font-size: 24px;
          margin-right: 15px;
        }

        .recipient-name {
          font-weight: 600;
          color: #333;
        }

        .recipient-phone {
          color: #666;
          font-size: 14px;
        }

        .quick-amounts {
          margin-bottom: 20px;
        }

        .quick-amounts span {
          display: block;
          margin-bottom: 10px;
          font-size: 14px;
          color: #666;
        }

        .quick-amount-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .quick-amount-btn {
          padding: 8px 16px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-amount-btn:hover:not(:disabled) {
          border-color: #667eea;
          background: #f1f4ff;
        }

        .quick-amount-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 30px;
        }

        .confirm-btn, .send-btn, .new-transaction-btn, .home-btn {
          padding: 14px 28px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          font-size: 16px;
        }

        .confirm-btn, .send-btn {
          background: #667eea;
          color: white;
        }

        .confirm-btn:hover, .send-btn:hover {
          background: #5a6fd8;
        }

        .send-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .back-btn {
          padding: 14px 28px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .back-btn:hover {
          background: #f8fafc;
        }

        .transaction-summary {
          margin: 30px 0;
        }

        .summary-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row.highlight {
          font-weight: 600;
          font-size: 18px;
          color: #333;
        }

        .success-screen {
          text-align: center;
        }

        .success-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .success-screen h3 {
          color: #10b981;
          margin: 0 0 10px 0;
        }

        .success-screen p {
          color: #666;
          margin: 0 0 30px 0;
        }

        .success-details {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }

        .new-transaction-btn {
          background: #667eea;
          color: white;
        }

        .new-transaction-btn:hover {
          background: #5a6fd8;
        }

        .home-btn {
          background: #f1f5f9;
          color: #333;
        }

        .home-btn:hover {
          background: #e2e8f0;
        }

        @media (max-width: 768px) {
          .send-money {
            padding: 15px;
          }
          
          .send-form, .confirmation-screen, .success-screen {
            padding: 20px;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .quick-amount-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SendMoney;