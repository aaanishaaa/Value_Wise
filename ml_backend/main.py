from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS to allow communication between React and Flask

# Load your data and model
data = pd.read_csv('final_dataset.csv')
pipe = pickle.load(open("RidgeModel.pkl", 'rb'))

@app.route('/')
def index():
    return jsonify({"message": "Flask server is running!"})

@app.route('/predict', methods=['POST'])
def predict():
    bedrooms = request.json.get('number of bedrooms')
    bathrooms = request.json.get('number of bathrooms')
    size = request.json.get('living area')
    zipcode = request.json.get('Postal Code')

    # Create a DataFrame with the input data
    input_data = pd.DataFrame([[bedrooms, bathrooms, size, zipcode]],
                               columns=['number of bedrooms', 'baths', 'size', 'Postal Code'])

    # Handle unknown categories in the input data
    for column in input_data.columns:
        unknown_categories = set(input_data[column]) - set(data[column].unique())
        if unknown_categories:
            input_data[column] = input_data[column].replace(unknown_categories, data[column].mode()[0])

    # Predict the price
    prediction = pipe.predict(input_data)[0]

    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(debug=True, port=5000)