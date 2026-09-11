import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageTrips() {

    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =====================================================
    // FETCH TRIPS
    // =====================================================

    const fetchTrips = async () => {

        setLoading(true);
        setError("");

        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Admin login required.");
            setLoading(false);
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5014/api/Trips",
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
                    "Unable to load itineraries."
                );

                return;
            }

            setTrips(data);

        } catch (err) {

            console.error(
                "Fetch Trips Error:",
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
    // LOAD TRIPS
    // =====================================================

    useEffect(() => {

        fetchTrips();

    }, []);


    // =====================================================
    // GET TRIP ID
    // =====================================================

    const getTripId = (trip) => {

        return trip.id ?? trip.Id;

    };


    // =====================================================
    // DELETE TRIP
    // =====================================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this itinerary?"
        );

        if (!confirmed) {
            return;
        }

        const token = localStorage.getItem("adminToken");

        if (!token) {
            setError("Admin login required.");
            return;
        }

        setMessage("");
        setError("");

        try {

            const response = await fetch(
                `http://localhost:5014/api/Trips/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.message ||
                    "Unable to delete itinerary."
                );

                return;
            }

            setMessage(
                "Itinerary deleted successfully."
            );

            setTrips((currentTrips) =>
                currentTrips.filter(
                    (trip) =>
                        getTripId(trip) !== id
                )
            );

        } catch (err) {

            console.error(
                "Delete Trip Error:",
                err
            );

            setError(
                "Unable to connect to the server."
            );
        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");

        navigate("/admin-login");

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (dateString) => {

        if (!dateString) {
            return "N/A";
        }

        return new Date(dateString).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div
            style={{
                maxWidth: "1200px",
                margin: "40px auto",
                padding: "30px"
            }}
        >

            {/* =================================================
                TOP HEADER
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                    flexWrap: "wrap",
                    gap: "15px"
                }}
            >

                {/* TITLE */}

                <div>

                    <h1>
                        Manage Itineraries
                    </h1>

                    <p>
                        Create, edit and manage travel
                        itineraries for users.
                    </p>

                </div>


                {/* =================================================
                    TOP BUTTONS
                ================================================= */}

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}
                >

                    {/* DASHBOARD */}

                    <button
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                        style={{
                            padding: "12px 20px",
                            cursor: "pointer",
                            border: "none",
                            borderRadius: "6px",
                            background: "#075b96",
                            color: "#fff",
                            fontWeight: "600"
                        }}
                    >
                        🏠 Dashboard
                    </button>


                    {/* CREATE */}

                    <button
                        onClick={() =>
                            navigate("/create-trip")
                        }
                        style={{
                            padding: "12px 20px",
                            cursor: "pointer",
                            border: "none",
                            borderRadius: "6px",
                            background: "#198754",
                            color: "#fff",
                            fontWeight: "600"
                        }}
                    >
                        + Create Itinerary
                    </button>


                    {/* LOGOUT */}

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "12px 20px",
                            cursor: "pointer",
                            border: "none",
                            borderRadius: "6px",
                            background: "#dc3545",
                            color: "#fff",
                            fontWeight: "600"
                        }}
                    >
                        🚪 Logout
                    </button>

                </div>

            </div>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {message && (

                <div
                    style={{
                        padding: "15px",
                        marginBottom: "20px",
                        background: "#e6f7e6",
                        color: "#176b17",
                        borderRadius: "8px"
                    }}
                >
                    {message}
                </div>

            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (

                <div
                    style={{
                        padding: "15px",
                        marginBottom: "20px",
                        background: "#ffe5e5",
                        color: "#b00000",
                        borderRadius: "8px"
                    }}
                >
                    {error}
                </div>

            )}


            {/* =================================================
                TABLE
            ================================================= */}

            {loading ? (

                <p>
                    Loading itineraries...
                </p>

            ) : trips.length === 0 ? (

                <div
                    style={{
                        padding: "30px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                    }}
                >

                    <h3>
                        No itineraries found.
                    </h3>

                    <p>
                        Create your first travel itinerary.
                    </p>

                </div>

            ) : (

                <div
                    style={{
                        overflowX: "auto"
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            background: "#fff"
                        }}
                    >

                        <thead>

                            <tr>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #ddd",
                                        textAlign: "left"
                                    }}
                                >
                                    #
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #ddd",
                                        textAlign: "left"
                                    }}
                                >
                                    Itinerary
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #ddd",
                                        textAlign: "left"
                                    }}
                                >
                                    Destination
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #ddd",
                                        textAlign: "left"
                                    }}
                                >
                                    Start Date
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #ddd",
                                        textAlign: "left"
                                    }}
                                >
                                    End Date
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #ddd",
                                        textAlign: "left"
                                    }}
                                >
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {trips.map((trip, index) => {

                                const tripId =
                                    getTripId(trip);

                                return (

                                    <tr key={tripId}>

                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #eee"
                                            }}
                                        >
                                            {index + 1}
                                        </td>


                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #eee",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {trip.name}
                                        </td>


                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #eee"
                                            }}
                                        >
                                            {trip.destination ||
                                                "N/A"}
                                        </td>


                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #eee"
                                            }}
                                        >
                                            {formatDate(
                                                trip.startDate
                                            )}
                                        </td>


                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #eee"
                                            }}
                                        >
                                            {formatDate(
                                                trip.endDate
                                            )}
                                        </td>


                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #eee"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px"
                                                }}
                                            >

                                                {/* EDIT */}

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/edit-trip/${tripId}`
                                                        )
                                                    }
                                                    style={{
                                                        padding: "8px 12px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Edit
                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            tripId
                                                        )
                                                    }
                                                    style={{
                                                        padding: "8px 12px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );
}

export default ManageTrips;
