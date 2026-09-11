import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../api";

function EditTrip() {
    const navigate = useNavigate();
    const params = useParams();

    // Get the ID safely
    const tripId = params.id;

    const [name, setName] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =====================================================
    // LOAD ITINERARY
    // =====================================================

    useEffect(() => {
        const fetchTrip = async () => {

            if (!tripId) {
                setError(
                    "Itinerary ID is missing. Please return to Manage Itineraries and try again."
                );
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("adminToken");

            if (!token) {
                setError("Admin login required.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/api/Trips/${tripId}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message ||
                        "Unable to load itinerary."
                    );
                    return;
                }

                setName(data.name || "");
                setDestination(data.destination || "");

                setStartDate(
                    data.startDate
                        ? data.startDate.substring(0, 10)
                        : ""
                );

                setEndDate(
                    data.endDate
                        ? data.endDate.substring(0, 10)
                        : ""
                );

            } catch (err) {
                console.error(
                    "Fetch Trip Error:",
                    err
                );

                setError(
                    "Unable to connect to the server."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();

    }, [tripId]);

    // =====================================================
    // UPDATE ITINERARY
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!tripId) {
            setError(
                "Itinerary ID is missing."
            );
            return;
        }

        if (!name.trim()) {
            setError(
                "Please enter itinerary name."
            );
            return;
        }

        if (!destination.trim()) {
            setError(
                "Please enter destination."
            );
            return;
        }

        if (!startDate || !endDate) {
            setError(
                "Please select both start and end dates."
            );
            return;
        }

        if (endDate < startDate) {
            setError(
                "End date cannot be before start date."
            );
            return;
        }

        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Admin login required.");
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(
                `${API_URL}/api/Trips/${tripId}`,
                {
                    method: "PUT",

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
                console.error(
                    "Update Trip Response:",
                    data
                );

                setError(
                    data.message ||
                    "Unable to update itinerary."
                );

                return;
            }

            setMessage(
                "Itinerary updated successfully."
            );

            setTimeout(() => {
                navigate("/manage-trips");
            }, 1000);

        } catch (err) {
            console.error(
                "Update Trip Error:",
                err
            );

            setError(
                "Unable to connect to the server."
            );

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div
                style={{
                    maxWidth: "800px",
                    margin: "50px auto",
                    padding: "30px"
                }}
            >
                <h2>
                    Loading itinerary...
                </h2>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "50px auto",
                padding: "30px"
            }}
        >
            <h1>
                Edit Travel Itinerary
            </h1>

            <p>
                Update the details of this travel itinerary.
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

                {/* ================= ITINERARY NAME ================= */}

                <div
                    style={{
                        marginBottom: "20px"
                    }}
                >
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
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "8px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                {/* ================= DESTINATION ================= */}

                <div
                    style={{
                        marginBottom: "20px"
                    }}
                >
                    <label>
                        <strong>
                            Destination
                        </strong>
                    </label>

                    <input
                        type="text"
                        value={destination}
                        onChange={(e) =>
                            setDestination(
                                e.target.value
                            )
                        }
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "8px",
                            boxSizing: "border-box"
                        }}
                    />
                </div>

                {/* ================= DATES ================= */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "1fr 1fr",
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
                                setStartDate(
                                    e.target.value
                                )
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
                                setEndDate(
                                    e.target.value
                                )
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

                {/* ================= BUTTONS ================= */}

                <div
                    style={{
                        display: "flex",
                        gap: "15px"
                    }}
                >

                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: "12px 20px",
                            cursor: saving
                                ? "not-allowed"
                                : "pointer"
                        }}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/manage-trips")
                        }
                        style={{
                            padding: "12px 20px",
                            cursor: "pointer"
                        }}
                    >
                        Cancel
                    </button>

                </div>

            </form>
        </div>
    );
}

export default EditTrip;
