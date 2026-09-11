import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";

function MyTrips() {

    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // LOAD ADMIN-CREATED ITINERARIES
    // =====================================================

    const loadTrips = async () => {

        const token = localStorage.getItem("userToken");

        if (!token) {
            setError("Please login to view itineraries.");
            setLoading(false);
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/api/Trips`,
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                if (response.status === 401) {

                    localStorage.removeItem("userToken");
                    localStorage.removeItem("user");

                    setError(
                        "Your session has expired. Please login again."
                    );

                    return;
                }

                setError(
                    data.message ||
                    "Unable to load itineraries."
                );

                return;
            }

            setTrips(data);

        } catch (err) {

            console.error(
                "Load Itineraries Error:",
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
    // LOAD WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {
        loadTrips();
    }, []);


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric"
            }
        );
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div
            style={{
                padding: "40px",
                maxWidth: "1100px",
                margin: "0 auto"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                style={{
                    marginBottom: "30px"
                }}
            >

                <h1>
                    Travel Itineraries 🧳
                </h1>

                <p>
                    Explore travel itineraries prepared
                    by our travel team.
                </p>

            </div>


            {/* =================================================
                ERROR
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
                LOADING
            ================================================= */}

            {loading && (

                <p>
                    Loading itineraries...
                </p>

            )}


            {/* =================================================
                NO ITINERARIES
            ================================================= */}

            {!loading &&
                !error &&
                trips.length === 0 && (

                    <div
                        style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            border: "1px solid #ddd",
                            borderRadius: "12px",
                            background: "#fff"
                        }}
                    >

                        <h2>
                            No itineraries available
                        </h2>

                        <p>
                            Travel itineraries will appear here
                            when they are published by the admin.
                        </p>

                    </div>

                )
            }


            {/* =================================================
                ITINERARIES
            ================================================= */}

            {!loading &&
                trips.length > 0 && (

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "25px"
                        }}
                    >

                        {trips.map((trip) => {

                            const tripId =
                                trip.id ?? trip.Id;

                            return (

                                <div
                                    key={tripId}
                                    style={{
                                        border: "1px solid #ddd",
                                        borderRadius: "12px",
                                        padding: "25px",
                                        background: "#fff",
                                        boxShadow:
                                            "0 3px 10px rgba(0,0,0,0.08)"
                                    }}
                                >

                                    {/* ITINERARY NAME */}

                                    <h2>
                                        {trip.name}
                                    </h2>


                                    {/* DESTINATION */}

                                    <p>
                                        📍{" "}
                                        {trip.destination ||
                                            "Destination not specified"}
                                    </p>


                                    {/* DATES */}

                                    <p>
                                        📅{" "}
                                        {formatDate(
                                            trip.startDate
                                        )}

                                        {" → "}

                                        {formatDate(
                                            trip.endDate
                                        )}
                                    </p>


                                    {/* VIEW BUTTON */}

                                    <div
                                        style={{
                                            marginTop: "20px"
                                        }}
                                    >

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/view-trip/${tripId}`
                                                )
                                            }
                                            style={{
                                                padding:
                                                    "10px 18px",
                                                cursor:
                                                    "pointer"
                                            }}
                                        >
                                            View Itinerary
                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )
            }

        </div>

    );
}

export default MyTrips;
