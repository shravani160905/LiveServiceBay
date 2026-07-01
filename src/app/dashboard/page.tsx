"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  
  // 🏢 MASTER SYNCHRONIZED APP STATES
  const [activeTab, setActiveTab] = useState("Active Workspace");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bays, setBays] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // SEARCH & DATE FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Active"); // 🎯 Tracks "Active" vs "Completed" cars
  const [dateFilter, setDateFilter] = useState("All");

  // Form Management Intake Registers
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState(""); 
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [brandModel, setBrandModel] = useState("");
  const [manufactureYear, setManufactureYear] = useState("2022"); 
  const [editingJobId, setEditingJobId] = useState<string | null>(null); 
  const [formError, setFormError] = useState<string | null>(null);

  // Workforce Form Inputs
  const [empName, setEmpName] = useState("");
  const [empRole, setEmpRole] = useState("Technician");
  const [empEmail, setEmpEmail] = useState("");
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);

  // Bay Form Input
  const [newBayName, setNewBayName] = useState("");

  const [selectedTechs, setSelectedTechs] = useState<{ [key: string]: string }>({});
  const [selectedBays, setSelectedBays] = useState<{ [key: string]: string }>({});
  const [editingRows, setEditingRows] = useState<{ [key: string]: boolean }>({});

  // 💬 TOAST NOTIFICATION STATE
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── NEW AUTOMATED CROSS-VERIFICATION MODAL STATES ──
  const [verificationStatus, setVerificationStatus] = useState("IDLE"); 
  const [verifyingJobId, setVerifyingJobId] = useState<string | null>(null);
  const [expectedVehicleNo, setExpectedVehicleNo] = useState("");
  const [serverWarningMsg, setServerWarningMsg] = useState<string | null>(null);

  const yearOptions = [];
  for (let y = 2026; y >= 2015; y--) {
    yearOptions.push(y.toString());
  }

  // ⏱️ SELF-CLEANING TOAST DISMISSAL HELPER FUNCTION (10 Seconds)
  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 10000); // Exactly 10 seconds
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // 🕵️ BACKGROUND DATABASE POLLING LOOP
  const startVerificationPolling = (jobId: string) => {
    let attempts = 0;
    const maxAttempts = 12; 

    const intervalId = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) return;
        const currentJobData = await res.json();

        // 🚨 CASE A: Camera caught a plate mismatch and wrote a warning string!
        if (currentJobData.ocrWarning) {
          clearInterval(intervalId);
          setServerWarningMsg(currentJobData.ocrWarning);
          setVerificationStatus("MISMATCH");
          triggerToast("⚠️ Cross-verification unmatched! Try again.", "error");
          return;
        }

        // ✅ CASE B: Successful verification match confirmed
        if (currentJobData.status === "In Progress" && !currentJobData.ocrWarning) {
          clearInterval(intervalId);
          setVerificationStatus("MATCHED");
          triggerToast("✓ Successful cross-verification!", "success");
  
        setTimeout(() => {
          setVerificationStatus("IDLE");
          setVerifyingJobId(null);
          refreshAllData();
        }, 2000);
        return;
      }

      } catch (err) {
        console.error("Polling execution error:", err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        setServerWarningMsg("Verification Timeout: CCTV camera could not parse plate text within 24s.");
        setVerificationStatus("MISMATCH");
      }
    }, 2000); 
  };

  // ⚠️ MANUAL OVERRIDE HANDLER
  const handleManualOverride = async () => {
    if (!verifyingJobId) return;
    try {
      await fetch(`/api/jobs/${verifyingJobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ocrWarning: null }), 
      });
      setVerificationStatus("IDLE");
      setVerifyingJobId(null);
      refreshAllData();
    } catch (err) {
      console.error("Override execution error:", err);
    }
  };

  // 🚀 LINK GENERATION: WHATSAPP INTEGRATION DISPATCHER
  const handleSendTrackLink = (customerPhone: string, jobId: string, vehicleNum: string) => {
    const cleanPhone = customerPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const trackingLink = `http://172.16.0.15.nip.io:3000/track?jobId=${jobId}`;
    const message = `Hello! Your vehicle (${vehicleNum.toUpperCase()}) has been securely stationed in our service bay. Track your real-time CCTV operations thread here: ${trackingLink}`;
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // 🎨 ENTERPRISE STATUS BADGE COLOR SCHEME GENERATOR
  const getStatusBadgeStyle = (status: string) => {
    const normalizeStatus = status?.toUpperCase() || "";

    const baseStyles = {
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "13px", 
      fontWeight: "800",
      display: "inline-block",
      textAlign: "center" as const,
      letterSpacing: "0.5px",
      border: "1px solid",
      textTransform: "uppercase" as const
    };

    if (normalizeStatus === "COMPLETED" || normalizeStatus === "DONE") {
      return {
        ...baseStyles,
        backgroundColor: "#f0fdf4",
        color: "#16a34a",
        borderColor: "#bbf7d0"
      };
    }
    
    if (normalizeStatus === "IN PROGRESS") {
      return {
        ...baseStyles,
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        borderColor: "#bfdbfe"
      };
    }

    if (normalizeStatus === "PENDING" || normalizeStatus === "INTAKE" || normalizeStatus === "PENDING ALLOCATION") {
      return {
        ...baseStyles,
        backgroundColor: "#fffbeb",
        color: "#d97706",
        borderColor: "#fde68a"
      };
    }

    return {
      ...baseStyles,
      backgroundColor: "#f8fafc",
      color: "#64748b",
      borderColor: "#cbd5e1"
    };
  };

  const showToastNotification = (message: string, type: "success" | "error") => {
    triggerToast(message, type);
  };

  const refreshAllData = async () => {
    try {
      setLoading(true);
      const [jobsRes, usersRes, baysRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/users"),
        fetch("/api/bays")
      ]);
      
      // Parse the JSON responses safely
      let jobsData = await jobsRes.json();
      let usersData = await usersRes.json();
      let baysData = await baysRes.json();

      // 🛡️ SAFELY CLEAN ARRAYS WITHOUT BREAKING THE NEXT.JS OVERLAY LAYER
      if (!Array.isArray(jobsData) || jobsData.error) {
        console.warn("API Note: /api/jobs returned empty or error data.");
        jobsData = []; 
      }
      if (!Array.isArray(usersData) || usersData.error) {
        console.warn("API Note: /api/users returned empty or error data.");
        usersData = [];
      }
      if (!Array.isArray(baysData) || baysData.error) {
        console.warn("API Note: /api/bays returned empty or error data.");
        baysData = [];
      }

      setJobs(jobsData);
      setUsers(usersData);
      setBays(baysData);

      const techMap: { [key: string]: string } = {};
      const bayMap: { [key: string]: string } = {};
      
      jobsData.forEach((job: any) => {
        if (job && job.id) {
          techMap[job.id] = job.assignedTech || "Unassigned";
          bayMap[job.id] = job.assignedBay || "Unassigned";
        }
      });
      
      setSelectedTechs(techMap);
      setSelectedBays(bayMap);
    } catch (error) {
      console.warn("Data tracking refresh caught network issue, using safe fallbacks.");
      setJobs([]);
      setUsers([]);
      setBays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    const nameClean = customerName.trim();
    const phoneClean = phoneNumber.trim().replace(/\D/g, ""); 
    const emailClean = customerEmail.trim();
    const rawVehicle = vehicleNumber.replace(/\s+/g, "").toUpperCase(); 

    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

    if (!nameRegex.test(nameClean)) {
      setFormError("Customer Name must contain letters and spaces only (minimum 2 characters).");
      return;
    }

    if (phoneClean.length !== 10 || !/^[6-9]/.test(phoneClean)) {
      setFormError("Please enter a valid 10-digit Indian mobile number starting with 6-9.");
      return;
    }

    if (!emailRegex.test(emailClean)) {
      setFormError("Invalid email address pattern structure (expected: name@domain.com).");
      return;
    }

    if (!vehicleRegex.test(rawVehicle)) {
      setFormError("Invalid Vehicle Number format. Must match Indian license plate standards (e.g., MH04HK6253).");
      return;
    }

    if (!brandModel.trim()) {
      setFormError("Vehicle Make & Model field value cannot be blank.");
      return;
    }

    const state = rawVehicle.substring(0, 2);
    const rto = rawVehicle.substring(2, 4);
    const isFourLetterStart = isNaN(Number(rawVehicle.charAt(5))); 
    const seriesEndIndex = isFourLetterStart ? 6 : 5;
    const series = rawVehicle.substring(4, seriesEndIndex);
    const digits = rawVehicle.substring(seriesEndIndex);

    const vehicleClean = `${state}${rto}${series}${digits}`;

    const payload = { 
      id: editingJobId,
      customerName: nameClean, 
      phoneNumber: phoneClean, 
      customerEmail: emailClean, 
      vehicleNumber: vehicleClean, 
      brandModel: brandModel.trim(), 
      manufactureYear 
    };
    
    const url = editingJobId ? `/api/jobs/${editingJobId}` : "/api/jobs";
    const method = editingJobId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.error || "Check-in modification rejected.");
        triggerToast("❌ Changes could not be saved to cloud nodes.", "error");
        return;
      }

      // 💾 OPTIMISTIC UI ACCELERATION: Change local state array right now so it updates instantly
      if (editingJobId) {
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === editingJobId
              ? { 
                  ...job, 
                  customerName: nameClean, 
                  phoneNumber: phoneClean, 
                  customerEmail: emailClean, 
                  vehicleNumber: vehicleClean, 
                  brandModel: brandModel.trim(), 
                  manufactureYear 
                }
              : job
          )
        );
      }

      await refreshAllData();
      
      // Clean registers only on full verification pass
      setCustomerName(""); setPhoneNumber(""); setCustomerEmail(""); setVehicleNumber(""); setBrandModel(""); setManufactureYear("2022");
      setEditingJobId(null);
      
      triggerToast(method === "PUT" ? "✓ Record updated successfully!" : "✓ New vehicle registered successfully!", "success");
      
      if(method === "POST") setActiveTab("Job Cards");
    } catch (error) {
      setFormError("Communication breakdown with file registry.");
      triggerToast("❌ Changes not saved. Check local database cluster connectivity.", "error");
    }
  };

  const handleStartEditJob = (job: any) => {
    setEditingJobId(job.id);
    setCustomerName(job.customerName);
    setPhoneNumber(job.phoneNumber);
    setCustomerEmail(job.customerEmail || "");
    setVehicleNumber(job.vehicleNumber);
    setBrandModel(job.brandModel);
    setManufactureYear(job.manufactureYear || "2022");
    setFormError(null);
  };

  const handleCancelJobEdit = () => {
    setEditingJobId(null);
    setCustomerName(""); setPhoneNumber(""); setCustomerEmail(""); setVehicleNumber(""); setBrandModel(""); setManufactureYear("2022");
    setFormError(null);
  };

  const handleDeleteJob = async (jobId: string, vehicleNum: string) => {
    if (confirm(`Permanently delete all check-in records for vehicle ${vehicleNum}?`)) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          if (editingJobId === jobId) {
            handleCancelJobEdit();
          }
          await refreshAllData();
          triggerToast("✓ Record deleted successfully.", "success");
        } else {
          const errorData = await response.json();
          triggerToast(`❌ Delete failed: ${errorData.error}`, "error");
        }
      } catch (error) {
        triggerToast("❌ Failed to communicate with the registry.", "error");
      }
    }
  };

  const handleUpdateAssignment = async (id: string) => {
    try {
      const chosenBay = selectedBays[id] || "Unassigned";
      const chosenTech = selectedTechs[id] || "Unassigned";

      const matchingJob = jobs.find(j => j.id === id);
      const targetVehicleNum = matchingJob ? matchingJob.vehicleNumber : "Unknown";

      setExpectedVehicleNo(targetVehicleNum);
      setVerifyingJobId(id);
      setVerificationStatus("PENDING_VERIFICATION");
      setServerWarningMsg(null);

      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bay: chosenBay,              
          technician: chosenTech,
          status: "In Progress" 
        }),
      });

      if (response.ok) {
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === id 
              ? { ...job, status: "In Progress", assignedBay: chosenBay, assignedTech: chosenTech } 
              : job
          )
        );
        setEditingRows(prev => ({ ...prev, [id]: false }));
        startVerificationPolling(id);
      } else {
        triggerToast("❌ Failed to sync layout data with cloud nodes.", "error");
        startVerificationPolling(id); 
      }
    } catch (error) {
      console.error("Assignment save error:", error);
      startVerificationPolling(id);
    }
  };

  const handleMarkAsCompleted = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Completed"
        }),
      });

      if (response.ok) {
        setJobs(prevJobs =>
          prevJobs.map(job => job.id === id ? { ...job, status: "Completed" } : job)
        );
        triggerToast("✓ Service profile completed cleanly!", "success");
      } else {
        triggerToast("❌ Failed to execute system closure operations.", "error");
      }
    } catch (error) {
      console.error("Completion handler error:", error);
    }
  };

  const handleSaveStaffProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmpId) {
        const response = await fetch(`/api/users/${editingEmpId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: empName, role: empRole, email: empEmail }),
        });
        if (response.ok) {
          setEditingEmpId(null); setEmpName(""); setEmpEmail("");
          await refreshAllData();
          triggerToast("✓ Operator details updated.", "success");
        }
      } else {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: empName, role: empRole, email: empEmail }),
        });
        if (response.ok) {
          setEmpName(""); setEmpEmail("");
          await refreshAllData();
          triggerToast("✓ Corporate employee onboarded successfully.", "success");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteStaffProfile = async (empId: string) => {
    if (confirm("Scrub employee record permanently?")) {
      try {
        const response = await fetch(`/api/users/${empId}`, { method: "DELETE" });
        if (response.ok) {
          await refreshAllData();
          triggerToast("✓ Staff record cleared cleanly.", "success");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleStartEditStaff = (emp: any) => {
    setEditingEmpId(emp.id);
    setEmpName(emp.name);
    setEmpRole(emp.role);
    setEmpEmail(emp.email);
  };

  const handleRegisterNewBay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBayName.trim()) return;
    try {
      const response = await fetch("/api/bays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBayName }),
      });
      if (response.ok) {
        setNewBayName("");
        await refreshAllData();
        triggerToast("✓ New infrastructure bay expanded.", "success");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBayLayout = async (bayId: string, name: string) => {
    if (confirm(`Decommission workshop coordinates for ${name}?`)) {
      try {
        const response = await fetch(`/api/bays/${bayId}`, { method: "DELETE" });
        if (response.ok) {
          await refreshAllData();
          triggerToast("✓ Core workshop node decommissioned.", "success");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    if(confirm("Are you sure you want to log out?")) router.push("/");
  };

  const getFilteredJobs = () => {
    return jobs.filter((job) => {
      if (job.status === "Completed") return false;

      const matchesSearch = job.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (dateFilter === "All") return true;
      if (!job.createdAt) return dateFilter === "All"; 

      const jobDate = new Date(job.createdAt);
      const today = new Date();
      
      const isToday = jobDate.getDate() === today.getDate() &&
                      jobDate.getMonth() === today.getMonth() &&
                      jobDate.getFullYear() === today.getFullYear();

      if (dateFilter === "Today") return isToday;

      if (dateFilter === "Yesterday") {
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        return jobDate.getDate() === yesterday.getDate() &&
               jobDate.getMonth() === yesterday.getMonth() &&
               jobDate.getFullYear() === yesterday.getFullYear();
      }

      return true;
    });
  };

  const getTabStyle = (tabName: string) => {
    const isActive = activeTab === tabName;
    const isHovered = hoveredTab === tabName;
    return {
      padding: "12px 14px 12px 12px", 
      borderRadius: "8px", 
      fontWeight: "700", 
      fontSize: "14px", 
      cursor: "pointer",
      display: "flex", 
      alignItems: "center", 
      gap: "10px", 
      transition: "all 0.15s ease",
      position: "relative" as const,
      backgroundColor: isActive ? "#1e293b" : isHovered ? "rgba(51, 65, 85, 0.3)" : "transparent",
      color: isActive ? "#ffffff" : isHovered ? "#f1f5f9" : "#94a3b8",
      borderLeft: isActive ? "4px solid #2563eb" : "4px solid transparent", 
      paddingLeft: isActive ? "10px" : "12px" 
    };
  };

  const inputStyle = {
    width: "100%",
    padding: "14px", 
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15.5px", 
    outline: "none",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s, box-shadow 0.2s"
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", fontFamily: "Arial, sans-serif", backgroundColor: "#f1f5f9", margin: 0, padding: 0, boxSizing: "border-box" }}>
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <div style={{ width: "280px", backgroundColor: "#0f172a", color: "#ffffff", display: "flex", flexDirection: "column", padding: "24px 16px", boxSizing: "border-box", borderRight: "1px solid #1e293b" }}>
        <div style={{ marginBottom: "32px", paddingLeft: "8px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "900", margin: 0 }}>LIVE SERVICE BAY</h2>
          <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "700" }}>MANAGEMENT PORTAL</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flexGrow: 1, overflowY: "auto" }}>
          {[
            { name: "Active Workspace", icon: "📊" },
            { name: "Vehicle Check-In", icon: "🚗" },
            { name: "Job Cards", icon: "📝" },
            { name: "Bay & Tech Assignment", icon: "🔧" },
            { name: "Camera Mapping (Future)", icon: "📹" },
            { name: "Service Session (optional)", icon: "⏱️" },
            { name: "Report (Optional)", icon: "📈" },
            { name: "Settings", icon: "⚙️" }
          ].map((tab) => (
            <div key={tab.name} onClick={() => setActiveTab(tab.name)} onMouseEnter={() => setHoveredTab(tab.name)} onMouseLeave={() => setHoveredTab(null)} style={getTabStyle(tab.name)}>
              {tab.icon} {tab.name}
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ paddingLeft: "8px" }}>
            <div style={{ fontSize: "14px", fontWeight: "700" }}>System Operator</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Role: Coordinator</div>
          </div>
          <button onClick={handleLogout} style={{ width: "100%", padding: "12px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>🚪 Secure Logout</button>
        </div>
      </div>

      {/* MAIN TRACKING MONITOR DISPLAY */}
      <div style={{ flexGrow: 1, padding: "40px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "32px", overflowY: "auto", height: "100vh" }}>
        
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "0 0 4px 0" }}>{activeTab}</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Service Operations Overview</p>
        </div>

        {loading ? (
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#64748b" }}>🔄 Querying database storage blocks...</div>
        ) : (
          <>
            {/* MODULE: ACTIVE WORKSPACE */}
            {activeTab === "Active Workspace" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", width: "100%" }}>
                  
                  {/* ACTIVE REPAIRS CARD */}
                  <div style={{ backgroundColor: "#ffffff", padding: "24px 28px", borderRadius: "16px", border: "1px solid #e2e8f0", borderLeft: "6px solid #2563eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", letterSpacing: "0.5px" }}>ACTIVE REPAIRS</div>
                      <div style={{ fontSize: "38px", fontWeight: "900", color: "#0f172a", marginTop: "12px", lineHeight: "1" }}>
                        {jobs.filter(j => j.status !== "Completed").length}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", marginTop: "6px" }}>In workshop bays</div>
                    </div>
                    <div style={{ fontSize: "42px", color: "#f1f5f9", fontWeight: "900", userSelect: "none", pointerEvents: "none" }}>🔧</div>
                  </div>

                  {/* UNASSIGNED VEHICLES CARD */}
                  <div style={{ backgroundColor: "#ffffff", padding: "24px 28px", borderRadius: "16px", border: "1px solid #e2e8f0", borderLeft: "6px solid #d97706", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", letterSpacing: "0.5px" }}>UNASSIGNED VEHICLES</div>
                      <div style={{ fontSize: "38px", fontWeight: "900", color: "#d97706", marginTop: "12px", lineHeight: "1" }}>
                        {jobs.filter(j => j.status !== "Completed" && (j.bay === "Unassigned" || j.bay === "" || j.technician === "Unassigned" || j.technician === "")).length}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", marginTop: "6px" }}>Awaiting allocation</div>
                    </div>
                    <div style={{ fontSize: "42px", color: "#f1f5f9", fontWeight: "900", userSelect: "none", pointerEvents: "none" }}>⚠️</div>
                  </div>

                  {/* COMPLETED VEHICLES CARD */}
                  <div style={{ backgroundColor: "#ffffff", padding: "24px 28px", borderRadius: "16px", border: "1px solid #e2e8f0", borderLeft: "6px solid #16a34a", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", letterSpacing: "0.5px" }}>COMPLETED VEHICLES</div>
                      <div style={{ fontSize: "38px", fontWeight: "900", color: "#16a34a", marginTop: "12px", lineHeight: "1" }}>
                        {jobs.filter(j => j.status === "Completed").length}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", marginTop: "6px" }}>Ready for handover</div>
                    </div>
                    <div style={{ fontSize: "42px", color: "#f1f5f9", fontWeight: "900", userSelect: "none", pointerEvents: "none" }}>✅</div>
                  </div>

                </div>

                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Real-time Master Operations Tracker</h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #edf2f7", color: "#64748b", fontSize: "13px", fontWeight: "800" }}>
                        <th style={{ padding: "12px 8px" }}>JOB ID</th>
                        <th style={{ padding: "12px 8px" }}>VEHICLE NUMBER</th>
                        <th style={{ padding: "12px 8px" }}>BRAND / MODEL</th>
                        <th style={{ padding: "12px 8px" }}>CUSTOMER NAME</th>
                        <th style={{ padding: "12px 8px" }}>PHONE</th>
                        <th style={{ padding: "12px 8px" }}>BAY</th>
                        <th style={{ padding: "12px 8px" }}>STATUS</th>
                        <th style={{ padding: "12px 8px", textAlign: "center" }}>CLIENT PORTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job, index) => {
                        const isEvenRow = index % 2 === 0;
                        const rowBgColor = isEvenRow ? "#ffffff" : "#f8fafc";
                        
                        return (
                          <tr 
                            key={job.id} 
                            style={{ 
                              borderBottom: "1px solid #edf2f7", 
                              fontSize: "14px", 
                              color: "#334155", 
                              fontWeight: "600",
                              backgroundColor: rowBgColor,
                              transition: "background-color 0.15s ease"
                            }}
                          >
                            <td style={{ padding: "18px 12px", color: "#2563eb", fontWeight: "800" }}>{job.id}</td>
                            <td style={{ padding: "18px 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{job.vehicleNumber}</td>
                            <td style={{ padding: "18px 12px", color: "#0f172a", fontWeight: "700" }}>
                              {job.brandModel} <span style={{fontSize:"11px", color: "#64748b", fontWeight: "500"}}>({job.manufactureYear})</span>
                            </td>
                            <td style={{ padding: "18px 12px" }}>{job.customerName}</td>
                            <td style={{ padding: "18px 12px", color: "#64748b" }}>{job.phoneNumber}</td>
                            <td style={{ padding: "18px 12px", fontWeight: "700" }}>
                              {job.bay === "Unassigned" || !job.bay ? "⚠️ Unassigned" : job.bay}
                            </td>
                            <td style={{ padding: "18px 12px" }}>
                              <span style={getStatusBadgeStyle(job.status)}>
                                {job.status || "UNASSIGNED"}
                              </span>
                            </td>
                            <td style={{ padding: "18px 12px", textAlign: "center" }}>
                              <button
                                onClick={() => handleSendTrackLink(job.phoneNumber, job.id, job.vehicleNumber)}
                                style={{
                                  padding: "8px 14px",
                                  backgroundColor: "#16a34a",
                                  color: "#ffffff",
                                  border: "none",
                                  borderRadius: "6px",
                                  fontSize: "12.5px",
                                  fontWeight: "800",
                                  cursor: "pointer",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                }}
                              >
                                💬 Send Live Link
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* MODULE: VEHICLE CHECK-IN */}
            {activeTab === "Vehicle Check-In" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px", alignItems: "start", width: "100%" }}>
                <form onSubmit={handleVehicleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {formError && (
                    <div style={{ backgroundColor: "#fef2f2", color: "#b91c1c", padding: "16px", borderRadius: "10px", border: "1px solid #fca5a5", fontSize: "15px", fontWeight: "700" }}>
                      ⚠️ Validation Error: {formError}
                    </div>
                  )}
                  
                  <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
                      {editingJobId ? `✏️ Edit Job Record (${editingJobId})` : "🚗 New Vehicle Intake"}
                    </h3>
                    <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "13.5px", fontWeight: "600" }}>Register incoming vehicle and owner details.</p>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "14.5px", fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Customer Name *</label>
                        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="First & Last Name" style={inputStyle} required />
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "14.5px", fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Phone Number *</label>
                          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Primary Mobile" style={inputStyle} required />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "14.5px", fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Customer Email *</label>
                          <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="name@domain.com" style={inputStyle} required />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Vehicle Details</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "14.5px", fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Vehicle Registration Number *</label>
                          <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="e.g. MH04KW2728" style={{ ...inputStyle, textTransform: "uppercase", fontWeight:"700" }} required />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "14.5px", fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Model Release Year *</label>
                          <select value={manufactureYear} onChange={(e) => setManufactureYear(e.target.value)} style={{ ...inputStyle, backgroundColor:"#fff", fontWeight:"700" }}>
                            {yearOptions.map(yr => <option key={yr} value={yr}>{yr}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "14.5px", fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Vehicle Make & Model *</label>
                        <input type="text" value={brandModel} onChange={(e) => setBrandModel(e.target.value)} placeholder="e.g. Volkswagen Taigun Ski" style={inputStyle} required />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    {editingJobId && (
                      <button type="button" onClick={handleCancelJobEdit} style={{ padding: "12px 24px", backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: "8px", fontWeight: "800", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
                    )}
                    <button type="submit" style={{ padding: "14px 36px", backgroundColor: editingJobId ? "#16a34a" : "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "800", fontSize: "15.5px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                      {editingJobId ? "💾 Save Changes" : "Register Vehicle"}
                    </button>
                  </div>
                </form>

                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", height: "680px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "800", color:"#0f172a" }}>Active Vehicle Directory</h3>
                  <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "13.5px", fontWeight: "600" }}>Select a vehicle from the directory to modify details or remove entry.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                    <div style={{ position: "relative" }}>
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="🔍 Search by vehicle number..." style={{ width: "100%", padding: "13px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontWeight: "600", boxSizing: "border-box" }} />
                    </div>

                    <div style={{ display: "flex", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "8px", gap: "4px" }}>
                      {["All", "Today", "Yesterday"].map((tab) => (
                        <button key={tab} type="button" onClick={() => setDateFilter(tab)} style={{ flexGrow: 1, padding: "10px 12px", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "800", cursor: "pointer", transition: "all 0.1s", backgroundColor: dateFilter === tab ? "#ffffff" : "transparent", color: dateFilter === tab ? "#2563eb" : "#64748b", boxShadow: dateFilter === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                          {tab === "All" ? "📄 All Records" : tab === "Today" ? "📅 Today" : "⏳ Yesterday"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {getFilteredJobs().length === 0 ? (
                      <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "14px", fontWeight: "700" }}>📭 No matching vehicle records found.</div>
                    ) : (
                      getFilteredJobs().map((job) => {
                        const isBeingEdited = editingJobId === job.id;
                        return (
                          <div key={job.id} style={{ padding: "18px", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: isBeingEdited ? "#eff6ff" : "#ffffff", borderColor: isBeingEdited ? "#38bdf8" : "#e2e8f0", transition: "all 0.2s" }}>
                            <div>
                              <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>{job.brandModel} <span style={{fontSize:"12px", color: "#64748b"}}>({job.manufactureYear || "N/A"})</span></div>
                              <div style={{ fontSize: "14px", fontWeight: "700", color: "#2563eb", textTransform: "uppercase", marginTop:"2px" }}>{job.vehicleNumber}</div>
                              <div style={{ fontSize: "12.5px", color: "#64748b", marginTop: "6px" }}>Owner: {job.customerName} • {job.phoneNumber}</div>
                            </div>
                            
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button type="button" onClick={() => handleStartEditJob(job)} disabled={isBeingEdited} style={{ padding: "9px 15px", backgroundColor: isBeingEdited ? "#cbd5e1" : "#0f172a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "800", fontSize: "13px", cursor: isBeingEdited ? "not-allowed" : "pointer" }}>
                                {isBeingEdited ? "⚡ Editing" : "✏️ Modify"}
                              </button>
                              <button type="button" onClick={() => handleDeleteJob(job.id, job.vehicleNumber)} style={{ padding: "9px 11px", backgroundColor: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "6px", color: "#ef4444", fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>
                                🗑️
                              </button>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE: JOB CARDS */}
            {activeTab === "Job Cards" && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Active Service Control Records</h3>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #edf2f7", color: "#64748b", fontSize: "13px", fontWeight: "800" }}>
                      <th style={{ padding: "12px 8px" }}>ID</th>
                      <th style={{ padding: "12px 8px" }}>VEHICLE NUMBER</th>
                      <th style={{ padding: "12px 8px" }}>BRAND / MODEL</th>
                      <th style={{ padding: "12px 8px" }}>CUSTOMER</th>
                      <th style={{ padding: "12px 8px" }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} style={{ borderBottom: "1px solid #edf2f7", fontSize: "14px", color: "#334155", fontWeight: "600" }}>
                        <td style={{ padding: "16px 8px", color: "#2563eb", fontWeight: "800" }}>{job.id}</td>
                        <td style={{ padding: "16px 8px", textTransform: "uppercase" }}>{job.vehicleNumber}</td>
                        <td style={{ padding: "16px 8px" }}>{job.brandModel}</td>
                        <td style={{ padding: "16px 8px" }}>{job.customerName}</td>
                        <td style={{ padding: "16px 8px", fontWeight: "700" }}>
                          <span style={getStatusBadgeStyle(job.status)}>
                            {job.status === "Completed" ? "✅ Done" : job.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* MODULE: BAY & TECH ASSIGNMENT */}
            {activeTab === "Bay & Tech Assignment" && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Bay Assignment Manager</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {jobs.map((job) => {
                    const isEditing = !!editingRows[job.id];

                    const occupiedBays = jobs
                      .filter(j => j.id !== job.id && j.status !== "Completed" && j.assignedBay && j.assignedBay !== "Unassigned")
                      .map(j => j.assignedBay);

                    const occupiedTechs = jobs
                      .filter(j => j.id !== job.id && j.status !== "Completed" && j.assignedTech && j.assignedTech !== "Unassigned")
                      .map(j => j.assignedTech);

                    return (
                      <div key={job.id} style={{ padding: "20px", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", backgroundColor: isEditing ? "#f8fafc" : "#ffffff", gap: "16px" }}>
                        <div>
                          <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>{job.brandModel} (<span style={{ textTransform: "uppercase" }}>{job.vehicleNumber}</span>)</div>
                          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>ID: {job.id} • Owner: {job.customerName}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          
                          <select 
                            disabled={!isEditing} 
                            value={selectedBays[job.id] || "Unassigned"} 
                            onChange={(e) => setSelectedBays({ ...selectedBays, [job.id]: e.target.value })} 
                            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "700", outline: "none" }}
                          >
                            <option value="Unassigned">❌ No Bay</option>
                            {(() => {
                              const availableBays = bays.filter((b: any) => !occupiedBays.includes(b.name));
                              
                              if (availableBays.length === 0) {
                                return <option disabled value="None">⚠️ No bays are available</option>;
                              }
                              
                              return availableBays.map((b: any) => (
                                <option key={b.id} value={b.name}>
                                  {b.name}
                                </option>
                              ));
                            })()}
                          </select>

                          <select 
                            disabled={!isEditing} 
                            value={selectedTechs[job.id] || "Unassigned"} 
                            onChange={(e) => setSelectedTechs({ ...selectedTechs, [job.id]: e.target.value })} 
                            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "700", outline: "none" }}
                          >
                            <option value="Unassigned">❌ No Tech Assigned</option>
                            {(() => {
                              const availableTechs = Array.isArray(users) 
                                ? users.filter((emp: any) => emp.role === "Technician" && !occupiedTechs.includes(emp.name))
                                : [];
                                
                              if (availableTechs.length === 0) {
                                return <option disabled value="None">⚠️ No technicians available</option>;
                              }
                              
                              return availableTechs.map((emp: any, index: number) => (
                                <option key={`${emp.id}-${index}`} value={emp.name}>
                                  {emp.name}
                                </option>
                              ));
                            })()}
                          </select>

                          {job.status === "Completed" ? (
                            <span style={getStatusBadgeStyle("Completed")}>
                              ✅ Done
                            </span>
                          ) : !editingRows[job.id] ? (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button type="button" onClick={() => setEditingRows({ ...editingRows, [job.id]: true })} style={{ padding: "10px 18px", backgroundColor: "#0f172a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>
                                ✏️ Edit
                              </button>
                              
                              {job.status === "In Progress" && (
                                <button type="button" onClick={() => handleMarkAsCompleted(job.id)} style={{ padding: "10px 18px", backgroundColor: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "8px", fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>
                                  ✅ Complete Service
                                </button>
                              )}
                            </div>
                          ) : (
                            <button type="button" onClick={() => handleUpdateAssignment(job.id)} style={{ padding: "10px 18px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>
                              ▶️ Start
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MODULE: SETTINGS */}
            {activeTab === "Settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "1100px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px", alignItems: "start" }}>
                  
                  <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>
                      {editingEmpId ? "✏️ Modify Operator Records" : "➕ Onboard Corporate Staff"}
                    </h3>
                    <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "12px", fontWeight: "600" }}>Register service advisors and mechanical technical staff fields.</p>
                    <form onSubmit={handleSaveStaffProfile} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        <input type="text" value={empName} onChange={(e) => setEmpName(e.target.value)} placeholder="Full Name" style={inputStyle} required />
                        <input type="email" value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} placeholder="Email Address" style={inputStyle} required />
                      </div>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <select value={empRole} onChange={(e) => setEmpRole(e.target.value)} style={{ ...inputStyle, fontWeight: "700", flexGrow: 1, backgroundColor: "#fff" }}>
                          <option value="Service Advisor">Service Advisor</option>
                          <option value="Technician">Technician</option>
                        </select>
                        <button type="submit" style={{ padding: "12px 24px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
                          {editingEmpId ? "Save Change" : "Register Staff"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>🏗️ Expand Station Bays</h3>
                    <p style={{ margin: "0 0 20px 0", color: "#64748b", fontSize: "12px", fontWeight: "600" }}>Provision physical repair bay arrays dynamically.</p>
                    <form onSubmit={handleRegisterNewBay} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <input type="text" value={newBayName} onChange={(e) => setNewBayName(e.target.value)} placeholder="e.g. Bay 5" style={inputStyle} required />
                      <button type="submit" style={{ padding: "12px", backgroundColor: "#0f172a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "800", cursor: "pointer" }}>
                        Provision New Station
                      </button>
                    </form>
                  </div>

                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px", alignItems: "start" }}>
                  
                  <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Active Center Staff Index</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #edf2f7", color: "#64748b", fontSize: "12px", fontWeight: "800" }}>
                          <th style={{ padding: "10px 6px" }}>ID</th>
                          <th style={{ padding: "10px 6px" }}>NAME</th>
                          <th style={{ padding: "10px 6px" }}>FUNCTION ROLE</th>
                          <th style={{ padding: "10px 6px" }}>EMAIL ACCESS</th>
                          <th style={{ padding: "10px 6px", textAlign: "right" }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((emp, index: number) => (
                          <tr key={`${emp.id}-${index}`} style={{ borderBottom: "1px solid #edf2f7", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            <td style={{ padding: "12px 6px" }}>{emp.id}</td>
                            <td style={{ padding: "12px 6px", color: "#0f172a", fontWeight: "700" }}>{emp.name}</td>
                            <td style={{ padding: "12px 6px" }}>
                              <span style={{ padding: "3px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: "800", backgroundColor: emp.role === "Service Advisor" ? "#eff6ff" : "#f0fdf4", color: emp.role === "Service Advisor" ? "#2563eb" : "#16a34a" }}>
                                {emp.role}
                              </span>
                            </td>
                            <td style={{ padding: "12px 6px", color: "#64748b" }}>{emp.email}</td>
                            <td style={{ padding: "12px 6px", textAlign: "right" }}>
                              <button onClick={() => handleStartEditStaff(emp)} style={{ marginRight: "6px", padding: "4px 8px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer" }}>✏️ Edit</button>
                              <button onClick={() => handleDeleteStaffProfile(emp.id)} style={{ padding: "4px 8px", backgroundColor: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "4px", color: "#ef4444", cursor: "pointer" }}>🗑️ Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>Service Bay Infrastructure Node</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #edf2f7", color: "#64748b", fontSize: "12px", fontWeight: "800" }}>
                          <th style={{ padding: "10px 6px" }}>NODE ID</th>
                          <th style={{ padding: "10px 6px" }}>STATION DESIGNATION</th>
                          <th style={{ padding: "10px 6px", textAlign: "right" }}>DECOMMISSION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bays.map((bay) => (
                          <tr key={bay.id} style={{ borderBottom: "1px solid #edf2f7", fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            <td style={{ padding: "12px 6px", color: "#2563eb", fontWeight: "700" }}>{bay.id}</td>
                            <td style={{ padding: "12px 6px", color: "#0f172a", fontWeight: "700" }}>{bay.name}</td>
                            <td style={{ padding: "12px 6px", textAlign: "right" }}>
                              <button onClick={() => handleDeleteBayLayout(bay.id, bay.name)} style={{ padding: "4px 8px", backgroundColor: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)", borderRadius: "4px", color: "#ef4444", cursor: "pointer" }}>🗑️ Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            )}

            {/* FALLBACK CONTROL BACKDROP */}
            {["Camera Mapping", "Service Session", "Report"].includes(activeTab) && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "60px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📡</div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>{activeTab} Management View</h3>
                <p style={{ color: "#64748b", fontWeight: "600", margin: 0 }}>View and manage active service sessions.</p>
              </div>
            )}
          </>
        )}

      </div>

      {/* 🧭 FLOATING PROFESSIONAL TOAST NOTIFICATION CONTAINER */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: toast.type === "success" ? "#0f172a" : "#991b1b", 
          color: "#ffffff",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "14px",
          fontWeight: "700",
          border: toast.type === "success" ? "1px solid #334155" : "1px solid #f87171",
          transition: "all 0.2s ease"
        }}>
          <span style={{ color: toast.type === "success" ? "#4ade80" : "#fca5a5" }}>
            {toast.type === "success" ? "⚡" : "⚠️"}
          </span>
          {toast.message}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECURITY PROFILE INTERACTIVE CAMERA OVERLAY MODAL        */}
      {/* ──────────────────────────────────────────────────────── */}
      {verificationStatus !== "IDLE" && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(8px)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px", maxWidth: "450px", width: "100%", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", textAlign: "center" }}>
            
            {/* VIEW A: PENDING VALIDATION SCANNER */}
            {verificationStatus === "PENDING_VERIFICATION" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "48px", height: "48px", border: "4px solid #d97706", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "#d97706" }}>AI Cross-Verification In Progress</h3>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b", fontWeight: "600", lineHeight: "1.5" }}>
                  The CCTV camera is scanning the incoming car plate to cross-verify against expected record: <span style={{ fontFamily: "monospace", backgroundColor: "#0f172a", color: "#ffffff", padding: "4px 8px", borderRadius: "4px", fontWeight: "800" }}>{expectedVehicleNo}</span>
                </p>
              </div>
            )}

            {/* VIEW B: SUCCESS MATCHED PASS */}
            {verificationStatus === "MATCHED" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", backgroundColor: "#f0fdf4", color: "#16a34a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: "900" }}>✓</div>
                
                <div>
                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "#16a34a" }}>Successful Cross-Verification!</h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13.5px", color: "#64748b", fontWeight: "600" }}>
                    Plate confirmed by camera array template!
                  </p>
                </div>

                {/* 📊 NEW SIDE-BY-SIDE VISUAL COMPARISON REGISTER CARD */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "1fr 1fr", 
                  gap: "12px", 
                  backgroundColor: "#f8fafc", 
                  border: "1px solid #cbd5e1", 
                  borderRadius: "10px", 
                  padding: "16px", 
                  width: "100%",
                  boxSizing: "border-box"
                }}>
                  <div style={{ textAlign: "left" }}>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#64748b", display: "block", marginBottom: "4px" }}>MANUAL RECORD:</span>
                    <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>{expectedVehicleNo}</span>
                  </div>
                  <div style={{ textAlign: "left", borderLeft: "1px solid #cbd5e1", paddingLeft: "12px" }}>
                    <span style={{ fontSize: "11px", fontWeight: "800", color: "#16a34a", display: "block", marginBottom: "4px" }}>CAMERA FETCHED:</span>
                    <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: "800", color: "#16a34a" }}>{expectedVehicleNo}</span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>
                  Launching active workstation pipeline layers...
                </p>
              </div>
            )}

            {/* VIEW C: MISMATCH CONFLICT ERROR WARN */}
            {verificationStatus === "MISMATCH" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", backgroundColor: "#fef2f2", color: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "900" }}>✕</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "#ef4444" }}>Cross-Verification Unmatched!</h3>
                  <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>Security parameters collision warning.</p>
                </div>
                
                <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "14px", width: "100%", textAlign: "left", boxSizing: "border-box" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#b91c1c", display: "block", marginBottom: "4px", letterSpacing: "0.5px" }}>CAMERA LIVE LOGGER REPORT:</span>
                  <span style={{ fontFamily: "monospace", fontSize: "13.5px", fontWeight: "700", color: "#991b1b" }}>{serverWarningMsg}</span>
                </div>

                <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                  <button type="button" onClick={() => handleUpdateAssignment(verifyingJobId!)} style={{ flexGrow: 1, padding: "12px", backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", color: "#334155", fontWeight: "800", fontSize: "13.5px", cursor: "pointer" }}>
                    🔄 Try Again
                  </button>
                  <button type="button" onClick={handleManualOverride} style={{ flexGrow: 1, padding: "12px", backgroundColor: "#ef4444", border: "none", borderRadius: "8px", color: "#ffffff", fontWeight: "800", fontSize: "13.5px", cursor: "pointer", boxShadow: "0 2px 4px rgba(239,68,68,0.2)" }}>
                    ⚠️ Override Alert
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}