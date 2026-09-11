import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";

function Home() {

    const navigate = useNavigate();

    // =====================================================
    // SEARCH FORM
    // =====================================================

    const [destination, setDestination] = useState("");
    const [category, setCategory] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (destination && destination !== "Choose destination") {
            params.set("destination", destination);
        }

        if (category && category !== "What are you looking for?") {
            params.set("type", category);
        }

        const query = params.toString();

        navigate(query ? `/search?${query}` : "/search");
    };


    return (
        <div className="home-page">

            {/* =====================================================
                 HERO
                 ===================================================== */}

            <section className="modern-hero">

                <div className="hero-overlay"></div>

                <div className="container hero-container">

                    <div className="row align-items-center">

                        <div className="col-lg-7">

                            <div className="hero-text">

                                <div className="hero-label">
                                    <i className="bi bi-geo-alt-fill"></i>
                                    DISCOVER PAKISTAN
                                </div>

                                <h1>
                                    Your Journey
                                    <br />
                                    <span>Starts Here.</span>
                                </h1>

                                <p>
                                    Discover breathtaking mountains, peaceful
                                    valleys, historic cities and beautiful
                                    coastal destinations across Pakistan.
                                </p>

                                <div className="hero-buttons">

                                    <Link
                                        to="/tourist-spots"
                                        className="hero-primary-btn"
                                    >
                                        Explore Destinations
                                        <i className="bi bi-arrow-right"></i>
                                    </Link>

                                    <Link
                                        to="/search"
                                        className="hero-secondary-btn"
                                    >
                                        <i className="bi bi-search"></i>
                                        Search
                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* =====================================================
                             HERO SEARCH
                             ===================================================== */}

                        <div className="col-lg-5">

                            <div className="hero-search-card">

                                <div className="search-title">

                                    <div className="search-icon">
                                        <i className="bi bi-search"></i>
                                    </div>

                                    <div>
                                        <h4>
                                            Find Your Destination
                                        </h4>

                                        <p>
                                            Where would you like to go?
                                        </p>
                                    </div>

                                </div>


                                <form onSubmit={handleSearch}>

                                    {/* Destination */}

                                    <div className="search-field">

                                        <i className="bi bi-geo-alt"></i>

                                        <select
                                            className="form-select"
                                            value={destination}
                                            onChange={(e) =>
                                                setDestination(e.target.value)
                                            }
                                        >

                                            <option value="">
                                                Choose destination
                                            </option>

                                            <option value="Hunza">
                                                Hunza
                                            </option>

                                            <option value="Skardu">
                                                Skardu
                                            </option>

                                            <option value="Swat">
                                                Swat
                                            </option>

                                            <option value="Naran Kaghan">
                                                Naran Kaghan
                                            </option>

                                            <option value="Murree">
                                                Murree
                                            </option>

                                            <option value="Lahore">
                                                Lahore
                                            </option>

                                            <option value="Karachi">
                                                Karachi
                                            </option>

                                            <option value="Gwadar">
                                                Gwadar
                                            </option>

                                        </select>

                                    </div>


                                    {/* Category */}

                                    <div className="search-field">

                                        <i className="bi bi-grid"></i>

                                        <select
                                            className="form-select"
                                            value={category}
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                        >

                                            <option value="">
                                                What are you looking for?
                                            </option>

                                            <option value="Tourist Spots">
                                                Tourist Spots
                                            </option>

                                            <option value="Hotels">
                                                Hotels
                                            </option>

                                            <option value="Restaurants">
                                                Restaurants
                                            </option>

                                            <option value="Resorts">
                                                Resorts
                                            </option>

                                        </select>

                                    </div>


                                    <button
                                        type="submit"
                                        className="hero-search-btn"
                                    >
                                        Search Now
                                        <i className="bi bi-arrow-right"></i>
                                    </button>

                                </form>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                         HERO STATISTICS
                         ===================================================== */}

                    <div className="hero-stat-row">

                        <div className="hero-stat">
                            <strong>50+</strong>
                            <span>Destinations</span>
                        </div>

                        <div className="hero-stat">
                            <strong>100+</strong>
                            <span>Hotels</span>
                        </div>

                        <div className="hero-stat">
                            <strong>50+</strong>
                            <span>Restaurants</span>
                        </div>

                        <div className="hero-stat">
                            <strong>25+</strong>
                            <span>Resorts</span>
                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                 POPULAR DESTINATIONS
                 ===================================================== */}

            <section className="popular-section">

                <div className="container">

                    <div className="section-heading-modern">

                        <div>

                            <span>
                                EXPLORE PAKISTAN
                            </span>

                            <h2>
                                Popular Destinations
                            </h2>

                        </div>


                        <Link
                            to="/tourist-spots"
                            className="view-all-link"
                        >
                            View All
                            <i className="bi bi-arrow-right"></i>
                        </Link>

                    </div>


                    <div className="row g-4">


                        {/* =====================================================
                             HUNZA
                             ===================================================== */}

                        <div className="col-lg-4 col-md-6">

                            <Link
                                to="/tourist-spots"
                                className="destination-modern"
                            >

                                <img
                                    src="/images/hunza.jpg"
                                    alt="Hunza Valley"
                                />

                                <div className="destination-gradient"></div>

                                <div className="rating-pill">
                                    <i className="bi bi-star-fill"></i>
                                    4.9
                                </div>

                                <div className="destination-info">

                                    <small>
                                        <i className="bi bi-geo-alt-fill"></i>
                                        Gilgit-Baltistan
                                    </small>

                                    <h3>
                                        Hunza Valley
                                    </h3>

                                    <p>
                                        Mountains, valleys and unforgettable
                                        natural beauty.
                                    </p>

                                    <span className="destination-link">
                                        Explore
                                        <i className="bi bi-arrow-right"></i>
                                    </span>

                                </div>

                            </Link>

                        </div>


                        {/* =====================================================
                             SKARDU
                             ===================================================== */}

                        <div className="col-lg-4 col-md-6">

                            <Link
                                to="/tourist-spots"
                                className="destination-modern"
                            >

                                <img
                                    src="/images/skardu.jpg"
                                    alt="Skardu"
                                />

                                <div className="destination-gradient"></div>

                                <div className="rating-pill">
                                    <i className="bi bi-star-fill"></i>
                                    4.8
                                </div>

                                <div className="destination-info">

                                    <small>
                                        <i className="bi bi-geo-alt-fill"></i>
                                        Gilgit-Baltistan
                                    </small>

                                    <h3>
                                        Skardu
                                    </h3>

                                    <p>
                                        Lakes, mountains and breathtaking
                                        landscapes.
                                    </p>

                                    <span className="destination-link">
                                        Explore
                                        <i className="bi bi-arrow-right"></i>
                                    </span>

                                </div>

                            </Link>

                        </div>


                        {/* =====================================================
                             SWAT
                             ===================================================== */}

                        <div className="col-lg-4 col-md-6">

                            <Link
                                to="/tourist-spots"
                                className="destination-modern"
                            >

                                <img
                                    src="/images/swat.jpg"
                                    alt="Swat Valley"
                                />

                                <div className="destination-gradient"></div>

                                <div className="rating-pill">
                                    <i className="bi bi-star-fill"></i>
                                    4.7
                                </div>

                                <div className="destination-info">

                                    <small>
                                        <i className="bi bi-geo-alt-fill"></i>
                                        Khyber Pakhtunkhwa
                                    </small>

                                    <h3>
                                        Swat Valley
                                    </h3>

                                    <p>
                                        Green valleys, rivers and peaceful
                                        mountain scenery.
                                    </p>

                                    <span className="destination-link">
                                        Explore
                                        <i className="bi bi-arrow-right"></i>
                                    </span>

                                </div>

                            </Link>

                        </div>


                        {/* =====================================================
                             MURREE
                             ===================================================== */}

                        <div className="col-lg-6 col-md-6">

                            <Link
                                to="/tourist-spots"
                                className="destination-modern destination-wide"
                            >

                                <img
                                    src="/images/murree.jpg"
                                    alt="Murree"
                                />

                                <div className="destination-gradient"></div>

                                <div className="rating-pill">
                                    <i className="bi bi-star-fill"></i>
                                    4.6
                                </div>

                                <div className="destination-info">

                                    <small>
                                        <i className="bi bi-geo-alt-fill"></i>
                                        Punjab
                                    </small>

                                    <h3>
                                        Murree
                                    </h3>

                                    <p>
                                        A beautiful hill station famous for
                                        its cool weather and scenic views.
                                    </p>

                                    <span className="destination-link">
                                        Explore
                                        <i className="bi bi-arrow-right"></i>
                                    </span>

                                </div>

                            </Link>

                        </div>


                        {/* =====================================================
                             GWADAR
                             ===================================================== */}

                        <div className="col-lg-6 col-md-6">

                            <Link
                                to="/tourist-spots"
                                className="destination-modern destination-wide"
                            >

                                <img
                                    src="/images/gwadar.jpg"
                                    alt="Gwadar"
                                />

                                <div className="destination-gradient"></div>

                                <div className="rating-pill">
                                    <i className="bi bi-star-fill"></i>
                                    4.7
                                </div>

                                <div className="destination-info">

                                    <small>
                                        <i className="bi bi-geo-alt-fill"></i>
                                        Balochistan
                                    </small>

                                    <h3>
                                        Gwadar
                                    </h3>

                                    <p>
                                        Discover beautiful beaches and the
                                        stunning Makran coastline.
                                    </p>

                                    <span className="destination-link">
                                        Explore
                                        <i className="bi bi-arrow-right"></i>
                                    </span>

                                </div>

                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                 SERVICES
                 ===================================================== */}

            <section className="services-modern">

                <div className="container">

                    <div className="section-heading-modern">

                        <div>

                            <span>
                                TRAVEL WITH CONFIDENCE
                            </span>

                            <h2>
                                Everything You Need
                            </h2>

                        </div>

                    </div>


                    <div className="row g-4">


                        {/* =====================================================
                             HOTELS
                             ===================================================== */}

                        <div className="col-lg-4 col-md-6">

                            <div className="service-modern">

                                <div className="service-image">

                                    <img
                                        src="/images/lahore-hotel.jpg"
                                        alt="Hotels"
                                    />

                                    <div className="service-icon">
                                        <i className="bi bi-building"></i>
                                    </div>

                                </div>


                                <div className="service-body">

                                    <div className="service-top">

                                        <span>
                                            STAY
                                        </span>

                                        <i className="bi bi-arrow-up-right"></i>

                                    </div>

                                    <h3>
                                        Hotels
                                    </h3>

                                    <p>
                                        Find comfortable hotels in
                                        your favorite destinations.
                                    </p>

                                    <Link to="/hotels">
                                        Find Hotels
                                        <i className="bi bi-arrow-right"></i>
                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* =====================================================
                             RESTAURANTS
                             ===================================================== */}

                        <div className="col-lg-4 col-md-6">

                            <div className="service-modern">

                                <div className="service-image">

                                    <img
                                        src="/images/karachi-restaurant.jpg"
                                        alt="Restaurants"
                                    />

                                    <div className="service-icon">
                                        <i className="bi bi-cup-hot"></i>
                                    </div>

                                </div>


                                <div className="service-body">

                                    <div className="service-top">

                                        <span>
                                            FOOD
                                        </span>

                                        <i className="bi bi-arrow-up-right"></i>

                                    </div>

                                    <h3>
                                        Restaurants
                                    </h3>

                                    <p>
                                        Discover popular restaurants and
                                        delicious local cuisine.
                                    </p>

                                    <Link to="/restaurants">
                                        Find Restaurants
                                        <i className="bi bi-arrow-right"></i>
                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* =====================================================
                             RESORTS
                             ===================================================== */}

                        <div className="col-lg-4 col-md-6">

                            <div className="service-modern">

                                <div className="service-image">

                                    <img
                                        src="/images/swat-resort.jpg"
                                        alt="Resorts"
                                    />

                                    <div className="service-icon">
                                        <i className="bi bi-house-heart"></i>
                                    </div>

                                </div>


                                <div className="service-body">

                                    <div className="service-top">

                                        <span>
                                            RELAX
                                        </span>

                                        <i className="bi bi-arrow-up-right"></i>

                                    </div>

                                    <h3>
                                        Resorts
                                    </h3>

                                    <p>
                                        Relax and enjoy beautiful resorts
                                        surrounded by nature.
                                    </p>

                                    <Link to="/resorts">
                                        Find Resorts
                                        <i className="bi bi-arrow-right"></i>
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                 WHY CHOOSE US
                 ===================================================== */}

            <section className="why-modern">

                <div className="container">

                    <div className="row align-items-center g-5">

                        <div className="col-lg-5">

                            <span className="section-label">
                                WHY KARNEL?
                            </span>

                            <h2>
                                Make Your Pakistan
                                <span>Trip Unforgettable.</span>
                            </h2>

                            <p>
                                From choosing a destination to finding
                                hotels, restaurants and resorts, Karnel
                                Travel Guide brings everything together
                                in one place.
                            </p>

                            <Link
                                to="/about"
                                className="dark-btn"
                            >
                                Learn More
                                <i className="bi bi-arrow-right"></i>
                            </Link>

                        </div>


                        <div className="col-lg-7">

                            <div className="feature-grid">

                                <div className="feature-box">

                                    <div className="feature-number">
                                        01
                                    </div>

                                    <i className="bi bi-map"></i>

                                    <h4>
                                        Discover Places
                                    </h4>

                                    <p>
                                        Explore famous and hidden
                                        destinations across Pakistan.
                                    </p>

                                </div>


                                <div className="feature-box">

                                    <div className="feature-number">
                                        02
                                    </div>

                                    <i className="bi bi-search"></i>

                                    <h4>
                                        Easy Search
                                    </h4>

                                    <p>
                                        Quickly find the right place
                                        for your trip.
                                    </p>

                                </div>


                                <div className="feature-box">

                                    <div className="feature-number">
                                        03
                                    </div>

                                    <i className="bi bi-star"></i>

                                    <h4>
                                        Compare Options
                                    </h4>

                                    <p>
                                        Check ratings, locations and
                                        available facilities.
                                    </p>

                                </div>


                                <div className="feature-box">

                                    <div className="feature-number">
                                        04
                                    </div>

                                    <i className="bi bi-headset"></i>

                                    <h4>
                                        Travel Support
                                    </h4>

                                    <p>
                                        Get useful information before
                                        starting your journey.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                 CTA
                 ===================================================== */}

            <section className="travel-cta">

                <div className="container">

                    <div className="cta-box">

                        <div>

                            <span>
                                READY FOR YOUR NEXT ADVENTURE?
                            </span>

                            <h2>
                                Pakistan Is Waiting For You.
                            </h2>

                            <p>
                                Start exploring beautiful destinations today.
                            </p>

                        </div>


                        <Link
                            to="/search"
                            className="cta-button"
                        >
                            Start Exploring
                            <i className="bi bi-arrow-right"></i>
                        </Link>

                    </div>

                </div>

            </section>


            {/* =====================================================
                 FOOTER
                 ===================================================== */}

            <footer className="footer">

                <div className="container">

                    <div className="row g-4">


                        {/* =====================================================
                             FOOTER ABOUT
                             ===================================================== */}

                        <div className="col-lg-4">

                            <h3 className="footer-title">
                                Karnel
                                <span>Travel Guide</span>
                            </h3>

                            <p>
                                Discover beautiful destinations,
                                hotels, restaurants and resorts
                                across Pakistan.
                            </p>

                        </div>


                        {/* =====================================================
                             QUICK LINKS
                             ===================================================== */}

                        <div className="col-lg-2">

                            <h5>
                                Quick Links
                            </h5>

                            <Link to="/">
                                Home
                            </Link>

                            <Link to="/about">
                                About Us
                            </Link>

                            <Link to="/search">
                                Search
                            </Link>

                            <Link to="/contact">
                                Contact
                            </Link>

                        </div>


                        {/* =====================================================
                             EXPLORE
                             ===================================================== */}

                        <div className="col-lg-3">

                            <h5>
                                Explore
                            </h5>

                            <Link to="/tourist-spots">
                                Tourist Spots
                            </Link>

                            <Link to="/hotels">
                                Hotels
                            </Link>

                            <Link to="/restaurants">
                                Restaurants
                            </Link>

                            <Link to="/resorts">
                                Resorts
                            </Link>

                        </div>


                        {/* =====================================================
                             CONTACT
                             ===================================================== */}

                        <div className="col-lg-3">

                            <h5>
                                Contact
                            </h5>

                            <p>
                                <i className="bi bi-telephone"></i>
                                +92 300 1234567
                            </p>

                            <p>
                                <i className="bi bi-envelope"></i>
                                info@karneltravelguide.com
                            </p>

                            <p>
                                <i className="bi bi-geo-alt"></i>
                                Pakistan
                            </p>

                        </div>

                    </div>


                    <hr />


                    <div className="text-center">

                        <p className="copyright-text">
                            © 2026 Karnel Travel Guide.
                            All Rights Reserved.
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}

export default Home;