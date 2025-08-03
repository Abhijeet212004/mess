import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedType, setSelectedType] = useState('MORNING');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [monthlyData, setMonthlyData] = useState(null);
  const [costData, setCostData] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    fetchMonthlyData();
    fetchCostData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const response = await attendanceAPI.getMonthlyAttendance(currentYear, currentMonth);
      setMonthlyData(response.data.attendance);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const fetchCostData = async () => {
    try {
      const response = await attendanceAPI.getMonthlyCost(currentYear, currentMonth);
      setCostData(response.data.data);
    } catch (error) {
      console.error('Error fetching cost data:', error);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await attendanceAPI.markAttendance({
        date: selectedDate,
        type: selectedType,
      });
      setMessage('Attendance marked successfully!');
      fetchMonthlyData();
      fetchCostData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error marking attendance');
    } finally {
      setLoading(false);
    }
  };

  const userCostData = costData?.userCosts?.find(u => u.user.id === user.id);

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Mess Attendance System</h1>
        <div>
          <span>Welcome, {user.name}! </span>
          <button onClick={onLogout} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Mark Attendance */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', marginBottom: '30px', borderRadius: '5px' }}>
        <h3>Mark Attendance</h3>
        <form onSubmit={handleMarkAttendance}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'end', marginBottom: '15px' }}>
            <div>
              <label>Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ padding: '8px', marginLeft: '10px' }}
              />
            </div>
            <div>
              <label>Meal:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ padding: '8px', marginLeft: '10px' }}
              >
                <option value="MORNING">Morning</option>
                <option value="NIGHT">Night</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
              {loading ? 'Marking...' : 'Mark Present'}
            </button>
          </div>
        </form>
        {message && <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
      </div>

      {/* Your Monthly Summary */}
      <div style={{ backgroundColor: '#e9ecef', padding: '20px', marginBottom: '30px', borderRadius: '5px' }}>
        <h3>Your Monthly Summary ({currentMonth}/{currentYear})</h3>
        {userCostData ? (
          <div>
            <p><strong>Total Entries:</strong> {userCostData.entries}</p>
            <p><strong>Your Share:</strong> ₹{userCostData.cost.toFixed(2)}</p>
          </div>
        ) : (
          <p>No attendance data for this month</p>
        )}
      </div>

      {/* Monthly Cost Distribution */}
      {costData && (
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', marginBottom: '30px', borderRadius: '5px' }}>
          <h3>Monthly Cost Distribution</h3>
          <p><strong>Total Mess Price:</strong> ₹{costData.totalMessPrice}</p>
          <p><strong>Total Entries:</strong> {costData.totalEntries}</p>
          <p><strong>Cost per Entry:</strong> ₹{costData.costPerEntry}</p>
          
          <h4>All Users:</h4>
          {costData.userCosts.map((userData) => (
            <div key={userData.user.id} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px' }}>
              <strong>{userData.user.name}</strong> - {userData.entries} entries - ₹{userData.cost.toFixed(2)}
            </div>
          ))}
        </div>
      )}

      {/* Your Attendance History */}
      {monthlyData && monthlyData.length > 0 && (
        <div>
          <h3>Your Attendance This Month</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
            {monthlyData.map((attendance) => (
              <div key={attendance.id} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <div><strong>{new Date(attendance.date).toLocaleDateString()}</strong></div>
                <div>{attendance.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;