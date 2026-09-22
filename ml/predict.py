import pickle
import pandas as pd


# Load trained model
with open("model.pkl", "rb") as file:
    model_data = pickle.load(file)


model = model_data["model"]
activity_mapping = model_data["activity_mapping"]


# Function to predict impact
def predict_impact(activity_type, quantity, frequency):

    activity_number = activity_mapping[activity_type]

    input_data = pd.DataFrame([
        {
            "activity_type": activity_number,
            "quantity": quantity,
            "frequency": frequency
        }
    ])

    prediction = model.predict(input_data)

    return prediction[0]


# Test predictions

print("CarbEarn ML Prediction")
print("----------------------")

print(
    "Cycling, 5 km, 2 times/week:",
    predict_impact("Cycling", 5, 2)
)

print(
    "Cycling, 20 km, 6 times/week:",
    predict_impact("Cycling", 20, 6)
)

print(
    "Tree Planting, 2 trees, 1 time/week:",
    predict_impact("Tree Planting", 2, 1)
)

print(
    "LED Usage, 10 hours, 2 times/week:",
    predict_impact("LED Usage", 10, 2)
)