import "./Login.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5014/api/Auth/user-login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            console.log("LOGIN RESPONSE:", data);
            console.log("USER ROLE:", data.user?.role);

            if (!response.ok) {
                setError(
                    data.message ||
                    "Invalid email or password."
                );
                return;
            }

            // =============================================
            // SAVE LOGGED-IN USER
            // =============================================

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            if (data.token) {

                // Save token for normal user authentication
                localStorage.setItem(
                    "userToken",
                    data.token
                );

                // Save the same token for admin pages
                if (data.user?.role === "Admin") {
                    localStorage.setItem(
                        "adminToken",
                        data.token
                    );
                }
            }

            // =============================================
            // UPDATE NAVBAR / AUTH STATE
            // =============================================

            window.dispatchEvent(
                new Event("userAuthChanged")
            );

            setLoading(false);
            setError("");

            setSuccess(
                "Login successful! Redirecting..."
            );

            // =============================================
            // LOGIN → ADMIN OR NORMAL HOME
            // =============================================

            setTimeout(() => {

                const role = data.user?.role;

                console.log("REDIRECT ROLE:", role);

                if (role === "Admin") {
                    navigate("/admin-dashboard");
                } else {
                    navigate("/");
                }

            }, 1000);

        } catch (err) {
            console.error("Login Error:", err);

            setError(
                "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="signup-section">
                <div className="container">

                    <div className="signup-container">

                        {/* ================= HEADING ================= */}

                        <div className="signup-heading text-center">

                            <span>
                                WELCOME BACK
                            </span>

                            <h2>
                                Login to Karnel Travel
                            </h2>

                            <p>
                                Login to your account and continue
                                exploring beautiful places across Pakistan.
                            </p>

                        </div>


                        {/* ================= LOGIN BOX ================= */}

                        <div className="signup-box">

                            <form onSubmit={handleLogin}>

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


                                {/* ================= LOGIN BUTTON ================= */}

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

                                            Logging In...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-box-arrow-in-right"></i>

                                            {" "}

                                            Login
                                        </>
                                    )}

                                </button>


                                {/* ================= SIGNUP LINK ================= */}

                                <div className="signup-login">

                                    <p>

                                        Don't have an account?{" "}

                                        <Link to="/signup">
                                            Create Account
                                        </Link>

                                    </p>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>
            </section>


            {/* ================= COPYRIGHT ================= */}

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

export default Login;

