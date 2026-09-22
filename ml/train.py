import pandas as pd
import pickle

from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report


# Load dataset
data = pd.read_csv("dataset.csv")


# Convert activity type into numeric values
activity_mapping = {
    "Cycling": 1,
    "Walking": 2,
    "Public Transport": 3,
    "Carpooling": 4,
    "Tree Planting": 5,
    "LED Usage": 6,
    "Electricity Saving": 7,
    "Reusable Bottle": 8
}

data["activity_type"] = data["activity_type"].map(
    activity_mapping
)


# Features
X = data[
    [
        "activity_type",
        "quantity",
        "frequency"
    ]
]


# Target
y = data["impact"]


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# Create Decision Tree model
model = DecisionTreeClassifier(
    max_depth=5,
    random_state=42
)


# Train model
model.fit(X_train, y_train)


# Make predictions
y_pred = model.predict(X_test)


# Calculate accuracy
accuracy = accuracy_score(
    y_test,
    y_pred
)


print("CarbEarn ML Model")
print("-----------------")

print(
    f"Dataset size: {len(data)}"
)

print(
    f"Training samples: {len(X_train)}"
)

print(
    f"Testing samples: {len(X_test)}"
)

print(
    f"Accuracy: {accuracy * 100:.2f}%"
)

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        zero_division=0
    )
)


# Save model and mapping
model_data = {
    "model": model,
    "activity_mapping": activity_mapping
}

with open(
    "model.pkl",
    "wb"
) as file:

    pickle.dump(
        model_data,
        file
    )


print("\nModel saved successfully as model.pkl")