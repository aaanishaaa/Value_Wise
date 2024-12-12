from flask import Flask, render_template, request, jsonify
import pandas as pd
import pickle

# Initialize Flask app
app = Flask(__name__)

# Load dataset and pre-trained model
data = pd.read_csv('final_dataset.csv')
pipe = pickle.load(open("RidgeModel.pkl", 'rb'))

@app.route('/')
def index():
    """Render the homepage with dropdown options for features."""
    dropdown_data = {
        'bedrooms': sorted(data['number of bedrooms'].unique()),
        'bathrooms': sorted(data['number of bathrooms'].unique()),
        'zip_codes': sorted(data['Postal Code'].unique()),
        'conditions': sorted(data['condition of the house'].unique()),
        'grades': sorted(data['grade of the house'].unique())
    }
    return render_template('index.html', **dropdown_data)

@app.route('/predict', methods=['POST'])
def predict():
    """Handle form submissions and return the predicted price."""
    # Get input data from the form
    bedrooms = request.form.get('beds')
    bathrooms = request.form.get('baths')
    size = request.form.get('size')
    zipcode = request.form.get('zip_code')
    condition = request.form.get('condition')
    grade = request.form.get('grade')
    distance = request.form.get('distance')

    # Create a DataFrame for the input
    input_data = pd.DataFrame([[
        bedrooms, bathrooms, size, zipcode, condition, grade, distance
    ]], columns=[
        'number of bedrooms', 'number of bathrooms', 'living area',
        'Postal Code', 'condition of the house', 'grade of the house',
        'Distance from the airport'
    ])

    # Convert input data to numeric
    input_data = input_data.astype({
        'number of bedrooms': int,
        'number of bathrooms': float,
        'living area': float,
        'Postal Code': int,
        'condition of the house': int,
        'grade of the house': int,
        'Distance from the airport': float
    })

    # Handle unknown categories (replace with mode of the column)
    for column in input_data.columns:
        if column in data.columns:
            unknown_categories = set(input_data[column]) - set(data[column].unique())
            if unknown_categories:
                input_data[column] = input_data[column].replace(unknown_categories, data[column].mode()[0])

    # Predict the house price using the trained model
    prediction = pipe.predict(input_data)[0]
    return jsonify({'prediction': prediction})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
