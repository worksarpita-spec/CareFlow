/**
 * CareFlow — Supabase client
 * Load AFTER the CDN: @supabase/supabase-js@2
 * Do NOT use `const supabase = ...` — the CDN already declares that name.
 */

(function (global) {
  var SUPABASE_URL = "https://vjxtbfyvttpbcupxoong.supabase.co";
  var SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqeHRiZnl2dHRwYmN1cHhvb25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1ODcwOTksImV4cCI6MjEwMTE2MzA5OX0.JOX-3aA30_nIBA5l3avirnb4zvPQY3c5_ec69QANlF0";

  var lib = global.supabase;
  if (!lib || typeof lib.createClient !== "function") {
    console.error("[CareFlow] Load CDN @supabase/supabase-js@2 before supabase.js");
    return;
  }

  var client = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  // Replace library global with the client instance (used by all pages)
  global.supabase = client;

  global.getSession = async function () {
    var result = await client.auth.getSession();
    if (result.error) {
      console.error(result.error.message);
      return null;
    }
    return result.data.session;
  };

  global.getUser = async function () {
    var session = await global.getSession();
    return session ? session.user : null;
  };

  global.requirePatientAuth = async function (redirectTo) {
    redirectTo = redirectTo || "patient-login.html";
    var session = await global.getSession();
    if (!session) {
      window.location.href = redirectTo;
      return null;
    }
    return session;
  };

  global.requireDoctorAuth = async function (redirectTo) {
    redirectTo = redirectTo || "doctor-login.html";
    var session = await global.getSession();
    if (!session) {
      window.location.href = redirectTo;
      return null;
    }
    var doctor = null;
    try {
      doctor = JSON.parse(sessionStorage.getItem("careflow_doctor") || "null");
    } catch (e) {}
    if (!doctor || !doctor.id) {
      var res = await client
        .from("doctors")
        .select("id, full_name, department, email")
        .eq("email", session.user.email)
        .maybeSingle();
      if (res.error || !res.data) {
        await client.auth.signOut();
        sessionStorage.removeItem("careflow_doctor");
        window.location.href = redirectTo;
        return null;
      }
      doctor = res.data;
      sessionStorage.setItem("careflow_doctor", JSON.stringify(doctor));
    }
    return { session: session, doctor: doctor };
  };

  global.executeLogout = async function (redirectTo) {
    redirectTo = redirectTo || "patient-login.html";
    try {
      await client.auth.signOut();
    } catch (e) {}
    sessionStorage.removeItem("careflow_doctor");
    sessionStorage.removeItem("careflow_pending_appt");
    localStorage.removeItem("loggedIn");
    window.location.href = redirectTo;
  };

  global.signIn = function (email, password) {
    return client.auth.signInWithPassword({
      email: String(email).trim(),
      password: password,
    });
  };

  global.signUp = function (email, password, fullName) {
    return client.auth.signUp({
      email: String(email).trim(),
      password: password,
      options: { data: { full_name: fullName || "Patient" } },
    });
  };

  global.resetPassword = function (email) {
    return client.auth.resetPasswordForEmail(String(email).trim(), {
      redirectTo: window.location.origin + "/patient-login.html",
    });
  };

  global.onAuthStateChange = function (cb) {
    return client.auth.onAuthStateChange(function (event, session) {
      cb(event, session);
    });
  };

  console.log("[CareFlow] Supabase client ready");
})(window);
