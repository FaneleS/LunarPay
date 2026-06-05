import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from "./lib/supabase.js";
import App from "./lunarpay.jsx";
import Auth from "./modules/Auth.jsx";

function Root() {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    // Check for existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Still checking session
  if (session === undefined) {
    return (
      <div style={{
        minHeight: "100vh", background: "#F5F2EA", display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif",
        backgroundImage: "radial-gradient(circle, rgba(101,109,74,0.07) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}>
        <div style={{ textAlign: "center" }}>
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none" style={{ marginBottom: 16 }}>
            <circle cx="14" cy="14" r="9" stroke="#656D4A" strokeWidth="1.4" />
            <circle cx="14" cy="14" r="4" fill="#C4B470" />
            <circle cx="23" cy="7" r="2.2" fill="#656D4A" />
          </svg>
          <div style={{ fontSize: 13, color: "#7F7455" }}>Loading LunarPay…</div>
        </div>
      </div>
    );
  }

  // Not logged in — show auth screen
  if (!session) {
    return <Auth onAuth={setSession} />;
  }

  // Logged in — show main app
  return <App session={session} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>
);