

import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import FlowPage from './FlowPage';
import EditFlowPage from './EditFlowPage';
import axios from 'axios';


export default function App() {
  const [count, setCount] = useState(0);
  const [showFlow, setShowFlow] = useState(false);
  const [editShowFlow, setEditShowFlow] = useState(0);

  const [editRow, setEditRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/survey/index') // Adjust to your Laravel API endpoint
      .then(res => {
        setTableData(res.data.data || res.data); // Adjust if your API returns differently
        setError(null);
      })
      .catch(err => {
        setError('Failed to fetch data');
      })
      .finally(() => setLoading(false));
  }, []);

  if (showFlow) {
    return <FlowPage />;
  }

  if(editShowFlow > 0){
    console.log("Edit ID:", editShowFlow);
    return <EditFlowPage editId={editShowFlow} />;
  }

  return (
    <>

      <div style={{ marginTop: 24 }}>
        <button onClick={() => setShowFlow(true)} style={{ fontSize: 18, padding: '10px 24px' }}>
          Go to Flow Chart Page
        </button>
      </div>
      <div style={{ marginTop: 32 }}>
        <h2>Survey Table</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 800 }}>
            <thead>
              <tr>
                {/* Adjust columns as per your API data */}
                <th>ID</th>
                <th>Question</th>
                <th>Actions</th>
                {/* Add more columns if needed */}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td>{row.id}</td>
                  <td>{row.buildings || row.question || row.label}</td>
                  <td><button onClick={() => setEditShowFlow(row.id)}>Edit</button></td>
                  {/* Add more cells if needed */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
