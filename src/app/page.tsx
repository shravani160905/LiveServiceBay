"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Service Advisor");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This pushes the browser straight to your new dashboard folder layout
    router.push("/dashboard");
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.65)), url('https://img.freepik.com/premium-photo/car-automobile-repair-service-center-with-softfocus-light-background_41050-6507.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "blur(12px)", transform: "scale(1.1)", zIndex: -1 }} />
      <div style={{ width: "100%", maxWidth: "420px", padding: "40px", borderRadius: "24px", backgroundColor: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.15)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", color: "#ffffff", boxSizing: "border-box", margin: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "900", margin: "0 0 8px 0" }}>LIVE SERVICE BAY</h1>
          <p style={{ color: "#38bdf8", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", margin: 0, letterSpacing: "1.5px" }}>Smart Workshop. Smart Service.</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "800", marginBottom: "8px" }}>Username / Email</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(0,0,0,0.4)", color: "#fff", fontSize: "15px", fontWeight: "600", outline: "none", boxSizing: "border-box" }} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "800", marginBottom: "8px" }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "rgba(0,0,0,0.4)", color: "#fff", fontSize: "15px", fontWeight: "600", outline: "none", boxSizing: "border-box" }} required />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "800", marginBottom: "8px" }}>Access Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", backgroundColor: "#0f172a", color: "#fff", fontSize: "15px", fontWeight: "800", cursor: "pointer", boxSizing: "border-box" }}>
              <option value="Admin">Admin</option>
              <option value="Service Advisor">Service Advisor</option>
              <option value="Technician">Technician</option>
            </select>
          </div>
          <button type="submit" style={{ width: "100%", padding: "16px", marginTop: "10px", border: "none", borderRadius: "12px", backgroundColor: "#2563eb", color: "#fff", fontSize: "16px", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)" }}>
            Validate User
          </button>
        </form>
      </div>
    </div>
  );
}