import API_URL from "../api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/restaurant.css";

function Restaurants() {

    // =====================================================
    // API DATA
    // =====================================================

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // RESTAURANT IMAGES
    // =====================================================

    const restaurantImages = {

        // Skardu Restaurant
        8: "/images/skardu-restaurant.jpg",

        // Monal
        9: "/images/islamabad-restaurant.jpg",

        // Tuscany Courtyard
        10: "/images/tuscany-restaurant.jpg",

        // Spice Bazaar
        11: "/images/spice-bazar-restaurant.jpg",

        // Haveli Restaurant
        12: "/images/haveli-restaurant.jpg",

        // LalQila Restaurant
        13: "/images/lalqila-restaurant.jpg"
    };


    // =====================================================
    // FETCH RESTAURANTS
    // =====================================================

    useEffect(() => {

        fetch(`${API_URL}/api/Restaurants`)
            .then((response) => {

                if (!response.ok) {
                    throw new Error("Failed to fetch restaurants");
                }

                return response.json();
            })
            .then((data) => {

                console.log("Restaurants:", data);

                setRestaurants(data);
                setLoading(false);
            })
            .catch((error) => {

                console.error("API Error:", error);

                setError("Unable to load restaurants.");
                setLoading(false);
            });

    }, []);


    // =====================================================
    // GET RESTAURANT IMAGE
    // =====================================================

    const getImageUrl = (restaurant) => {

        // First use our local image mapping
        if (restaurantImages[restaurant.id]) {
            return restaurantImages[restaurant.id];
        }


        // If there is no ID mapping, try database image
        if (restaurant.image) {

            let image = restaurant.image
                .trim()
                .replace(/\\/g, "/");


            // Old localhost upload URL
            if (image.includes("/uploads/restaurants/")) {

                const fileName =
                    image.substring(
                        image.lastIndexOf("/") + 1
                    );

                return `/images/${fileName}`;
            }


            // Already a frontend image
            if (image.startsWith("/images/")) {
                return image;
            }


            // Absolute URL
            if (
                image.startsWith("http://") ||
                image.startsWith("https://")
            ) {
                return image;
            }


            // Other path
            if (image.startsWith("/")) {
                return image;
            }


            return `/images/${image}`;
        }


        // Default
        return "/images/restaurant-placeholder.jpg";
    };


    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = (e) => {

        console.error(
            "Restaurant image failed:",
            e.currentTarget.src
        );

        e.currentTarget.onerror = null;

        e.currentTarget.src =
            "/images/restaurant-placeholder.jpg";
    };


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
                        Restaurants in Pakistan
                    </h2>

                    <p>
                        Explore delicious food across Pakistan
                    </p>

                </div>

            </section>


            <br />
            <br />


            {/* =====================================================
                RESTAURANT SECTION
            ===================================================== */}

            <section className="page-section">

                <div className="container">

                    {/* =================================================
                        HEADING
                    ================================================= */}

                    <div className="section-heading text-center">

                        <span>
                            RESTAURANT INFORMATION
                        </span>

                        <h2>
                            Popular Restaurants
                        </h2>

                        <p>
                            Explore restaurants serving Pakistani
                            and international cuisines.
                        </p>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="text-center">

                            <p>
                                Loading restaurants...
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
                        RESTAURANTS
                    ================================================= */}

                    {!loading && !error && (

                        <div className="row g-4">

                            {restaurants.map((restaurant) => (

                                <div
                                    className="col-lg-4 col-md-6"
                                    key={restaurant.id}
                                >

                                    <div className="info-card">

                                        {/* =================================
                                            IMAGE
                                        ================================= */}

                                        <div className="card-image">

                                            <img
                                                src={getImageUrl(
                                                    restaurant
                                                )}
                                                alt={
                                                    restaurant.name ||
                                                    "Restaurant"
                                                }
                                                onError={
                                                    handleImageError
                                                }
                                            />

                                        </div>


                                        {/* =================================
                                            CARD BODY
                                        ================================= */}

                                        <div className="card-body">

                                            {/* =============================
                                                ICON
                                            ============================= */}

                                            <div className="card-icon">

                                                <i className="bi bi-cup-hot-fill"></i>

                                            </div>


                                            {/* =============================
                                                NAME
                                            ============================= */}

                                            <h4>
                                                {restaurant.name}
                                            </h4>


                                            {/* =============================
                                                DETAILS
                                            ============================= */}

                                            <p>

                                                <strong>
                                                    Location:
                                                </strong>{" "}

                                                {restaurant.location}

                                                <br />

                                                <strong>
                                                    Cuisine:
                                                </strong>{" "}

                                                {restaurant.cuisine || "-"}

                                                <br />

                                                <strong>
                                                    Price:
                                                </strong>{" "}

                                                {restaurant.price || "-"}

                                            </p>


                                            {/* =============================
                                                RATING
                                            ============================= */}

                                            {restaurant.rating !== null &&
                                                restaurant.rating !== undefined && (

                                                    <p>

                                                        <strong>
                                                            Rating:
                                                        </strong>{" "}

                                                        {restaurant.rating}

                                                    </p>

                                                )}


                                            {/* =============================
                                                DESCRIPTION
                                            ============================= */}

                                            <p>
                                                {restaurant.description}
                                            </p>


                                            {/* =============================
                                                VIEW DETAILS
                                            ============================= */}

                                            <Link
                                                to={`/view-details?type=restaurant&id=${restaurant.id}`}
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
                        NO RESTAURANTS
                    ================================================= */}

                    {!loading &&
                        !error &&
                        restaurants.length === 0 && (

                            <div className="text-center">

                                <p>
                                    No restaurants found.
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

export default Restaurants;
