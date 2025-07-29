import React from 'react';

const WalletHome = ({ user, recentTransactions, setCurrentView }) => {
  const quickActions = [
    { 
      title: 'Send Money', 
      icon: '💸', 
      action: () => setCurrentView('send'),
      description: 'Send money to anyone'
    },
    { 
      title: 'QR Payment', 
      icon: '📱', 
      action: () => setCurrentView('qr'),
      description: 'Pay with QR code'
    },
    { 
      title: 'Transaction History', 
      icon: '📊', 
      action: () => setCurrentView('history'),
      description: 'View all transactions'
    }
  ];

  return (
    <div className="wallet-home">
      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-header">
          <h3>Available Balance</h3>
          <span className="balance-icon">💰</span>
        </div>
        <div className="balance-amount">
          <span className="currency">R</span>
          <span className="amount">{user.balance.toFixed(2)}</span>
        </div>
        <div className="balance-info">
          <p>Account: {user.phone}</p>
          <p>Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <div 
              key={index} 
              className="action-card"
              onClick={action.action}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h5>{action.title}</h5>
                <p>{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <div className="section-header">
          <h4>Recent Transactions</h4>
          <button 
            className="view-all-btn"
            onClick={() => setCurrentView('history')}
          >
            View All
          </button>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="no-transactions">
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <h5>No transactions yet</h5>
              <p>Your recent transactions will appear here</p>
              <button 
                className="start-transaction-btn"
                onClick={() => setCurrentView('send')}
              >
                Send Your First Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="transactions-list">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-icon">
                  {transaction.type === 'sent' ? '📤' : '📥'}
                </div>
                <div className="transaction-details">
                  <div className="transaction-title">
                    {transaction.type === 'sent' 
                      ? `Sent to ${transaction.recipientName}` 
                      : `Received from ${transaction.senderName}`
                    }
                  </div>
                  <div className="transaction-subtitle">
                    {transaction.phone} • {transaction.date}
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === 'sent' ? '-' : '+'}R{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="account-info">
        <h4>Account Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Account Holder</span>
            <span className="info-value">{user.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone Number</span>
            <span className="info-value">{user.phone}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Account Status</span>
            <span className="info-value status-active">Active</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wallet-home {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .balance-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 20px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .balance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .balance-header h3 {
          margin: 0;
          font-size: 18px;
          opacity: 0.9;
        }

        .balance-icon {
          font-size: 24px;
        }

        .balance-amount {
          display: flex;
          align-items: baseline;
          margin-bottom: 15px;
        }

        .currency {
          font-size: 24px;
          margin-right: 5px;
        }

        .amount {
          font-size: 48px;
          font-weight: bold;
        }

        .balance-info p {
          margin: 5px 0;
          opacity: 0.8;
          font-size: 14px;
        }

        .quick-actions {
          margin-bottom: 30px;
        }

        .quick-actions h4 {
          margin-bottom: 15px;
          color: #333;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .action-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border-color: #667eea;
        }

        .action-icon {
          font-size: 24px;
          margin-right: 15px;
        }

        .action-content h5 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 16px;
        }

        .action-content p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .recent-transactions {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header h4 {
          margin: 0;
          color: #333;
        }

        .view-all-btn {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 500;
          cursor: pointer;
          padding: 5px 10px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .view-all-btn:hover {
          background-color: #f1f4ff;
        }

        .no-transactions {
          text-align: center;
          padding: 40px 20px;
        }

        .empty-state {
          color: #666;
        }

        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 15px;
        }

        .empty-state h5 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .empty-state p {
          margin: 0 0 20px 0;
        }

        .start-transaction-btn {
          background: #667eea;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .start-transaction-btn:hover {
          background: #5a6fd8;
        }

        .transactions-list {
          space-y: 12px;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .transaction-icon {
          font-size: 20px;
          margin-right: 15px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border-radius: 50%;
        }

        .transaction-details {
          flex: 1;
        }

        .transaction-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .transaction-subtitle {
          font-size: 14px;
          color: #666;
        }

        .transaction-amount {
          font-weight: 600;
          font-size: 16px;
        }

        .transaction-amount.sent {
          color: #ef4444;
        }

        .transaction-amount.received {
          color: #10b981;
        }

        .account-info {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .account-info h4 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .info-grid {
          display: grid;
          gap: 15px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          color: #666;
          font-weight: 500;
        }

        .info-value {
          color: #333;
          font-weight: 500;
        }

        .status-active {
          color: #10b981;
          background: #d1fae5;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .wallet-home {
            padding: 15px;
          }
          
          .balance-card {
            padding: 20px;
          }
          
          .amount {
            font-size: 36px;
          }
          
          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default WalletHome;