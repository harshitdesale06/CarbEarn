const userData = localStorage.getItem("carbearn_user");

if (!userData) {
    window.location.href = "login.html";
}

const user = JSON.parse(userData);


const activitySelect =
    document.getElementById("activity");

const quantityInput =
    document.getElementById("quantity");

const frequencyInput =
    document.getElementById("frequency");

const activityDate =
    document.getElementById("activityDate");

const unitText =
    document.getElementById("unitText");

const activityDescription =
    document.getElementById("activityDescription");

const activityList =
    document.getElementById("activityList");

const activityForm =
    document.getElementById("activityForm");

const activityMessage =
    document.getElementById("activityMessage");

const mlPrediction =
    document.getElementById("mlPrediction");


let activities = [];



function setTodayDate() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    activityDate.value =
        year + "-" + month + "-" + day;
}



async function loadActivities() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/activities"
            );

        const data =
            await response.json();


        if (!response.ok) {

            activityList.innerHTML =
                "<p>Failed to load activities.</p>";

            return;
        }


        activities =
            data.activities;


        activitySelect.innerHTML =
            '<option value="">Select an activity</option>';


        activities.forEach(
            function (activity) {

                const option =
                    document.createElement("option");

                option.value =
                    activity.id;

                option.textContent =
                    activity.name +
                    " (" +
                    activity.unit +
                    ")";

                activitySelect.appendChild(
                    option
                );

            }
        );


        displayActivityList();


    } catch (error) {

        console.error(
            "Activity loading error:",
            error
        );

        activityList.innerHTML =
            "<p>Cannot connect to server.</p>";
    }
}



function displayActivityList() {

    activityList.innerHTML = "";


    activities.forEach(
        function (activity) {

            const item =
                document.createElement("div");

            item.className =
                "activity-item";


            item.innerHTML =
                "<div>" +
                    "<strong>" +
                        activity.name +
                    "</strong>" +

                    "<span>" +
                        "Unit: " +
                        activity.unit +
                    "</span>" +
                "</div>" +

                "<p>" +
                    (activity.description || "") +
                "</p>";


            activityList.appendChild(
                item
            );

        }
    );
}



activitySelect.addEventListener(
    "change",
    function () {

        const selectedId =
            Number(
                activitySelect.value
            );


        const selectedActivity =
            activities.find(
                function (activity) {

                    return activity.id ===
                        selectedId;

                }
            );


        if (!selectedActivity) {

            unitText.textContent =
                "Select an activity first";

            activityDescription.textContent =
                "";

            return;
        }


        unitText.textContent =
            "Unit: " +
            selectedActivity.unit;


        activityDescription.textContent =
            selectedActivity.description || "";

    }
);



activityForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const activityId =
            Number(
                activitySelect.value
            );


        const quantity =
            Number(
                quantityInput.value
            );


        const frequency =
            Number(
                frequencyInput.value
            );


        const date =
            activityDate.value;


        if (!activityId) {

            activityMessage.textContent =
                "Please select an activity.";

            activityMessage.style.color =
                "#c0392b";

            return;
        }


        if (!quantity || quantity <= 0) {

            activityMessage.textContent =
                "Please enter a valid quantity.";

            activityMessage.style.color =
                "#c0392b";

            return;
        }


        if (!frequency || frequency <= 0) {

            activityMessage.textContent =
                "Please enter a valid frequency.";

            activityMessage.style.color =
                "#c0392b";

            return;
        }


        if (!date) {

            activityMessage.textContent =
                "Please select a date.";

            activityMessage.style.color =
                "#c0392b";

            return;
        }


        const selectedActivity =
            activities.find(
                function (activity) {

                    return activity.id ===
                        activityId;

                }
            );


        if (!selectedActivity) {

            activityMessage.textContent =
                "Invalid activity selected.";

            activityMessage.style.color =
                "#c0392b";

            return;
        }


        activityMessage.textContent =
            "Getting ML prediction...";

        activityMessage.style.color =
            "#71827d";


        mlPrediction.textContent =
            "Predicting...";


        try {

            /*
             * STEP 1
             * Get ML prediction
             */

            const mlResponse =
                await fetch(
                    "http://localhost:5000/api/ml/predict",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            activity_type:
                                selectedActivity.name,

                            quantity:
                                quantity,

                            frequency:
                                frequency

                        })
                    }
                );


            const mlData =
                await mlResponse.json();


            if (!mlResponse.ok) {

                activityMessage.textContent =
                    mlData.message ||
                    "ML prediction failed.";

                activityMessage.style.color =
                    "#c0392b";

                mlPrediction.textContent =
                    "-";

                return;
            }


            const predictedImpact =
                mlData.prediction.predicted_impact;


            /*
             * STEP 2
             * Save activity with ML prediction
             */

            activityMessage.textContent =
                "Saving activity...";


            const response =
                await fetch(
                    "http://localhost:5000/api/activities/add",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            user_id:
                                user.id,

                            activity_id:
                                activityId,

                            quantity:
                                quantity,

                            frequency:
                                frequency,

                            activity_date:
                                date,

                            ml_prediction:
                                predictedImpact

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                activityMessage.textContent =
                    data.message ||
                    "Failed to add activity.";

                activityMessage.style.color =
                    "#c0392b";

                mlPrediction.textContent =
                    "-";

                return;
            }


            /*
             * STEP 3
             * Display results
             */

            activityMessage.textContent =
                "Activity added successfully!";

            activityMessage.style.color =
                "#0b8068";


            document.getElementById(
                "savedCO2"
            ).textContent =
                data.activity.co2_saved;


            document.getElementById(
                "earnedPoints"
            ).textContent =
                data.activity.points;


            document.getElementById(
                "activityImpact"
            ).textContent =
                data.activity.impact;


            mlPrediction.textContent =
                data.activity.ml_prediction;


            document.getElementById(
                "successCard"
            ).style.display =
                "block";


            /*
             * STEP 4
             * Reset form
             */

            activityForm.reset();


            setTodayDate();


            unitText.textContent =
                "Select an activity first";


            activityDescription.textContent =
                "";


            window.scrollTo({

                top:
                    document.body.scrollHeight,

                behavior:
                    "smooth"

            });

        } catch (error) {

            console.error(
                "Add activity error:",
                error
            );


            activityMessage.textContent =
                "Cannot connect to server.";

            activityMessage.style.color =
                "#c0392b";


            mlPrediction.textContent =
                "-";
        }

    }
);



document.getElementById(
    "logoutButton"
).addEventListener(
    "click",
    function (event) {

        event.preventDefault();


        localStorage.removeItem(
            "carbearn_user"
        );


        window.location.href =
            "login.html";

    }
);



setTodayDate();

loadActivities();