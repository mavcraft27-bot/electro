import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import '../styles/notifications.css';

const Notifications = () => {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      auth: {
        token,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to notifications');
      newSocket.emit('join-room', user.id);
    });

    newSocket.on('new-request', (data) => {
      setNotifications((prev) => [{
        id: Date.now(),
        type: 'new-request',
        title: 'New Repair Request',
        message: `New ${data.applianceType} repair request in your region`,
        timestamp: new Date(),
      }, ...prev]);
    });

    newSocket.on('request-claimed', (data) => {
      setNotifications((prev) => [{
        id: Date.now(),
        type: 'request-claimed',
        title: 'Request Claimed',
        message: 'A technician has claimed your repair request',
        timestamp: new Date(),
      }, ...prev]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user.id, token]);

  return (
    <div className="notifications-container">
      <h4>Notifications</h4>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div key={notif.id} className={`notification ${notif.type}`}>
              <h5>{notif.title}</h5>
              <p>{notif.message}</p>
              <small>{new Date(notif.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;