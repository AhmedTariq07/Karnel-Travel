import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import "../Pages/ManageTouristSpots.css";

function Cashbook() {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");


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
                throw new Error(
                    "Failed to load cashbook"
                );
            }

            const data = await response.json();

            setBookings(data);

        }
        catch (error) {

            console.error(
                "Cashbook Error:",
                error
            );

            setMessage(
                "Unable to load cashbook."
            );

        }
        finally {

            setLoading(false);

        }
    };


    // =====================================================
    // CHECK ADMIN LOGIN
    // =====================================================

    useEffect(() => {

        const token =
            localStorage.getItem("adminToken");

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

        localStorage.removeItem(
            "adminToken"
        );

        localStorage.removeItem(
            "adminUsername"
        );

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
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (amount) => {

        const value =
            Number(amount) || 0;

        return `Rs. ${value.toLocaleString(
            "en-PK",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )}`;
    };


    // =====================================================
    // PAYMENT STATUS
    // =====================================================

    const formatStatus = (status) => {

        if (!status) {
            return "Pending";
        }

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );
    };


    // =====================================================
    // TOTALS
    // =====================================================

    const totalAmount =
        bookings.reduce(
            (total, booking) =>
                total +
                (Number(booking.amount) || 0),
            0
        );


    const totalPaid =
        bookings.reduce(
            (total, booking) =>
                total +
                (Number(booking.paidAmount) || 0),
            0
        );


    const totalRemaining =
        bookings.reduce(
            (total, booking) =>
                total +
                (
                    Number(
                        booking.remainingAmount
                    ) || 0
                ),
            0
        );


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
                        Cashbook
                    </h1>

                    <p>
                        Manage customer bookings and payment records
                    </p>

                </div>


                <div className="manage-header-buttons">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(
                                "/admin-dashboard"
                            )
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
                        Payment Cashbook
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
                    SUMMARY
                ================================================= */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, 1fr)",
                        gap: "20px",
                        marginBottom: "30px"
                    }}
                >

                    {/* TOTAL BOOKING */}

                    <div
                        style={{
                            padding: "22px",
                            borderRadius: "10px",
                            background: "#eaf4ff",
                            border: "1px solid #c9e3fa"
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                color: "#555",
                                fontWeight: "600"
                            }}
                        >
                            Total Booking Amount
                        </p>

                        <h2
                            style={{
                                margin: "8px 0 0",
                                color: "#075b96"
                            }}
                        >
                            {formatMoney(
                                totalAmount
                            )}
                        </h2>

                    </div>


                    {/* TOTAL PAID */}

                    <div
                        style={{
                            padding: "22px",
                            borderRadius: "10px",
                            background: "#eaf8ee",
                            border: "1px solid #c8e6d0"
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                color: "#555",
                                fontWeight: "600"
                            }}
                        >
                            Total Paid
                        </p>

                        <h2
                            style={{
                                margin: "8px 0 0",
                                color: "#198754"
                            }}
                        >
                            {formatMoney(
                                totalPaid
                            )}
                        </h2>

                    </div>


                    {/* REMAINING */}

                    <div
                        style={{
                            padding: "22px",
                            borderRadius: "10px",
                            background: "#fff5e8",
                            border: "1px solid #f3d7aa"
                        }}
                    >

                        <p
                            style={{
                                margin: 0,
                                color: "#555",
                                fontWeight: "600"
                            }}
                        >
                            Total Remaining
                        </p>

                        <h2
                            style={{
                                margin: "8px 0 0",
                                color: "#d97706"
                            }}
                        >
                            {formatMoney(
                                totalRemaining
                            )}
                        </h2>

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <p className="loading">
                        Loading cashbook...
                    </p>

                ) : bookings.length === 0 ? (

                    /* =================================================
                       EMPTY STATE
                    ================================================= */

                    <div className="empty-state">

                        <h3>
                            No Cashbook Records
                        </h3>

                        <p>
                            Customer booking and payment
                            records will appear here.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       CASHBOOK TABLE
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
                                        Booking
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                    <th>
                                        Paid
                                    </th>

                                    <th>
                                        Remaining
                                    </th>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {bookings.map(
                                    (booking) => (

                                    <tr
                                        key={
                                            booking.id
                                        }
                                    >

                                        {/* ID */}

                                        <td>
                                            {booking.id}
                                        </td>


                                        {/* CUSTOMER */}

                                        <td>
                                            <strong>
                                                {
                                                    booking.fullName
                                                }
                                            </strong>

                                            <br />

                                            <small>
                                                {
                                                    booking.phone
                                                }
                                            </small>
                                        </td>


                                        {/* BOOKING */}

                                        <td>
                                            {
                                                booking.itemName ||
                                                "-"
                                            }
                                        </td>


                                        {/* TYPE */}

                                        <td>
                                            {
                                                booking.type ||
                                                "General"
                                            }
                                        </td>


                                        {/* TOTAL */}

                                        <td>
                                            {formatMoney(
                                                booking.amount
                                            )}
                                        </td>


                                        {/* PAID */}

                                        <td>
                                            {formatMoney(
                                                booking.paidAmount
                                            )}
                                        </td>


                                        {/* REMAINING */}

                                        <td>
                                            {formatMoney(
                                                booking.remainingAmount
                                            )}
                                        </td>


                                        {/* PAYMENT METHOD */}

                                        <td>
                                            {
                                                booking.paymentMethod ||
                                                "Not selected"
                                            }
                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                style={{
                                                    display:
                                                        "inline-block",
                                                    padding:
                                                        "5px 10px",
                                                    borderRadius:
                                                        "20px",
                                                    fontSize:
                                                        "13px",
                                                    fontWeight:
                                                        "600",
                                                    background:
                                                        booking.paymentStatus ===
                                                        "Paid"
                                                            ? "#d1e7dd"
                                                            : booking.paymentStatus ===
                                                              "Partially Paid"
                                                                ? "#fff3cd"
                                                                : "#f8d7da",
                                                    color:
                                                        booking.paymentStatus ===
                                                        "Paid"
                                                            ? "#0f5132"
                                                            : booking.paymentStatus ===
                                                              "Partially Paid"
                                                                ? "#664d03"
                                                                : "#842029"
                                                }}
                                            >
                                                {formatStatus(
                                                    booking.paymentStatus
                                                )}
                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td>
                                            {formatDate(
                                                booking.createdAt
                                            )}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Cashbook;
