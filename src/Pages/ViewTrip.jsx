import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ViewTrip() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showBookingForm, setShowBookingForm] = useState(false);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [travelers, setTravelers] = useState("1");
    const [amount, setAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [message, setMessage] = useState("");

    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState("");
    const [bookingError, setBookingError] = useState("");

    // =====================================================
    // LOAD ITINERARY
    // =====================================================

    useEffect(() => {

        const loadTrip = async () => {

            if (!id) {
                setError("Itinerary ID is missing.");
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("userToken");

            if (!token) {
                setError("Please login to view this itinerary.");
                setLoading(false);
                return;
            }

            try {

                const response = await fetch(
                    `http://localhost:5014/api/Trips/${id}`,
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
                        "Unable to load itinerary."
                    );

                    return;
                }

                setTrip(data);

            } catch (err) {

                console.error(
                    "Load Trip Error:",
                    err
                );

                setError(
                    "Unable to connect to the server."
                );

            } finally {

                setLoading(false);

            }
        };

        loadTrip();

    }, [id]);


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
                month: "long",
                day: "numeric"
            }
        );
    };


    // =====================================================
    // BOOK ITINERARY
    // =====================================================

    const handleBooking = async (e) => {

        e.preventDefault();

        setBookingSuccess("");
        setBookingError("");

        if (!fullName.trim()) {
            setBookingError("Please enter your full name.");
            return;
        }

        if (!email.trim()) {
            setBookingError("Please enter your email.");
            return;
        }

        if (!phone.trim()) {
            setBookingError("Please enter your phone number.");
            return;
        }

        const phoneRegex = /^(03\d{9}|\+923\d{9})$/;

        if (!phoneRegex.test(phone.trim())) {
            setBookingError(
                "Please enter a valid Pakistani mobile number."
            );
            return;
        }

        if (!travelers || Number(travelers) < 1) {
            setBookingError(
                "Number of travelers must be at least 1."
            );
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setBookingError(
                "Please enter a valid booking amount."
            );
            return;
        }

        if (!paymentMethod) {
            setBookingError(
                "Please select a payment method."
            );
            return;
        }

        const token = localStorage.getItem("userToken");

        if (!token) {
            setBookingError(
                "Please login before booking an itinerary."
            );
            return;
        }

        setBookingLoading(true);

        try {

            const bookingMessage =
                message.trim()
                    ? `${message.trim()}\n\nNumber of Travelers: ${travelers}`
                    : `Number of Travelers: ${travelers}`;

            const bookingAmount = Number(amount);

            const response = await fetch(
                "http://localhost:5014/api/Bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        fullName:
                            fullName.trim(),

                        email:
                            email.trim(),

                        phone:
                            phone.trim(),

                        subject:
                            "Itinerary Booking",

                        message:
                            bookingMessage,

                        type:
                            "Itinerary",

                        itemId:
                            trip.id ?? trip.Id,

                        itemName:
                            trip.name ?? trip.Name,

                        amount:
                            bookingAmount,

                        paidAmount:
                            paymentMethod === "Card"
                                ? bookingAmount
                                : 0,

                        remainingAmount:
                            paymentMethod === "Card"
                                ? 0
                                : bookingAmount,

                        paymentMethod:
                            paymentMethod,

                        paymentStatus:
                            paymentMethod === "Card"
                                ? "Paid"
                                : "Pending"
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setBookingError(
                    data.message ||
                    "Unable to submit booking."
                );

                return;
            }

            setBookingSuccess(
                "Your itinerary booking request has been submitted successfully."
            );

            setFullName("");
            setEmail("");
            setPhone("");
            setTravelers("1");
            setAmount("");
            setPaymentMethod("");
            setMessage("");

        } catch (err) {

            console.error(
                "Itinerary Booking Error:",
                err
            );

            setBookingError(
                "Unable to connect to the server."
            );

        } finally {

            setBookingLoading(false);

        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div
                style={{
                    maxWidth: "900px",
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
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div
                style={{
                    maxWidth: "900px",
                    margin: "50px auto",
                    padding: "30px"
                }}
            >

                <div
                    style={{
                        padding: "20px",
                        background: "#ffe5e5",
                        color: "#b00000",
                        borderRadius: "10px",
                        marginBottom: "20px"
                    }}
                >
                    {error}
                </div>

                <button
                    onClick={() =>
                        navigate("/my-trips")
                    }
                    style={{
                        padding: "10px 18px",
                        cursor: "pointer"
                    }}
                >
                    ← Back to Itineraries
                </button>

            </div>
        );
    }


    // =====================================================
    // ITINERARY NOT FOUND
    // =====================================================

    if (!trip) {

        return (
            <div
                style={{
                    maxWidth: "900px",
                    margin: "50px auto",
                    padding: "30px"
                }}
            >

                <h2>
                    Itinerary not found.
                </h2>

                <button
                    onClick={() =>
                        navigate("/my-trips")
                    }
                >
                    ← Back to Itineraries
                </button>

            </div>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div
            style={{
                maxWidth: "900px",
                margin: "50px auto",
                padding: "30px"
            }}
        >

            <button
                onClick={() =>
                    navigate("/my-trips")
                }
                style={{
                    padding: "10px 18px",
                    marginBottom: "25px",
                    cursor: "pointer"
                }}
            >
                ← Back to Itineraries
            </button>


            <div
                style={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "15px",
                    padding: "35px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.08)"
                }}
            >

                <h1
                    style={{
                        marginTop: 0,
                        marginBottom: "15px"
                    }}
                >
                    {trip.name}
                </h1>


                <div
                    style={{
                        marginBottom: "20px"
                    }}
                >

                    <h3>
                        📍 Destination
                    </h3>

                    <p>
                        {trip.destination ||
                            "Destination not specified"}
                    </p>

                </div>


                <div
                    style={{
                        marginBottom: "20px"
                    }}
                >

                    <h3>
                        📅 Travel Dates
                    </h3>

                    <p>
                        {formatDate(trip.startDate)}
                        {" → "}
                        {formatDate(trip.endDate)}
                    </p>

                </div>


                <div
                    style={{
                        marginTop: "30px",
                        padding: "20px",
                        background: "#f7f7f7",
                        borderRadius: "10px"
                    }}
                >

                    <h3>
                        About This Itinerary
                    </h3>

                    <p>
                        This travel itinerary has been
                        prepared by our travel team to help
                        you plan your journey.
                    </p>

                </div>


                <div
                    style={{
                        marginTop: "30px",
                        textAlign: "center"
                    }}
                >

                    <button
                        onClick={() => {
                            setShowBookingForm(!showBookingForm);
                            setBookingSuccess("");
                            setBookingError("");
                        }}
                        style={{
                            padding: "13px 25px",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            background: "#075b96",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "600"
                        }}
                    >
                        {showBookingForm
                            ? "Close Booking Form"
                            : "Book This Itinerary"}
                    </button>

                </div>


                {showBookingForm && (

                    <div
                        style={{
                            marginTop: "30px",
                            padding: "25px",
                            background: "#f7f9fc",
                            borderRadius: "12px",
                            border: "1px solid #ddd"
                        }}
                    >

                        <h2>
                            Book This Itinerary
                        </h2>

                        <p>
                            Please provide your details
                            to submit a booking request.
                        </p>


                        {bookingSuccess && (
                            <div
                                style={{
                                    padding: "15px",
                                    marginBottom: "20px",
                                    background: "#e6f7e6",
                                    color: "#176b17",
                                    borderRadius: "8px"
                                }}
                            >
                                {bookingSuccess}
                            </div>
                        )}


                        {bookingError && (
                            <div
                                style={{
                                    padding: "15px",
                                    marginBottom: "20px",
                                    background: "#ffe5e5",
                                    color: "#b00000",
                                    borderRadius: "8px"
                                }}
                            >
                                {bookingError}
                            </div>
                        )}


                        <form onSubmit={handleBooking}>

                            <div
                                style={{
                                    marginBottom: "18px"
                                }}
                            >
                                <label>
                                    <strong>
                                        Full Name
                                    </strong>
                                </label>

                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    placeholder="Enter your full name"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        boxSizing: "border-box",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px"
                                    }}
                                />
                            </div>


                            <div
                                style={{
                                    marginBottom: "18px"
                                }}
                            >
                                <label>
                                    <strong>
                                        Email
                                    </strong>
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        boxSizing: "border-box",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px"
                                    }}
                                />
                            </div>


                            <div
                                style={{
                                    marginBottom: "18px"
                                }}
                            >
                                <label>
                                    <strong>
                                        Phone
                                    </strong>
                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    placeholder="03001234567 or +923001234567"
                                    maxLength="13"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        boxSizing: "border-box",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px"
                                    }}
                                />
                            </div>


                            <div
                                style={{
                                    marginBottom: "18px"
                                }}
                            >
                                <label>
                                    <strong>
                                        Number of Travelers
                                    </strong>
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={travelers}
                                    onChange={(e) =>
                                        setTravelers(e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        boxSizing: "border-box",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px"
                                    }}
                                />
                            </div>


                            <div
                                style={{
                                    marginBottom: "18px"
                                }}
                            >
                                <label>
                                    <strong>
                                        Booking Amount (Rs.)
                                    </strong>
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    placeholder="Enter booking amount"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        boxSizing: "border-box",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px"
                                    }}
                                />
                            </div>


                            <div
                                style={{
                                    marginBottom: "18px"
                                }}
                            >
                                <label>
                                    <strong>
                                        Payment Method
                                    </strong>
                                </label>

                                <select
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        boxSizing: "border-box",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px",
                                        background: "#fff"
                                    }}
                                >

                                    <option value="">
                                        Select Payment Method
                                    </option>

                                    <option value="Cash">
                                        Cash
                                    </option>

                                    <option value="Card">
                                        Card
                                    </option>

                                    <option value="Bank Transfer">
                                        Bank Transfer
                                    </option>

                                </select>

                            </div>


                            <div
                                style={{
                                    marginBottom: "20px"
                                }}
                            >
                                <label>
                                    <strong>
                                        Message
                                    </strong>
                                </label>

                                <textarea
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    placeholder="Any additional information or requests..."
                                    rows="4"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        boxSizing: "border-box",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px",
                                        resize: "vertical"
                                    }}
                                />
                            </div>


                            <button
                                type="submit"
                                disabled={bookingLoading}
                                style={{
                                    padding: "12px 25px",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: bookingLoading
                                        ? "not-allowed"
                                        : "pointer",
                                    background: "#075b96",
                                    color: "#fff",
                                    fontSize: "16px",
                                    fontWeight: "600"
                                }}
                            >
                                {bookingLoading
                                    ? "Submitting..."
                                    : "Submit Booking"}
                            </button>

                        </form>

                    </div>
                )}

            </div>

        </div>
    );
}

export default ViewTrip;