from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Load the trained model
model = joblib.load("phishing_model.pkl")

# Feature extraction function
def extract_features(url):
    # Extract features that match the trained model
    return pd.DataFrame([{
        "length_url": len(url),
        "nb_dots": url.count("."),
        "nb_hyphens": url.count("-"),
        "nb_slash": url.count("/")
    }])

@app.route("/check", methods=["GET"])
def check_url():
    url = request.args.get("url")
    logging.debug(f"Received URL: {url}")
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    # Extract features from the URL
    features = extract_features(url)
    logging.debug(f"Extracted features: {features}")

    # Predict using the ML model
    try:
        prediction = model.predict(features)[0]
        logging.debug(f"Prediction: {prediction}")
        return jsonify({"is_phishing": bool(prediction)})
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        return jsonify({"error": "Prediction failed"}), 500

if __name__ == "__main__":
    app.run(debug=True)
