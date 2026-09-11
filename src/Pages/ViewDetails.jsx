import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API_URL from "../api";
import "./ViewDetails.css";

function ViewDetails() {

    const [searchParams] = useSearchParams();

    const type = searchParams.get("type");
    const id = searchParams.get("id");

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // REAL RATING DATA
    // =====================================================

    const [averageRating, setAverageRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);

    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const [ratingMessage, setRatingMessage] = useState("");
    const [ratingLoading, setRatingLoading] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);


    // =====================================================
    // CHECK USER LOGIN
    // =====================================================

    useEffect(() => {

        const checkLogin = () => {

            const token = localStorage.getItem("userToken");

            setIsLoggedIn(!!token);
        };

        checkLogin();

        window.addEventListener(
            "userAuthChanged",
            checkLogin
        );

        return () => {

            window.removeEventListener(
                "userAuthChanged",
                checkLogin
            );

        };

    }, []);


    // =====================================================
    // GET DETAILS
    // =====================================================

    useEffect(() => {

        const loadDetails = async () => {

            try {

                setLoading(true);
                setError("");

                let apiUrl = "";


                // =================================================
                // HOTEL
                // =================================================

                if (type === "hotel") {

                    apiUrl =
                        `${API_URL}/api/Hotels/${id}`;

                }


                // =================================================
                // RESTAURANT
                // =================================================

                else if (type === "restaurant") {

                    apiUrl =
                        `${API_URL}/api/Restaurants/${id}`;

                }


                // =================================================
                // TOURIST SPOT
                // =================================================

                else if (type === "touristspot") {

                    apiUrl =
                        `${API_URL}/api/TouristSpots/${id}`;

                }


                // =================================================
                // RESORT
                // =================================================

                else if (type === "resort") {

                    apiUrl =
                        `${API_URL}/api/Resorts/${id}`;

                }


                else {

                    setError(
                        "Invalid item type."
                    );

                    return;
                }


                const response =
                    await fetch(apiUrl);


                if (!response.ok) {

                    throw new Error(
                        "Unable to load details."
                    );

                }


                const data =
                    await response.json();


                setItem(data);

            }


            catch (err) {

                console.error(err);

                setError(
                    "Unable to load details."
                );

            }


            finally {

                setLoading(false);

            }

        };


        if (type && id) {
            loadDetails();
        } else {
            setLoading(false);
            setError("Invalid item information.");
        }

    }, [type, id]);


    // =====================================================
    // GET REAL RATING
    // HOTEL + RESTAURANT + TOURIST SPOT + RESORT
    // =====================================================

    useEffect(() => {

        const loadRating = async () => {

            if (
                type !== "hotel" &&
                type !== "restaurant" &&
                type !== "touristspot" &&
                type !== "resort"
            ) {

                return;

            }


            if (!id) {

                return;

            }


            try {

                let ratingApiUrl = "";


                // =================================================
                // HOTEL RATING API
                // =================================================

                if (type === "hotel") {

                    ratingApiUrl =
                        `${API_URL}/api/HotelRatings/${id}`;

                }


                // =================================================
                // RESTAURANT RATING API
                // =================================================

                else if (type === "restaurant") {

                    ratingApiUrl =
                        `${API_URL}/api/RestaurantRatings/${id}`;

                }


                // =================================================
                // TOURIST SPOT RATING API
                // =================================================

                else if (type === "touristspot") {

                    ratingApiUrl =
                        `${API_URL}/api/TouristSpotRatings/${id}`;

                }


                // =================================================
                // RESORT RATING API
                // =================================================

                else if (type === "resort") {

                    ratingApiUrl =
                        `${API_URL}/api/ResortRatings/${id}`;

                }


                const response =
                    await fetch(ratingApiUrl);


                if (!response.ok) {

                    return;

                }


                const data =
                    await response.json();


                setAverageRating(
                    data.averageRating || 0
                );


                setTotalRatings(
                    data.totalRatings || 0
                );

            }


            catch (err) {

                console.error(
                    "Unable to load rating:",
                    err
                );

            }

        };


        loadRating();

    }, [type, id]);


    // =====================================================
    // SUBMIT / UPDATE RATING
    // =====================================================

    const submitRating = async () => {

        const token =
            localStorage.getItem("userToken");


        // =================================================
        // CHECK LOGIN
        // =================================================

        if (!token) {

            setIsLoggedIn(false);

            setRatingMessage(
                `Please login to rate this ${type}.`
            );

            return;

        }


        // =================================================
        // CHECK SELECTED RATING
        // =================================================

        if (selectedRating === 0) {

            setRatingMessage(
                "Please select a rating first."
            );

            return;

        }


        try {

            setRatingLoading(true);

            setRatingMessage("");


            let ratingApiUrl = "";


            // =================================================
            // HOTEL
            // =================================================

            if (type === "hotel") {

                ratingApiUrl =
                    `${API_URL}/api/HotelRatings`;

            }


            // =================================================
            // RESTAURANT
            // =================================================

            else if (type === "restaurant") {

                ratingApiUrl =
                    `${API_URL}/api/RestaurantRatings`;

            }


            // =================================================
            // TOURIST SPOT
            // =================================================

            else if (type === "touristspot") {

                ratingApiUrl =
                    `${API_URL}/api/TouristSpotRatings`;

            }


            // =================================================
            // RESORT
            // =================================================

            else if (type === "resort") {

                ratingApiUrl =
                    `${API_URL}/api/ResortRatings`;

            }


            else {

                setRatingMessage(
                    "Rating is not available for this item."
                );

                return;

            }


            // =================================================
            // REQUEST BODY
            // =================================================

            let requestBody = {};


            if (type === "hotel") {

                requestBody = {

                    hotelId:
                        Number(id),

                    rating:
                        selectedRating

                };

            }


            else if (type === "restaurant") {

                requestBody = {

                    restaurantId:
                        Number(id),

                    rating:
                        selectedRating

                };

            }


            else if (type === "touristspot") {

                requestBody = {

                    touristSpotId:
                        Number(id),

                    rating:
                        selectedRating

                };

            }


            else if (type === "resort") {

                requestBody = {

                    resortId:
                        Number(id),

                    rating:
                        selectedRating

                };

            }


            // =================================================
            // SEND RATING
            // =================================================

            const response =
                await fetch(
                    ratingApiUrl,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify(
                                requestBody
                            )

                    }
                );


            const data =
                await response.json();


            // =================================================
            // ERROR
            // =================================================

            if (!response.ok) {

                // TOKEN EXPIRED

                if (response.status === 401) {

                    localStorage.removeItem(
                        "userToken"
                    );

                    localStorage.removeItem(
                        "user"
                    );


                    setIsLoggedIn(false);


                    setRatingMessage(
                        "Your login session has expired. Please login again."
                    );


                    return;

                }


                setRatingMessage(
                    data.message ||
                    "Unable to submit rating."
                );


                return;

            }


            // =================================================
            // UPDATE DISPLAYED RATING
            // =================================================

            setAverageRating(
                data.averageRating || 0
            );


            setTotalRatings(
                data.totalRatings || 0
            );


            // =================================================
            // SUCCESS MESSAGE
            // =================================================

            setRatingMessage(
                data.message ||
                "Your rating has been submitted successfully."
            );


            // =================================================
            // RESET STAR SELECTION
            // =================================================

            setSelectedRating(0);

            setHoverRating(0);

        }


        catch (err) {

            console.error(
                "Rating Error:",
                err
            );


            setRatingMessage(
                "Unable to submit rating."
            );

        }


        finally {

            setRatingLoading(false);

        }

    };


    // =====================================================
    // BACK LINK
    // =====================================================

    let backPath = "/";
    let backText = "← Back";


    if (type === "hotel") {

        backPath = "/hotels";

        backText =
            "← Back to Hotels";

    }


    if (type === "restaurant") {

        backPath = "/restaurants";

        backText =
            "← Back to Restaurants";

    }


    if (type === "touristspot") {

        backPath =
            "/tourist-spots";

        backText =
            "← Back to Tourist Spots";

    }


    if (type === "resort") {

        backPath =
            "/resorts";

        backText =
            "← Back to Resorts";

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <section className="page-section text-center py-5">

                <div className="container">

                    <h2>
                        Loading Details...
                    </h2>

                </div>

            </section>

        );

    }


    // =====================================================
    // ERROR / NOT FOUND
    // =====================================================

    if (error || !item) {

        return (

            <section className="page-section text-center py-5">

                <div className="container">

                    <h2>
                        Details Not Found
                    </h2>


                    <p>
                        {error ||
                            "Sorry, the requested information could not be found."
                        }
                    </p>


                    <Link
                        to={backPath}
                        className="btn btn-success"
                    >
                        {backText}
                    </Link>

                </div>

            </section>

        );

    }


    // =====================================================
    // TOURIST SPOT PACKAGE CALCULATIONS
    // =====================================================

    const touristSpotOriginalPrice =
        type === "touristspot"
            ? Number(item.price) || 0
            : 0;


    const touristSpotDiscount =
        type === "touristspot"
            ? Number(
                item.discountPercent ?? 20
            )
            : 0;


    const touristSpotDiscountAmount =
        type === "touristspot"
            ? touristSpotOriginalPrice *
            (
                touristSpotDiscount /
                100
            )
            : 0;


    const touristSpotFinalPrice =
        type === "touristspot"
            ? touristSpotOriginalPrice -
            touristSpotDiscountAmount
            : 0;


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="view-details-page">

            <>

                {/* =================================================
                     PAGE BANNER
                     ================================================= */}

                <section className="page-banner">

                    <div className="container">

                        <h2>
                            Detail Information
                        </h2>


                        <p>
                            Discover {type}s across Pakistan
                        </p>

                    </div>

                </section>


                {/* =================================================
                     MAIN DETAILS
                     ================================================= */}

                <section className="py-5">

                    <div className="container">

                        <div className="row g-5 align-items-center">


                            {/* =================================================
                                 IMAGE
                                 ================================================= */}

                            <div className="col-lg-6">

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="img-fluid rounded-4 shadow w-100"
                                />

                            </div>


                            {/* =================================================
                                 INFORMATION
                                 ================================================= */}

                            <div className="col-lg-6">


                                {/* NAME */}

                                <h1 className="fw-bold mb-3">

                                    {item.name}

                                </h1>


                                {/* LOCATION */}

                                <p className="text-muted fs-5">

                                    📍 {item.location}

                                </p>


                                {/* =================================================
                                     REAL RATING DISPLAY
                                     ================================================= */}

                                {(
                                    type === "hotel" ||
                                    type === "restaurant" ||
                                    type === "touristspot" ||
                                    type === "resort"
                                ) ? (

                                    <div className="hotel-rating-display mb-4">

                                        <div className="d-flex align-items-center gap-2">

                                            <span className="rating-stars">

                                                {averageRating > 0
                                                    ? "⭐"
                                                    : "☆"
                                                }

                                            </span>


                                            <strong className="fs-5">

                                                {averageRating > 0
                                                    ? averageRating.toFixed(1)
                                                    : "No rating yet"
                                                }

                                            </strong>

                                        </div>


                                        {totalRatings > 0 && (

                                            <small className="text-muted">

                                                Based on{" "}

                                                {totalRatings}{" "}

                                                {totalRatings === 1
                                                    ? "rating"
                                                    : "ratings"
                                                }

                                            </small>

                                        )}

                                    </div>

                                ) : (

                                    <p className="text-warning fs-5">

                                        ⭐ {item.rating}

                                    </p>

                                )}


                                {/* DESCRIPTION */}

                                <p className="text-muted">

                                    {item.description}

                                </p>


                                {/* =================================================
                                     RESTAURANT DETAILS
                                     ================================================= */}

                                {type === "restaurant" && (

                                    <div className="card border-0 shadow-sm mb-4">

                                        <div className="card-body">

                                            <h5 className="fw-bold mb-3">

                                                🍽️ Restaurant Details

                                            </h5>


                                            {item.cuisine && (

                                                <p className="mb-2">

                                                    <strong>
                                                        Cuisine:
                                                    </strong>{" "}

                                                    {item.cuisine}

                                                </p>

                                            )}


                                            {item.price && (

                                                <p className="mb-2">

                                                    <strong>
                                                        Average Price:
                                                    </strong>{" "}

                                                    <span className="text-success fw-bold">

                                                        {item.price}

                                                    </span>{" "}

                                                    <span>
                                                        per person
                                                    </span>

                                                </p>

                                            )}


                                            {item.availableSeats !== undefined && (

                                                <p className="mb-0">

                                                    <strong>
                                                        🪑 Available Seats:
                                                    </strong>{" "}

                                                    <span className="text-success fw-bold">

                                                        {item.availableSeats}

                                                    </span>

                                                    {item.totalSeats !== undefined && (

                                                        <span>

                                                            {" "} / {item.totalSeats} total seats

                                                        </span>

                                                    )}

                                                </p>

                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                     RESORT DETAILS
                                     ================================================= */}

                                {type === "resort" && (

                                    <div className="card border-0 shadow-sm mb-4">

                                        <div className="card-body">

                                            <h5 className="fw-bold mb-3">

                                                🏨 Resort Details

                                            </h5>


                                            {item.price && (

                                                <p className="mb-2">

                                                    <strong>
                                                        Price:
                                                    </strong>{" "}

                                                    <span className="text-success fw-bold">

                                                        {item.price}

                                                    </span>{" "}

                                                    <span>
                                                        per room / night
                                                    </span>

                                                </p>

                                            )}


                                            {item.availableRooms !== undefined && (

                                                <p className="mb-0">

                                                    <strong>
                                                        🛏️ Available Rooms:
                                                    </strong>{" "}

                                                    <span className="text-success fw-bold">

                                                        {item.availableRooms}

                                                    </span>

                                                    {item.totalRooms !== undefined && (

                                                        <span>

                                                            {" "} / {item.totalRooms} total rooms

                                                        </span>

                                                    )}

                                                </p>

                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                     TOURIST SPOT TOUR PACKAGE
                                     ================================================= */}

                                {type === "touristspot" && (

                                    <div className="card border-success shadow-sm mb-4">

                                        <div className="card-body">

                                            <h5 className="fw-bold mb-3">

                                                🏔️ Tour Package

                                            </h5>


                                            <div className="d-flex justify-content-between align-items-center mb-3">

                                                <span className="fw-semibold">

                                                    🗓️ Tour Duration

                                                </span>

                                                <strong>

                                                    {item.tourDays}{" "}

                                                    {Number(item.tourDays) === 1
                                                        ? "Day"
                                                        : "Days"
                                                    }

                                                </strong>

                                            </div>


                                            <div className="d-flex justify-content-between align-items-center mb-3">

                                                <span className="fw-semibold">

                                                    Original Package Price

                                                </span>

                                                <strong>

                                                    Rs.{" "}

                                                    {touristSpotOriginalPrice.toLocaleString()}

                                                </strong>

                                            </div>


                                            <div className="d-flex justify-content-between align-items-center mb-3">

                                                <span className="fw-semibold">

                                                    🏷️ Discount

                                                </span>

                                                <strong className="text-danger">

                                                    {touristSpotDiscount}% OFF

                                                </strong>

                                            </div>


                                            <div className="d-flex justify-content-between align-items-center mb-3">

                                                <span className="fw-semibold">

                                                    Discount Amount

                                                </span>

                                                <strong className="text-danger">

                                                    Rs.{" "}

                                                    {touristSpotDiscountAmount.toLocaleString()}

                                                </strong>

                                            </div>


                                            <hr />


                                            <div className="d-flex justify-content-between align-items-center">

                                                <span className="fw-bold fs-5">

                                                    Final Package Price

                                                </span>

                                                <strong className="text-success fs-4">

                                                    Rs.{" "}

                                                    {touristSpotFinalPrice.toLocaleString()}

                                                </strong>

                                            </div>


                                            <div className="alert alert-info mt-3 mb-0">

                                                <strong>
                                                    Fixed Tour Package:
                                                </strong>{" "}

                                                This package has a fixed duration and permanent{" "}

                                                {touristSpotDiscount}% discount.

                                            </div>

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                     HOTEL DETAILS
                                     ================================================= */}

                                {type === "hotel" && (

                                    <div className="card border-0 shadow-sm mb-4">

                                        <div className="card-body">

                                            <h5 className="fw-bold mb-3">

                                                🏨 Hotel Details

                                            </h5>


                                            {item.price && (

                                                <p className="mb-2">

                                                    <strong>
                                                        Price:
                                                    </strong>{" "}

                                                    <span className="text-success fw-bold">

                                                        {item.price}

                                                    </span>{" "}

                                                    <span>
                                                        per room / night
                                                    </span>

                                                </p>

                                            )}


                                            {item.availableRooms !== undefined && (

                                                <p className="mb-2">

                                                    <strong>
                                                        🛏️ Rooms:
                                                    </strong>{" "}

                                                    <span className="text-success fw-bold">

                                                        {item.availableRooms}

                                                    </span>

                                                    {item.totalRooms !== undefined && (

                                                        <span>

                                                            {" "} / {item.totalRooms} available

                                                        </span>

                                                    )}

                                                </p>

                                            )}


                                            {item.discountPercent !== undefined &&
                                                item.discountPercent !== null &&
                                                item.discountPercent > 0 && (

                                                    <p className="mb-2">

                                                        <strong>
                                                            🏷️ Discount:
                                                        </strong>{" "}

                                                        <span className="text-danger fw-bold">

                                                            {item.discountPercent}% OFF

                                                        </span>

                                                    </p>

                                                )}


                                            {item.offerText && (

                                                <p className="mb-0">

                                                    <strong>
                                                        🎁 Offer:
                                                    </strong>{" "}

                                                    <span className="text-primary fw-bold">

                                                        {item.offerText}

                                                    </span>

                                                </p>

                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* =================================================
                                     RATING BOX
                                     ================================================= */}

                                {(
                                    type === "hotel" ||
                                    type === "restaurant" ||
                                    type === "touristspot" ||
                                    type === "resort"
                                ) && (

                                    <div className="rating-box mt-4 mb-4">


                                        <h5 className="fw-bold mb-2">

                                            Rate this{" "}

                                            {type === "hotel"
                                                ? "hotel"
                                                : type === "restaurant"
                                                    ? "restaurant"
                                                    : type === "touristspot"
                                                        ? "tourist spot"
                                                        : "resort"
                                            }

                                        </h5>


                                        {!isLoggedIn ? (

                                            <div>

                                                <p className="text-muted mb-3">

                                                    Please login to rate this{" "}

                                                    {type === "hotel"
                                                        ? "hotel"
                                                        : type === "restaurant"
                                                            ? "restaurant"
                                                            : type === "touristspot"
                                                                ? "tourist spot"
                                                                : "resort"
                                                    }.

                                                </p>


                                                <Link
                                                    to="/login"
                                                    className="btn btn-success"
                                                >

                                                    Login to Rate

                                                </Link>

                                            </div>

                                        ) : (

                                            <>

                                                <div
                                                    className="rating-select"
                                                    onMouseLeave={() =>
                                                        setHoverRating(0)
                                                    }
                                                >

                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (

                                                            <button
                                                                key={star}
                                                                type="button"

                                                                className={
                                                                    star <=
                                                                    (
                                                                        hoverRating ||
                                                                        selectedRating
                                                                    )
                                                                        ? "rating-star active"
                                                                        : "rating-star"
                                                                }

                                                                onMouseEnter={() =>
                                                                    setHoverRating(star)
                                                                }

                                                                onClick={() =>
                                                                    setSelectedRating(star)
                                                                }

                                                                aria-label={
                                                                    `${star} star rating`
                                                                }
                                                            >

                                                                ★

                                                            </button>

                                                        )
                                                    )}

                                                </div>


                                                {selectedRating > 0 && (

                                                    <p className="mt-2 mb-2">

                                                        You selected{" "}

                                                        <strong>

                                                            {selectedRating} / 5

                                                        </strong>

                                                    </p>

                                                )}


                                                <button
                                                    type="button"
                                                    className="btn btn-success"

                                                    onClick={
                                                        submitRating
                                                    }

                                                    disabled={
                                                        ratingLoading ||
                                                        selectedRating === 0
                                                    }
                                                >

                                                    {ratingLoading
                                                        ? "Submitting..."
                                                        : "Submit Rating"
                                                    }

                                                </button>


                                                {ratingMessage && (

                                                    <p className="mt-2 mb-0 text-muted">

                                                        {ratingMessage}

                                                    </p>

                                                )}

                                            </>

                                        )}

                                    </div>

                                )}


                                {/* =================================================
                                     CONTACT / BOOK
                                     ================================================= */}

                                <Link
                                    to={`/contact?type=${type}&id=${item.id}`}
                                    className="btn btn-success btn-lg me-2"
                                >

                                    Contact / Book

                                </Link>


                                {/* =================================================
                                     BACK
                                     ================================================= */}

                                <Link
                                    to={backPath}
                                    className="btn btn-outline-success"
                                >

                                    {backText}

                                </Link>

                            </div>

                        </div>


                        {/* =================================================
                             LOCATION + INFORMATION
                             ================================================= */}

                        <div className="row g-4 mt-5">


                            <div className="col-md-6">

                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-body p-4">

                                        <h4 className="fw-bold mb-3">

                                            📍 Location

                                        </h4>


                                        <p className="text-muted mb-0">

                                            {item.location}

                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="col-md-6">

                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-body p-4">

                                        <h4 className="fw-bold mb-3">

                                            ℹ️ Information

                                        </h4>


                                        <p className="text-muted mb-0">

                                            {item.description}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                     CALL TO ACTION
                     ================================================= */}

                <section className="bg-success text-white py-5">

                    <div className="container text-center">

                        <h2 className="fw-bold">

                            Ready to Explore Pakistan?

                        </h2>


                        <p className="lead">

                            Contact Karnel Travel Guide and plan your trip today.

                        </p>


                        <Link
                            to="/contact"
                            className="btn btn-light btn-lg"
                        >

                            Contact Us

                        </Link>

                    </div>

                </section>

            </>

        </div>

    );

}

export default ViewDetails;
