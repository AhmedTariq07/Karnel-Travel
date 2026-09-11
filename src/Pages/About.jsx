import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";

function About() {
    return (
        <>
            {/* =====================================================
                 NAVBAR
                 ===================================================== */}

            


            {/* =====================================================
                 ABOUT HERO
                 ===================================================== */}

            <section className="about-hero">

                <div className="about-hero-overlay"></div>

                <div className="container">

                    <div className="about-hero-content">

                        <span className="about-label">

                            <i className="bi bi-airplane-fill"></i>

                            ABOUT KARNEL

                        </span>


                        <h1>
                            Discover Pakistan{" "}
                            <span>With Us.</span>
                        </h1>


                        <p>
                            Your trusted travel guide for discovering
                            the most beautiful destinations, hotels,
                            restaurants and resorts across Pakistan.
                        </p>

                    </div>

                </div>

            </section>



            {/* =====================================================
                 INTRODUCTION
                 ===================================================== */}

            <section className="about-intro">

                <div className="container">

                    <div className="row align-items-center g-5">


                        {/* =================================================
                             LEFT CONTENT
                             ================================================= */}

                        <div className="col-lg-6">

                            <div className="about-content">

                                <span className="about-section-label">
                                    WHO WE ARE
                                </span>


                                <h2>
                                    Your Journey{" "}
                                    <strong>Starts Here.</strong>
                                </h2>


                                <p>
                                    Karnel Travel Guide is a Tours and
                                    Travels company providing information
                                    and travel services for destinations
                                    throughout Pakistan.
                                </p>


                                <p>
                                    Our goal is to make travelling easier
                                    by providing useful information about
                                    tourist attractions, transportation,
                                    hotels, restaurants and resorts.
                                </p>


                                <p>
                                    From the mountains of Hunza and Skardu
                                    to the beaches of Gwadar and the
                                    historical cities of Lahore and Taxila,
                                    we help travellers discover the beauty
                                    of Pakistan.
                                </p>


                                {/* Highlights */}

                                <div className="about-highlights">


                                    <div className="highlight-item">

                                        <div className="highlight-icon">

                                            <i className="bi bi-geo-alt-fill"></i>

                                        </div>


                                        <div>

                                            <strong>
                                                Explore Pakistan
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="highlight-item">

                                        <div className="highlight-icon">

                                            <i className="bi bi-building"></i>

                                        </div>


                                        <div>

                                            <strong>
                                                Find Best Hotels
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="highlight-item">

                                        <div className="highlight-icon">

                                            <i className="bi bi-cup-hot-fill"></i>

                                        </div>


                                        <div>

                                            <strong>
                                                Discover Restaurants
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="highlight-item">

                                        <div className="highlight-icon">

                                            <i className="bi bi-house-heart-fill"></i>

                                        </div>


                                        <div>

                                            <strong>
                                                Find Resorts
                                            </strong>

                                        </div>

                                    </div>


                                </div>

                            </div>

                        </div>



                        {/* =================================================
                             RIGHT CONTENT
                             ================================================= */}

                        <div className="col-lg-6">

                            <div className="about-image">

                                <img
                                    src="images/faisal-mosque.jpg"
                                    alt="Pakistan Travel"
                                    className="img-fluid"
                                />

                            </div>

                        </div>


                    </div>

                </div>

            </section>



            {/* =====================================================
                 WHY CHOOSE US
                 ===================================================== */}

            <section className="why-section">

                <div className="container">


                    <div className="section-heading text-center">

                        <span>
                            WHY CHOOSE US
                        </span>

                        <h2>
                            Everything You Need To Travel
                        </h2>

                        <p>
                            We make discovering Pakistan easier,
                            simpler and more enjoyable.
                        </p>

                    </div>



                    <div className="row g-4">


                        {/* Feature 01 */}

                        <div className="col-lg-3 col-md-6">

                            <div className="feature-box">

                                <div className="feature-number">
                                    01
                                </div>

                                <i className="bi bi-search"></i>

                                <h4>
                                    Easy Search
                                </h4>

                                <p>
                                    Quickly find destinations,
                                    hotels, restaurants and resorts.
                                </p>

                            </div>

                        </div>



                        {/* Feature 02 */}

                        <div className="col-lg-3 col-md-6">

                            <div className="feature-box">

                                <div className="feature-number">
                                    02
                                </div>

                                <i className="bi bi-geo-alt"></i>

                                <h4>
                                    Explore Destinations
                                </h4>

                                <p>
                                    Discover beautiful places
                                    throughout Pakistan.
                                </p>

                            </div>

                        </div>



                        {/* Feature 03 */}

                        <div className="col-lg-3 col-md-6">

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

                        </div>



                        {/* Feature 04 */}

                        <div className="col-lg-3 col-md-6">

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

        </>
    );
}

export default About;
