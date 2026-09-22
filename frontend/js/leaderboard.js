const userData =
    localStorage.getItem("carbearn_user");


if (!userData) {

    window.location.href =
        "login.html";

}


const currentUser =
    JSON.parse(userData);


const leaderboardContainer =
    document.getElementById(
        "leaderboardContainer"
    );


const totalUsers =
    document.getElementById(
        "totalUsers"
    );


async function loadLeaderboard() {

    try {

        const response =
            await fetch(
                "http://localhost:5000/api/leaderboard"
            );


        const data =
            await response.json();


        if (!response.ok) {

            leaderboardContainer.innerHTML =
                "<p>Failed to load leaderboard.</p>";

            return;

        }


        totalUsers.textContent =
            `${data.total_users} users`;


        if (data.leaderboard.length === 0) {

            leaderboardContainer.innerHTML = `

                <div class="empty-leaderboard">

                    <h3>
                        No users yet
                    </h3>

                    <p>
                        Start adding activities to
                        appear on the leaderboard.
                    </p>

                </div>

            `;

            return;

        }


        leaderboardContainer.innerHTML = "";


        data.leaderboard.forEach(
            function (user) {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "leaderboard-row";


                if (
                    user.user_id ===
                    currentUser.id
                ) {

                    row.classList.add(
                        "current-user"
                    );

                }


                row.innerHTML = `

                    <div class="rank">

                        ${user.rank}

                    </div>


                    <div class="leader-user">

                        <div class="user-avatar">

                            ${user.name
                                .charAt(0)
                                .toUpperCase()}

                        </div>


                        <div>

                            <strong>
                                ${user.name}
                            </strong>

                            <span>
                                ${user.college ||
                                "College not provided"}
                            </span>

                        </div>

                    </div>


                    <div class="leader-stat">

                        <strong>
                            ${user.total_activities}
                        </strong>

                        <span>
                            Activities
                        </span>

                    </div>


                    <div class="leader-stat">

                        <strong>
                            ${user.total_co2_saved}
                        </strong>

                        <span>
                            kg CO₂
                        </span>

                    </div>


                    <div class="leader-points">

                        <strong>
                            ${user.total_points}
                        </strong>

                        <span>
                            Points
                        </span>

                    </div>

                `;


                leaderboardContainer.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        leaderboardContainer.innerHTML =
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


loadLeaderboard();