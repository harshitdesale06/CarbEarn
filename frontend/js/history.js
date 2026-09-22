const userData =
    localStorage.getItem("carbearn_user");

if (!userData) {
    window.location.href = "login.html";
}

const user =
    JSON.parse(userData);


const historyContainer =
    document.getElementById(
        "historyContainer"
    );



async function loadHistory() {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/activities/user/${user.id}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            historyContainer.innerHTML =
                "<p>Failed to load activity history.</p>";

            return;
        }


        document.getElementById(
            "totalActivities"
        ).textContent =
            data.total_activities;


        let totalCO2 = 0;

        let totalPoints = 0;


        data.activities.forEach(
            function (activity) {

                totalCO2 +=
                    Number(
                        activity.co2_saved
                    );

                totalPoints +=
                    Number(
                        activity.points
                    );

            }
        );


        document.getElementById(
            "totalCO2"
        ).textContent =
            totalCO2.toFixed(2);


        document.getElementById(
            "totalPoints"
        ).textContent =
            totalPoints;



        if (data.activities.length === 0) {

            historyContainer.innerHTML = `

                <div class="empty-history">

                    <h3>
                        No activities yet
                    </h3>

                    <p>
                        Start recording your
                        eco-friendly activities
                        to see them here.
                    </p>

                    <a
                        href="activities.html"
                        class="primary-button">

                        Add Your First Activity

                    </a>

                </div>

            `;

            return;
        }



        historyContainer.innerHTML = "";



        data.activities.forEach(
            function (activity) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "history-item";


                item.innerHTML = `

                    <div class="history-main">

                        <div class="history-icon">
                            ✓
                        </div>


                        <div>

                            <h3>
                                ${activity.activity_name}
                            </h3>


                            <p>

                                ${activity.quantity}
                                ${activity.unit}

                                ·

                                ${activity.frequency}
                                time(s)/week

                                ·

                                ${activity.activity_date}

                            </p>

                        </div>

                    </div>



                    <div class="history-values">


                        <div>

                            <strong>

                                ${Number(
                                    activity.co2_saved
                                ).toFixed(2)}

                            </strong>

                            <span>
                                kg CO₂
                            </span>

                        </div>



                        <div>

                            <strong>

                                ${activity.points}

                            </strong>

                            <span>
                                points
                            </span>

                        </div>



                        <span
                            class="impact-badge
                            impact-${activity.impact.toLowerCase()}">

                            ${activity.impact}

                        </span>



                        <span
                            class="impact-badge
                            impact-${(
                                activity.ml_prediction ||
                                "Low"
                            ).toLowerCase()}">

                            ML:
                            ${activity.ml_prediction || "N/A"}

                        </span>


                    </div>

                `;


                historyContainer.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "History error:",
            error
        );


        historyContainer.innerHTML =
            "<p>Cannot connect to server.</p>";

    }

}



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



loadHistory();