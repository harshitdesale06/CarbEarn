const registerForm = document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");


registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const college =
        document.getElementById("college").value.trim();


    registerMessage.textContent =
        "Creating account...";


    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    college: college
                })
            }
        );


        const data = await response.json();


        if (response.ok) {

            registerMessage.textContent =
                "Account created successfully! Redirecting...";


            registerMessage.style.color =
                "#0b8068";


            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1500);

        } else {

            registerMessage.textContent =
                data.message || "Registration failed";

            registerMessage.style.color =
                "#c0392b";
        }


    } catch (error) {

        console.error(error);

        registerMessage.textContent =
            "Cannot connect to server.";

        registerMessage.style.color =
            "#c0392b";
    }

});