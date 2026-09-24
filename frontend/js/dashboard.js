const userData =
    localStorage.getItem("carbearn_user");


if (!userData) {

    window.location.href =
        "login.html";

}


const user =
    JSON.parse(userData);


const userName =
    document.getElementById("userName");

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileCollege =
    document.getElementById("profileCollege");


userName.textContent =
    user.name;

profileName.textContent =
    user.name;

profileEmail.textContent =
    user.email;

profileCollege.textContent =
    user.college || "Not provided";


async function loadDashboard() {

    try {

        const response =
            await fetch(
                `http://localhost:5000/api/dashboard/${user.id}`
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to load dashboard"
            );

            return;

        }


        const summary =
            data.summary;

        const breakdown =
            data.impact_breakdown;


        document.getElementById(
            "totalActivities"
        ).textContent =
            summary.total_activities;


        document.getElementById(
            "totalCO2"
        ).textContent =
            summary.total_co2_saved;


        document.getElementById(
            "totalPoints"
        ).textContent =
            summary.total_points;


        document.getElementById(
            "overallImpact"
        ).textContent =
            summary.overall_impact;


        document.getElementById(
            "lowImpact"
        ).textContent =
            breakdown.low;


        document.getElementById(
            "mediumImpact"
        ).textContent =
            breakdown.medium;


        document.getElementById(
            "highImpact"
        ).textContent =
            breakdown.high;


        const total =
            breakdown.low +
            breakdown.medium +
            breakdown.high;


        if (total > 0) {

            document.getElementById(
                "lowImpactBar"
            ).style.width =
                `${(breakdown.low / total) * 100}%`;


            document.getElementById(
                "mediumImpactBar"
            ).style.width =
                `${(breakdown.medium / total) * 100}%`;


            document.getElementById(
                "highImpactBar"
            ).style.width =
                `${(breakdown.high / total) * 100}%`;

        }


        // Load recent activities
        loadRecentActivities(
            data.recent_activities
        );

        updateGoalProgress(
            summary.total_co2_saved
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        alert(
            "Cannot connect to server."
        );

    }

}


function loadRecentActivities(
    activities
) {

    const container =
        document.getElementById(
            "recentActivities"
        );


    if (!container) {
        return;
    }


    if (
        !activities ||
        activities.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-recent">
                <p>No activities recorded yet.</p>

                <a
                    href="activities.html"
                    class="primary-button">
                    Add Activity
                </a>
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    activities.forEach(
        function (activity) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "recent-activity-item";


            item.innerHTML = `
                <div class="recent-activity-main">

                    <div class="recent-activity-icon">
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
                        </p>

                        <span>
                            ${activity.activity_date}
                        </span>

                    </div>

                </div>


                <div class="recent-activity-values">

                    <div>
                        <strong>
                            ${activity.co2_saved}
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
                        class="impact-badge impact-${activity.impact.toLowerCase()}">
                        ${activity.impact}
                    </span>


                    <span
                        class="impact-badge impact-${(
                            activity.ml_prediction ||
                            "low"
                        ).toLowerCase()}">
                        ML:
                        ${activity.ml_prediction || "N/A"}
                    </span>

                </div>
            `;


            container.appendChild(
                item
            );

        }
    );

}

function updateGoalProgress(totalCO2) {

    const goal =
        50;

    const percentage =
        Math.min(
            (Number(totalCO2) / goal) * 100,
            100
        );

    document.getElementById(
        "goalCO2"
    ).textContent =
        Number(totalCO2).toFixed(2);


    document.getElementById(
        "goalProgress"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "goalPercentage"
    ).textContent =
        Math.round(percentage) + "%";

}


loadDashboard();


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