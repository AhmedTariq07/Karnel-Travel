import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const getLoggedInUser = () => {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch (error) {
            console.error("Invalid user data:", error);
            return null;
        }
    };


    const [user, setUser] = useState(getLoggedInUser);


    // =====================================================
    // AUTOMATICALLY UPDATE NAVBAR
    // =====================================================

    useEffect(() => {

        const updateUser = () => {
            setUser(getLoggedInUser());
        };

        // Custom event for login/logout
        window.addEventListener("userAuthChanged", updateUser);

        // Also listen for localStorage changes
        window.addEventListener("storage", updateUser);

        return () => {
            window.removeEventListener(
                "userAuthChanged",
                updateUser
            );

            window.removeEventListener(
                "storage",
                updateUser
            );
        };

    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const logoutUser = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("userToken");

        // Update Navbar immediately
        window.dispatchEvent(
            new Event("userAuthChanged")
        );

        navigate("/login");
    };


    return (
        <>

            {/* =====================================================
                 TOP BAR
                 ===================================================== */}

            <div className="top-bar">

                <div className="container-fluid header-container">

                    <div className="row align-items-center">

                    </div>

                </div>

            </div>


            {/* =====================================================
                 MAIN HEADER
                 ===================================================== */}

            <header className="main-header">

                <div className="container-fluid header-container">

                    <div className="row align-items-center">

                        {/* LOGO */}

                        <div className="col-lg-7">

                            <Link
                                to="/"
                                className="brand text-decoration-none"
                            >

                                <div className="brand-logo">

                                    <i className="bi bi-airplane-fill"></i>

                                </div>

                                <div>

                                    <h1>
                                        Karnel
                                    </h1>

                                    <span>
                                        Travel Guide
                                    </span>

                                </div>

                            </Link>

                        </div>


                        {/* CUSTOMER SUPPORT */}

                        <div className="col-lg-5">

                            <div className="customer-support">

                                <i className="bi bi-headset"></i>

                                <div>

                                    <small>
                                        24x7 Customer Support
                                    </small>

                                    <strong>
                                        +92 300 1234567
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </header>


            {/* =====================================================
                 NAVIGATION BAR
                 ===================================================== */}

            <nav className="navbar navbar-expand-lg main-navbar">

                <div className="container-fluid header-container">

                    {/* MOBILE MENU */}

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainMenu"
                        aria-controls="mainMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >

                        <span className="navbar-toggler-icon"></span>

                    </button>


                    {/* NAVIGATION */}

                    <div
                        className="collapse navbar-collapse"
                        id="mainMenu"
                    >

                        <ul className="navbar-nav me-auto">

                            {/* HOME */}

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/"
                                >

                                    <i className="bi bi-house-door me-1"></i>

                                    HOME

                                </Link>

                            </li>


                            {/* ABOUT */}

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/about"
                                >

                                    <i className="bi bi-info-circle me-1"></i>

                                    ABOUT US

                                </Link>

                            </li>


                            {/* SEARCH */}

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/search"
                                >

                                    <i className="bi bi-search me-1"></i>

                                    SEARCH

                                </Link>

                            </li>


                            {/* =================================================
                                 ITINERARIES
                            ================================================= */}

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/my-trips"
                                >

                                    <i className="bi bi-map me-1"></i>

                                    ITINERARIES

                                </Link>

                            </li>


                            {/* INFORMATION */}

                            <li className="nav-item dropdown">

                                <button
                                    className="nav-link dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >

                                    <i className="bi bi-compass me-1"></i>

                                    INFORMATION

                                </button>


                                <ul className="dropdown-menu">

                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/tourist-spots"
                                        >

                                            <i className="bi bi-geo-alt me-2"></i>

                                            Tourist Spots

                                        </Link>

                                    </li>


                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/travel-information"
                                        >

                                            <i className="bi bi-airplane me-2"></i>

                                            Travel Information

                                        </Link>

                                    </li>


                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/hotels"
                                        >

                                            <i className="bi bi-building me-2"></i>

                                            Hotels

                                        </Link>

                                    </li>


                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/restaurants"
                                        >

                                            <i className="bi bi-cup-hot me-2"></i>

                                            Restaurants

                                        </Link>

                                    </li>


                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/resorts"
                                        >

                                            <i className="bi bi-house-heart me-2"></i>

                                            Resorts

                                        </Link>

                                    </li>

                                </ul>

                            </li>


                            {/* CONTACT */}

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/contact"
                                >

                                    <i className="bi bi-envelope me-1"></i>

                                    CONTACT US

                                </Link>

                            </li>

                        </ul>


                        {/* =====================================================
                             PROFILE DROPDOWN
                             ===================================================== */}

                        <ul className="navbar-nav">

                            <li className="nav-item dropdown">

                                <button
                                    className="nav-link profile-link dropdown-toggle"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >

                                    <span className="profile-icon">

                                        <i className="bi bi-person-circle"></i>

                                    </span>

                                    {user ? user.name : "PROFILE"}

                                </button>


                                <ul className="dropdown-menu dropdown-menu-end profile-dropdown">

                                    {/* MY PROFILE */}

                                    <li>

                                        <Link
                                            className="dropdown-item"
                                            to="/profile"
                                        >

                                            <i className="bi bi-person me-2"></i>

                                            My Profile

                                        </Link>

                                    </li>


                                    {/* LOGIN */}

                                    {!user && (

                                        <li>

                                            <Link
                                                className="dropdown-item"
                                                to="/login"
                                            >

                                                <i className="bi bi-box-arrow-in-right me-2"></i>

                                                Login

                                            </Link>

                                        </li>

                                    )}


                                    {/* SIGN UP */}

                                    {!user && (

                                        <li>

                                            <Link
                                                className="dropdown-item"
                                                to="/signup"
                                            >

                                                <i className="bi bi-person-plus me-2"></i>

                                                Sign Up

                                            </Link>

                                        </li>

                                    )}


                                    {/* ADMIN LOGIN */}

                                    


                                    {/* DIVIDER */}

                                    <li>

                                        <hr className="dropdown-divider" />

                                    </li>


                                    {/* LOGOUT */}

                                    {user && (

                                        <li>

                                            <button
                                                className="dropdown-item logout-item"
                                                type="button"
                                                onClick={logoutUser}
                                            >

                                                <i className="bi bi-box-arrow-right me-2"></i>

                                                Logout

                                            </button>

                                        </li>

                                    )}

                                </ul>

                            </li>

                        </ul>

                    </div>

                </div>

            </nav>

        </>
    );
}

export default Navbar;