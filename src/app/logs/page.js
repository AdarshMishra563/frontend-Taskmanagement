"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loading } from '../page';
import { useSelect } from '@react-three/drei';
import { useSelector } from 'react-redux';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('user');
 const token=useSelector(state=>state.user?.user?.user);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
       
        
        const response = await axios.get(
          `https://backend-taskmanagement-k0md.onrender.com/api/auth/${filter === 'all' ? 'logs/all' : 'logs'}`,
          {
            headers: {
              Authorization: `${token}`
            }
          }
        );
        
        setLogs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [filter]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getActionColor = (action) => {
    const colors = {
      'task_create': '#10B981',
      'task_update': '#F59E0B',
      'task_delete': '#EF4444',
      'task_assign': '#3B82F6',
      'register': '#8B5CF6',
      'login': '#6B7280',
      'api_call': '#EC4899'
    };
    return colors[action] || '#6B7280';
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  if (error) {
    return (
   
        <div className="error-message">{error}</div>
     
    );
  }

  return (
    <>
      <div className="logs-container">
        <h1 className="logs-title">Activity Logs</h1>
        
        <div className="filter-controls">
          <button 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'active' : ''}
          >
            All Logs
          </button>
          <button 
            onClick={() => setFilter('user')} 
            className={filter === 'user' ? 'active' : ''}
          >
            My Logs
          </button>
        </div>

        <div className="logs-list">
          {logs.length === 0 ? (
            <p className="no-logs">No activity logs found</p>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="log-item">
                <div className="log-header">
                  <span 
                    className="action-badge"
                    style={{ backgroundColor: getActionColor(log.action) }}
                  >
                    {log.action.replace('_', ' ')}
                  </span>
                  <span className="log-date">{formatDate(log.createdAt)}</span>
                </div>
                <div className="log-details">
                  <p>{log.details}</p>
                  {log.endpoint && (
                    <p className="endpoint">
                      <strong>API:</strong> {log.method} {log.endpoint}
                    </p>
                  )}
                </div>
                <div className="log-meta">
                  {log.user?.name && (
                    <span className="user-info">
                      <strong>User:</strong> {log.user.name}
                    </span>
                  )}
                  {log.ipAddress && (
                    <span className="ip-info">
                      <strong>IP:</strong> {log.ipAddress}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .logs-container {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(to bottom, #374151, #000000);
          color: #fff;
        }
        
        .logs-title {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .filter-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .filter-controls button {
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          background: #4B5563;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        
        .filter-controls button:hover {
          background: #6B7280;
        }
        
        .filter-controls button.active {
          background: #3B82F6;
        }
        
        .logs-list {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .log-item {
          background: rgba(31, 41, 55, 0.7);
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
          border-left: 4px solid #3B82F6;
        }
        
        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .action-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: capitalize;
        }
        
        .log-date {
          font-size: 0.875rem;
          color: #9CA3AF;
        }
        
        .log-details p {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        
        .endpoint {
          font-family: monospace;
          font-size: 0.875rem;
          color: #D1D5DB;
        }
        
        .log-meta {
          display: flex;
          gap: 1.5rem;
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #9CA3AF;
        }
        
        .no-logs {
          text-align: center;
          color: #9CA3AF;
          font-size: 1.1rem;
        }
        
        .error-message {
          color: #EF4444;
          text-align: center;
          padding: 2rem;
          font-size: 1.1rem;
        }
        
        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
        }
        
        .custom-loader {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 5px solid #3B82F6;
          border-top-color: transparent;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
   </>
  );
};

export default LogsPage;