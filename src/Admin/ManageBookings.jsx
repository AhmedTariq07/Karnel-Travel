import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Pages/ManageTouristSpots.css";
import API_URL from "../api";

function ManageBookings() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    const [selectedBooking, setSelectedBooking] = useState(null);


    // =====================================================
    // LOAD BOOKINGS
    // =====================================================

    const loadBookings = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/Bookings`
            );

            if (!response.ok) {
                throw new Error("Failed to load bookings");
            }

            const data = await response.json();

            setBookings(data);

        }
        catch (error) {

            console.error(error);

            setMessage(
                "Unable to load bookings."
            );

        }
        finally {

            setLoading(false);

        }
    };


    // =====================================================
    // CHECK LOGIN + LOAD DATA
    // =====================================================

    useEffect(() => {

        const token = localStorage.getItem("adminToken");

        if (!token) {

            navigate("/admin-login");

            return;
        }

        loadBookings();

    }, [navigate]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem("adminToken");

        localStorage.removeItem("adminUsername");

        navigate("/admin-login");
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();
    };


    // =====================================================
    // FORMAT TYPE
    // =====================================================

    const formatType = (type) => {

        if (!type) {
            return "General";
        }

        return (
            type.charAt(0).toUpperCase() +
            type.slice(1)
        );
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
                        Manage Bookings
                    </h1>

                    <p>
                        View customer booking and contact requests
                    </p>

                </div>


                <div className="manage-header-buttons">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/admin-dashboard")
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
                        Bookings
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
                        Loading bookings...
                    </p>

                ) : bookings.length === 0 ? (

                    /* =================================================
                       EMPTY STATE
                    ================================================= */

                    <div className="empty-state">

                        <h3>
                            No Bookings Found
                        </h3>

                        <p>
                            There are currently no customer booking requests.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       BOOKINGS TABLE
                    ================================================= */

                    <div className="tourist-table-wrapper">

                        <table className="tourist-table">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Place
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Subject
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {bookings.map((booking) => (

                                    <tr key={booking.id}>


                                        {/* ID */}

                                        <td>
                                            {booking.id}
                                        </td>


                                        {/* CUSTOMER */}

                                        <td>
                                            {booking.fullName}
                                        </td>


                                        {/* EMAIL */}

                                        <td>
                                            {booking.email}
                                        </td>


                                        {/* PHONE */}

                                        <td>
                                            {booking.phone}
                                        </td>


                                        {/* PLACE */}

                                        <td>
                                            {booking.itemName || "-"}
                                        </td>


                                        {/* TYPE */}

                                        <td>
                                            {formatType(booking.type)}
                                        </td>


                                        {/* SUBJECT */}

                                        <td className="description-cell">

                                            {booking.subject || "-"}

                                        </td>


                                        {/* DATE */}

                                        <td>

                                            {formatDate(
                                                booking.createdAt
                                            )}

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        setSelectedBooking(
                                                            booking
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =================================================
                BOOKING DETAILS
            ================================================= */}

            {selectedBooking && (

                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                        padding: "20px"
                    }}
                    onClick={() =>
                        setSelectedBooking(null)
                    }
                >

                    <div
                        style={{
                            background: "#ffffff",
                            width: "100%",
                            maxWidth: "600px",
                            maxHeight: "90vh",
                            overflowY: "auto",
                            borderRadius: "10px",
                            padding: "30px",
                            boxShadow: "0 5px 25px rgba(0,0,0,0.2)"
                        }}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* =================================================
                            MODAL HEADER
                        ================================================= */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "25px"
                            }}
                        >

                            <h2
                                style={{
                                    margin: 0,
                                    color: "#075b96"
                                }}
                            >
                                Booking Details
                            </h2>


                            <button
                                className="delete-button"
                                onClick={() =>
                                    setSelectedBooking(null)
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* =================================================
                            DETAILS
                        ================================================= */}

                        <p>
                            <strong>
                                Booking ID:
                            </strong>{" "}
                            {selectedBooking.id}
                        </p>


                        <p>
                            <strong>
                                Customer:
                            </strong>{" "}
                            {selectedBooking.fullName}
                        </p>


                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {selectedBooking.email}
                        </p>


                        <p>
                            <strong>
                                Phone:
                            </strong>{" "}
                            {selectedBooking.phone}
                        </p>


                        <p>
                            <strong>
                                Place:
                            </strong>{" "}
                            {selectedBooking.itemName || "-"}
                        </p>


                        <p>
                            <strong>
                                Type:
                            </strong>{" "}
                            {formatType(selectedBooking.type)}
                        </p>


                        <p>
                            <strong>
                                Subject:
                            </strong>{" "}
                            {selectedBooking.subject}
                        </p>


                        <div>

                            <strong>
                                Message:
                            </strong>

                            <div
                                style={{
                                    background: "#f4f7fb",
                                    padding: "15px",
                                    marginTop: "8px",
                                    marginBottom: "15px",
                                    borderRadius: "6px",
                                    lineHeight: "1.6"
                                }}
                            >
                                {selectedBooking.message}
                            </div>

                        </div>


                        <p>

                            <strong>
                                Submitted:
                            </strong>{" "}

                            {formatDate(
                                selectedBooking.createdAt
                            )}

                        </p>


                        {/* =================================================
                            CLOSE
                        ================================================= */}

                        <button
                            className="back-button"
                            onClick={() =>
                                setSelectedBooking(null)
                            }
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default ManageBookings;
