import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    Study_Hours_per_Week: '',
    Sleep_Hours_per_Night: '',
    Participation_Score: '',
    'Attendance (%)': ''
  });

  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponseData(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Study_Hours_per_Week: parseFloat(formData.Study_Hours_per_Week),
          Sleep_Hours_per_Night: parseFloat(formData.Sleep_Hours_per_Night),
          Participation_Score: parseFloat(formData.Participation_Score),
          'Attendance (%)': parseFloat(formData['Attendance (%)'])
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      setResponseData(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong while contacting the server.');
    }
  };

  return (
    <div className="App">
      <h1>Student Pass/Fail Predictor</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Study Hours per Week:
          <input
            type="number"
            name="Study_Hours_per_Week"
            value={formData.Study_Hours_per_Week}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Sleep Hours per Night:
          <input
            type="number"
            name="Sleep_Hours_per_Night"
            value={formData.Sleep_Hours_per_Night}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Participation Score:
          <input
            type="number"
            name="Participation_Score"
            value={formData.Participation_Score}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Attendance (%):
          <input
            type="number"
            name="Attendance (%)"
            value={formData['Attendance (%)']}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Predict</button>
      </form>

      {error && <p className="error">{error}</p>}

      {responseData && (
        <div className="result">
          <h2>Results</h2>
          <p><strong>You are going to</strong> {responseData.prediction}</p>
          <p><strong>Probability of Passing is</strong> {responseData.probability_pass}%</p>
          <p><strong>Probability of Failing is</strong> {responseData.probability_fail}%</p>
        </div>
      )}
    </div>
  );
}

export default App;
