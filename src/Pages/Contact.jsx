import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Contact() {

    // =====================================================
    // GET TYPE AND ID FROM URL
    // =====================================================

    const [searchParams] = useSearchParams();

    const type = searchParams.get("type");
    const id = searchParams.get("id");


    // =====================================================
    // STATES
    // =====================================================

    const [selectedItem, setSelectedItem] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });


    // =====================================================
    // HOTEL / RESORT BOOKING
    // =====================================================

    const [rooms, setRooms] = useState(1);

    const [nights, setNights] = useState(1);


    // =====================================================
    // RESTAURANT QUANTITY
    // =====================================================

    const [quantity, setQuantity] = useState(1);


    // =====================================================
    // SUBMIT STATES
    // =====================================================

    const [submitting, setSubmitting] = useState(false);

    const [submitError, setSubmitError] = useState("");


    // =====================================================
    // LOAD SELECTED PLACE
    // =====================================================

    useEffect(() => {

        if (!type || !id) {
            setSelectedItem(null);
            return;
        }


        const loadItem = async () => {

            try {

                setLoading(true);

                setError("");


                let apiUrl = "";


                if (type === "hotel") {

                    apiUrl =
                        `http://localhost:5014/api/Hotels/${id}`;

                }

                else if (type === "restaurant") {

                    apiUrl =
                        `http://localhost:5014/api/Restaurants/${id}`;

                }

                else if (type === "touristspot") {

                    apiUrl =
                        `http://localhost:5014/api/TouristSpots/${id}`;

                }

                else if (type === "resort") {

                    apiUrl =
                        `http://localhost:5014/api/Resorts/${id}`;

                }

                else {

                    setError("Invalid place type.");

                    return;
                }


                const response =
                    await fetch(apiUrl);


                if (!response.ok) {

                    throw new Error(
                        "Unable to load selected place."
                    );

                }


                const data =
                    await response.json();


                setSelectedItem(data);

            }

            catch (err) {

                console.error(err);

                setError(
                    "Unable to load selected place."
                );

            }

            finally {

                setLoading(false);

            }

        };


        loadItem();

    }, [type, id]);


    // =====================================================
    // SET BOOKING DEFAULT VALUES
    // =====================================================

    useEffect(() => {

        if (selectedItem) {

            setFormData((previous) => ({

                ...previous,

                subject:
                    `Booking Request - ${selectedItem.name}`,

                message:
                    `I would like to book/contact about ${selectedItem.name}.`

            }));


            setRooms(1);

            setNights(1);

            setQuantity(1);

        }

    }, [selectedItem]);


    // =====================================================
    // HANDLE FORM INPUT
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // =====================================================
    // GET NUMERIC PRICE
    // =====================================================

    const getNumericPrice = () => {

        if (!selectedItem) {

            return 0;

        }


        let price =
            selectedItem.price;


        if (
            price === null ||
            price === undefined ||
            price === ""
        ) {

            return 0;

        }


        if (typeof price === "string") {

            price =
                price.replace(
                    /[^0-9.]/g,
                    ""
                );

        }


        const numericPrice =
            Number(price);


        return Number.isFinite(numericPrice)
            ? numericPrice
            : 0;

    };


    // =====================================================
    // ORIGINAL UNIT PRICE
    // =====================================================

    const unitPrice =
        getNumericPrice();


    // =====================================================
    // TOURIST SPOT DISCOUNT
    // =====================================================

    const touristSpotDiscount =
        type === "touristspot"
            ? Number(
                selectedItem?.discountPercent ?? 20
            )
            : 0;


    // =====================================================
    // TOURIST SPOT DISCOUNT AMOUNT
    // =====================================================

    const touristSpotDiscountAmount =
        type === "touristspot"
            ? unitPrice *
            (
                touristSpotDiscount /
                100
            )
            : 0;


    // =====================================================
    // TOURIST SPOT FINAL PACKAGE PRICE
    // =====================================================

    const touristSpotFinalPrice =
        type === "touristspot"
            ? unitPrice -
            touristSpotDiscountAmount
            : 0;


    // =====================================================
    // TOTAL AMOUNT
    // =====================================================

    let totalAmount = 0;


    if (
        type === "hotel" ||
        type === "resort"
    ) {

        // HOTEL / RESORT:
        // Price × Rooms × Nights

        totalAmount =
            unitPrice *
            rooms *
            nights;

    }

    else if (type === "restaurant") {

        // RESTAURANT:
        // Price × People

        totalAmount =
            unitPrice *
            quantity;

    }

    else if (type === "touristspot") {

        // TOURIST SPOT:
        // FIXED PACKAGE PRICE AFTER 20% DISCOUNT

        totalAmount =
            touristSpotFinalPrice;

    }


    // =====================================================
    // BOOKING LABEL
    // =====================================================

    const getQuantityLabel = () => {

        if (type === "restaurant") {

            return quantity === 1
                ? "Person"
                : "People";

        }


        return "Quantity";

    };


    // =====================================================
    // HANDLE ROOMS
    // =====================================================

    const handleRoomsChange = (e) => {

        const value =
            Number(e.target.value);


        if (value >= 1) {

            setRooms(value);

        }

    };


    // =====================================================
    // HANDLE NIGHTS
    // =====================================================

    const handleNightsChange = (e) => {

        const value =
            Number(e.target.value);


        if (value >= 1) {

            setNights(value);

        }

    };


    // =====================================================
    // HANDLE RESTAURANT QUANTITY
    // =====================================================

    const handleQuantityChange = (e) => {

        const value =
            Number(e.target.value);


        if (value >= 1) {

            setQuantity(value);

        }

    };


    // =====================================================
    // SUBMIT FORM
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            setSubmitting(true);

            setSubmitError("");


            // =================================================
            // CHECK BOOKING PRICE
            // =================================================

            if (
                selectedItem &&
                totalAmount <= 0
            ) {

                throw new Error(
                    "Booking price is not available for this place."
                );

            }


            // =================================================
            // CHECK HOTEL / RESORT ROOM AVAILABILITY
            // =================================================

            if (
                type === "hotel" ||
                type === "resort"
            ) {

                const availableRooms =
                    Number(
                        selectedItem.availableRooms ?? 0
                    );


                if (availableRooms <= 0) {

                    throw new Error(
                        "Sorry, no rooms are currently available."
                    );

                }


                if (rooms > availableRooms) {

                    throw new Error(
                        `Only ${availableRooms} room(s) are currently available.`
                    );

                }

            }


            // =================================================
            // CHECK RESTAURANT SEAT AVAILABILITY
            // =================================================

            if (type === "restaurant") {

                const availableSeats =
                    Number(
                        selectedItem.availableSeats ?? 0
                    );


                if (availableSeats <= 0) {

                    throw new Error(
                        "Sorry, no seats are currently available."
                    );

                }


                if (quantity > availableSeats) {

                    throw new Error(
                        `Only ${availableSeats} seat(s) are currently available.`
                    );

                }

            }


            // =================================================
            // CREATE BOOKING MESSAGE
            // =================================================

            let bookingMessage =
                formData.message;


            if (selectedItem) {

                // =============================================
                // HOTEL / RESORT
                // =============================================

                if (
                    type === "hotel" ||
                    type === "resort"
                ) {

                    bookingMessage =
                        `${formData.message}\n\n` +
                        `Booking Details:\n` +
                        `Rooms: ${rooms}\n` +
                        `Nights: ${nights}\n` +
                        `Price per Room/Night: Rs. ${unitPrice.toLocaleString()}\n` +
                        `Total Amount: Rs. ${totalAmount.toLocaleString()}`;

                }


                // =============================================
                // RESTAURANT
                // =============================================

                else if (type === "restaurant") {

                    bookingMessage =
                        `${formData.message}\n\n` +
                        `Booking Details:\n` +
                        `${getQuantityLabel()}: ${quantity}\n` +
                        `Price per Person: Rs. ${unitPrice.toLocaleString()}\n` +
                        `Total Amount: Rs. ${totalAmount.toLocaleString()}`;

                }


                // =============================================
                // TOURIST SPOT
                // FIXED TOUR PACKAGE
                // =============================================

                else if (type === "touristspot") {

                    bookingMessage =
                        `${formData.message}\n\n` +
                        `Tour Package Details:\n` +
                        `Tour Duration: ${selectedItem.tourDays} Days\n` +
                        `Original Package Price: Rs. ${unitPrice.toLocaleString()}\n` +
                        `Discount: ${touristSpotDiscount}% OFF\n` +
                        `Discount Amount: Rs. ${touristSpotDiscountAmount.toLocaleString()}\n` +
                        `Final Package Price: Rs. ${touristSpotFinalPrice.toLocaleString()}`;

                }

            }


            // =================================================
            // BOOKING DATA
            // =================================================

            const bookingData = {

                fullName:
                    formData.fullName,

                email:
                    formData.email,

                phone:
                    formData.phone,

                subject:
                    formData.subject,

                message:
                    bookingMessage,

                type:
                    type || null,

                itemId:
                    id
                        ? Number(id)
                        : null,

                itemName:
                    selectedItem
                        ? selectedItem.name
                        : null,


                // =================================================
                // CASHBOOK AMOUNT
                // =================================================

                amount:
                    selectedItem
                        ? totalAmount
                        : 0,

                paidAmount:
                    0,

                remainingAmount:
                    selectedItem
                        ? totalAmount
                        : 0,

                paymentMethod:
                    selectedItem
                        ? "Cash"
                        : null,

                paymentStatus:
                    selectedItem
                        ? "Pending"
                        : null

            };


            // =================================================
            // SEND BOOKING
            // =================================================

            const response =
                await fetch(
                    "http://localhost:5014/api/Bookings",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                bookingData
                            )
                    }
                );


            const data =
                await response.json();


            // =================================================
            // BOOKING ERROR
            // =================================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to submit your request."
                );

            }


            // =================================================
            // RESERVE HOTEL ROOMS
            // =================================================

            if (type === "hotel") {

                const reserveResponse =
                    await fetch(
                        `http://localhost:5014/api/Hotels/${id}/reserve-rooms`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    rooms: rooms
                                })
                        }
                    );


                const reserveData =
                    await reserveResponse.json();


                if (!reserveResponse.ok) {

                    throw new Error(
                        reserveData.message ||
                        "Booking was created, but rooms could not be reserved."
                    );

                }


                setSelectedItem((previous) => {

                    if (!previous) {

                        return previous;

                    }


                    return {

                        ...previous,

                        availableRooms:
                            reserveData.availableRooms

                    };

                });

            }


            // =================================================
            // RESERVE RESORT ROOMS
            // =================================================

            if (type === "resort") {

                const reserveResponse =
                    await fetch(
                        `http://localhost:5014/api/Resorts/${id}/reserve-rooms`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    rooms: rooms
                                })
                        }
                    );


                const reserveData =
                    await reserveResponse.json();


                if (!reserveResponse.ok) {

                    throw new Error(
                        reserveData.message ||
                        "Booking was created, but resort rooms could not be reserved."
                    );

                }


                setSelectedItem((previous) => {

                    if (!previous) {

                        return previous;

                    }


                    return {

                        ...previous,

                        availableRooms:
                            reserveData.availableRooms

                    };

                });

            }


            // =================================================
            // RESERVE RESTAURANT SEATS
            // =================================================

            if (type === "restaurant") {

                const reserveResponse =
                    await fetch(
                        `http://localhost:5014/api/Restaurants/${id}/reserve-seats`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    seats: quantity
                                })
                        }
                    );


                const reserveData =
                    await reserveResponse.json();


                if (!reserveResponse.ok) {

                    throw new Error(
                        reserveData.message ||
                        "Booking was created, but restaurant seats could not be reserved."
                    );

                }


                setSelectedItem((previous) => {

                    if (!previous) {

                        return previous;

                    }


                    return {

                        ...previous,

                        availableSeats:
                            reserveData.availableSeats

                    };

                });

            }


            // =================================================
            // CLEAR FORM
            // =================================================

            setFormData({

                fullName: "",
                email: "",
                phone: "",
                subject: "",
                message: ""

            });


            setRooms(1);

            setNights(1);

            setQuantity(1);

        }


        catch (error) {

            console.error(error);


            setSubmitError(
                error.message ||
                "Unable to submit your request."
            );

        }


        finally {

            setSubmitting(false);

        }

    };


    // =====================================================
    // QUANTITY OPTIONS
    // =====================================================

    const quantityOptions =
        Array.from(
            { length: 30 },
            (_, index) => index + 1
        );


    // =====================================================
    // HOTEL / RESORT ROOM COUNT
    // =====================================================

    const roomCount =
        selectedItem &&
        (
            type === "hotel" ||
            type === "resort"
        )
            ? Number(
                selectedItem.availableRooms ?? 0
            )
            : 0;


    // =====================================================
    // RESTAURANT SEAT COUNT
    // =====================================================

    const seatCount =
        selectedItem &&
        type === "restaurant"
            ? Number(
                selectedItem.availableSeats ?? 0
            )
            : 0;


    // =====================================================
    // ROOM OPTIONS
    // =====================================================

    const roomOptions =
        Array.from(
            {
                length:
                    Math.min(
                        roomCount,
                        30
                    )
            },
            (_, index) => index + 1
        );


    // =====================================================
    // RESTAURANT PEOPLE OPTIONS
    // =====================================================

    const restaurantQuantityOptions =
        Array.from(
            {
                length:
                    Math.min(
                        seatCount,
                        30
                    )
            },
            (_, index) => index + 1
        );


    // =====================================================
    // RETURN
    // =====================================================

    return (
        <>

            {/* =====================================================
                 HERO SECTION
                 ===================================================== */}

            <section className="page-banner">

                <div className="container">

                    <h2>
                        Let's Talk About Your Journey.
                    </h2>

                    <p>
                        Contact us and let us help you plan
                        your perfect journey across Pakistan.
                    </p>

                </div>

            </section>


            {/* =====================================================
                 CONTACT SECTION
                 ===================================================== */}

            <section className="contact-section py-5">

                <div className="container">

                    <div className="row g-5">


                        {/* =================================================
                             CONTACT INFORMATION
                             ================================================= */}

                        <div className="col-lg-5">

                            <h3 className="mb-4">
                                Get In Touch
                            </h3>

                            <p>
                                Have a question, need travel information,
                                or want to book a place? Feel free to
                                contact us.
                            </p>


                            <div className="mt-4">

                                <div className="d-flex mb-4">

                                    <div className="me-3">

                                        <i className="bi bi-geo-alt-fill fs-3"></i>

                                    </div>

                                    <div>

                                        <h5>
                                            Address
                                        </h5>

                                        <p className="mb-0">
                                            Islamabad, Pakistan
                                        </p>

                                    </div>

                                </div>


                                <div className="d-flex mb-4">

                                    <div className="me-3">

                                        <i className="bi bi-telephone-fill fs-3"></i>

                                    </div>

                                    <div>

                                        <h5>
                                            Phone
                                        </h5>

                                        <p className="mb-0">
                                            +92 300 1234567
                                        </p>

                                    </div>

                                </div>


                                <div className="d-flex mb-4">

                                    <div className="me-3">

                                        <i className="bi bi-envelope-fill fs-3"></i>

                                    </div>

                                    <div>

                                        <h5>
                                            Email
                                        </h5>

                                        <p className="mb-0">
                                            info@karneltravel.com
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                             CONTACT / BOOKING FORM
                             ================================================= */}

                        <div className="col-lg-7">

                            <div className="card shadow-sm border-0 p-4">

                                <h3 className="mb-4">
                                    Contact Us
                                </h3>


                                {/* LOADING */}

                                {loading && (

                                    <div className="alert alert-info">

                                        Loading selected place...

                                    </div>

                                )}


                                {/* ERROR */}

                                {error && (

                                    <div className="alert alert-danger">

                                        {error}

                                    </div>

                                )}


                                {/* SUBMIT ERROR */}

                                {submitError && (

                                    <div className="alert alert-danger">

                                        {submitError}

                                    </div>

                                )}


                                {/* SELECTED PLACE */}

                                {selectedItem && (

                                    <div className="alert alert-success">

                                        <strong>
                                            Booking For:
                                        </strong>

                                        <div className="mt-2">

                                            <h5 className="mb-1">
                                                {selectedItem.name}
                                            </h5>


                                            {selectedItem.location && (

                                                <p className="mb-2">

                                                    <i className="bi bi-geo-alt-fill me-1"></i>

                                                    {selectedItem.location}

                                                </p>

                                            )}


                                            {/* HOTEL / RESORT AVAILABILITY */}

                                            {(
                                                type === "hotel" ||
                                                type === "resort"
                                            ) && (

                                                <div className="mt-3">

                                                    <strong>
                                                        Available Rooms:
                                                    </strong>{" "}

                                                    <span className="fw-bold">

                                                        {selectedItem.availableRooms ?? 0}

                                                    </span>

                                                </div>

                                            )}


                                            {/* RESTAURANT AVAILABILITY */}

                                            {type === "restaurant" && (

                                                <div className="mt-3">

                                                    <strong>
                                                        Available Seats:
                                                    </strong>{" "}

                                                    <span className="fw-bold">

                                                        {selectedItem.availableSeats ?? 0}

                                                    </span>

                                                </div>

                                            )}


                                            {/* TOURIST SPOT PACKAGE INFORMATION */}

                                            {type === "touristspot" && (

                                                <div className="mt-3">

                                                    <div className="mb-2">

                                                        <strong>
                                                            Tour Duration:
                                                        </strong>{" "}

                                                        <span className="fw-bold">

                                                            {selectedItem.tourDays}{" "}

                                                            {Number(
                                                                selectedItem.tourDays
                                                            ) === 1
                                                                ? "Day"
                                                                : "Days"
                                                            }

                                                        </span>

                                                    </div>


                                                    <div className="mb-2">

                                                        <strong>
                                                            Original Package Price:
                                                        </strong>{" "}

                                                        <span className="fw-bold">

                                                            Rs.{" "}

                                                            {unitPrice.toLocaleString()}

                                                        </span>

                                                    </div>


                                                    <div className="mb-2">

                                                        <strong>
                                                            Discount:
                                                        </strong>{" "}

                                                        <span className="text-danger fw-bold">

                                                            {touristSpotDiscount}% OFF

                                                        </span>

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            Final Package Price:
                                                        </strong>{" "}

                                                        <span className="text-success fw-bold">

                                                            Rs.{" "}

                                                            {touristSpotFinalPrice.toLocaleString()}

                                                        </span>

                                                    </div>

                                                </div>

                                            )}


                                            {/* HOTEL / RESORT PRICE */}

                                            {(
                                                type === "hotel" ||
                                                type === "resort"
                                            ) && (

                                                <div className="mt-3">

                                                    <strong>
                                                        Price:
                                                    </strong>{" "}

                                                    <span className="text-success fw-bold">

                                                        Rs.{" "}

                                                        {unitPrice.toLocaleString()}

                                                    </span>

                                                    <span>
                                                        {" "}per room / night
                                                    </span>

                                                </div>

                                            )}


                                            {/* RESTAURANT PRICE */}

                                            {type === "restaurant" && (

                                                <div className="mt-3">

                                                    <strong>
                                                        Price:
                                                    </strong>{" "}

                                                    <span className="text-success fw-bold">

                                                        Rs.{" "}

                                                        {unitPrice.toLocaleString()}

                                                    </span>

                                                    <span>
                                                        {" "}per person
                                                    </span>

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* FORM */}

                                <form onSubmit={handleSubmit}>


                                    {/* FULL NAME */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-control"
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* EMAIL */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* PHONE */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Phone
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control"
                                            placeholder="Enter your phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* HOTEL / RESORT ROOMS */}

                                    {selectedItem &&
                                        (
                                            type === "hotel" ||
                                            type === "resort"
                                        ) && (

                                            <div className="mb-3">

                                                <label className="form-label fw-bold">

                                                    How many rooms?

                                                </label>


                                                {roomCount > 0 ? (

                                                    <select
                                                        className="form-select"
                                                        value={rooms}
                                                        onChange={
                                                            handleRoomsChange
                                                        }
                                                    >

                                                        {roomOptions.map(
                                                            (number) => (

                                                                <option
                                                                    key={number}
                                                                    value={number}
                                                                >

                                                                    {number}{" "}

                                                                    {number === 1
                                                                        ? "Room"
                                                                        : "Rooms"
                                                                    }

                                                                </option>

                                                            )
                                                        )}

                                                    </select>

                                                ) : (

                                                    <div className="alert alert-danger mb-0">

                                                        No rooms are currently available.

                                                    </div>

                                                )}

                                            </div>

                                        )}


                                    {/* HOTEL / RESORT NIGHTS */}

                                    {selectedItem &&
                                        (
                                            type === "hotel" ||
                                            type === "resort"
                                        ) && (

                                            <div className="mb-4">

                                                <label className="form-label fw-bold">

                                                    How many nights?

                                                </label>


                                                <select
                                                    className="form-select"
                                                    value={nights}
                                                    onChange={
                                                        handleNightsChange
                                                    }
                                                >

                                                    {quantityOptions.map(
                                                        (number) => (

                                                            <option
                                                                key={number}
                                                                value={number}
                                                            >

                                                                {number}{" "}

                                                                {number === 1
                                                                    ? "Night"
                                                                    : "Nights"
                                                                }

                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </div>

                                        )}


                                    {/* RESTAURANT PEOPLE */}

                                    {selectedItem &&
                                        type === "restaurant" && (

                                            <div className="mb-4">

                                                <label className="form-label fw-bold">

                                                    How many people?

                                                </label>


                                                {seatCount > 0 ? (

                                                    <select
                                                        className="form-select"
                                                        value={quantity}
                                                        onChange={
                                                            handleQuantityChange
                                                        }
                                                    >

                                                        {restaurantQuantityOptions.map(
                                                            (number) => (

                                                                <option
                                                                    key={number}
                                                                    value={number}
                                                                >

                                                                    {number}{" "}

                                                                    {number === 1
                                                                        ? "Person"
                                                                        : "People"
                                                                    }

                                                                </option>

                                                            )
                                                        )}

                                                    </select>

                                                ) : (

                                                    <div className="alert alert-danger mb-0">

                                                        No seats are currently available.

                                                    </div>

                                                )}

                                            </div>

                                        )}


                                    {/* TOURIST SPOT HAS NO QUANTITY SELECTOR */}

                                    {selectedItem &&
                                        type === "touristspot" && (

                                            <div className="alert alert-info mb-4">

                                                <strong>
                                                    Fixed Tour Package
                                                </strong>

                                                <div className="mt-2">

                                                    This is a permanent{" "}

                                                    {selectedItem.tourDays}{" "}

                                                    day tour package.

                                                    The package price already includes the permanent{" "}

                                                    {touristSpotDiscount}% discount.

                                                </div>

                                            </div>

                                        )}


                                    {/* TOTAL AMOUNT */}

                                    {selectedItem && (

                                        <div className="card border-success mb-4">

                                            <div className="card-body">


                                                {/* HOTEL / RESORT */}

                                                {(
                                                    type === "hotel" ||
                                                    type === "resort"
                                                ) ? (

                                                    <>

                                                        <div className="d-flex justify-content-between mb-2">

                                                            <span>
                                                                Price per Room/Night
                                                            </span>

                                                            <strong>

                                                                Rs.{" "}

                                                                {unitPrice.toLocaleString()}

                                                            </strong>

                                                        </div>


                                                        <div className="d-flex justify-content-between mb-2">

                                                            <span>
                                                                Rooms
                                                            </span>

                                                            <strong>
                                                                {rooms}
                                                            </strong>

                                                        </div>


                                                        <div className="d-flex justify-content-between mb-2">

                                                            <span>
                                                                Nights
                                                            </span>

                                                            <strong>
                                                                {nights}
                                                            </strong>

                                                        </div>


                                                        <hr />


                                                        <div className="d-flex justify-content-between">

                                                            <span className="fw-bold fs-5">

                                                                Total Amount

                                                            </span>

                                                            <strong className="text-success fs-4">

                                                                Rs.{" "}

                                                                {totalAmount.toLocaleString()}

                                                            </strong>

                                                        </div>

                                                    </>

                                                ) : type === "restaurant" ? (

                                                    /* RESTAURANT */

                                                    <>

                                                        <div className="d-flex justify-content-between mb-2">

                                                            <span>
                                                                Price per Person
                                                            </span>

                                                            <strong>

                                                                Rs.{" "}

                                                                {unitPrice.toLocaleString()}

                                                            </strong>

                                                        </div>


                                                        <div className="d-flex justify-content-between mb-2">

                                                            <span>
                                                                People
                                                            </span>

                                                            <strong>
                                                                {quantity}
                                                            </strong>

                                                        </div>


                                                        <hr />


                                                        <div className="d-flex justify-content-between">

                                                            <span className="fw-bold fs-5">

                                                                Total Amount

                                                            </span>

                                                            <strong className="text-success fs-4">

                                                                Rs.{" "}

                                                                {totalAmount.toLocaleString()}

                                                            </strong>

                                                        </div>

                                                    </>

                                                ) : (

                                                    /* TOURIST SPOT */

                                                    <>

                                                        <div className="d-flex justify-content-between mb-2">

                                                            <span>
                                                                Tour Duration
                                                            </span>

                                                            <strong>

                                                                {selectedItem.tourDays}{" "}

                                                                {Number(
                                                                    selectedItem.tourDays
                                                                ) === 1
                                                                    ? "Day"
                                                                    : "Days"
                                                                }

                                                            </strong>

                                                        </div>


                                                        <div className="d-flex justify-content-between mb-2">

                                                            <span>
                                                                Original Package Price
                                                            </span>

                                                            <strong>

                                                                Rs.{" "}

                                                                {unitPrice.toLocaleString()}

                                                            </strong>

                                                        </div>


                                                        <div className="d-flex justify-content-between mb-2">

                                                            <span>
                                                                Discount
                                                            </span>

                                                            <strong className="text-danger">

                                                                {touristSpotDiscount}% OFF

                                                            </strong>

                                                        </div>


                                                        <div className="d-flex justify-content-between mb-2">

                                                            <span>
                                                                Discount Amount
                                                            </span>

                                                            <strong className="text-danger">

                                                                Rs.{" "}

                                                                {touristSpotDiscountAmount.toLocaleString()}

                                                            </strong>

                                                        </div>


                                                        <hr />


                                                        <div className="d-flex justify-content-between">

                                                            <span className="fw-bold fs-5">

                                                                Final Package Price

                                                            </span>

                                                            <strong className="text-success fs-4">

                                                                Rs.{" "}

                                                                {touristSpotFinalPrice.toLocaleString()}

                                                            </strong>

                                                        </div>

                                                    </>

                                                )}

                                            </div>

                                        </div>

                                    )}


                                    {/* SUBJECT */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Subject
                                        </label>

                                        <input
                                            type="text"
                                            name="subject"
                                            className="form-control"
                                            placeholder="Enter subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* MESSAGE */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Message
                                        </label>

                                        <textarea
                                            name="message"
                                            className="form-control"
                                            rows="5"
                                            placeholder="Write your message..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>

                                    </div>


                                    {/* SUBMIT */}

                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg"
                                        disabled={
                                            submitting ||
                                            (
                                                (
                                                    type === "hotel" ||
                                                    type === "resort"
                                                ) &&
                                                roomCount <= 0
                                            ) ||
                                            (
                                                type === "restaurant" &&
                                                seatCount <= 0
                                            )
                                        }
                                    >

                                        {submitting
                                            ? "Sending..."
                                            : selectedItem
                                                ? "Submit Booking"
                                                : "Send Message"
                                        }

                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                 FEEDBACK SECTION
                 ===================================================== */}

            <section className="py-5">

                <div className="container text-center">

                    <h3 className="mb-3">
                        We Value Your Feedback
                    </h3>

                    <p>
                        Your feedback helps us improve Karnel Travel
                        and provide a better travel experience.
                    </p>

                    <Link
                        to="/"
                        className="btn btn-success"
                    >
                        Back to Home
                    </Link>

                </div>

            </section>


            {/* =====================================================
                 FOOTER
                 ===================================================== */}

            <footer className="py-4 bg-dark text-white">

                <div className="container text-center">

                    <p className="mb-0">
                        © 2026 Karnel Travel. All Rights Reserved.
                    </p>

                </div>

            </footer>

        </>
    );
}

export default Contact;
