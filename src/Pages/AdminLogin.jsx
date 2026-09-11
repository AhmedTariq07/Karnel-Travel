import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            // =============================================
            // CLEAR OLD ADMIN SESSION
            // =============================================

            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUsername");


            // =============================================
            // ADMIN LOGIN
            // =============================================

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


            // =============================================
            // LOGIN FAILED
            // =============================================

            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Invalid username or password"
                );

                setLoading(false);

                return;
            }


            // =============================================
            // SAVE ADMIN SESSION
            // =============================================

            localStorage.setItem(
                "adminToken",
                data.token
            );

            localStorage.setItem(
                "adminUsername",
                data.username
            );


            // =============================================
            // ADMIN → DASHBOARD
            // =============================================

            navigate("/admin-dashboard");

        }
        catch (error) {

            console.error(
                "Admin Login Error:",
                error
            );

            setMessage(
                "Unable to connect to the server."
            );
        }

        setLoading(false);
    };


    return (
        <div className="admin-login-page">

            <div className="admin-login-box">

                <h1>
                    Admin Login
                </h1>

                <p>
                    Login to manage Karnel Travel
                </p>


                <form onSubmit={handleLogin}>

                    {/* ================= USERNAME ================= */}

                    <div className="form-group">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* ================= PASSWORD ================= */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>


                    {/* ================= MESSAGE ================= */}

                    {message && (
                        <div className="login-message">
                            {message}
                        </div>
                    )}


                    {/* ================= LOGIN BUTTON ================= */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminLogin;