import API_URL from "../api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/restaurant.css";

function Resorts() {

    // =====================================================
    // API DATA
    // =====================================================

    const [resorts, setResorts] = useState([]);
    const [ratings, setRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        image = image.trim();

        // If API already returns a complete URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Images stored in React public/images
        if (!image.startsWith("/")) {
            return `/${image}`;
        }

        return image;
    };


    // =====================================================
    // GET RESORTS FROM ASP.NET CORE API
    // =====================================================

    useEffect(() => {

        fetch(`${API_URL}/api/Resorts`)

            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch resorts"
                    );

                }

                return response.json();

            })

            .then(async (data) => {

                console.log("Resorts:", data);

                setResorts(data);

                // =============================================
                // GET RATINGS
                // =============================================

                const ratingData = {};

                await Promise.all(

                    data.map(async (resort) => {

                        try {

                            const response = await fetch(
                                `${API_URL}/api/ResortRatings/${resort.id}`
                            );

                            if (!response.ok) {
                                return;
                            }

                            const result =
                                await response.json();

                            ratingData[resort.id] = {

                                averageRating:
                                    result.averageRating,

                                totalRatings:
                                    result.totalRatings,

                            };

                        }
                        catch (error) {

                            console.error(
                                `Rating Error for Resort ${resort.id}:`,
                                error
                            );

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
                    "Unable to load resorts."
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
                        Resorts in Pakistan
                    </h2>

                    <p>
                        Relax and enjoy beautiful resorts in Pakistan
                    </p>

                </div>

            </section>


            {/* =====================================================
                RESORTS
            ===================================================== */}

            <section className="page-section">

                <div className="container">


                    {/* =================================================
                        SECTION HEADING
                    ================================================= */}

                    <div className="section-heading text-center">

                        <span>
                            RESORT INFORMATION
                        </span>

                        <h2>
                            Popular Resorts
                        </h2>

                        <p>
                            Find peaceful resorts for your next holiday.
                        </p>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="text-center">

                            <p>
                                Loading resorts...
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
                        RESORT CARDS
                    ================================================= */}

                    {!loading && !error && (

                        <div className="row g-4">

                            {resorts.map((resort) => (

                                <div
                                    className="col-lg-4 col-md-6"
                                    key={resort.id}
                                >

                                    <div className="info-card">


                                        {/* ================= IMAGE ================= */}

                                        <div className="card-image">

                                            {resort.image ? (

                                                <img
                                                    src={getImageUrl(
                                                        resort.image
                                                    )}
                                                    alt={
                                                        resort.name ||
                                                        "Resort"
                                                    }
                                                    onError={(e) => {

                                                        console.error(
                                                            "Resort image failed:",
                                                            resort.image,
                                                            "URL:",
                                                            e.currentTarget.src
                                                        );

                                                    }}
                                                />

                                            ) : (

                                                <span>
                                                    No Image
                                                </span>

                                            )}

                                        </div>


                                        {/* ================= CARD BODY ================= */}

                                        <div className="card-body">


                                            {/* ================= ICON ================= */}

                                            <div className="card-icon">

                                                <i className="bi bi-house-heart-fill"></i>

                                            </div>


                                            {/* ================= NAME ================= */}

                                            <h4>
                                                {resort.name}
                                            </h4>


                                            {/* ================= INFORMATION ================= */}

                                            <p>

                                                <strong>
                                                    Location:
                                                </strong>

                                                {" "}

                                                {resort.location || "-"}

                                                <br />


                                                <strong>
                                                    Price:
                                                </strong>

                                                {" "}

                                                {resort.price || "-"}

                                                <br />


                                                <strong>
                                                    Rating:
                                                </strong>

                                                {" "}


                                                {ratings[resort.id] &&
                                                ratings[resort.id]
                                                    .totalRatings > 0 ? (

                                                    <>

                                                        ⭐{" "}

                                                        {
                                                            ratings[
                                                                resort.id
                                                            ]
                                                                .averageRating
                                                        }

                                                        {" "}

                                                        (

                                                        {
                                                            ratings[
                                                                resort.id
                                                            ]
                                                                .totalRatings
                                                        }

                                                        {" "}

                                                        {
                                                            ratings[
                                                                resort.id
                                                            ]
                                                                .totalRatings ===
                                                            1
                                                                ? "rating"
                                                                : "ratings"
                                                        }

                                                        )

                                                    </>

                                                ) : (

                                                    "No rating yet"

                                                )}

                                            </p>


                                            {/* ================= DESCRIPTION ================= */}

                                            {resort.description && (

                                                <p>
                                                    {resort.description}
                                                </p>

                                            )}


                                            {/* ================= VIEW DETAILS ================= */}

                                            <Link
                                                to={`/view-details?type=resort&id=${resort.id}`}
                                                className="read-more"
                                            >
                                                View Details →
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}


                    {/* =================================================
                        NO DATA
                    ================================================= */}

                    {!loading &&
                        !error &&
                        resorts.length === 0 && (

                            <div className="text-center">

                                <p>
                                    No resorts found.
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

export default Resorts;
