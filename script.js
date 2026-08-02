
const SUPABASE_URL = "https://vjxtbfyvttpbcupxoong.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqeHRiZnl2dHRwYmN1cHhvb25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1ODcwOTksImV4cCI6MjEwMTE2MzA5OX0.JOX-3aA30_nIBA5l3avirnb4zvPQY3c5_ec69QANlF0";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);



document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("patientLoginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const registerButton = document.querySelector(".register-button");
    const forgotPassword = document.querySelector(".password-label a");


    const message = document.createElement("div");

    message.style.marginTop = "20px";
    message.style.padding = "12px";
    message.style.borderRadius = "10px";
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

        } else {

            message.style.background = "#f8d7da";
            message.style.color = "#721c24";
            message.style.border = "1px solid #f5c6cb";

        }

    }


    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const userEmail = email.value.trim();
        const userPassword = password.value.trim();

        if (!userEmail) {

            showMessage("Please enter your email.", "error");
            return;

        }

        if (!userPassword) {

            showMessage("Please enter your password.", "error");
            return;

        }


        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: userEmail,
                password: userPassword

            });

        if (error) {

            showMessage(error.message, "error");
            return;

        }

        showMessage("Login Successful!", "success");

        localStorage.setItem("loggedIn", "true");

        setTimeout(() => {

            window.location.href = "patient-dashboard.html";

        }, 1000);

    });

    forgotPassword.addEventListener("click", async (e) => {

        e.preventDefault();

        const userEmail = prompt(
            "Enter your registered email:"
        );

        if (!userEmail) return;

        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(
                userEmail
            );

        if (error) {

            alert(error.message);

        } else {

            alert("Password reset email sent!");

        }

    });


    (async () => {

        const {
            data: { session }

        } = await supabaseClient.auth.getSession();

        if (session) {

            window.location.href = "patient-dashboard.html";

        }

    })();

});


function openPopup() {

    document.getElementById("confirmationPopup").style.display = "flex";

}

function closePopup() {

    document.getElementById("confirmationPopup").style.display = "none";

}
