import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/restaurant.css";

function Hotels() {

    // =====================================================
    // API DATA
    // =====================================================

    const [hotels, setHotels] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        // Remove accidental spaces
        image = image.trim();

        // If API already returns a complete URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Images are stored inside:
        // React public/images
        //
        // Examples:
        //
        // hotel.jpg
        //      -> /hotel.jpg
        //
        // /images/hotel.jpg
        //      -> /images/hotel.jpg
        //
        // images/hotel.jpg
        //      -> /images/hotel.jpg

        if (image.startsWith("/images/")) {
            return image;
        }

        if (image.startsWith("images/")) {
            return `/${image}`;
        }

        // If database only contains:
        // hotel.jpg
        //
        // and the actual file is:
        // public/images/hotel.jpg

        return `/images/${image.replace(/^\/+/, "")}`;
    };


    // =====================================================
    // GET HOTELS FROM ASP.NET CORE API
    // =====================================================

    useEffect(() => {

        fetch("http://localhost:5014/api/Hotels")

            .then((response) => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch hotels"
                    );

                }

                return response.json();

            })

            .then((data) => {

                console.log("Hotels:", data);

                setHotels(data);

                setLoading(false);

            })

            .catch((error) => {

                console.error("API Error:", error);

                setError(
                    "Unable to load hotels."
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
                        Hotels in Pakistan
                    </h2>

                    <p>
                        Find comfortable accommodation for your journey
                    </p>

                </div>

            </section>


            {/* =====================================================
                 HOTELS
                 ===================================================== */}

            <section className="page-section">

                <div className="container">


                    {/* =================================================
                         SECTION HEADING
                         ================================================= */}

                    <div className="section-heading text-center">

                        <span>
                            HOTEL INFORMATION
                        </span>

                        <h2>
                            Featured Hotels
                        </h2>

                        <p>
                            Choose accommodation according to
                            your location and budget.
                        </p>

                    </div>


                    {/* =================================================
                         LOADING
                         ================================================= */}

                    {loading && (

                        <div className="text-center">

                            <p>
                                Loading hotels...
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
                         HOTEL CARDS
                         ================================================= */}

                    {!loading && !error && (

                        <div className="row g-4">

                            {hotels.map((hotel) => (

                                <div
                                    className="col-lg-4 col-md-6"
                                    key={hotel.id}
                                >

                                    <div className="info-card">


                                        {/* ================= IMAGE ================= */}

                                        <div className="card-image">

                                            {hotel.image ? (

                                                <img
                                                    src={getImageUrl(
                                                        hotel.image
                                                    )}
                                                    alt={hotel.name}
                                                    onError={(e) => {

                                                        console.error(
                                                            "Hotel image failed:",
                                                            hotel.image,
                                                            "Final URL:",
                                                            e.currentTarget.src
                                                        );

                                                        // Prevent infinite error loop
                                                        e.currentTarget.onerror = null;

                                                        // Fallback image
                                                        e.currentTarget.src =
                                                            "/images/hotel-placeholder.jpg";

                                                    }}
                                                />

                                            ) : (

                                                <img
                                                    src="/images/hotel-placeholder.jpg"
                                                    alt="No hotel image"
                                                />

                                            )}

                                        </div>


                                        {/* ================= CARD BODY ================= */}

                                        <div className="card-body">

                                            <div className="card-icon">

                                                <i className="bi bi-building-fill"></i>

                                            </div>


                                            {/* Hotel Name */}

                                            <h4>
                                                {hotel.name}
                                            </h4>


                                            {/* Hotel Information */}

                                            <p>

                                                <strong>
                                                    Location:
                                                </strong>

                                                {" "}

                                                {hotel.location || "-"}

                                                <br />

                                                <strong>
                                                    Price:
                                                </strong>

                                                {" "}

                                                {hotel.price || "-"}

                                                <br />

                                                <strong>
                                                    Rating:
                                                </strong>

                                                {" "}

                                                {hotel.rating || "No rating"}

                                            </p>


                                            {/* Description */}

                                            {hotel.description && (

                                                <p>
                                                    {hotel.description}
                                                </p>

                                            )}


                                            {/* View Details */}

                                            <Link
                                                to={`/view-details?type=hotel&id=${hotel.id}`}
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
                        hotels.length === 0 && (

                            <div className="text-center">

                                <p>
                                    No hotels found.
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

export default Hotels;
