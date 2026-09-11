
import React from "react";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {

    // =============================================
    // GET LOGIN TOKEN
    // =============================================

    const userToken = localStorage.getItem("userToken");

    // =============================================
    // GET LOGGED-IN USER
    // =============================================

    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        console.error(
            "Invalid user data:",
            error
        );
    }

    // =============================================
    // CHECK ADMIN ACCESS
    // =============================================

    if (
        !userToken ||
        !user ||
        user.role !== "Admin"
    ) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // =============================================
    // ADMIN IS AUTHENTICATED
    // =============================================

    return children;
}

export default AdminProtectedRoute;

