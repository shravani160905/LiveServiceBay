"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter(); // Next.js Router hook used for programmatically redirecting users (e.g., on logout)
  
  // =========================================================================
  // 🏢 MASTER SYNCHRONIZED GLOBAL APPLICATION STATES
  // =========================================================================
  const [activeTab, setActiveTab] = useState("Active Workspace");           // Controls which panel/module view is currently rendering on screen
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);         // Tracks the current sidebar menu item being hovered over for dynamic styling
  const [jobs, setJobs] = useState<any[]>([]);                               // Main directory housing all vehicle check-in records fetched from the database
  const [users, setUsers] = useState<any[]>([]);                             // Index of onboarded company staff members (Service Advisors and Technicians)
  const [bays, setBays] = useState<any[]>([]);                               // Physical workshop repair station slots configuration array
  const [loading, setLoading] = useState(true);                              // Loading banner flag active during background async database data-fetching queries

  // =========================================================================
  // 🔍 DATA SEARCH & FILTERING VIEW STATES
  // =========================================================================
  const [searchQuery, setSearchQuery] = useState("");                       // Live raw text filter matching vehicle registration license plate strings
  const [statusFilter, setStatusFilter] = useState("Active");                 // Segregates active repairs from completed history workflows
  const [dateFilter, setDateFilter] = useState("All");                       // Isolates operational records by context timing ranges ("All", "Today", "Yesterday")

  // =========================================================================
  // 🚗 VEHICLE CHECK-IN INTAKE REGISTER STATES
  // =========================================================================
  const [customerName, setCustomerName] = useState("");                       // Customer legal name input register
  const [phoneNumber, setPhoneNumber] = useState("");                         // Customer primary 10-digit mobile phone contact string
  const [customerEmail, setCustomerEmail] = useState("");                     // Customer notification destination email text input
  const [vehicleNumber, setVehicleNumber] = useState("");                     // Raw license tracking number captured from input field standard templates
  const [brandModel, setBrandModel] = useState("");                           // Vehicle manufacturing description data container (e.g., Tata Safari)
  const [manufactureYear, setManufactureYear] = useState("2022");             // Selected model inventory release drop-down calendar marker year
  const [editingJobId, setEditingJobId] = useState<string | null>(null);       // References the unique alphanumeric target key when modifying an existing vehicle check-in record
  const [formError, setFormError] = useState<string | null>(null);             // Holds input pattern violation error statements rendered directly inside validation warnings

  // =========================================================================
  // 👥 WORKFORCE INFRASTRUCTURE ONBOARDING REGISTERS
  // =========================================================================
  const [empName, setEmpName] = useState("");                                 // Structural name text field register for new employees
  const [empRole, setEmpRole] = useState("Technician");                       // Selection marker classifying roles into "Service Advisor" or "Technician" groups
  const [empEmail, setEmpEmail] = useState("");                               // Corporate communication endpoint target address for staff logins
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);       // References the active user index key targeted for field updates in Settings

  // =========================================================================
  // 🏗️ PHYSICAL WORKSHOP STRUCTURAL INPUT REGISTER
  // =========================================================================
  const [newBayName, setNewBayName] = useState("");                           // Simple layout descriptor label deployed for provisioning new stations (e.g., Bay 4)

  // =========================================================================
  // 🔗 DROPDOWN ASSIGNMENT BINDINGS & INLINE ROW EDITING FLAGS
  // =========================================================================
  const [selectedTechs, setSelectedTechs] = useState<{ [key: string]: string }>({}); // Key-Value register pinning an employee's name to a specific Job ID key
  const [selectedBays, setSelectedBays] = useState<{ [key: string]: string }>({});   // Key-Value register pinning a physical bay location designation to a specific Job ID key
  const [editingRows, setEditingRows] = useState<{ [key: string]: boolean }>({});     // Flags an active workspace tracking row to convert pure text fields into active drop-down selectors

  // =========================================================================
  // 💬 GLOBAL TOAST ALERT STATE
  // =========================================================================
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null); // Floating pop-up alert system state box

  // Generates a reverse order list array of manufacturing years used to populate vehicle information fields dynamically
  const yearOptions = [];
  for (let y = 2026; y >= 2015; y--) {
    yearOptions.push(y.toString());
  }

  // =========================================================================
  // 🚀 CUSTOMER COMMUNICATIONS INTERACTION HANDLERS
  // =========================================================================
  /**
   * Sanitizes numbers, builds an online customer monitoring link, and shapes a WhatsApp chat utility link
   * to push streaming parameters out to the customer's phone instantly.
   */
  const handleSendTrackLink = (customerPhone: string, jobId: string, vehicleNum: string) => {
    const cleanPhone = customerPhone.replace(/\D/g, "");                       // Cleans all formatting characters, leaving only raw numeric codes
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone; // Enforces the international country prefix dial context code for India (+91)
    const trackingLink = `http://172.16.0.15.nip.io:3000/track?jobId=${jobId}`;  // Generates the monitoring link tied directly to the unique database job index record
    const message = `Hello! Your vehicle (${vehicleNum.toUpperCase()}) has been securely stationed in our service bay. Track your real-time CCTV operations thread here: ${trackingLink}`;
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`; // Wraps message blocks into standard URL parameter sets safely
    window.open(whatsappUrl, "_blank");                                        // Dispatches the communication link task directly inside an independent window context frame
  };

  // =========================================================================
  // 🎨 ENTERPRISE VISUAL LAYOUT COLOR STYLE DESIGNATORS
  // =========================================================================
  /**
   * Computes layout variables dynamically based on a vehicle's current tracking state.
   * Returns a custom color configuration block containing border, font weight, background, and lettering parameters.
   */
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
      return { ...baseStyles, backgroundColor: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }; // Green execution theme for finalized assignments
    }
    
    if (normalizeStatus === "IN PROGRESS") {
      return { ...baseStyles, backgroundColor: "#eff6ff", color: "#2563eb", borderColor: "#bfdbfe" }; // Blue active execution style for vehicles on site
    }

    if (normalizeStatus === "PENDING" || normalizeStatus === "INTAKE" || normalizeStatus === "PENDING ALLOCATION") {
      return { ...baseStyles, backgroundColor: "#fffbeb", color: "#d97706", borderColor: "#fde68a" }; // Amber alert palette for vehicles waiting for a bay allocation slot
    }

    return { ...baseStyles, backgroundColor: "#f8fafc", color: "#64748b", borderColor: "#cbd5e1" };   // Fallback muted styling if tracking codes fail to read
  };

  /**
   * Spawns a floating message panel and tracks it on a background loop to clear itself automatically.
   */
  const showToastNotification = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500); // Clears the toast from the screen layout matrix exactly 3.5 seconds after it triggers
  };

  // =========================================================================
  // 🔄 SYNCHRONIZED BACKEND DATA SYNCHRONIZATION PIPELINE
  // =========================================================================
  /**
   * Executes a simultaneous asynchronous batch query down to the Next.js API server routes.
   * Pulls vehicle lists, operator logs, and infrastructure configurations, then maps current assignments to local states.
   */
  const refreshAllData = async () => {
    try {
      setLoading(true);
      const [jobsRes, usersRes, baysRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/users"),
        fetch("/api/bays")
      ]);
      const jobsData = await jobsRes.json();
      const usersData = await usersRes.json();
      const baysData = await baysRes.json();

      setJobs(jobsData);
      setUsers(usersData);
      setBays(baysData);

      // Create lookup maps to align drop-down values with saved database configurations across individual vehicle tracking items
      const techMap: { [key: string]: string } = {};
      const bayMap: { [key: string]: string } = {};
      jobsData.forEach((job: any) => {
        techMap[job.id] = job.assignedTech || "Unassigned";
        bayMap[job.id] = job.assignedBay || "Unassigned";
      });
      setSelectedTechs(techMap);
      setSelectedBays(bayMap);
    } catch (error) {
      console.error("Database connection fault tracking failure logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle monitoring hook that executes database calls immediately when the management dashboard first mounts on the client screen
  useEffect(() => {
    refreshAllData();
  }, []);

  // =========================================================================
  // 💾 POST / PUT: INTAKE CONTROLLER WITH INPUT FORM VALIDATION ENGINE
  // =========================================================================
  /**
   * Standardizes raw fields, verifies regex criteria, splits license plate sequences to match uniform text standards,
   * and dispatches payload packages up to the system database registry safely.
   */
  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // 🧹 Clean up input values to eliminate trailing whitespaces and isolate raw number sequences
    const nameClean = customerName.trim();
    const phoneClean = phoneNumber.trim().replace(/\D/g, ""); 
    const emailClean = customerEmail.trim();
    const rawVehicle = vehicleNumber.replace(/\s+/g, "").toUpperCase(); 

    // 🔬 Validation regular expressions
    const nameRegex = /^[A-Za-z\s]{2,50}$/;                                            // Letters and space strings only (minimum length: 2 characters)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;             // Enforces standard digital communication syntax properties
    const vehicleRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;                        // Matches uniform Indian high-security license structures (e.g., MH04HK6253)

    // Form data verification guards
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

    // 🎯 Process Uniform License Plate Matrix Spaces dynamically (Converts 'MH04HK6253' into a clean readable string like 'MH 04 HK 6253')
    const state = rawVehicle.substring(0, 2);
    const rto = rawVehicle.substring(2, 4);
    const isFourLetterStart = isNaN(Number(rawVehicle.charAt(5))); 
    const seriesEndIndex = isFourLetterStart ? 6 : 5;
    const series = rawVehicle.substring(4, seriesEndIndex);
    const digits = rawVehicle.substring(seriesEndIndex);
    const vehicleClean = `${state} ${rto} ${series} ${digits}`;

    const payload = { 
      customerName: nameClean, 
      phoneNumber: phoneClean, 
      customerEmail: emailClean, 
      vehicleNumber: vehicleClean, 
      brandModel: brandModel.trim(), 
      manufactureYear 
    };
    
    // Switches routes automatically to determine if the intake engine should save a brand-new vehicle entry (POST) or update an existing tracking line item (PUT)
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
        return;
      }

      await refreshAllData(); // Re-sync local dashboard state values with updated cloud files
      
      // Reset intake form control hooks to empty base structures
      setCustomerName(""); setPhoneNumber(""); setCustomerEmail(""); setVehicleNumber(""); setBrandModel(""); setManufactureYear("2022");
      setEditingJobId(null);
      
      showToastNotification(method === "PUT" ? "✓ Record updated successfully!" : "✓ New vehicle registered successfully!", "success");
      if(method === "POST") setActiveTab("Job Cards"); // Automatically shifts views to show newly initialized sheets
    } catch (error) {
      setFormError("Communication breakdown with file registry.");
    }
  };

  // Populates input fields instantly with selected dataset parameters to prepare for a modifications update pass
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

  // Cancels an active modification task, safely restoring base variables without overwriting existing entries
  const handleCancelJobEdit = () => {
    setEditingJobId(null);
    setCustomerName(""); setPhoneNumber(""); setCustomerEmail(""); setVehicleNumber(""); setBrandModel(""); setManufactureYear("2022");
    setFormError(null);
  };

  // Removes a specified vehicle tracking check-in record permanently from database storage collections
  const handleDeleteJob = async (jobId: string, vehicleNum: string) => {
    if (confirm(`Permanently delete all check-in records for vehicle ${vehicleNum}?`)) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
        if (response.ok) {
          if (editingJobId === jobId) handleCancelJobEdit();
          await refreshAllData();
          showToastNotification("✓ Record deleted successfully.", "success");
        } else {
          const errorData = await response.json();
          showToastNotification(`❌ Delete failed: ${errorData.error}`, "error");
        }
      } catch (error) {
        showToastNotification("❌ Failed to communicate with the registry.", "error");
      }
    }
  };

  // =========================================================================
  // 🔧 WORKSPACE RESOURCE ALLOCATION CONTROL ROUTINES
  // =========================================================================
  /**
   * Commits current drop-down personnel and repair bay selections directly to the database layer,
   * setting the tracking state profile to "In Progress".
   */
  const handleUpdateAssignment = async (id: string) => {
    try {
      const chosenBay = selectedBays[id] || "Unassigned";
      const chosenTech = selectedTechs[id] || "Unassigned";

      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bay: chosenBay, technician: chosenTech, status: "In Progress" }),
      });

      if (response.ok) {
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === id 
              ? { ...job, status: "In Progress", assignedBay: chosenBay, assignedTech: chosenTech } 
              : job
          )
        );
        setEditingRows(prev => ({ ...prev, [id]: false })); // Exits editing row configuration mode
        showToastNotification("✓ Service bay allocation modified successfully.", "success");
      } else {
        showToastNotification("❌ Failed to sync layout data with cloud nodes.", "error");
      }
    } catch (error) {
      console.error("Assignment save error:", error);
    }
  };

  /**
   * Shuts down active resource metrics on a vehicle, updating its track status parameter to "Completed"
   * to immediately free up assigned personnel and physical bays back into general selection drop-downs.
   */
  const handleMarkAsCompleted = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" }),
      });

      if (response.ok) {
        setJobs(prevJobs => prevJobs.map(job => job.id === id ? { ...job, status: "Completed" } : job));
        showToastNotification("✓ Service profile completed cleanly!", "success");
      } else {
        showToastNotification("❌ Failed to execute system closure operations.", "error");
      }
    } catch (error) {
      console.error("Completion handler error:", error);
    }
  };

  // =========================================================================
  // ⚙️ SYSTEM SETTINGS INFRASTRUCTURE & STAFF REGISTRATION CONTROLLERS
  // =========================================================================
  /**
   * Submits employee profile updates or registers new service staff parameters down into database storage tables.
   */
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
          showToastNotification("✓ Operator details updated.", "success");
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
          showToastNotification("✓ Corporate employee onboarded successfully.", "success");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Removes a targeted user profile permanently from the workplace data index
  const handleDeleteStaffProfile = async (empId: string) => {
    if (confirm("Scrub employee record permanently?")) {
      try {
        const response = await fetch(`/api/users/${empId}`, { method: "DELETE" });
        if (response.ok) {
          await refreshAllData();
          showToastNotification("✓ Staff record cleared cleanly.", "success");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Pulls team details directly into settings data input blocks for modifications
  const handleStartEditStaff = (emp: any) => {
    setEditingEmpId(emp.id);
    setEmpName(emp.name);
    setEmpRole(emp.role);
    setEmpEmail(emp.email);
  };

  // Deploys a new physical repair bay tracking coordinate into active dashboard display grids
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
        showToastNotification("✓ New infrastructure bay expanded.", "success");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Removes a technical workspace station bay node configuration block completely from system files
  const handleDeleteBayLayout = async (bayId: string, name: string) => {
    if (confirm(`Decommission workshop coordinates for ${name}?`)) {
      try {
        const response = await fetch(`/api/bays/${bayId}`, { method: "DELETE" });
        if (response.ok) {
          await refreshAllData();
          showToastNotification("✓ Core workshop node decommissioned.", "success");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Clears active dashboard session tracking routing parameters to return cleanly to the core gateway home path
  const handleLogout = () => {
    if(confirm("Are you sure you want to log out?")) router.push("/");
  };

  // =========================================================================
  // 📊 LIVE QUERY DIRECTORY DATA FILTER COMPUTATION ENGINE
  // =========================================================================
  /**
   * Filters the master vehicle dataset array against active text search parameters
   * and isolated chronological date categories ("All", "Today", "Yesterday").
   */
  const getFilteredJobs = () => {
    return jobs.filter((job) => {
      if (job.status === "Completed") return false; // Keeps historical records separated from active repair views

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

  // =========================================================================
  // 🎨 DYNAMIC VIEW LAYOUT CSS OBJECT DESIGNATORS
  // =========================================================================
  // Generates interactive sidebar element background style properties based on active application tabs and hover triggers
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

  // Standardized configuration matrix used uniformly across layout form input components
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

  // =========================================================================
  // 🖥️ MAIN APPLICATION VIEWPORT INTERFACE GRID RENDERER
  // =========================================================================
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", fontFamily: "Arial, sans-serif", backgroundColor: "#f1f5f9", margin: 0, padding: 0, boxSizing: "border-box" }}>
      
      {/* ===================================================================
          🏢 SECTION: SIDEBAR NAVIGATION AND OPERATOR CONTEXT PANEL
          =================================================================== */}
      <div style={{ width: "280px", backgroundColor: "#0f172a", color: "#ffffff", display: "flex", flexDirection: "column", padding: "24px 16px", boxSizing: "border-box", borderRight: "1px solid #1e293b" }}>
        <div style={{ marginBottom: "32px", paddingLeft: "8px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "900", margin: 0 }}>LIVE SERVICE BAY</h2>
          <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "700" }}>MANAGEMENT PORTAL</span>
        </div>

        {/* Dynamic Sidebar Menu Link Map Loop */}
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

        {/* User Identity Context Card in Sidebar Footer */}
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ paddingLeft: "8px" }}>
            <div style={{ fontSize: "14px", fontWeight: "700" }}>System Operator</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>Role: Coordinator</div>
          </div>
          <button onClick={handleLogout} style={{ width: "100%", padding: "12px", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "8px", fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>🚪 Secure Logout</button>
        </div>
      </div>

      {/* ===================================================================
          🖥️ SECTION: MAIN CONTENT TRACKING DISPLAY FRAMEWORK
          =================================================================== */}
      <div style={{ flexGrow: 1, padding: "40px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "32px", overflowY: "auto", height: "100vh" }}>
        
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "0 0 4px 0" }}>{activeTab}</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Service Operations Overview</p>
        </div>

        {loading ? (
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#64748b" }}>🔄 Querying database storage blocks...</div>
        ) : (
          <>
            {/* ===============================================================
                📊 SUB-MODULE: ACTIVE WORKSPACE METRICS & MAIN TABLE
                =============================================================== */}
            {activeTab === "Active Workspace" && (
              <>
                {/* Upper Metrics Grid Panel Rows */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", width: "100%" }}>
                  
                  {/* Metric Card: Active Repair Counter */}
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

                  {/* Metric Card: Unallocated Workloads Counter */}
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

                  {/* Metric Card: Completed Handover Counter */}
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

                {/* Main Workshop Operations Table Grid Layout */}
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
                        const rowBgColor = isEvenRow ? "#ffffff" : "#f8fafc"; // Zebra-striping alternating row background styles
                        
                        return (
                          <tr key={job.id} style={{ borderBottom: "1px solid #edf2f7", fontSize: "14px", color: "#334155", fontWeight: "600", backgroundColor: rowBgColor, transition: "background-color 0.15s ease" }}>
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
                              <span style={getStatusBadgeStyle(job.status)}>{job.status || "UNASSIGNED"}</span>
                            </td>
                            <td style={{ padding: "18px 12px", textAlign: "center" }}>
                              <button onClick={() => handleSendTrackLink(job.phoneNumber, job.id, job.vehicleNumber)} style={{ padding: "8px 14px", backgroundColor: "#16a34a", color: "#ffffff", border: "none", borderRadius: "6px", fontSize: "12.5px", fontWeight: "800", cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
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

            {/* ===============================================================
                🚗 SUB-MODULE: VEHICLE CHECK-IN AND SYSTEM INTAKE FORMS
                =============================================================== */}
            {activeTab === "Vehicle Check-In" && (
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px", alignItems: "start", width: "100%" }}>
                {/* Entry Input Form Column Structure */}
                <form onSubmit={handleVehicleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {formError && (
                    <div style={{ backgroundColor: "#fef2f2", color: "#b91c1c", padding: "16px", borderRadius: "10px", border: "1px solid #fca5a5", fontSize: "15px", fontWeight: "700" }}>
                      ⚠️ Validation Error: {formError}
                    </div>
                  )}
                  
                  {/* Form Block Section: Customer Ownership Fields */}
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

                  {/* Form Block Section: Mechanical Identity Attributes */}
                  <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "28px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Vehicle Details</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "14.5px", fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Vehicle Registration Number *</label>
                          <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="e.g. MH04HK6253" style={{ ...inputStyle, textTransform: "uppercase", fontWeight:"700" }} required />
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
                        <input type="text" value={brandModel} onChange={(e) => setBrandModel(e.target.value)} placeholder="e.g. Volkswagen Taigun GT" style={inputStyle} required />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions Submit Toolbar Panel */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    {editingJobId && (
                      <button type="button" onClick={handleCancelJobEdit} style={{ padding: "12px 24px", backgroundColor: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: "8px", fontWeight: "800", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
                    )}
                    <button type="submit" style={{ padding: "14px 36px", backgroundColor: editingJobId ? "#16a34a" : "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "800", fontSize: "15.5px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                      {editingJobId ? "💾 Save Changes" : "Register Vehicle"}
                    </button>
                  </div>
                </form>

                {/* Right Side Column Layout: Interactive Live Search Directory Cards */}
                <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", height: "680px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "800", color:"#0f172a" }}>Active Vehicle Directory</h3>
                  <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "13.5px", fontWeight: "600" }}>Select a vehicle from the directory to modify details or remove entry.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                    <div style={{ position: "relative" }}>
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="🔍 Search by vehicle number..." style={{ width: "100%", padding: "13px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", fontWeight: "600", boxSizing: "border-box" }} />
                    </div>

                    {/* Historical Filter Navigation Toggle Buttons */}
                    <div style={{ display: "flex", backgroundColor: "#f1f5f9", padding: "4px", borderRadius: "8px", gap: "4px" }}>
                      {["All", "Today", "Yesterday"].map((tab) => (
                        <button key={tab} type="button" onClick={() => setDateFilter(tab)} style={{ flexGrow: 1, padding: "10px 12px", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "800", cursor: "pointer", transition: "all 0.1s", backgroundColor: dateFilter === tab ? "#ffffff" : "transparent", color: dateFilter === tab ? "#2563eb" : "#64748b", boxShadow: dateFilter === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                          {tab === "All" ? "📄 All Records" : tab === "Today" ? "📅 Today" : "⏳ Yesterday"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Render Stack Loop for Active Target Vehicles */}
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

            {/* ===============================================================
                📝 SUB-MODULE: JOB CARDS SIMPLIFIED VERIFICATION TRACKER
                =============================================================== */}
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

            {/* ===============================================================
                🔧 SUB-MODULE: BAY & TECHNICIAN EXCLUSIVE ALLOCATION COMPONENT
                =============================================================== */}
            {activeTab === "Bay & Tech Assignment" && (
              <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Bay Assignment Manager</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {jobs.map((job) => {
                    const isEditing = !!editingRows[job.id];

                    // 🛑 1. Scan active vehicle rows to isolate bay designations occupied by OTHER vehicles
                    const occupiedBays = jobs
                      .filter(j => j.id !== job.id && j.status !== "Completed" && j.assignedBay && j.assignedBay !== "Unassigned")
                      .map(j => j.assignedBay);

                    // 👤 2. Scan active vehicle rows to isolate technicians currently busy with OTHER vehicles
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
                          
                          {/* 🚗 DYNAMICALLY FILTERED DISAPPEARING PHYSICAL REPAIR BAY DROP-DOWN */}
                          <select 
                            disabled={!isEditing} 
                            value={selectedBays[job.id] || "Unassigned"} 
                            onChange={(e) => setSelectedBays({ ...selectedBays, [job.id]: e.target.value })} 
                            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "700", outline: "none" }}
                          >
                            <option value="Unassigned">❌ No Bay</option>
                            {(() => {
                              // Filter out any bays currently occupied by other vehicles
                              const availableBays = bays.filter((b: any) => !occupiedBays.includes(b.name));
                              
                              // If no bays are vacant, provide a dynamic warning state placeholder option
                              if (availableBays.length === 0) {
                                return <option disabled value="None">⚠️ No bays are available</option>;
                              }
                              
                              return availableBays.map((b: any) => (
                                <option key={b.id} value={b.name}>{b.name}</option>
                              ));
                            })()}
                          </select>

                          {/* 🔧 DYNAMICALLY FILTERED DISAPPEARING TECHNICIAN DROPDOWN */}
                          <select 
                            disabled={!isEditing} 
                            value={selectedTechs[job.id] || "Unassigned"} 
                            onChange={(e) => setSelectedTechs({ ...selectedTechs, [job.id]: e.target.value })} 
                            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13px", fontWeight: "700", outline: "none" }}
                          >
                            <option value="Unassigned">❌ No Tech Assigned</option>
                            {(() => {
                              // Filter out any technicians currently busy with other vehicles
                              const availableTechs = Array.isArray(users) 
                                ? users.filter((emp: any) => emp.role === "Technician" && !occupiedTechs.includes(emp.name))
                                : [];
                                
                              // If all qualified workshop mechanics are busy, toggle a dynamic warning placeholder
                              if (availableTechs.length === 0) {
                                return <option disabled value="None">⚠️ No technicians available</option>;
                              }
                              
                              return availableTechs.map((emp: any, index: number) => (
                                <option key={`${emp.id}-${index}`} value={emp.name}>{emp.name}</option>
                              ));
                            })()}
                          </select>

                          {/* Dynamic Workspace Context Routing Control Buttons */}
                          {job.status === "Completed" ? (
                            <span style={getStatusBadgeStyle("Completed")}>✅ Done</span>
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

            {/* ===============================================================
                ⚙️ SUB-MODULE: SYSTEM INFRASTRUCTURE CONTROL AND CORPORATE SETTINGS
                =============================================================== */}
            {activeTab === "Settings" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "40px", maxWidth: "1100px" }}>
                {/* Upper Input Layout Forms: Onboard Employees & Provision New Station Bays */}
                <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px", alignItems: "start" }}>
                  
                  {/* Panel Block: Corporate Onboarding Registry Form */}
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

                  {/* Panel Block: Physical Station Bay Deployment Form */}
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

                {/* Lower Layout Tables Index: Manage Registered Staff & Decommission Stations */}
                <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "24px", alignItems: "start" }}>
                  
                  {/* Master Corporate Employee List Grid Matrix */}
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

                  {/* Physical Service Station Infrastructure Map Index Matrix */}
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

            {/* ===============================================================
                📡 FALLBACK GENERIC BACKDROP PANEL (FOR MODULES UNDER DEVELOPMENT)
                =============================================================== */}
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

      {/* ===================================================================
          🧭 FLOATING PROFESSIONALLY DESIGNED SYSTEM NOTIFICATION TOAST CARD
          =================================================================== */}
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

    </div>
  );
}