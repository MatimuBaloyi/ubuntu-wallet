import React, { useState, useEffect } from 'react';
import WalletHome from './components/WalletHome';
import SendMoney from './components/SendMoney';
import TransactionHistory from './components/TransactionHistory';
import QRPayment from './components/QRPayment';
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      phone: '+27123456789',
      email: 'john@example.com',
      balance: 1500,
      password: 'password123'
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '+27987654321',
      email: 'jane@example.com',
      balance: 2000,
      password: 'password123'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      phone: '+27555123456',
      email: 'mike@example.com',
      balance: 750,
      password: 'password123'
    }
  ]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });

  const handleLogin = () => {
    const user = users.find(u => u.phone === loginForm.phone && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setCurrentView('home');
      setLoginForm({ phone: '', password: '' });
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = () => {
    if (users.some(u => u.phone === registerForm.phone)) {
      alert('Phone number already exists');
      return;
    }
    
    const newUser = {
      id: users.length + 1,
      ...registerForm,
      balance: 1500
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentView('home');
    setRegisterForm({ name: '', phone: '', email: '', password: '' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const switchAccount = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const updateUserBalance = (userId, newBalance) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, balance: newBalance } : user
    ));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({ ...currentUser, balance: newBalance });
    }
  };

  const addTransaction = (transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const addNotification = (notification) => {
    setNotifications([notification, ...notifications]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const renderAuthForms = () => (
    <div className="auth-container">
      <div className="auth-header">
        <h1>PayWallet</h1>
        <p>Secure Digital Payments</p>
      </div>
      
      <div className="auth-tabs">
        <button 
          className={currentView === 'login' ? 'tab active' : 'tab'}
          onClick={() => setCurrentView('login')}
        >
          Login
        </button>
        <button 
          className={currentView === 'register' ? 'tab active' : 'tab'}
          onClick={() => setCurrentView('register')}
        >
          Register
        </button>
      </div>

      {currentView === 'login' ? (
        <div className="auth-form">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={loginForm.phone}
              onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
              placeholder="+27123456789"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              placeholder="Enter password"
            />
          </div>
          <button onClick={handleLogin} className="auth-button">Login</button>
          <div className="demo-accounts">
            <p>Demo Accounts (password: password123):</p>
            <small>+27123456789 (John) | +27987654321 (Jane) | +27555123456 (Mike)</small>
          </div>
        </div>
      ) : (
        <div className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={registerForm.name}
              onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
              placeholder="+27123456789"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
              placeholder="john@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
              placeholder="Create password"
            />
          </div>
          <button onClick={handleRegister} className="auth-button">Register (Get R1,500 Welcome Bonus!)</button>
        </div>
      )}
    </div>
  );

  const renderMainApp = () => (
    <div className="app-container">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications">
          {notifications.map(notification => (
            <div key={notification.id} className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h2>PayWallet</h2>
          <span>Welcome, {currentUser.name}</span>
        </div>
        <div className="header-right">
          <select 
            onChange={(e) => switchAccount(parseInt(e.target.value))}
            value={currentUser.id}
            className="account-switcher"
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} - R{user.balance.toFixed(2)}
              </option>
            ))}
          </select>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button 
          className={currentView === 'home' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('home')}
        >
          Home
        </button>
        <button 
          className={currentView === 'send' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('send')}
        >
          Send Money
        </button>
        <button 
          className={currentView === 'qr' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('qr')}
        >
          QR Payment
        </button>
        <button 
          className={currentView === 'history' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('history')}
        >
          Transaction History
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {currentView === 'home' && (
          <WalletHome 
            user={currentUser}
            recentTransactions={transactions.slice(0, 3)}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'send' && (
          <SendMoney 
            currentUser={currentUser}
            users={users}
            updateUserBalance={updateUserBalance}
            addTransaction={addTransaction}
            addNotification={addNotification}
            setCurrentView={setCurrentView}
          />
        )}
        {currentView === 'qr' && (
          <QRPayment 
            currentUser={currentUser}
            users={users}
            updateUserBalance={updateUserBalance}
            addTransaction={addTransaction}
            addNotification={addNotification}
          />
        )}
        {currentView === 'history' && (
          <TransactionHistory 
            transactions={transactions}
            currentUser={currentUser}
          />
        )}
      </main>
    </div>
  );

  return (
    <div className="App">
      {currentUser ? renderMainApp() : renderAuthForms()}
    </div>
  );
};

export default App;