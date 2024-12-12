import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  // State to store input data and the prediction result
  const [formData, setFormData] = useState({
    beds: '',
    baths: '',
    size: '',
    zip_code: '',
    condition: '',
    grade: '',
    distance: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission and prediction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setPrediction(response.data.prediction);
    } catch (error) {
      setError('Error predicting house price');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>House Price Prediction</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Bedrooms:
          <input
            type="number"
            name="beds"
            value={formData.beds}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Bathrooms:
          <input
            type="number"
            name="baths"
            value={formData.baths}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Living Area (sq ft):
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Zip Code:
          <input
            type="number"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Condition of the House:
          <input
            type="number"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Grade of the House:
          <input
            type="number"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Distance from the Airport (miles):
          <input
            type="number"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            step="0.1"
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {prediction && <h2>Predicted Price: ${prediction}</h2>}
    </div>
  );
};

export default App;
