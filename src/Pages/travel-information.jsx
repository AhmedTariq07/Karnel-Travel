import React from "react";

import "../css/travelInformation.css";

function TravelInformation() {
    return (
        <>
            {/* =====================================================
                 PAGE BANNER
                 ===================================================== */}

            <section className="travel-page-banner">

                <div className="container">

                    <h2>
                        Travel Information
                    </h2>

                    <p>
                        Explore the best transportation options available
                        across Pakistan
                    </p>

                </div>

            </section>


            {/* =====================================================
                 TRAVEL INFORMATION
                 ===================================================== */}

            <section className="travel-information-section">

                <div className="container">

                    {/* ================= SECTION HEADING ================= */}

                    <div className="travel-section-heading text-center">

                        <span>
                            TRAVEL INFORMATION
                        </span>

                        <h2>
                            Choose Your Way to Travel
                        </h2>

                        <p>
                            Whether you are exploring cities, mountains or
                            historical destinations, Pakistan offers several
                            ways to travel comfortably and conveniently.
                        </p>

                    </div>


                    {/* =================================================
                         TRANSPORTATION CARDS
                         ================================================= */}

                    <div className="row g-4">


                        {/* =================================================
                             AIR TRAVEL
                             ================================================= */}

                        <div className="col-lg-4 col-md-6">

                            <div className="travel-card">

                                <div className="travel-card-image">

                                    <img
                                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80"
                                        alt="Air Travel"
                                    />

                                    <div className="travel-card-icon">
                                        <i className="bi bi-airplane-fill"></i>
                                    </div>

                                </div>


                                <div className="travel-card-content">

                                    <h3>
                                        Air Travel
                                    </h3>

                                    <p>
                                        Air travel is one of the fastest ways
                                        to travel between major cities and
                                        tourist destinations in Pakistan.
                                    </p>

                                    <div className="travel-info-list">

                                        <div>
                                            <i className="bi bi-geo-alt-fill"></i>
                                            <span>
                                                Major Cities: Karachi, Lahore,
                                                Islamabad, Peshawar & Quetta
                                            </span>
                                        </div>

                                        <div>
                                            <i className="bi bi-clock-fill"></i>
                                            <span>
                                                Best for: Long-distance travel
                                            </span>
                                        </div>

                                    </div>

                                    <div className="travel-tags">

                                        <span>
                                            Fast
                                        </span>

                                        <span>
                                            Comfortable
                                        </span>

                                        <span>
                                            Long Distance
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                             RAILWAY
                             ================================================= */}

                        <div className="col-lg-4 col-md-6">

                            <div className="travel-card">

                                <div className="travel-card-image">

                                    <img
                                        src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=900&q=80"
                                        alt="Railway Travel"
                                    />

                                    <div className="travel-card-icon">
                                        <i className="bi bi-train-front-fill"></i>
                                    </div>

                                </div>


                                <div className="travel-card-content">

                                    <h3>
                                        Railway
                                    </h3>

                                    <p>
                                        Pakistan Railways connects many major
                                        cities and provides an economical way
                                        to travel across the country.
                                    </p>

                                    <div className="travel-info-list">

                                        <div>
                                            <i className="bi bi-geo-alt-fill"></i>
                                            <span>
                                                Routes: Karachi, Lahore,
                                                Rawalpindi, Multan & Peshawar
                                            </span>
                                        </div>

                                        <div>
                                            <i className="bi bi-ticket-perforated-fill"></i>
                                            <span>
                                                Best for: Affordable long trips
                                            </span>
                                        </div>

                                    </div>

                                    <div className="travel-tags">

                                        <span>
                                            Economical
                                        </span>

                                        <span>
                                            Scenic
                                        </span>

                                        <span>
                                            Comfortable
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                             BUS SERVICES
                             ================================================= */}

                        <div className="col-lg-4 col-md-6">

                            <div className="travel-card">

                                <div className="travel-card-image">

                                    <img
                                        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80"
                                        alt="Bus Services"
                                    />

                                    <div className="travel-card-icon">
                                        <i className="bi bi-bus-front-fill"></i>
                                    </div>

                                </div>


                                <div className="travel-card-content">

                                    <h3>
                                        Bus Services
                                    </h3>

                                    <p>
                                        Intercity bus services connect major
                                        cities with towns and popular tourist
                                        destinations throughout Pakistan.
                                    </p>

                                    <div className="travel-info-list">

                                        <div>
                                            <i className="bi bi-signpost-fill"></i>
                                            <span>
                                                Available between major cities
                                                and tourist areas
                                            </span>
                                        </div>

                                        <div>
                                            <i className="bi bi-wallet2"></i>
                                            <span>
                                                Best for: Budget-friendly travel
                                            </span>
                                        </div>

                                    </div>

                                    <div className="travel-tags">

                                        <span>
                                            Affordable
                                        </span>

                                        <span>
                                            Intercity
                                        </span>

                                        <span>
                                            Convenient
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                             CAR RENTAL
                             ================================================= */}

                        <div className="col-lg-4 col-md-6">

                            <div className="travel-card">

                                <div className="travel-card-image">

                                    <img
                                        src="https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80"
                                        alt="Car Rental"
                                    />

                                    <div className="travel-card-icon">
                                        <i className="bi bi-car-front-fill"></i>
                                    </div>

                                </div>


                                <div className="travel-card-content">

                                    <h3>
                                        Car Rental
                                    </h3>

                                    <p>
                                        Renting a car gives travelers greater
                                        freedom to explore cities, valleys and
                                        tourist destinations at their own pace.
                                    </p>

                                    <div className="travel-info-list">

                                        <div>
                                            <i className="bi bi-car-front-fill"></i>
                                            <span>
                                                Suitable for families and groups
                                            </span>
                                        </div>

                                        <div>
                                            <i className="bi bi-map-fill"></i>
                                            <span>
                                                Best for: Flexible road trips
                                            </span>
                                        </div>

                                    </div>

                                    <div className="travel-tags">

                                        <span>
                                            Flexible
                                        </span>

                                        <span>
                                            Private
                                        </span>

                                        <span>
                                            Road Trips
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                             LOCAL TRANSPORT
                             ================================================= */}

                        <div className="col-lg-4 col-md-6">

                            <div className="travel-card">

                                <div className="travel-card-image">

                                    <img
                                        src="https://images.unsplash.com/photo-1556122071-e404eaedb77f?auto=format&fit=crop&w=900&q=80"
                                        alt="Local Transport"
                                    />

                                    <div className="travel-card-icon">
                                        <i className="bi bi-taxi-front-fill"></i>
                                    </div>

                                </div>


                                <div className="travel-card-content">

                                    <h3>
                                        Local Transport
                                    </h3>

                                    <p>
                                        Taxis, ride-hailing services, rickshaws
                                        and public transport make it easy to
                                        move around Pakistan's major cities.
                                    </p>

                                    <div className="travel-info-list">

                                        <div>
                                            <i className="bi bi-geo-alt-fill"></i>
                                            <span>
                                                Common in major cities and
                                                urban areas
                                            </span>
                                        </div>

                                        <div>
                                            <i className="bi bi-clock-fill"></i>
                                            <span>
                                                Best for: Short city journeys
                                            </span>
                                        </div>

                                    </div>

                                    <div className="travel-tags">

                                        <span>
                                            City Travel
                                        </span>

                                        <span>
                                            Easy
                                        </span>

                                        <span>
                                            Quick
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                             ROAD TRAVEL
                             ================================================= */}

                        <div className="col-lg-4 col-md-6">

                            <div className="travel-card">

                                <div className="travel-card-image">

                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/The_Karakoram_Highway.jpg/1280px-The_Karakoram_Highway.jpg"
                                        alt="Karakoram Highway Pakistan"
                                    />

                                    <div className="travel-card-icon">
                                        <i className="bi bi-signpost-2-fill"></i>
                                    </div>

                                </div>


                                <div className="travel-card-content">

                                    <h3>
                                        Road Travel
                                    </h3>

                                    <p>
                                        Road trips are a wonderful way to
                                        discover Pakistan's mountains, valleys,
                                        highways and scenic landscapes.
                                    </p>

                                    <div className="travel-info-list">

                                        <div>
                                            <i className="bi bi-signpost-2-fill"></i>
                                            <span>
                                                Popular route: Karakoram Highway
                                            </span>
                                        </div>

                                        <div>
                                            <i className="bi bi-camera-fill"></i>
                                            <span>
                                                Best for: Scenic adventures
                                            </span>
                                        </div>

                                    </div>

                                    <div className="travel-tags">

                                        <span>
                                            Scenic
                                        </span>

                                        <span>
                                            Adventure
                                        </span>

                                        <span>
                                            Road Trip
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                         TRAVEL TIP
                         ===================================================== */}

                    <div className="travel-tip-box">

                        <div className="travel-tip-icon">
                            <i className="bi bi-lightbulb-fill"></i>
                        </div>

                        <div>

                            <h4>
                                Travel Tip
                            </h4>

                            <p>
                                Plan your transportation according to your
                                destination, budget and travel time. For
                                railway journeys, check the current schedule
                                and ticket availability before traveling.
                            </p>

                        </div>

                    </div>

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

export default TravelInformation;

