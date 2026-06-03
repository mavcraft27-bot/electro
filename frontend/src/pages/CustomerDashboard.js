import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CreateRepairRequest from '../components/CreateRepairRequest';
import CustomerRequests from '../components/CustomerRequests';
import Notifications from '../components/Notifications';
import '../styles/dashboard.css';

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>TrouveMonReparateur.ca</h1>
          <div className="user-info">
            <span>{user?.firstName} {user?.lastName}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-main">
        <aside className="sidebar">
          <Notifications />
        </aside>

        <main className="dashboard-content">
          <section className="section">
            <CreateRepairRequest />
          </section>

          <section className="section">
            <CustomerRequests />
          </section>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;