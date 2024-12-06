import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [formData, setFormData] = useState({
        beds: "",
        baths: "",
        size: "",
        zip_code: "",
    });
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", formData);
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error("Error:", error);
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
                    />
                </label>
                <br />
                <label>
                    Size (sq ft):
                    <input
                        type="number"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
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
                    />
                </label>
                <br />
                <button type="submit">Predict</button>
            </form>
            {prediction && <h2>Predicted Price: ${prediction}</h2>}
        </div>
    );
};

export default App;
