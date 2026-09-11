import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../Components/Navbar/AdminSidebar/AdminSidebar";
import "./AdminDashboard.css";

function AdminDashboard() {

    const navigate = useNavigate();

    // =====================================================
    // ADMIN USER
    // =====================================================

    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch (error) {
        console.error("Invalid user data:", error);
    }

    const username =
        user?.name ||
        user?.email ||
        "Admin";


    // =====================================================
    // COUNTS
    // =====================================================

    const [counts, setCounts] = useState({
        touristSpots: 0,
        hotels: 0,
        restaurants: 0,
        resorts: 0,
        bookings: 0,
        users: 0
    });


    const [loadingCounts, setLoadingCounts] = useState(true);


    // =====================================================
    // RECENT BOOKINGS
    // =====================================================

    const [recentBookings, setRecentBookings] = useState([]);


    // =====================================================
    // SEARCH
    // =====================================================

    const [searchText, setSearchText] = useState("");


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem("userToken");
        localStorage.removeItem("user");

        window.dispatchEvent(
            new Event("userAuthChanged")
        );

        navigate("/login");
    };


    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        // =============================================
        // CHECK USER LOGIN + ADMIN ROLE
        // =============================================

        const token = localStorage.getItem("userToken");
        const storedUser = localStorage.getItem("user");

        let currentUser = null;

        try {
            currentUser = storedUser
                ? JSON.parse(storedUser)
                : null;
        } catch (error) {
            console.error(
                "Invalid user data:",
                error
            );
        }


        // =============================================
        // NOT LOGGED IN OR NOT ADMIN
        // =============================================

        if (
            !token ||
            !currentUser ||
            currentUser.role !== "Admin"
        ) {

            navigate("/login");

            return;
        }


        // =============================================
        // LOAD DASHBOARD DATA
        // =============================================

        const loadDashboardData = async () => {

            try {

                setLoadingCounts(true);


                const endpoints = [
                    {
                        key: "touristSpots",
                        url: "http://localhost:5014/api/TouristSpots"
                    },
                    {
                        key: "hotels",
                        url: "http://localhost:5014/api/Hotels"
                    },
                    {
                        key: "restaurants",
                        url: "http://localhost:5014/api/Restaurants"
                    },
                    {
                        key: "resorts",
                        url: "http://localhost:5014/api/Resorts"
                    },
                    {
                        key: "bookings",
                        url: "http://localhost:5014/api/Bookings"
                    },
                    {
                        key: "users",
                        url: "http://localhost:5014/api/Users"
                    }
                ];


                const responses = await Promise.all(
                    endpoints.map((item) =>
                        fetch(item.url)
                    )
                );


                const data = await Promise.all(
                    responses.map(async (response) => {

                        if (!response.ok) {
                            throw new Error(
                                "Failed to load dashboard data"
                            );
                        }

                        return await response.json();

                    })
                );


                const newCounts = {};


                endpoints.forEach((item, index) => {

                    newCounts[item.key] =
                        Array.isArray(data[index])
                            ? data[index].length
                            : 0;

                });


                setCounts(newCounts);


                // =============================================
                // RECENT BOOKINGS
                // =============================================

                const bookingData = data[4];

                if (Array.isArray(bookingData)) {

                    setRecentBookings(
                        bookingData.slice(0, 5)
                    );

                }

            }
            catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

            }
            finally {

                setLoadingCounts(false);

            }

        };


        loadDashboardData();

    }, [navigate]);


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = (e) => {

        e.preventDefault();

        const query = searchText.trim();

        if (!query) {
            return;
        }

        navigate(
            `/search?query=${encodeURIComponent(query)}`
        );
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString();

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="admin-dashboard">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <AdminSidebar />


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <main className="admin-main">


                {/* =================================================
                    TOP HEADER
                ================================================= */}

                <header className="admin-top-header">

                    <div className="admin-header-left">

                        <span className="dashboard-label">
                            ADMIN PANEL
                        </span>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Manage your Karnel Travel Guide website.
                        </p>

                    </div>


                    {/* ADMIN PROFILE */}

                    <div className="admin-profile">

                        <div className="admin-profile-icon">

                            <i className="bi bi-person-fill"></i>

                        </div>


                        <div className="admin-profile-info">

                            <strong>
                                {username}
                            </strong>

                            <span>
                                Administrator
                            </span>

                        </div>


                        <button
                            type="button"
                            className="admin-header-logout"
                            onClick={logout}
                            title="Logout"
                        >

                            <i className="bi bi-box-arrow-right"></i>

                        </button>

                    </div>

                </header>



                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="admin-dashboard-content">


                    {/* =================================================
                        WELCOME BANNER
                    ================================================= */}

                    <div className="admin-welcome">

                        <div className="welcome-text">

                            <span>
                                Welcome back 👋
                            </span>

                            <h2>
                                Hello, {username}!
                            </h2>

                            <p>
                                Everything you need to manage your
                                travel platform is right here.
                            </p>

                        </div>


                        <div className="welcome-icon">

                            <i className="bi bi-globe-americas"></i>

                        </div>

                    </div>



                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="dashboard-search">

                        <div className="search-icon">

                            <i className="bi bi-search"></i>

                        </div>


                        <form onSubmit={handleSearch}>

                            <input
                                type="text"
                                value={searchText}
                                onChange={(e) =>
                                    setSearchText(e.target.value)
                                }
                                placeholder="Search your travel website..."
                            />


                            <button type="submit">

                                Search

                                <i className="bi bi-arrow-right"></i>

                            </button>

                        </form>

                    </div>



                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <div className="dashboard-stats">


                        {/* TOURIST SPOTS */}

                        <div className="stat-box">

                            <div className="stat-icon tourist-stat">

                                <i className="bi bi-geo-alt-fill"></i>

                            </div>

                            <div>

                                <span>
                                    Tourist Spots
                                </span>

                                <strong>
                                    {loadingCounts
                                        ? "..."
                                        : counts.touristSpots}
                                </strong>

                            </div>

                        </div>


                        {/* HOTELS */}

                        <div className="stat-box">

                            <div className="stat-icon hotel-stat">

                                <i className="bi bi-building-fill"></i>

                            </div>

                            <div>

                                <span>
                                    Hotels
                                </span>

                                <strong>
                                    {loadingCounts
                                        ? "..."
                                        : counts.hotels}
                                </strong>

                            </div>

                        </div>


                        {/* RESTAURANTS */}

                        <div className="stat-box">

                            <div className="stat-icon restaurant-stat">

                                <i className="bi bi-cup-hot-fill"></i>

                            </div>

                            <div>

                                <span>
                                    Restaurants
                                </span>

                                <strong>
                                    {loadingCounts
                                        ? "..."
                                        : counts.restaurants}
                                </strong>

                            </div>

                        </div>


                        {/* RESORTS */}

                        <div className="stat-box">

                            <div className="stat-icon resort-stat">

                                <i className="bi bi-house-heart-fill"></i>

                            </div>

                            <div>

                                <span>
                                    Resorts
                                </span>

                                <strong>
                                    {loadingCounts
                                        ? "..."
                                        : counts.resorts}
                                </strong>

                            </div>

                        </div>


                        {/* BOOKINGS */}

                        <div className="stat-box">

                            <div className="stat-icon booking-stat">

                                <i className="bi bi-calendar-check-fill"></i>

                            </div>

                            <div>

                                <span>
                                    Bookings
                                </span>

                                <strong>
                                    {loadingCounts
                                        ? "..."
                                        : counts.bookings}
                                </strong>

                            </div>

                        </div>


                        {/* USERS */}

                        <div className="stat-box">

                            <div className="stat-icon users-stat">

                                <i className="bi bi-people-fill"></i>

                            </div>

                            <div>

                                <span>
                                    Users
                                </span>

                                <strong>
                                    {loadingCounts
                                        ? "..."
                                        : counts.users}
                                </strong>

                            </div>

                        </div>

                    </div>



                    {/* =================================================
                        SECTION HEADING
                    ================================================= */}

                    <div className="dashboard-section-heading">

                        <div>

                            <h2>
                                Manage Content
                            </h2>

                            <p>
                                Quickly access and manage your website
                                information.
                            </p>

                        </div>

                    </div>



                    {/* =================================================
                        MANAGEMENT CARDS
                    ================================================= */}

                    <div className="admin-cards">


                        {/* TOURIST SPOTS */}

                        <div className="admin-card tourist-card">

                            <div className="card-top">

                                <div className="admin-card-icon">

                                    <i className="bi bi-geo-alt-fill"></i>

                                </div>

                                <span className="card-number">

                                    {loadingCounts
                                        ? "..."
                                        : counts.touristSpots}

                                </span>

                            </div>


                            <div className="card-content">

                                <h3>
                                    Tourist Spots
                                </h3>

                                <p>
                                    Add, edit and delete tourist
                                    destinations and attractions.
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate("/manage-tourist-spots")
                                }
                            >

                                Manage Tourist Spots

                                <i className="bi bi-arrow-right"></i>

                            </button>

                        </div>



                        {/* HOTELS */}

                        <div className="admin-card hotel-card">

                            <div className="card-top">

                                <div className="admin-card-icon">

                                    <i className="bi bi-building-fill"></i>

                                </div>

                                <span className="card-number">

                                    {loadingCounts
                                        ? "..."
                                        : counts.hotels}

                                </span>

                            </div>


                            <div className="card-content">

                                <h3>
                                    Hotels
                                </h3>

                                <p>
                                    Add, edit and delete hotels and
                                    accommodation information.
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate("/manage-hotels")
                                }
                            >

                                Manage Hotels

                                <i className="bi bi-arrow-right"></i>

                            </button>

                        </div>



                        {/* RESTAURANTS */}

                        <div className="admin-card restaurant-card">

                            <div className="card-top">

                                <div className="admin-card-icon">

                                    <i className="bi bi-cup-hot-fill"></i>

                                </div>

                                <span className="card-number">

                                    {loadingCounts
                                        ? "..."
                                        : counts.restaurants}

                                </span>

                            </div>


                            <div className="card-content">

                                <h3>
                                    Restaurants
                                </h3>

                                <p>
                                    Manage restaurants, locations,
                                    ratings and food information.
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate("/manage-restaurants")
                                }
                            >

                                Manage Restaurants

                                <i className="bi bi-arrow-right"></i>

                            </button>

                        </div>



                        {/* RESORTS */}

                        <div className="admin-card resort-card">

                            <div className="card-top">

                                <div className="admin-card-icon">

                                    <i className="bi bi-house-heart-fill"></i>

                                </div>

                                <span className="card-number">

                                    {loadingCounts
                                        ? "..."
                                        : counts.resorts}

                                </span>

                            </div>


                            <div className="card-content">

                                <h3>
                                    Resorts
                                </h3>

                                <p>
                                    Manage beautiful resorts and
                                    holiday destinations.
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate("/manage-resorts")
                                }
                            >

                                Manage Resorts

                                <i className="bi bi-arrow-right"></i>

                            </button>

                        </div>



                        {/* BOOKINGS */}

                        <div className="admin-card booking-card">

                            <div className="card-top">

                                <div className="admin-card-icon">

                                    <i className="bi bi-calendar-check-fill"></i>

                                </div>

                                <span className="card-number">

                                    {loadingCounts
                                        ? "..."
                                        : counts.bookings}

                                </span>

                            </div>


                            <div className="card-content">

                                <h3>
                                    Bookings
                                </h3>

                                <p>
                                    View customer booking and contact
                                    requests from your website.
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate("/manage-bookings")
                                }
                            >

                                Manage Bookings

                                <i className="bi bi-arrow-right"></i>

                            </button>

                        </div>



                        {/* USERS */}

                        <div className="admin-card users-card">

                            <div className="card-top">

                                <div className="admin-card-icon">

                                    <i className="bi bi-people-fill"></i>

                                </div>

                                <span className="card-number">

                                    {loadingCounts
                                        ? "..."
                                        : counts.users}

                                </span>

                            </div>


                            <div className="card-content">

                                <h3>
                                    Users
                                </h3>

                                <p>
                                    View registered users of the
                                    Karnel Travel Guide website.
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate("/manage-users")
                                }
                            >

                                Manage Users

                                <i className="bi bi-arrow-right"></i>

                            </button>

                        </div>


                    </div>



                    {/* =================================================
                        RECENT BOOKINGS
                    ================================================= */}

                    <div className="recent-bookings">

                        <div className="recent-bookings-header">

                            <div>

                                <h2>
                                    Recent Bookings
                                </h2>

                                <p>
                                    Latest customer requests
                                </p>

                            </div>


                            <button
                                onClick={() =>
                                    navigate("/manage-bookings")
                                }
                            >

                                View All

                                <i className="bi bi-arrow-right"></i>

                            </button>

                        </div>


                        {recentBookings.length === 0 ? (

                            <div className="no-bookings">

                                <i className="bi bi-calendar-x"></i>

                                <p>
                                    No booking requests yet.
                                </p>

                            </div>

                        ) : (

                            <div className="recent-bookings-list">

                                {recentBookings.map((booking) => (

                                    <div
                                        className="recent-booking-item"
                                        key={booking.id}
                                    >

                                        <div className="recent-booking-icon">

                                            <i className="bi bi-person-fill"></i>

                                        </div>


                                        <div className="recent-booking-info">

                                            <strong>
                                                {booking.fullName}
                                            </strong>

                                            <span>
                                                {booking.itemName ||
                                                    "General Contact"}
                                            </span>

                                        </div>


                                        <div className="recent-booking-type">

                                            {booking.type
                                                ? booking.type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                  booking.type.slice(1)
                                                : "General"}

                                        </div>


                                        <div className="recent-booking-date">

                                            {formatDate(
                                                booking.createdAt
                                            )}

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>



                    {/* =================================================
                        QUICK ACCESS
                    ================================================= */}

                    <div className="quick-access">

                        <div className="quick-access-icon">

                            <i className="bi bi-lightning-charge-fill"></i>

                        </div>

                        <div>

                            <h3>
                                Quick Access
                            </h3>

                            <p>
                                Use the sidebar or management cards to
                                quickly navigate between different sections.
                            </p>

                        </div>

                    </div>


                </section>



                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="admin-footer">

                    <p>
                        © 2026 Karnel Travel Guide.
                        All Rights Reserved.
                    </p>

                </footer>


            </main>

        </div>
    );
}

export default AdminDashboard;

