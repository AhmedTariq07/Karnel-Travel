import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import API_URL from "../api";

function Profile() {

    const navigate = useNavigate();

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const getUser = () => {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch (error) {
            console.error("Invalid user data:", error);
            return null;
        }
    };

    const user = getUser();


    // =====================================================
    // STATES
    // =====================================================

    const [name, setName] = useState(user?.name || "");

    const [email, setEmail] = useState(user?.email || "");

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");


    // =====================================================
    // LOGOUT
    // =====================================================

    const logoutUser = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("userToken");

        window.dispatchEvent(
            new Event("userAuthChanged")
        );

        navigate("/login");
    };


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const handleUpdateProfile = async (e) => {

        e.preventDefault();

        setMessage("");

        setError("");


        // -------------------------------------------------
        // CHECK PASSWORD MATCH
        // -------------------------------------------------

        if (
            newPassword &&
            newPassword !== confirmPassword
        ) {
            setError("New passwords do not match.");
            return;
        }


        // -------------------------------------------------
        // CHECK PASSWORD LENGTH
        // -------------------------------------------------

        if (
            newPassword &&
            newPassword.length < 6
        ) {
            setError(
                "New password must be at least 6 characters."
            );

            return;
        }


        // -------------------------------------------------
        // GET TOKEN
        // -------------------------------------------------

        const token = localStorage.getItem("userToken");

        if (!token) {

            setError(
                "Your session has expired. Please login again."
            );

            return;
        }


        try {

            setLoading(true);


            // -------------------------------------------------
            // SEND REQUEST TO BACKEND
            // -------------------------------------------------

            const response = await fetch(
                `${API_URL}/api/Auth/update-profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        currentPassword:
                            currentPassword || null,

                        newPassword:
                            newPassword || null

                    })
                }
            );


            const data = await response.json();


            // -------------------------------------------------
            // HANDLE ERROR
            // -------------------------------------------------

            if (!response.ok) {

                setError(
                    data.message ||
                    "Failed to update profile."
                );

                return;
            }


            // -------------------------------------------------
            // UPDATE LOCAL STORAGE
            // -------------------------------------------------

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // -------------------------------------------------
            // UPDATE NAVBAR
            // -------------------------------------------------

            window.dispatchEvent(
                new Event("userAuthChanged")
            );


            // -------------------------------------------------
            // CLEAR PASSWORD FIELDS
            // -------------------------------------------------

            setCurrentPassword("");

            setNewPassword("");

            setConfirmPassword("");


            // -------------------------------------------------
            // SUCCESS MESSAGE
            // -------------------------------------------------

            setMessage(
                "Profile updated successfully!"
            );

        } catch (err) {

            console.error(
                "Profile Update Error:",
                err
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!user) {

        return (
            <section className="profile-section">

                <div className="profile-container">

                    <div className="profile-login-box">

                        <h2>
                            Please Login
                        </h2>

                        <p>
                            You need to login to view
                            your profile.
                        </p>

                        <Link
                            to="/login"
                            className="profile-login-btn"
                        >
                            Login
                        </Link>

                    </div>

                </div>

            </section>
        );
    }


    // =====================================================
    // PROFILE PAGE
    // =====================================================

    return (
        <section className="profile-section">

            <div className="profile-container">

                {/* =========================================
                    PAGE HEADING
                ========================================= */}

                <h2 className="profile-heading">
                    My Profile
                </h2>


                <div className="profile-box">


                    {/* =====================================
                        PROFILE HEADER
                    ===================================== */}

                    <div className="profile-header">

                        <div className="profile-icon">
                            👤
                        </div>

                        <h3>
                            {user.name}
                        </h3>

                        <p>
                            {user.email}
                        </p>

                    </div>


                    {/* =====================================
                        SUCCESS MESSAGE
                    ===================================== */}

                    {message && (

                        <div className="profile-success">
                            {message}
                        </div>

                    )}


                    {/* =====================================
                        ERROR MESSAGE
                    ===================================== */}

                    {error && (

                        <div className="profile-error">
                            {error}
                        </div>

                    )}


                    {/* =====================================
                        PROFILE FORM
                    ===================================== */}

                    <form onSubmit={handleUpdateProfile}>


                        {/* =================================
                            NAME
                        ================================= */}

                        <div className="profile-form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* =================================
                            EMAIL
                        ================================= */}

                        <div className="profile-form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* =================================
                            PASSWORD SECTION
                        ================================= */}

                        <h3 className="profile-password-title">
                            Change Password
                        </h3>

                        <p className="profile-password-info">
                            Leave the password fields empty
                            if you don't want to change
                            your password.
                        </p>


                        {/* CURRENT PASSWORD */}

                        <div className="profile-form-group">

                            <label>
                                Current Password
                            </label>

                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter current password"
                            />

                        </div>


                        {/* NEW PASSWORD */}

                        <div className="profile-form-group">

                            <label>
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter new password"
                            />

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="profile-form-group">

                            <label>
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                            />

                        </div>


                        {/* =================================
                            UPDATE BUTTON
                        ================================= */}

                        <button
                            type="submit"
                            className="profile-update-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Updating..."
                                : "Update Profile"}
                        </button>

                    </form>


                    {/* =====================================
                        LOGOUT BUTTON
                    ===================================== */}

                    <button
                        type="button"
                        onClick={logoutUser}
                        className="profile-logout-btn"
                    >
                        Logout
                    </button>


                </div>

            </div>

        </section>
    );
}

export default Profile;
