import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../api";

function Signup() {

    // =====================================================
    // NAVIGATION
    // =====================================================

    const navigate = useNavigate();


    // =====================================================
    // FORM STATE
    // =====================================================

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    // =====================================================
    // UI STATE
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // SIGNUP
    // =====================================================

    const handleSignup = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // -------------------------------------------------
        // CHECK PASSWORDS
        // -------------------------------------------------

        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;
        }


        // -------------------------------------------------
        // CHECK PASSWORD LENGTH
        // -------------------------------------------------

        if (password.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        try {

            setLoading(true);


            // -------------------------------------------------
            // SEND DATA TO BACKEND
            // -------------------------------------------------

            const response = await fetch(
                `${API_URL}/api/Auth/signup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
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
                    "Signup failed. Please try again."
                );

                return;
            }


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            setSuccess(
                "Signup successful! Redirecting to login..."
            );


            // -------------------------------------------------
            // CLEAR FORM
            // -------------------------------------------------

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");


            // -------------------------------------------------
            // REDIRECT TO LOGIN
            // -------------------------------------------------

            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (err) {

            console.error("Signup Error:", err);

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (
        <>

            {/* =================================================
                 SIGNUP SECTION
                 ================================================= */}

            <section className="signup-section">

                <div className="container">

                    <div className="signup-container">

                        {/* =====================================
                             HEADING
                             ===================================== */}

                        <div className="signup-heading text-center">

                            <span>
                                CREATE ACCOUNT
                            </span>

                            <h2>
                                Join Karnel Travel
                            </h2>

                            <p>
                                Create your account and start
                                exploring beautiful places across Pakistan.
                            </p>

                        </div>


                        {/* =====================================
                             SIGNUP FORM
                             ===================================== */}

                        <div className="signup-box">

                            <form onSubmit={handleSignup}>


                                {/* ================= NAME ================= */}

                                <div className="form-group">

                                    <label htmlFor="name">
                                        <i className="bi bi-person-fill"></i>
                                        Name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />

                                </div>


                                {/* ================= EMAIL ================= */}

                                <div className="form-group">

                                    <label htmlFor="email">
                                        <i className="bi bi-envelope-fill"></i>
                                        Email
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />

                                </div>


                                {/* ================= PASSWORD ================= */}

                                <div className="form-group">

                                    <label htmlFor="password">
                                        <i className="bi bi-lock-fill"></i>
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />

                                </div>


                                {/* ================= CONFIRM PASSWORD ================= */}

                                <div className="form-group">

                                    <label htmlFor="confirmPassword">
                                        <i className="bi bi-shield-lock-fill"></i>
                                        Confirm Password
                                    </label>

                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                    />

                                </div>


                                {/* ================= ERROR ================= */}

                                {error && (

                                    <div className="alert alert-danger">

                                        <i className="bi bi-exclamation-circle-fill"></i>

                                        {" "}

                                        {error}

                                    </div>

                                )}


                                {/* ================= SUCCESS ================= */}

                                {success && (

                                    <div className="alert alert-success">

                                        <i className="bi bi-check-circle-fill"></i>

                                        {" "}

                                        {success}

                                    </div>

                                )}


                                {/* ================= SUBMIT ================= */}

                                <button
                                    type="submit"
                                    className="signup-btn"
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                            ></span>

                                            {" "}

                                            Creating Account...
                                        </>

                                    ) : (

                                        <>
                                            <i className="bi bi-person-plus-fill"></i>

                                            {" "}

                                            Create Account
                                        </>

                                    )}

                                </button>


                                {/* ================= LOGIN ================= */}

                                <div className="signup-login">

                                    <p>
                                        Already have an account?{" "}

                                        <Link to="/login">
                                            Login
                                        </Link>
                                    </p>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                 COPYRIGHT
                 ================================================= */}

            <div className="copyright">

                <div className="container text-center">

                    <p>
                        © 2026 Karnel Travel Guide.
                        All Rights Reserved.
                    </p>

                </div>

            </div>

        </>
    );
}

export default Signup;
