import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AvailableRequests from '../components/AvailableRequests';
import Notifications from '../components/Notifications';
import '../styles/dashboard.css';

const TechnicianDashboard = () => {
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
            <AvailableRequests />
          </section>
        </main>
      </div>
    </div>
  );
};

export default TechnicianDashboard;