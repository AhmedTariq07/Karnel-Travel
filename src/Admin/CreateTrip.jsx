import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function CreateTrip() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!name.trim()) {
            setError("Please enter itinerary name.");
            return;
        }

        if (!destination.trim()) {
            setError("Please enter destination.");
            return;
        }

        if (!startDate || !endDate) {
            setError("Please select both start and end dates.");
            return;
        }

        if (endDate < startDate) {
            setError("End date cannot be before start date.");
            return;
        }

        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Admin login required.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/Trips`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: name.trim(),
                        destination: destination.trim(),
                        startDate: startDate,
                        endDate: endDate
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to create itinerary."
                );
                return;
            }

            setMessage(
                "Itinerary created successfully."
            );

            setName("");
            setDestination("");
            setStartDate("");
            setEndDate("");

            setTimeout(() => {
                navigate("/admin-dashboard");
            }, 1000);

        } catch (err) {
            console.error(
                "Create Trip Error:",
                err
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "50px auto",
                padding: "30px"
            }}
        >

            <h1>
                Create Travel Itinerary
            </h1>

            <p>
                Create a new itinerary for users to explore.
            </p>

            {message && (
                <div
                    style={{
                        padding: "15px",
                        marginTop: "20px",
                        marginBottom: "20px",
                        background: "#e6f7e6",
                        color: "#176b17",
                        borderRadius: "8px"
                    }}
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: "15px",
                        marginTop: "20px",
                        marginBottom: "20px",
                        background: "#ffe5e5",
                        color: "#b00000",
                        borderRadius: "8px"
                    }}
                >
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: "20px" }}>

                    <label>
                        <strong>
                            Itinerary Name
                        </strong>
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        placeholder="Example: 5 Days in Hunza"
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "8px",
                            boxSizing: "border-box"
                        }}
                    />

                </div>


                <div style={{ marginBottom: "20px" }}>

                    <label>
                        <strong>
                            Destination
                        </strong>
                    </label>

                    <input
                        type="text"
                        value={destination}
                        onChange={(e) =>
                            setDestination(e.target.value)
                        }
                        placeholder="Example: Hunza Valley"
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "8px",
                            boxSizing: "border-box"
                        }}
                    />

                </div>


                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginBottom: "25px"
                    }}
                >

                    <div>

                        <label>
                            <strong>
                                Start Date
                            </strong>
                        </label>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>


                    <div>

                        <label>
                            <strong>
                                End Date
                            </strong>
                        </label>

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "8px",
                                boxSizing: "border-box"
                            }}
                        />

                    </div>

                </div>


                <div
                    style={{
                        display: "flex",
                        gap: "15px"
                    }}
                >

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Itinerary"
                        }
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}

export default CreateTrip;
