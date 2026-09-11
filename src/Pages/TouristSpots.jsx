import API_URL from "../api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/touristspots.css";

function TouristSpots() {

    const navigate = useNavigate();


    // =====================================================
    // API DATA
    // =====================================================

    const [touristSpots, setTouristSpots] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // TOURIST SPOT RATINGS
    // =====================================================

    const [ratings, setRatings] = useState({});


    // =====================================================
    // CHECK ADMIN LOGIN
    // =====================================================

    const adminToken = localStorage.getItem("adminToken");


    // =====================================================
    // GET TOURIST SPOTS
    // =====================================================

    useEffect(() => {

        fetch(`${API_URL}/api/TouristSpots`)

            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch tourist spots"
                    );

                }

                return response.json();

            })

            .then(async (data) => {

                console.log(
                    "Tourist Spots:",
                    data
                );

                setTouristSpots(data);


                // =================================================
                // GET REAL RATING FOR EACH TOURIST SPOT
                // =================================================

                const ratingData = {};

                await Promise.all(

                    data.map(async (spot) => {

                        try {

                            const response =
                                await fetch(
                                    `${API_URL}/api/TouristSpotRatings/${spot.id}`
                                );


                            if (response.ok) {

                                const rating =
                                    await response.json();

                                ratingData[spot.id] = {

                                    averageRating:
                                        rating.averageRating || 0,

                                    totalRatings:
                                        rating.totalRatings || 0

                                };

                            }
                            else {

                                ratingData[spot.id] = {

                                    averageRating: 0,

                                    totalRatings: 0

                                };

                            }

                        }
                        catch (error) {

                            console.error(
                                `Unable to load rating for tourist spot ${spot.id}:`,
                                error
                            );

                            ratingData[spot.id] = {

                                averageRating: 0,

                                totalRatings: 0

                            };

                        }

                    })

                );


                setRatings(ratingData);

                setLoading(false);

            })

            .catch((error) => {

                console.error(
                    "API Error:",
                    error
                );

                setError(
                    "Unable to load tourist spots."
                );

                setLoading(false);

            });

    }, []);


    // =====================================================
    // PAGE
    // =====================================================

    return (
        <>

            {/* =====================================================
                 PAGE BANNER
                 ===================================================== */}

            <section className="page-banner">

                <div className="container">

                    <h2>
                        Tourist Spots
                    </h2>

                    <p>
                        Discover the most beautiful places in Pakistan
                    </p>

                </div>

            </section>


            {/* =====================================================
                 TOURIST SPOTS
                 ===================================================== */}

            <section className="page-section tourist-section">

                <div className="container">


                    {/* =================================================
                         ADMIN MANAGEMENT BUTTON
                         ================================================= */}

                    {adminToken && (

                        <div
                            className="text-end mb-4"
                        >

                            {/* <button
                                onClick={() =>
                                    navigate(
                                        "/manage-tourist-spots"
                                    )
                                }
                                className="btn btn-primary"
                            >
                                Manage Tourist Spots
                            </button> */}

                        </div>

                    )}


                    {/* =================================================
                         SECTION HEADING
                         ================================================= */}

                    <div className="section-heading text-center">

                        <span>
                            EXPLORE PAKISTAN
                        </span>

                        <h2>
                            Popular Tourist Destinations
                        </h2>

                        <p>
                            Explore mountains, valleys, beaches and
                            historical places across Pakistan.
                        </p>

                    </div>


                    {/* =================================================
                         LOADING
                         ================================================= */}

                    {loading && (

                        <div className="text-center">

                            <p>
                                Loading tourist spots...
                            </p>

                        </div>

                    )}


                    {/* =================================================
                         ERROR
                         ================================================= */}

                    {error && (

                        <div className="text-center">

                            <p className="text-danger">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =================================================
                         CARDS
                         ================================================= */}

                    {!loading && !error && (

                        <div className="row g-4">

                            {touristSpots.map((spot) => {

                                const spotRating =
                                    ratings[spot.id];

                                return (

                                    <div
                                        className="col-lg-4 col-md-6"
                                        key={spot.id}
                                    >

                                        <div className="info-card">


                                            {/* ================= IMAGE ================= */}

                                            <div className="card-image">

                                                <img
                                                    src={spot.image}
                                                    alt={spot.name}
                                                />

                                            </div>


                                            {/* ================= CARD BODY ================= */}

                                            <div className="card-body">


                                                {/* Icon */}

                                                <div className="card-icon">

                                                    <i className="bi bi-mountains"></i>

                                                </div>


                                                {/* Name */}

                                                <h4>
                                                    {spot.name}
                                                </h4>


                                                {/* Location */}

                                                <p>

                                                    <strong>
                                                        Location:
                                                    </strong>

                                                    {" "}

                                                    {spot.location}

                                                </p>


                                                {/* Description */}

                                                <p>
                                                    {spot.description}
                                                </p>


                                                {/* =================================================
                                                     REAL RATING
                                                     ================================================= */}

                                                <div className="tourist-rating">

                                                    <strong>
                                                        Rating:
                                                    </strong>

                                                    {" "}

                                                    {spotRating &&
                                                    spotRating.averageRating > 0 ? (

                                                        <>
                                                            <span>
                                                                ⭐{" "}
                                                                {spotRating.averageRating.toFixed(1)}
                                                            </span>

                                                            <small className="text-muted ms-2">
                                                                (
                                                                {spotRating.totalRatings}{" "}
                                                                {spotRating.totalRatings === 1
                                                                    ? "rating"
                                                                    : "ratings"
                                                                }
                                                                )
                                                            </small>
                                                        </>

                                                    ) : (

                                                        <span className="text-muted">
                                                            No rating yet
                                                        </span>

                                                    )}

                                                </div>


                                                {/* =================================================
                                                     VIEW DETAILS
                                                     IMPORTANT:
                                                     type MUST be "touristspot"
                                                     ================================================= */}

                                                <Link
                                                    to={`/view-details?type=touristspot&id=${spot.id}`}
                                                    className="read-more"
                                                >
                                                    View Details →
                                                </Link>

                                            </div>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    )}


                    {/* =================================================
                         NO DATA
                         ================================================= */}

                    {!loading &&
                        !error &&
                        touristSpots.length === 0 && (

                            <div className="text-center">

                                <p>
                                    No tourist spots found.
                                </p>

                            </div>

                        )}

                </div>

            </section>


            {/* =====================================================
                 COPYRIGHT
                 ===================================================== */}

            <div className="copyright">

                <div className="container text-center">

                    <p>
                        © 2026 Karnel Travel Guide.
                        All Rights Reserved.
                    </p>

                </div>

            </div>

        </>
    );
}

export default TouristSpots;
