const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;


        loginMessage.textContent =
            "Logging in...";

        loginMessage.style.color =
            "#71827d";


        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data =
                await response.json();


            if (response.ok) {

                localStorage.setItem(
                    "carbearn_user",
                    JSON.stringify(data.user)
                );


                loginMessage.textContent =
                    "Login successful! Redirecting...";

                loginMessage.style.color =
                    "#0b8068";


                setTimeout(function () {

                    window.location.href =
                        "dashboard.html";

                }, 1000);


            } else {

                loginMessage.textContent =
                    data.message ||
                    "Login failed";

                loginMessage.style.color =
                    "#c0392b";

            }


        } catch (error) {

            console.error(error);


            loginMessage.textContent =
                "Cannot connect to server.";

            loginMessage.style.color =
                "#c0392b";

        }

    }
);