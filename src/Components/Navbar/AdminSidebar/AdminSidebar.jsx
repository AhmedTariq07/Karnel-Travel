
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(true);

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
    // VIEW WEBSITE
    // =====================================================

    const viewWebsite = () => {
        window.location.href = "/";
    };

    // =====================================================
    // ACTIVE MENU
    // =====================================================

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            <button
                className={`admin-sidebar-toggle ${
                    isOpen ? "open" : ""
                }`}
                onClick={() => setIsOpen(!isOpen)}
                title={
                    isOpen
                        ? "Close Sidebar"
                        : "Open Sidebar"
                }
            >
                <i
                    className={
                        isOpen
                            ? "bi bi-x-lg"
                            : "bi bi-list"
                    }
                ></i>
            </button>

            <aside
                className={`admin-sidebar ${
                    isOpen
                        ? "sidebar-open"
                        : "sidebar-closed"
                }`}
            >

                <div className="admin-sidebar-logo">

                    <div className="admin-sidebar-logo-icon">
                        <i className="bi bi-airplane-fill"></i>
                    </div>

                    <div className="admin-sidebar-logo-text">
                        <h2>Karnel</h2>
                        <span>Travel Guide</span>
                    </div>

                </div>

                <nav className="admin-sidebar-menu">

                    <p className="admin-sidebar-title">
                        MAIN MENU
                    </p>

                    <button
                        className={`admin-sidebar-item ${
                            isActive("/admin-dashboard")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        <i className="bi bi-grid-1x2-fill"></i>
                        <span>Dashboard</span>
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            isActive("/manage-tourist-spots")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/manage-tourist-spots")
                        }
                    >
                        <i className="bi bi-geo-alt-fill"></i>
                        <span>Tourist Spots</span>
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            isActive("/manage-hotels")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/manage-hotels")
                        }
                    >
                        <i className="bi bi-building-fill"></i>
                        <span>Hotels</span>
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            isActive("/manage-restaurants")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/manage-restaurants")
                        }
                    >
                        <i className="bi bi-cup-hot-fill"></i>
                        <span>Restaurants</span>
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            isActive("/manage-resorts")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/manage-resorts")
                        }
                    >
                        <i className="bi bi-house-heart-fill"></i>
                        <span>Resorts</span>
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            isActive("/manage-trips")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/manage-trips")
                        }
                    >
                        <i className="bi bi-map-fill"></i>
                        <span>Itineraries</span>
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            isActive("/manage-bookings")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/manage-bookings")
                        }
                    >
                        <i className="bi bi-calendar-check-fill"></i>
                        <span>Bookings</span>
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            isActive("/cashbook")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/cashbook")
                        }
                    >
                        <i className="bi bi-cash-stack"></i>
                        <span>Cashbook</span>
                    </button>

                    <button
                        className={`admin-sidebar-item ${
                            isActive("/manage-users")
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            navigate("/manage-users")
                        }
                    >
                        <i className="bi bi-people-fill"></i>
                        <span>Users</span>
                    </button>

                </nav>

                <div className="admin-sidebar-bottom">

                    <button
                        className="admin-sidebar-item website-button"
                        onClick={viewWebsite}
                        title="View Website"
                    >
                        <i className="bi bi-globe2"></i>
                        <span>View Website</span>
                    </button>

                    <button
                        className="admin-sidebar-item logout"
                        onClick={logout}
                        title="Logout"
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </button>

                </div>

            </aside>
        </>
    );
}

export default AdminSidebar;

