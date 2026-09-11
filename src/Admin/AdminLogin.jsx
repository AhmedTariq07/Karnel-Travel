import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        if (!username || !password) {
            setError("Please enter username and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5014/api/Auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Invalid username or password."
                );
                return;
            }

            // Save admin login information
            localStorage.setItem(
                "adminToken",
                data.token
            );

            localStorage.setItem(
                "adminUsername",
                data.username
            );

            // Go to admin dashboard
            navigate("/admin-dashboard");

        } catch (err) {

            console.error("Admin Login Error:", err);

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <section className="admin-login-section">

            <div className="admin-login-container">

                <div className="admin-login-box">

                    <div className="admin-login-icon">
                        <i className="bi bi-shield-lock"></i>
                    </div>

                    <h2>
                        Admin Login
                    </h2>

                    <p>
                        Login to manage Karnel Travel
                    </p>


                    {error && (
                        <div className="admin-login-error">
                            {error}
                        </div>
                    )}


                    <form onSubmit={handleLogin}>

                        <div className="admin-form-group">

                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                placeholder="Enter username"
                                required
                            />

                        </div>


                        <div className="admin-form-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter password"
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="admin-login-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                </div>

            </div>

        </section>
    );
}

export default AdminLogin;