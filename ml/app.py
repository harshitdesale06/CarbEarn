from flask import Flask, request, jsonify
import pickle
import pandas as pd


app = Flask(__name__)


# Load trained model
with open("model.pkl", "rb") as file:
    model_data = pickle.load(file)


model = model_data["model"]
activity_mapping = model_data["activity_mapping"]


@app.route("/")
def home():
    return jsonify({
        "message": "CarbEarn ML API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        activity_type = data.get("activity_type")
        quantity = data.get("quantity")
        frequency = data.get("frequency")


        if not activity_type or quantity is None or frequency is None:
            return jsonify({
                "message": "Activity type, quantity and frequency are required"
            }), 400


        if activity_type not in activity_mapping:
            return jsonify({
                "message": "Invalid activity type"
            }), 400


        activity_number = activity_mapping[activity_type]


        input_data = pd.DataFrame([
            {
                "activity_type": activity_number,
                "quantity": float(quantity),
                "frequency": float(frequency)
            }
        ])


        prediction = model.predict(input_data)


        return jsonify({
            "activity_type": activity_type,
            "quantity": quantity,
            "frequency": frequency,
            "predicted_impact": prediction[0]
        })


    except Exception as error:

        print("Prediction error:", error)

        return jsonify({
            "message": "Prediction failed"
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=True
    )