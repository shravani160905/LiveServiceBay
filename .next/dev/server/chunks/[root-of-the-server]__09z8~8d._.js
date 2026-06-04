module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/jobs/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// 🗄️ This server-side array acts as our temporary local database.
// Because it lives on the server, it persists even if you refresh your browser!
let globalJobsDatabase = [
    {
        id: "JOB-101",
        vehicle: "Honda City (MH-04-AB-1234)",
        customer: "Rohan Sharma",
        technician: "Amit Patel",
        bay: "Bay 1 (Express)",
        status: "In Progress",
        color: "#eab308"
    },
    {
        id: "JOB-102",
        vehicle: "Maruti Swift (MH-02-XY-9876)",
        customer: "Priya Nair",
        technician: "Suresh Kumar",
        bay: "Bay 3 (Alignment)",
        status: "Pending Parts",
        color: "#ef4444"
    },
    {
        id: "JOB-103",
        vehicle: "Hyundai i20 (MH-03-CC-5544)",
        customer: "Vikram Malhotra",
        technician: "Amit Patel",
        bay: "Bay 2 (Washing)",
        status: "Completed",
        color: "#22c55e"
    }
];
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(globalJobsDatabase);
}
async function POST(request) {
    try {
        // Read the incoming JSON stream payload sent by the frontend form
        const body = await request.json();
        const { vehicle, customer } = body;
        // Backend Validation: Ensure fields aren't blank before storing
        if (!vehicle || !customer) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required vehicle or customer information."
            }, {
                status: 400
            });
        }
        // Generate a secure sequential Job ID on the server
        const nextId = `JOB-${globalJobsDatabase.length + 101}`;
        // Construct the new database record format
        const newDatabaseRecord = {
            id: nextId,
            vehicle: vehicle,
            customer: customer,
            technician: "Unassigned",
            bay: "Unassigned",
            status: "Awaiting Inspection",
            color: "#94a3b8"
        };
        // Push (Insert) the new vehicle straight into our database array
        globalJobsDatabase.push(newDatabaseRecord);
        // Send back a success confirmation along with the newly created record
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Vehicle successfully logged in database.",
            data: newDatabaseRecord
        }, {
            status: 201
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal Server Error parsing backend payload."
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__09z8~8d._.js.map