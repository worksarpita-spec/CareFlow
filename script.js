
// ===============================
// CareFlow Patient Login Script
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("patientLoginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const loginButton = document.querySelector(".login-button");
    const registerButton = document.querySelector(".register-button");
    const forgotPassword = document.querySelector(".password-label a");

    //-------------------------------------------------------
    // Create Message Box
    //-------------------------------------------------------

    const message = document.createElement("div");
    message.style.marginTop = "20px";
    message.style.padding = "12px";
    message.style.borderRadius = "12px";
    message.style.display = "none";
    message.style.fontWeight = "600";
    loginForm.appendChild(message);

    function showMessage(text, type) {

        message.innerText = text;
        message.style.display = "block";

        if (type === "success") {
            message.style.background = "#d4edda";
            message.style.color = "#155724";
            message.style.border = "1px solid #c3e6cb";
        }

        else {

            message.style.background = "#f8d7da";
            message.style.color = "#721c24";
            message.style.border = "1px solid #f5c6cb";

        }

    }

    //-------------------------------------------------------
    // Login
    //-------------------------------------------------------

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const userEmail = email.value.trim();
        const userPassword = password.value.trim();

        //---------------------------------------------------

        if (userEmail === "") {

            showMessage("Please enter your email.", "error");
            return;

        }

        if (userPassword === "") {

            showMessage("Please enter your password.", "error");
            return;

        }

        //---------------------------------------------------
        // Demo Login
        //---------------------------------------------------

        loginButton.disabled = true;
        loginButton.innerHTML = "Logging in...";

        setTimeout(() => {

            // Demo Credentials

            if (
                userEmail === "patient@careflow.com" &&
                userPassword === "123456"
            ) {

                localStorage.setItem("patientEmail", userEmail);
                localStorage.setItem("loggedIn", "true");

                showMessage("Login Successful!", "success");

                setTimeout(() => {

                    window.location.href = "patient-dashboard.html";

                }, 1200);

            }

            else {

                showMessage(
                    "Invalid Email or Password.",
                    "error"
                );

                loginButton.disabled = false;
                loginButton.innerHTML =
                    "Login to Patient Portal <span>→</span>";

            }

        }, 1200);

    });

    //-------------------------------------------------------
    // Register Button
    //-------------------------------------------------------

    registerButton.addEventListener("click", () => {

        window.location.href = "patient-dashboard.html";

    });

    //-------------------------------------------------------
    // Forgot Password
    //-------------------------------------------------------

    forgotPassword.addEventListener("click", function (e) {

        e.preventDefault();

        const userEmail = prompt(
            "Enter your registered email address:"
        );

        if (userEmail === null) return;

        if (userEmail.trim() === "") {

            alert("Email cannot be empty.");

            return;

        }

        alert(
            "Password reset link has been sent to:\n\n" +
            userEmail
        );

    });

    //-------------------------------------------------------
    // Auto Login
    //-------------------------------------------------------

    if (localStorage.getItem("loggedIn") === "true") {

        window.location.href = "patient-dashboard.html";

    }

});
