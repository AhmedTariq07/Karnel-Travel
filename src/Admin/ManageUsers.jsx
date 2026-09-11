import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import "../Pages/ManageTouristSpots.css";

function ManageUsers() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    const [changingRole, setChangingRole] = useState(null);

    const [currentUser, setCurrentUser] = useState(null);


    // =====================================================
    // LOAD USERS
    // =====================================================

    const loadUsers = async () => {

        try {

            setLoading(true);

            const token =
                localStorage.getItem("userToken");


            const response = await fetch(
                `${API_URL}/api/Users`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {
                throw new Error("Failed to load users");
            }


            const data =
                await response.json();


            setUsers(data);

        }
        catch (error) {

            console.error(error);

            setMessage(
                "Unable to load users."
            );

        }
        finally {

            setLoading(false);

        }
    };


    // =====================================================
    // CHECK LOGIN + LOAD USERS
    // =====================================================

    useEffect(() => {

        const token =
            localStorage.getItem("userToken");


        const storedUser =
            localStorage.getItem("user");


        let loggedInUser = null;


        try {

            loggedInUser = storedUser
                ? JSON.parse(storedUser)
                : null;

        }
        catch (error) {

            console.error(
                "Invalid user data:",
                error
            );

        }


        // -------------------------------------------------
        // ONLY ADMIN CAN OPEN THIS PAGE
        // -------------------------------------------------

        if (
            !token ||
            !loggedInUser ||
            loggedInUser.role !== "Admin"
        ) {

            navigate("/login");

            return;
        }


        // -------------------------------------------------
        // SAVE CURRENT USER
        // -------------------------------------------------

        setCurrentUser(loggedInUser);


        // -------------------------------------------------
        // LOAD USERS
        // -------------------------------------------------

        loadUsers();

    }, [navigate]);


    // =====================================================
    // CHANGE USER ROLE
    // ONLY MAIN ADMIN SHOULD REACH THIS FUNCTION
    // =====================================================

    const changeUserRole = async (
        userId,
        currentRole,
        isMainAdmin
    ) => {

        // -------------------------------------------------
        // EXTRA FRONTEND PROTECTION
        // -------------------------------------------------

        if (
            !currentUser ||
            !currentUser.isMainAdmin
        ) {

            setMessage(
                "Only the Main Admin can give or remove Admin access."
            );

            return;
        }


        // -------------------------------------------------
        // NEVER DEMOTE MAIN ADMIN
        // -------------------------------------------------

        if (
            isMainAdmin &&
            currentRole === "Admin"
        ) {

            setMessage(
                "Main Admin access cannot be removed."
            );

            return;
        }


        const newRole =
            currentRole === "Admin"
                ? "User"
                : "Admin";


        const confirmMessage =
            newRole === "Admin"
                ? "Give this user Admin access?"
                : "Remove Admin access from this user?";


        const confirmed =
            window.confirm(confirmMessage);


        if (!confirmed) {
            return;
        }


        try {

            setChangingRole(userId);

            setMessage("");


            const token =
                localStorage.getItem("userToken");


            const response = await fetch(
                `${API_URL}/api/Users/${userId}/role`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        role: newRole
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to change user role."
                );
            }


            // =================================================
            // UPDATE TABLE
            // =================================================

            setUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user.id === userId
                        ? {
                            ...user,
                            role: newRole
                        }
                        : user
                )
            );


            setMessage(
                data.message ||
                "User role updated successfully."
            );

        }
        catch (error) {

            console.error(error);

            setMessage(
                error.message ||
                "Unable to change user role."
            );

        }
        finally {

            setChangingRole(null);

        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem(
            "userToken"
        );

        localStorage.removeItem(
            "user"
        );

        window.dispatchEvent(
            new Event("userAuthChanged")
        );

        navigate("/login");
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="manage-tourist-spots">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="manage-header">

                <div>

                    <h1>
                        Manage Users
                    </h1>

                    <p>
                        View registered users
                    </p>

                </div>


                <div className="manage-header-buttons">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(
                                "/admin-dashboard"
                            )
                        }
                    >
                        ← Dashboard
                    </button>


                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="manage-content">


                {/* =================================================
                    TOP
                ================================================= */}

                <div className="manage-top">

                    <h2>
                        Registered Users
                    </h2>

                </div>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div className="manage-message">

                        {message}

                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <p className="loading">
                        Loading users...
                    </p>

                ) : users.length === 0 ? (

                    /* =================================================
                       EMPTY STATE
                    ================================================= */

                    <div className="empty-state">

                        <h3>
                            No Users Found
                        </h3>

                        <p>
                            There are currently no registered users.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       USERS TABLE
                    ================================================= */

                    <div className="tourist-table-wrapper">

                        <table className="tourist-table">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Admin Access
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {users.map((user) => (

                                    <tr key={user.id}>

                                        <td>
                                            {user.id}
                                        </td>

                                        <td>
                                            {user.name}
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>

                                            {user.isMainAdmin
                                                ? "Main Admin"
                                                : user.role}

                                        </td>

                                        <td>

                                            {/* ==========================================
                                                ONLY MAIN ADMIN CAN SEE ACCESS CONTROLS
                                            ========================================== */}

                                            {currentUser?.isMainAdmin ? (

                                                user.isMainAdmin ? (

                                                    <span>
                                                        Protected
                                                    </span>

                                                ) : (

                                                    <button
                                                        onClick={() =>
                                                            changeUserRole(
                                                                user.id,
                                                                user.role,
                                                                user.isMainAdmin
                                                            )
                                                        }
                                                        disabled={
                                                            changingRole ===
                                                            user.id
                                                        }
                                                    >

                                                        {changingRole ===
                                                        user.id
                                                            ? "Updating..."
                                                            : user.role ===
                                                              "Admin"
                                                            ? "Remove Admin Access"
                                                            : "Give Admin Access"}

                                                    </button>

                                                )

                                            ) : (

                                                <span>
                                                    —
                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default ManageUsers;
