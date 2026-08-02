/**
 * CareFlow — Patient login page
 * Script order: CDN → supabase.js → script.js
 */

document.addEventListener("DOMContentLoaded", function () {
  var loginForm = document.getElementById("patientLoginForm");
  if (!loginForm) return;

  var client = window.supabase;
  if (!client || !client.auth || typeof client.auth.signInWithPassword !== "function") {
    console.error("[CareFlow] Supabase client not ready.");
    alert("Auth not ready. Hard-refresh (Ctrl+Shift+R). Check console for errors.");
    return;
  }

  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");
  var registerButton = document.querySelector(".register-button");
  var forgotLink = document.querySelector(".password-label a");

  var message = document.getElementById("authMessage");
  if (!message) {
    message = document.createElement("div");
    message.id = "authMessage";
    message.setAttribute("role", "alert");
    message.style.cssText =
      "margin-top:16px;padding:12px 14px;border-radius:10px;display:none;font-weight:600;font-size:13px;line-height:1.45;";
    loginForm.appendChild(message);
  }

  function showMessage(text, type) {
    message.style.display = "block";
    message.textContent = text;
    message.style.background = type === "success" ? "#d4edda" : "#f8d7da";
    message.style.color = type === "success" ? "#155724" : "#721c24";
    message.style.border = "1px solid " + (type === "success" ? "#c3e6cb" : "#f5c6cb");
  }

  var loginBtn = loginForm.querySelector(".login-button");
  if (loginBtn) {
    loginBtn.type = "submit";
    loginBtn.removeAttribute("onclick");
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    var email = (emailInput && emailInput.value ? emailInput.value : "").trim();
    var password = passwordInput ? passwordInput.value : "";

    if (!email) { showMessage("Please enter your email.", "error"); return; }
    if (!password) { showMessage("Please enter your password.", "error"); return; }

    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = "Logging in…";
    }

    try {
      var result = await client.auth.signInWithPassword({ email: email, password: password });

      if (result.error) {
        var msg = result.error.message || "Login failed.";
        if (/invalid login credentials/i.test(msg)) msg = "Invalid email or password.";
        if (/email not confirmed/i.test(msg)) {
          msg = "Email not confirmed. Confirm via inbox, or disable Confirm email in Supabase.";
        }
        showMessage(msg, "error");
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = "Login to Patient Portal";
        }
        return;
      }

      if (!result.data || !result.data.session) {
        showMessage(
          "No session. Disable 'Confirm email' in Supabase Auth settings for testing.",
          "error"
        );
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = "Login to Patient Portal";
        }
        return;
      }

      localStorage.setItem("loggedIn", "true");
      showMessage("Login successful! Redirecting…", "success");
      window.location.assign("patient-dashboard.html");
    } catch (err) {
      console.error(err);
      showMessage(err.message || "Unexpected error.", "error");
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login to Patient Portal";
      }
    }
  });

  if (forgotLink) {
    forgotLink.addEventListener("click", async function (e) {
      e.preventDefault();
      var email =
        (emailInput && emailInput.value ? emailInput.value : "").trim() ||
        prompt("Enter your registered email:");
      if (!email) return;
      var result = await client.auth.resetPasswordForEmail(email.trim());
      if (result.error) showMessage(result.error.message, "error");
      else showMessage("Password reset email sent. Check your inbox.", "success");
    });
  }

  if (registerButton) {
    registerButton.addEventListener("click", async function () {
      var email = prompt("Enter email for new account:");
      if (!email || !email.trim()) return;
      var password = prompt("Password (min 6 characters):");
      if (!password || password.length < 6) {
        showMessage("Password must be at least 6 characters.", "error");
        return;
      }
      var fullName = prompt("Your full name:") || "Patient";

      registerButton.disabled = true;
      registerButton.textContent = "Creating account…";

      var result = await client.auth.signUp({
        email: email.trim(),
        password: password,
        options: { data: { full_name: fullName } },
      });

      if (result.error) {
        showMessage(result.error.message, "error");
        registerButton.disabled = false;
        registerButton.textContent = "Create New Account";
        return;
      }

      if (result.data && result.data.session) {
        localStorage.setItem("loggedIn", "true");
        showMessage("Account created! Redirecting…", "success");
        window.location.assign("patient-dashboard.html");
      } else {
        showMessage("Account created. Confirm email if required, then log in.", "success");
        registerButton.disabled = false;
        registerButton.textContent = "Create New Account";
        if (emailInput) emailInput.value = email.trim();
      }
    });
  }

  client.auth.getSession().then(function (res) {
    if (res.data && res.data.session) {
      window.location.assign("patient-dashboard.html");
    }
  });
});
