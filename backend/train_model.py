import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load dataset
data = pd.read_csv("C:\\Users\\Pracheer\\Desktop\SPARTA_Extension\\backend\\phishing_dataset.csv")

# Map 'legitimate' to 0 and 'phishing' to 1
data['status'] = data['status'].map({'legitimate': 0, 'phishing': 1})

# Select feature columns and target column
feature_columns = ['length_url', 'nb_dots', 'nb_hyphens', 'nb_slash']
features = data[feature_columns]
labels = data['status']

# Split dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42)

# Train a Random Forest model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Save the trained model
joblib.dump(model, "phishing_model.pkl")
print("Model trained and saved as phishing_model.pkl")
