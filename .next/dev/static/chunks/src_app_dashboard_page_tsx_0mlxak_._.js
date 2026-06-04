(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function DashboardPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // 🏢 MASTER SYNCHRONIZED APP STATES
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Active Workspace");
    const [hoveredTab, setHoveredTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [jobs, setJobs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [bays, setBays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // SEARCH & DATE FILTER STATES
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Active"); // 🎯 Tracks "Active" vs "Completed" cars
    const [dateFilter, setDateFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    // Form Management Intake Registers
    const [customerName, setCustomerName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [phoneNumber, setPhoneNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [customerEmail, setCustomerEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [vehicleNumber, setVehicleNumber] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [brandModel, setBrandModel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [manufactureYear, setManufactureYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("2022");
    const [editingJobId, setEditingJobId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Workforce Form Inputs
    const [empName, setEmpName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [empRole, setEmpRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Technician");
    const [empEmail, setEmpEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [editingEmpId, setEditingEmpId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Bay Form Input
    const [newBayName, setNewBayName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedTechs, setSelectedTechs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [selectedBays, setSelectedBays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [editingRows, setEditingRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const yearOptions = [];
    for(let y = 2026; y >= 2015; y--){
        yearOptions.push(y.toString());
    }
    const refreshAllData = async ()=>{
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
            // 🎯 THE CRUCIAL REFRESH FIX: Read the exact database fields
            const techMap = {};
            const bayMap = {};
            jobsData.forEach((job)=>{
                techMap[job.id] = job.assignedTech || "Unassigned";
                bayMap[job.id] = job.assignedBay || "Unassigned";
            });
            setSelectedTechs(techMap);
            setSelectedBays(bayMap);
        } catch (error) {
            console.error(error);
        } finally{
            setLoading(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            refreshAllData();
        }
    }["DashboardPage.useEffect"], []);
    // 🔵 POST / PUT: Vehicle Intake Controller
    const handleVehicleSubmit = async (e)=>{
        e.preventDefault();
        setFormError(null);
        const payload = {
            customerName,
            phoneNumber,
            customerEmail,
            vehicleNumber,
            brandModel,
            manufactureYear
        };
        const url = editingJobId ? `/api/jobs/${editingJobId}` : "/api/jobs";
        const method = editingJobId ? "PUT" : "POST";
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) {
                setFormError(result.error || "Check-in modification rejected.");
                return;
            }
            await refreshAllData();
            setCustomerName("");
            setPhoneNumber("");
            setCustomerEmail("");
            setVehicleNumber("");
            setBrandModel("");
            setManufactureYear("2022");
            setEditingJobId(null);
            if (method === "POST") setActiveTab("Job Cards");
        } catch (error) {
            setFormError("Communication breakdown with file registry.");
        }
    };
    const handleStartEditJob = (job)=>{
        setEditingJobId(job.id);
        setCustomerName(job.customerName);
        setPhoneNumber(job.phoneNumber);
        setCustomerEmail(job.customerEmail || "");
        setVehicleNumber(job.vehicleNumber);
        setBrandModel(job.brandModel);
        setManufactureYear(job.manufactureYear || "2022");
        setFormError(null);
    };
    const handleCancelJobEdit = ()=>{
        setEditingJobId(null);
        setCustomerName("");
        setPhoneNumber("");
        setCustomerEmail("");
        setVehicleNumber("");
        setBrandModel("");
        setManufactureYear("2022");
    };
    // 🔴 NEW FUNCTION FIXED IN PLACE: Completely Deletes Checked-In Vehicle
    const handleDeleteJob = async (jobId, vehicleNum)=>{
        if (confirm(`Permanently delete all check-in records for vehicle ${vehicleNum}?`)) {
            try {
                const response = await fetch(`/api/jobs/${jobId}`, {
                    method: "DELETE"
                });
                if (response.ok) {
                    if (editingJobId === jobId) {
                        handleCancelJobEdit();
                    }
                    await refreshAllData();
                } else {
                    const errorData = await response.json();
                    alert(`Server Error: ${errorData.error}`);
                }
            } catch (error) {
                alert("Failed to communicate with the local file server registry.");
            }
        }
    };
    // 🟡 PUT: Update Allocations
    // 🟡 FIXED SAVE CONTROLLER: Reads accurate select states directly
    const handleUpdateAssignment = async (id)=>{
        try {
            // 🎯 Grab the values straight from the dropdown maps instead of the unmutated job object
            const chosenBay = selectedBays[id] || "Unassigned";
            const chosenTech = selectedTechs[id] || "Unassigned";
            const response = await fetch(`/api/jobs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    bay: chosenBay,
                    technician: chosenTech,
                    status: "In Progress"
                })
            });
            if (response.ok) {
                // Force update our master array row indicators so everything stays synced
                setJobs((prevJobs)=>prevJobs.map((job)=>job.id === id ? {
                            ...job,
                            status: "In Progress",
                            assignedBay: chosenBay,
                            assignedTech: chosenTech
                        } : job));
                setEditingRows((prev)=>({
                        ...prev,
                        [id]: false
                    }));
                alert("Assignment updated and saved securely to Supabase cloud!");
            } else {
                alert("Failed to sync selection with cloud server.");
            }
        } catch (error) {
            console.error("Assignment save error:", error);
        }
    };
    // 🟢 NEW FUNCTION: Manually Mark a Vehicle Service as Completed
    const handleMarkAsCompleted = async (id)=>{
        try {
            const response = await fetch(`/api/jobs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "Completed"
                })
            });
            if (response.ok) {
                // 🎯 THE CRUCIAL PATCH: Use an isolated map update
                setJobs((prevJobs)=>prevJobs.map((job)=>job.id === id ? {
                            ...job,
                            status: "Completed"
                        } // Only change the status of the clicked car
                         : job // Leave EVERY other car row's data and dropdowns completely as they are
                    ));
                alert("Service execution marked as completed successfully.");
            } else {
                alert("Failed to update execution status on the cloud server.");
            }
        } catch (error) {
            console.error("Completion handler error:", error);
        }
    };
    // 🏢 WORKFORCE LAYER MUTATIONS
    const handleSaveStaffProfile = async (e)=>{
        e.preventDefault();
        try {
            if (editingEmpId) {
                const response = await fetch(`/api/users/${editingEmpId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: empName,
                        role: empRole,
                        email: empEmail
                    })
                });
                if (response.ok) {
                    setEditingEmpId(null);
                    setEmpName("");
                    setEmpEmail("");
                    await refreshAllData();
                }
            } else {
                const response = await fetch("/api/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: empName,
                        role: empRole,
                        email: empEmail
                    })
                });
                if (response.ok) {
                    setEmpName("");
                    setEmpEmail("");
                    await refreshAllData();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleDeleteStaffProfile = async (empId)=>{
        if (confirm("Scrub employee record permanently?")) {
            try {
                const response = await fetch(`/api/users/${empId}`, {
                    method: "DELETE"
                });
                if (response.ok) await refreshAllData();
            } catch (error) {
                console.error(error);
            }
        }
    };
    const handleStartEditStaff = (emp)=>{
        setEditingEmpId(emp.id);
        setEmpName(emp.name);
        setEmpRole(emp.role);
        setEmpEmail(emp.email);
    };
    // 🛠️ BAY INFRASTRUCTURE CONFIGURATIONS
    const handleRegisterNewBay = async (e)=>{
        e.preventDefault();
        if (!newBayName.trim()) return;
        try {
            const response = await fetch("/api/bays", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: newBayName
                })
            });
            if (response.ok) {
                setNewBayName("");
                await refreshAllData();
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleDeleteBayLayout = async (bayId, name)=>{
        if (confirm(`Decommission workshop coordinates for ${name}?`)) {
            try {
                const response = await fetch(`/api/bays/${bayId}`, {
                    method: "DELETE"
                });
                if (response.ok) await refreshAllData();
            } catch (error) {
                console.error(error);
            }
        }
    };
    const handleLogout = ()=>{
        if (confirm("Are you sure you want to log out?")) router.push("/");
    };
    // 🧮 RUNTIME COMPUTED SEARCH + DATE FILTERS
    const getFilteredJobs = ()=>{
        return jobs.filter((job)=>{
            if (job.status === "Completed") return false;
            const matchesSearch = job.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;
            if (dateFilter === "All") return true;
            if (!job.createdAt) {
                return dateFilter === "All";
            }
            const jobDate = new Date(job.createdAt);
            const today = new Date();
            const isToday = jobDate.getDate() === today.getDate() && jobDate.getMonth() === today.getMonth() && jobDate.getFullYear() === today.getFullYear();
            if (dateFilter === "Today") return isToday;
            if (dateFilter === "Yesterday") {
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                return jobDate.getDate() === yesterday.getDate() && jobDate.getMonth() === yesterday.getMonth() && jobDate.getFullYear() === yesterday.getFullYear();
            }
            return true;
        });
    };
    const getTabStyle = (tabName)=>{
        const isActive = activeTab === tabName;
        const isHovered = hoveredTab === tabName;
        return {
            padding: "12px 14px",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition: "all 0.15s ease",
            backgroundColor: isActive ? "#1e293b" : isHovered ? "rgba(51, 65, 85, 0.4)" : "transparent",
            color: isActive ? "#38bdf8" : isHovered ? "#f1f5f9" : "#94a3b8"
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: "flex",
            minHeight: "100vh",
            width: "100vw",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f1f5f9",
            margin: 0,
            padding: 0,
            boxSizing: "border-box"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: "280px",
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px 16px",
                    boxSizing: "border-box",
                    borderRight: "1px solid #1e293b"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: "32px",
                            paddingLeft: "8px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: "20px",
                                    fontWeight: "900",
                                    margin: 0
                                },
                                children: "LIVE SERVICE BAY"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 356,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: "11px",
                                    color: "#38bdf8",
                                    fontWeight: "700"
                                },
                                children: "MANAGEMENT PORTAL"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 357,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 355,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            flexGrow: 1,
                            overflowY: "auto"
                        },
                        children: [
                            {
                                name: "Active Workspace",
                                icon: "📊"
                            },
                            {
                                name: "Vehicle Check-In",
                                icon: "🚗"
                            },
                            {
                                name: "Job Cards",
                                icon: "📝"
                            },
                            {
                                name: "Bay & Tech Assignment",
                                icon: "🔧"
                            },
                            {
                                name: "Camera Mapping",
                                icon: "📹"
                            },
                            {
                                name: "Service Session",
                                icon: "⏱️"
                            },
                            {
                                name: "Report",
                                icon: "📈"
                            },
                            {
                                name: "Settings",
                                icon: "⚙️"
                            }
                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>setActiveTab(tab.name),
                                onMouseEnter: ()=>setHoveredTab(tab.name),
                                onMouseLeave: ()=>setHoveredTab(null),
                                style: getTabStyle(tab.name),
                                children: [
                                    tab.icon,
                                    " ",
                                    tab.name
                                ]
                            }, tab.name, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 371,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            borderTop: "1px solid #1e293b",
                            paddingTop: "16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    paddingLeft: "8px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "14px",
                                            fontWeight: "700"
                                        },
                                        children: "System Operator"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 379,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "12px",
                                            color: "#64748b"
                                        },
                                        children: "Role: Coordinator"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 378,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleLogout,
                                style: {
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                    color: "#ef4444",
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                    borderRadius: "8px",
                                    fontWeight: "800",
                                    fontSize: "13px",
                                    cursor: "pointer"
                                },
                                children: "🚪 Secure Logout"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 382,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 354,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flexGrow: 1,
                    padding: "40px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                    overflowY: "auto",
                    height: "100vh"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: "28px",
                                    fontWeight: "900",
                                    color: "#0f172a",
                                    margin: "0 0 4px 0"
                                },
                                children: activeTab
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 390,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: 0,
                                    color: "#64748b",
                                    fontSize: "14px",
                                    fontWeight: "600"
                                },
                                children: "Industrial-Grade Enterprise Fleet Logging"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 389,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#64748b"
                        },
                        children: "🔄 Querying database storage blocks..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/page.tsx",
                        lineNumber: 395,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            activeTab === "Active Workspace" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                                            gap: "24px",
                                            width: "100%"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#fff",
                                                    padding: "24px",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "13px",
                                                            fontWeight: "800",
                                                            color: "#64748b"
                                                        },
                                                        children: "ACTIVE REPAIRS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "32px",
                                                            fontWeight: "900",
                                                            color: "#0f172a",
                                                            marginTop: "8px"
                                                        },
                                                        children: jobs.filter((j)=>j.status !== "Completed").length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 402,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#fff",
                                                    padding: "24px",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "13px",
                                                            fontWeight: "800",
                                                            color: "#64748b"
                                                        },
                                                        children: "UNASSIGNED ASSETS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 407,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "32px",
                                                            fontWeight: "900",
                                                            color: "#2563eb",
                                                            marginTop: "8px"
                                                        },
                                                        children: jobs.filter((j)=>j.status !== "Completed" && (j.bay === "Unassigned" || j.bay === "" || j.technician === "Unassigned" || j.technician === "")).length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 406,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#fff",
                                                    padding: "24px",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "13px",
                                                            fontWeight: "800",
                                                            color: "#64748b"
                                                        },
                                                        children: "COMPLETED UNITS"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "32px",
                                                            fontWeight: "900",
                                                            color: "#16a34a",
                                                            marginTop: "8px"
                                                        },
                                                        children: jobs.filter((j)=>j.status === "Completed").length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 412,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 410,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 401,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            backgroundColor: "#ffffff",
                                            borderRadius: "16px",
                                            border: "1px solid #e2e8f0",
                                            padding: "24px",
                                            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    margin: "0 0 20px 0",
                                                    fontSize: "18px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "Real-time Master Operations Tracker"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 417,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                style: {
                                                    width: "100%",
                                                    borderCollapse: "collapse",
                                                    textAlign: "left"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            style: {
                                                                borderBottom: "2px solid #edf2f7",
                                                                color: "#64748b",
                                                                fontSize: "13px",
                                                                fontWeight: "800"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        padding: "12px 8px"
                                                                    },
                                                                    children: "JOB ID"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 421,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        padding: "12px 8px"
                                                                    },
                                                                    children: "VEHICLE NUMBER"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 422,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        padding: "12px 8px"
                                                                    },
                                                                    children: "BRAND / MODEL"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 423,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        padding: "12px 8px"
                                                                    },
                                                                    children: "CUSTOMER NAME"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 424,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        padding: "12px 8px"
                                                                    },
                                                                    children: "PHONE"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 425,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        padding: "12px 8px"
                                                                    },
                                                                    children: "BAY"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 426,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    style: {
                                                                        padding: "12px 8px"
                                                                    },
                                                                    children: "STATUS"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 427,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                            lineNumber: 420,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 419,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        children: jobs.map((job)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                style: {
                                                                    borderBottom: "1px solid #edf2f7",
                                                                    fontSize: "14px",
                                                                    color: "#334155",
                                                                    fontWeight: "600"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            padding: "16px 8px",
                                                                            color: "#2563eb",
                                                                            fontWeight: "800"
                                                                        },
                                                                        children: job.id
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 433,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            padding: "16px 8px",
                                                                            textTransform: "uppercase"
                                                                        },
                                                                        children: job.vehicleNumber
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 434,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            padding: "16px 8px"
                                                                        },
                                                                        children: [
                                                                            job.brandModel,
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: "11px",
                                                                                    color: "#94a3b8"
                                                                                },
                                                                                children: [
                                                                                    "(",
                                                                                    job.manufactureYear,
                                                                                    ")"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 435,
                                                                                columnNumber: 80
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 435,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            padding: "16px 8px"
                                                                        },
                                                                        children: job.customerName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 436,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            padding: "16px 8px"
                                                                        },
                                                                        children: job.phoneNumber
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 437,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            padding: "16px 8px"
                                                                        },
                                                                        children: job.bay
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 438,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        style: {
                                                                            padding: "16px 8px"
                                                                        },
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                backgroundColor: job.color,
                                                                                color: "#fff",
                                                                                padding: "6px 12px",
                                                                                borderRadius: "20px",
                                                                                fontSize: "11px",
                                                                                fontWeight: "900",
                                                                                textTransform: "uppercase"
                                                                            },
                                                                            children: job.status
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 440,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 439,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, job.id, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 432,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 430,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 418,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 416,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true),
                            activeTab === "Vehicle Check-In" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "1.2fr 1fr",
                                    gap: "32px",
                                    alignItems: "start",
                                    width: "100%"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleVehicleSubmit,
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "24px"
                                        },
                                        children: [
                                            formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#fef2f2",
                                                    color: "#b91c1c",
                                                    padding: "16px",
                                                    borderRadius: "10px",
                                                    border: "1px solid #fca5a5",
                                                    fontSize: "14px",
                                                    fontWeight: "700"
                                                },
                                                children: [
                                                    "⚠️ Validation Error: ",
                                                    formError
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 459,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#ffffff",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "28px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            margin: "0 0 4px 0",
                                                            fontSize: "16px",
                                                            fontWeight: "800",
                                                            color: "#0f172a"
                                                        },
                                                        children: editingJobId ? `✏️ Edit Operations Record (${editingJobId})` : "🚗 Intake Fleet Check-In"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 465,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            margin: "0 0 20px 0",
                                                            color: "#64748b",
                                                            fontSize: "12px",
                                                            fontWeight: "600"
                                                        },
                                                        children: "Log operational diagnostic fields securely."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 468,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "16px"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        style: {
                                                                            display: "block",
                                                                            fontSize: "13px",
                                                                            fontWeight: "700",
                                                                            marginBottom: "8px"
                                                                        },
                                                                        children: "Customer Owner Name *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 472,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: customerName,
                                                                        onChange: (e)=>setCustomerName(e.target.value),
                                                                        placeholder: "Full Name",
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "12px",
                                                                            borderRadius: "8px",
                                                                            border: "1px solid #cbd5e1",
                                                                            fontSize: "14px"
                                                                        },
                                                                        required: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 473,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 471,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "grid",
                                                                    gridTemplateColumns: "1fr 1fr",
                                                                    gap: "16px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                style: {
                                                                                    display: "block",
                                                                                    fontSize: "13px",
                                                                                    fontWeight: "700",
                                                                                    marginBottom: "8px"
                                                                                },
                                                                                children: "Phone Contact *"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 478,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: phoneNumber,
                                                                                onChange: (e)=>setPhoneNumber(e.target.value),
                                                                                placeholder: "Primary Mobile",
                                                                                style: {
                                                                                    width: "100%",
                                                                                    padding: "12px",
                                                                                    borderRadius: "8px",
                                                                                    border: "1px solid #cbd5e1",
                                                                                    fontSize: "14px"
                                                                                },
                                                                                required: true
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 479,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 477,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                style: {
                                                                                    display: "block",
                                                                                    fontSize: "13px",
                                                                                    fontWeight: "700",
                                                                                    marginBottom: "8px"
                                                                                },
                                                                                children: "Email Access ID *"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 482,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "email",
                                                                                value: customerEmail,
                                                                                onChange: (e)=>setCustomerEmail(e.target.value),
                                                                                placeholder: "name@domain.com",
                                                                                style: {
                                                                                    width: "100%",
                                                                                    padding: "12px",
                                                                                    borderRadius: "8px",
                                                                                    border: "1px solid #cbd5e1",
                                                                                    fontSize: "14px"
                                                                                },
                                                                                required: true
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 483,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 481,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 476,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 470,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 464,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#ffffff",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "28px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            margin: "0 0 20px 0",
                                                            fontSize: "16px",
                                                            fontWeight: "800"
                                                        },
                                                        children: "Vehicle Identification Parameters"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 490,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "16px"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "grid",
                                                                    gridTemplateColumns: "1.2fr 1fr",
                                                                    gap: "16px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                style: {
                                                                                    display: "block",
                                                                                    fontSize: "13px",
                                                                                    fontWeight: "700",
                                                                                    marginBottom: "8px"
                                                                                },
                                                                                children: "License Number Plate *"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 495,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: vehicleNumber,
                                                                                onChange: (e)=>setVehicleNumber(e.target.value),
                                                                                placeholder: "e.g. MH04KW2728",
                                                                                style: {
                                                                                    width: "100%",
                                                                                    padding: "12px",
                                                                                    borderRadius: "8px",
                                                                                    border: "1px solid #cbd5e1",
                                                                                    textTransform: "uppercase",
                                                                                    fontSize: "14px",
                                                                                    fontWeight: "700"
                                                                                },
                                                                                required: true
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 496,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 494,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                style: {
                                                                                    display: "block",
                                                                                    fontSize: "13px",
                                                                                    fontWeight: "700",
                                                                                    marginBottom: "8px"
                                                                                },
                                                                                children: "Model Release Year *"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 499,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                                value: manufactureYear,
                                                                                onChange: (e)=>setManufactureYear(e.target.value),
                                                                                style: {
                                                                                    width: "100%",
                                                                                    padding: "12px",
                                                                                    borderRadius: "8px",
                                                                                    border: "1px solid #cbd5e1",
                                                                                    backgroundColor: "#fff",
                                                                                    fontSize: "14px",
                                                                                    fontWeight: "700"
                                                                                },
                                                                                children: yearOptions.map((yr)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                        value: yr,
                                                                                        children: yr
                                                                                    }, yr, false, {
                                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                        lineNumber: 501,
                                                                                        columnNumber: 52
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 500,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 498,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 493,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        style: {
                                                                            display: "block",
                                                                            fontSize: "13px",
                                                                            fontWeight: "700",
                                                                            marginBottom: "8px"
                                                                        },
                                                                        children: "Brand & Specific Model Designation *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 507,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: brandModel,
                                                                        onChange: (e)=>setBrandModel(e.target.value),
                                                                        placeholder: "e.g. Volkswagen Taigun GT",
                                                                        style: {
                                                                            width: "100%",
                                                                            padding: "12px",
                                                                            borderRadius: "8px",
                                                                            border: "1px solid #cbd5e1",
                                                                            fontSize: "14px"
                                                                        },
                                                                        required: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 508,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 506,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 491,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 489,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    gap: "12px"
                                                },
                                                children: [
                                                    editingJobId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: handleCancelJobEdit,
                                                        style: {
                                                            padding: "12px 24px",
                                                            backgroundColor: "#f1f5f9",
                                                            color: "#334155",
                                                            border: "1px solid #cbd5e1",
                                                            borderRadius: "8px",
                                                            fontWeight: "800",
                                                            cursor: "pointer"
                                                        },
                                                        children: "Cancel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 515,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        style: {
                                                            padding: "12px 32px",
                                                            backgroundColor: editingJobId ? "#16a34a" : "#2563eb",
                                                            color: "#fff",
                                                            border: "none",
                                                            borderRadius: "8px",
                                                            fontWeight: "800",
                                                            cursor: "pointer"
                                                        },
                                                        children: editingJobId ? "💾 Save Changes" : "Commit Intake"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 517,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 513,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 457,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            backgroundColor: "#ffffff",
                                            borderRadius: "16px",
                                            border: "1px solid #e2e8f0",
                                            padding: "24px",
                                            height: "680px",
                                            display: "flex",
                                            flexDirection: "column"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    margin: "0 0 4px 0",
                                                    fontSize: "16px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "Active Floor Inventory Index"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 525,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: "0 0 16px 0",
                                                    color: "#64748b",
                                                    fontSize: "12px",
                                                    fontWeight: "600"
                                                },
                                                children: "Filter and select vehicle configs to modify field parameters."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 526,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "12px",
                                                    marginBottom: "20px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: "relative"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: searchQuery,
                                                            onChange: (e)=>setSearchQuery(e.target.value),
                                                            placeholder: "🔍 Search by vehicle number plate...",
                                                            style: {
                                                                width: "100%",
                                                                padding: "12px 14px",
                                                                borderRadius: "8px",
                                                                border: "1px solid #cbd5e1",
                                                                fontSize: "13px",
                                                                fontWeight: "600",
                                                                boxSizing: "border-box"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                            lineNumber: 531,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 530,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            backgroundColor: "#f1f5f9",
                                                            padding: "4px",
                                                            borderRadius: "8px",
                                                            gap: "4px"
                                                        },
                                                        children: [
                                                            "All",
                                                            "Today",
                                                            "Yesterday"
                                                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setDateFilter(tab),
                                                                style: {
                                                                    flexGrow: 1,
                                                                    padding: "8px 12px",
                                                                    border: "none",
                                                                    borderRadius: "6px",
                                                                    fontSize: "12px",
                                                                    fontWeight: "800",
                                                                    cursor: "pointer",
                                                                    transition: "all 0.1s",
                                                                    backgroundColor: dateFilter === tab ? "#ffffff" : "transparent",
                                                                    color: dateFilter === tab ? "#2563eb" : "#64748b",
                                                                    boxShadow: dateFilter === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                                                                },
                                                                children: tab === "All" ? "🌐 Show All" : tab === "Today" ? "📅 Today" : "⏳ Yesterday"
                                                            }, tab, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 536,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 529,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flexGrow: 1,
                                                    overflowY: "auto",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "12px"
                                                },
                                                children: getFilteredJobs().length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: "40px",
                                                        textAlign: "center",
                                                        color: "#94a3b8",
                                                        fontSize: "13px",
                                                        fontWeight: "700"
                                                    },
                                                    children: "📭 No matching vehicle records found."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 546,
                                                    columnNumber: 23
                                                }, this) : getFilteredJobs().map((job)=>{
                                                    const isBeingEdited = editingJobId === job.id;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            padding: "16px",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "12px",
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            backgroundColor: isBeingEdited ? "#eff6ff" : "#ffffff",
                                                            borderColor: isBeingEdited ? "#38bdf8" : "#e2e8f0",
                                                            transition: "all 0.2s"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: "14px",
                                                                            fontWeight: "800",
                                                                            color: "#0f172a"
                                                                        },
                                                                        children: [
                                                                            job.brandModel,
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: "11px",
                                                                                    color: "#64748b"
                                                                                },
                                                                                children: [
                                                                                    "(",
                                                                                    job.manufactureYear || "N/A",
                                                                                    ")"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 553,
                                                                                columnNumber: 119
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 553,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: "13px",
                                                                            fontWeight: "700",
                                                                            color: "#2563eb",
                                                                            textTransform: "uppercase",
                                                                            marginTop: "2px"
                                                                        },
                                                                        children: job.vehicleNumber
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 554,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            fontSize: "11px",
                                                                            color: "#64748b",
                                                                            marginTop: "6px"
                                                                        },
                                                                        children: [
                                                                            "Owner: ",
                                                                            job.customerName,
                                                                            " • ",
                                                                            job.phoneNumber
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 555,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 552,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "flex",
                                                                    gap: "6px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleStartEditJob(job),
                                                                        disabled: isBeingEdited,
                                                                        style: {
                                                                            padding: "8px 14px",
                                                                            backgroundColor: isBeingEdited ? "#cbd5e1" : "#0f172a",
                                                                            color: "#fff",
                                                                            border: "none",
                                                                            borderRadius: "6px",
                                                                            fontWeight: "800",
                                                                            fontSize: "12px",
                                                                            cursor: isBeingEdited ? "not-allowed" : "pointer"
                                                                        },
                                                                        children: isBeingEdited ? "⚡ Targeting" : "✏️ Modify"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 560,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleDeleteJob(job.id, job.vehicleNumber),
                                                                        style: {
                                                                            padding: "8px 10px",
                                                                            backgroundColor: "rgba(239, 68, 68, 0.05)",
                                                                            border: "1px solid rgba(239, 68, 68, 0.15)",
                                                                            borderRadius: "6px",
                                                                            color: "#ef4444",
                                                                            fontWeight: "800",
                                                                            fontSize: "12px",
                                                                            cursor: "pointer"
                                                                        },
                                                                        children: "🗑️"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 563,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 559,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, job.id, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 551,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 544,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 524,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 454,
                                columnNumber: 15
                            }, this),
                            activeTab === "Job Cards" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    backgroundColor: "#ffffff",
                                    borderRadius: "16px",
                                    border: "1px solid #e2e8f0",
                                    padding: "24px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            margin: "0 0 20px 0",
                                            fontSize: "18px",
                                            fontWeight: "800"
                                        },
                                        children: "Active Service Control Records"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 581,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        style: {
                                            width: "100%",
                                            borderCollapse: "collapse",
                                            textAlign: "left"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    style: {
                                                        borderBottom: "2px solid #edf2f7",
                                                        color: "#64748b",
                                                        fontSize: "13px",
                                                        fontWeight: "800"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "12px 8px"
                                                            },
                                                            children: "ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                            lineNumber: 585,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "12px 8px"
                                                            },
                                                            children: "VEHICLE NUMBER"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                            lineNumber: 586,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "12px 8px"
                                                            },
                                                            children: "BRAND / MODEL"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                            lineNumber: 587,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "12px 8px"
                                                            },
                                                            children: "CUSTOMER"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                            lineNumber: 588,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                padding: "12px 8px"
                                                            },
                                                            children: "STATUS"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                            lineNumber: 589,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                    lineNumber: 584,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 583,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                children: jobs.map((job)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        style: {
                                                            borderBottom: "1px solid #edf2f7",
                                                            fontSize: "14px",
                                                            color: "#334155",
                                                            fontWeight: "600"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "16px 8px",
                                                                    color: "#2563eb",
                                                                    fontWeight: "800"
                                                                },
                                                                children: job.id
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 595,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "16px 8px",
                                                                    textTransform: "uppercase"
                                                                },
                                                                children: job.vehicleNumber
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 596,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "16px 8px"
                                                                },
                                                                children: job.brandModel
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 597,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "16px 8px"
                                                                },
                                                                children: job.customerName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 598,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    padding: "16px 8px",
                                                                    fontWeight: "700"
                                                                },
                                                                children: job.status === "Completed" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        backgroundColor: "#f0fdf4",
                                                                        color: "#16a34a",
                                                                        padding: "6px 12px",
                                                                        borderRadius: "6px",
                                                                        fontSize: "12px",
                                                                        border: "1px solid #bbf7d0",
                                                                        display: "inline-flex",
                                                                        alignItems: "center"
                                                                    },
                                                                    children: "✅ Done"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 601,
                                                                    columnNumber: 29
                                                                }, this) : job.status === "In Progress" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        backgroundColor: "#eff6ff",
                                                                        color: "#2563eb",
                                                                        padding: "6px 12px",
                                                                        borderRadius: "6px",
                                                                        fontSize: "12px",
                                                                        border: "1px solid #bfdbfe"
                                                                    },
                                                                    children: "⚡ IN PROGRESS"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 614,
                                                                    columnNumber: 29
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        backgroundColor: "#fffbeb",
                                                                        color: "#d97706",
                                                                        padding: "6px 12px",
                                                                        borderRadius: "6px",
                                                                        fontSize: "12px",
                                                                        border: "1px solid #fde68a"
                                                                    },
                                                                    children: "⚠️ PENDING ALLOCATION"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 625,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 599,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, job.id, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 594,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 592,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 582,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 580,
                                columnNumber: 15
                            }, this),
                            activeTab === "Bay & Tech Assignment" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    backgroundColor: "#ffffff",
                                    borderRadius: "16px",
                                    border: "1px solid #e2e8f0",
                                    padding: "24px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            margin: "0 0 8px 0",
                                            fontSize: "18px",
                                            fontWeight: "800"
                                        },
                                        children: "Floor Marshalling Allocation Matrix"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 647,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "16px"
                                        },
                                        children: jobs.map((job)=>{
                                            const isEditing = !!editingRows[job.id];
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: "20px",
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: "12px",
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    backgroundColor: isEditing ? "#f8fafc" : "#ffffff",
                                                    gap: "16px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: "15px",
                                                                    fontWeight: "800"
                                                                },
                                                                children: [
                                                                    job.brandModel,
                                                                    " (",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            textTransform: "uppercase"
                                                                        },
                                                                        children: job.vehicleNumber
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 654,
                                                                        columnNumber: 98
                                                                    }, this),
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 654,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: "12px",
                                                                    color: "#64748b",
                                                                    marginTop: "4px"
                                                                },
                                                                children: [
                                                                    "ID: ",
                                                                    job.id,
                                                                    " • Owner: ",
                                                                    job.customerName
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 655,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 653,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: "12px"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                disabled: !isEditing,
                                                                value: selectedBays[job.id] || "Unassigned",
                                                                onChange: (e)=>setSelectedBays({
                                                                        ...selectedBays,
                                                                        [job.id]: e.target.value
                                                                    }),
                                                                style: {
                                                                    padding: "10px",
                                                                    borderRadius: "8px",
                                                                    border: "1px solid #cbd5e1",
                                                                    fontSize: "13px",
                                                                    fontWeight: "700"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "Unassigned",
                                                                        children: "❌ No Bay"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 660,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    bays.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: b.name,
                                                                            children: b.name
                                                                        }, b.id, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 661,
                                                                            columnNumber: 51
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 659,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                disabled: !isEditing,
                                                                value: selectedTechs[job.id] || "Unassigned",
                                                                onChange: (e)=>setSelectedTechs({
                                                                        ...selectedTechs,
                                                                        [job.id]: e.target.value
                                                                    }),
                                                                style: {
                                                                    padding: "10px",
                                                                    borderRadius: "8px",
                                                                    border: "1px solid #cbd5e1",
                                                                    fontSize: "13px",
                                                                    fontWeight: "700"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "Unassigned",
                                                                        children: "❌ No Tech Assigned"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 665,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    users.filter((emp)=>emp.role === "Technician").map((emp, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: emp.name,
                                                                            children: emp.name
                                                                        }, `${emp.id}-${index}`, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 667,
                                                                            columnNumber: 31
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 664,
                                                                columnNumber: 27
                                                            }, this),
                                                            job.status === "Completed" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    padding: "10px 18px",
                                                                    backgroundColor: "#f0fdf4",
                                                                    color: "#16a34a",
                                                                    border: "1px solid #bbf7d0",
                                                                    borderRadius: "8px",
                                                                    fontWeight: "800",
                                                                    fontSize: "13px",
                                                                    display: "inline-flex",
                                                                    alignItems: "center"
                                                                },
                                                                children: "✅ Done"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 675,
                                                                columnNumber: 29
                                                            }, this) : !editingRows[job.id] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "flex",
                                                                    gap: "8px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setEditingRows({
                                                                                ...editingRows,
                                                                                [job.id]: true
                                                                            }),
                                                                        style: {
                                                                            padding: "10px 18px",
                                                                            backgroundColor: "#0f172a",
                                                                            color: "#fff",
                                                                            border: "none",
                                                                            borderRadius: "8px",
                                                                            fontWeight: "800",
                                                                            fontSize: "13px",
                                                                            cursor: "pointer"
                                                                        },
                                                                        children: "✏️ Edit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 690,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    job.status === "In Progress" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleMarkAsCompleted(job.id),
                                                                        style: {
                                                                            padding: "10px 18px",
                                                                            backgroundColor: "#f0fdf4",
                                                                            color: "#16a34a",
                                                                            border: "1px solid #bbf7d0",
                                                                            borderRadius: "8px",
                                                                            fontWeight: "800",
                                                                            fontSize: "13px",
                                                                            cursor: "pointer"
                                                                        },
                                                                        children: "✅ Complete Service"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 695,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 689,
                                                                columnNumber: 29
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleUpdateAssignment(job.id),
                                                                style: {
                                                                    padding: "10px 18px",
                                                                    backgroundColor: "#16a34a",
                                                                    color: "#fff",
                                                                    border: "none",
                                                                    borderRadius: "8px",
                                                                    fontWeight: "800",
                                                                    fontSize: "13px",
                                                                    cursor: "pointer"
                                                                },
                                                                children: "💾 Save"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 701,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 657,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, job.id, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 652,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 648,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 646,
                                columnNumber: 15
                            }, this),
                            activeTab === "Settings" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "40px",
                                    maxWidth: "1100px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "1.8fr 1fr",
                                            gap: "24px",
                                            alignItems: "start"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#ffffff",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "28px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            margin: "0 0 4px 0",
                                                            fontSize: "16px",
                                                            fontWeight: "800"
                                                        },
                                                        children: editingEmpId ? "✏️ Modify Operator Records" : "➕ Onboard Corporate Staff"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 721,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            margin: "0 0 20px 0",
                                                            color: "#64748b",
                                                            fontSize: "12px",
                                                            fontWeight: "600"
                                                        },
                                                        children: "Register service advisors and mechanical technical staff fields."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                        onSubmit: handleSaveStaffProfile,
                                                        style: {
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "14px"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "grid",
                                                                    gridTemplateColumns: "1fr 1fr",
                                                                    gap: "14px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: empName,
                                                                        onChange: (e)=>setEmpName(e.target.value),
                                                                        placeholder: "Full Name",
                                                                        style: {
                                                                            padding: "12px",
                                                                            borderRadius: "8px",
                                                                            border: "1px solid #cbd5e1",
                                                                            fontSize: "14px"
                                                                        },
                                                                        required: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 727,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "email",
                                                                        value: empEmail,
                                                                        onChange: (e)=>setEmpEmail(e.target.value),
                                                                        placeholder: "Email Address",
                                                                        style: {
                                                                            padding: "12px",
                                                                            borderRadius: "8px",
                                                                            border: "1px solid #cbd5e1",
                                                                            fontSize: "14px"
                                                                        },
                                                                        required: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 728,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 726,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: "flex",
                                                                    gap: "12px"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: empRole,
                                                                        onChange: (e)=>setEmpRole(e.target.value),
                                                                        style: {
                                                                            padding: "12px",
                                                                            borderRadius: "8px",
                                                                            border: "1px solid #cbd5e1",
                                                                            fontSize: "14px",
                                                                            fontWeight: "700",
                                                                            flexGrow: 1,
                                                                            backgroundColor: "#fff"
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "Service Advisor",
                                                                                children: "Service Advisor"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 732,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: "Technician",
                                                                                children: "Technician"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 733,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 731,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "submit",
                                                                        style: {
                                                                            padding: "12px 24px",
                                                                            backgroundColor: "#2563eb",
                                                                            color: "#fff",
                                                                            border: "none",
                                                                            borderRadius: "8px",
                                                                            fontSize: "14px",
                                                                            fontWeight: "800",
                                                                            cursor: "pointer"
                                                                        },
                                                                        children: editingEmpId ? "Save Change" : "Register Staff"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 735,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 730,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 720,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#ffffff",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "28px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            margin: "0 0 4px 0",
                                                            fontSize: "16px",
                                                            fontWeight: "800"
                                                        },
                                                        children: "🏗️ Expand Station Bays"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 744,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            margin: "0 0 20px 0",
                                                            color: "#64748b",
                                                            fontSize: "12px",
                                                            fontWeight: "600"
                                                        },
                                                        children: "Provision physical repair bay arrays dynamically."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 745,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                        onSubmit: handleRegisterNewBay,
                                                        style: {
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "14px"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: newBayName,
                                                                onChange: (e)=>setNewBayName(e.target.value),
                                                                placeholder: "e.g. Bay 5",
                                                                style: {
                                                                    padding: "12px",
                                                                    borderRadius: "8px",
                                                                    border: "1px solid #cbd5e1",
                                                                    fontSize: "14px"
                                                                },
                                                                required: true
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 747,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "submit",
                                                                style: {
                                                                    padding: "12px",
                                                                    backgroundColor: "#0f172a",
                                                                    color: "#fff",
                                                                    border: "none",
                                                                    borderRadius: "8px",
                                                                    fontSize: "14px",
                                                                    fontWeight: "800",
                                                                    cursor: "pointer"
                                                                },
                                                                children: "Provision New Station"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 748,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 746,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 743,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 717,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "1.8fr 1fr",
                                            gap: "24px",
                                            alignItems: "start"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#ffffff",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "24px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            margin: "0 0 16px 0",
                                                            fontSize: "15px",
                                                            fontWeight: "800"
                                                        },
                                                        children: "Active Center Staff Index"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 760,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        style: {
                                                            width: "100%",
                                                            borderCollapse: "collapse",
                                                            textAlign: "left"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    style: {
                                                                        borderBottom: "2px solid #edf2f7",
                                                                        color: "#64748b",
                                                                        fontSize: "12px",
                                                                        fontWeight: "800"
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: "ID"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 764,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: "NAME"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 765,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: "FUNCTION ROLE"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 766,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: "EMAIL ACCESS"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 767,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "10px 6px",
                                                                                textAlign: "right"
                                                                            },
                                                                            children: "ACTIONS"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 768,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 763,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 762,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: users.map((emp, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        style: {
                                                                            borderBottom: "1px solid #edf2f7",
                                                                            fontSize: "13px",
                                                                            fontWeight: "600",
                                                                            color: "#334155"
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "12px 6px"
                                                                                },
                                                                                children: emp.id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 774,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "12px 6px",
                                                                                    color: "#0f172a",
                                                                                    fontWeight: "700"
                                                                                },
                                                                                children: emp.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 775,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "12px 6px"
                                                                                },
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    style: {
                                                                                        padding: "3px 8px",
                                                                                        borderRadius: "10px",
                                                                                        fontSize: "10px",
                                                                                        fontWeight: "800",
                                                                                        backgroundColor: emp.role === "Service Advisor" ? "#eff6ff" : "#f0fdf4",
                                                                                        color: emp.role === "Service Advisor" ? "#2563eb" : "#16a34a"
                                                                                    },
                                                                                    children: emp.role
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                    lineNumber: 777,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 776,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "12px 6px",
                                                                                    color: "#64748b"
                                                                                },
                                                                                children: emp.email
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 781,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "12px 6px",
                                                                                    textAlign: "right"
                                                                                },
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>handleStartEditStaff(emp),
                                                                                        style: {
                                                                                            marginRight: "6px",
                                                                                            padding: "4px 8px",
                                                                                            backgroundColor: "#f1f5f9",
                                                                                            border: "1px solid #cbd5e1",
                                                                                            borderRadius: "4px",
                                                                                            cursor: "pointer"
                                                                                        },
                                                                                        children: "✏️ Edit"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                        lineNumber: 783,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>handleDeleteStaffProfile(emp.id),
                                                                                        style: {
                                                                                            padding: "4px 8px",
                                                                                            backgroundColor: "rgba(239, 68, 68, 0.05)",
                                                                                            border: "1px solid rgba(239, 68, 68, 0.15)",
                                                                                            borderRadius: "4px",
                                                                                            color: "#ef4444",
                                                                                            cursor: "pointer"
                                                                                        },
                                                                                        children: "🗑️ Delete"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                        lineNumber: 784,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 782,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, `${emp.id}-${index}`, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 773,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 771,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 761,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 759,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    backgroundColor: "#ffffff",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "24px"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            margin: "0 0 16px 0",
                                                            fontSize: "15px",
                                                            fontWeight: "800"
                                                        },
                                                        children: "Service Bay Infrastructure Node"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 794,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        style: {
                                                            width: "100%",
                                                            borderCollapse: "collapse",
                                                            textAlign: "left"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    style: {
                                                                        borderBottom: "2px solid #edf2f7",
                                                                        color: "#64748b",
                                                                        fontSize: "12px",
                                                                        fontWeight: "800"
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: "NODE ID"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 798,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "10px 6px"
                                                                            },
                                                                            children: "STATION DESIGNATION"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 799,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            style: {
                                                                                padding: "10px 6px",
                                                                                textAlign: "right"
                                                                            },
                                                                            children: "DECOMMISSION"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/page.tsx",
                                                                            lineNumber: 800,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                    lineNumber: 797,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 796,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: bays.map((bay)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        style: {
                                                                            borderBottom: "1px solid #edf2f7",
                                                                            fontSize: "13px",
                                                                            fontWeight: "600",
                                                                            color: "#334155"
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "12px 6px",
                                                                                    color: "#2563eb",
                                                                                    fontWeight: "700"
                                                                                },
                                                                                children: bay.id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 806,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "12px 6px",
                                                                                    color: "#0f172a",
                                                                                    fontWeight: "700"
                                                                                },
                                                                                children: bay.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 807,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                style: {
                                                                                    padding: "12px 6px",
                                                                                    textAlign: "right"
                                                                                },
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: ()=>handleDeleteBayLayout(bay.id, bay.name),
                                                                                    style: {
                                                                                        padding: "4px 8px",
                                                                                        backgroundColor: "rgba(239, 68, 68, 0.05)",
                                                                                        border: "1px solid rgba(239, 68, 68, 0.15)",
                                                                                        borderRadius: "4px",
                                                                                        color: "#ef4444",
                                                                                        cursor: "pointer"
                                                                                    },
                                                                                    children: "🗑️ Delete"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                    lineNumber: 809,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                                lineNumber: 808,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, bay.id, true, {
                                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                                        lineNumber: 805,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                                lineNumber: 803,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                                        lineNumber: 795,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/page.tsx",
                                                lineNumber: 793,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 756,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 715,
                                columnNumber: 15
                            }, this),
                            [
                                "Camera Mapping",
                                "Service Session",
                                "Report"
                            ].includes(activeTab) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    backgroundColor: "#ffffff",
                                    borderRadius: "16px",
                                    border: "1px solid #e2e8f0",
                                    padding: "60px",
                                    textAlign: "center"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "48px",
                                            marginBottom: "16px"
                                        },
                                        children: "📡"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 825,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            margin: "0 0 8px 0",
                                            fontSize: "20px",
                                            fontWeight: "800",
                                            color: "#0f172a"
                                        },
                                        children: [
                                            activeTab,
                                            " Management View"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 826,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: "#64748b",
                                            fontWeight: "600",
                                            margin: 0
                                        },
                                        children: "Connected to full-stack API schema layer."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/page.tsx",
                                        lineNumber: 827,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/page.tsx",
                                lineNumber: 824,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/page.tsx",
                lineNumber: 387,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/page.tsx",
        lineNumber: 351,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "c1q5mtDpbgobFiESbZ5GZ9Js690=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_dashboard_page_tsx_0mlxak_._.js.map