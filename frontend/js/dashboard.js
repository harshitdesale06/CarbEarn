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