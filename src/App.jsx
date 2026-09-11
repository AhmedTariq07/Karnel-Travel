import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar.jsx";
import ManageUsers from "./Admin/ManageUsers";
import Cashbook from "./Admin/Cashbook";
import Home from "./Pages/Home";
import About from "./Pages/About";
import TouristSpots from "./Pages/TouristSpots";
import Hotels from "./Pages/Hotels";
import Restaurants from "./Pages/Restaurants";
import Resorts from "./Pages/Resorts";
import Search from "./Pages/Search";
import Contact from "./Pages/Contact";
import TravelInformation from "./Pages/travel-information";
import ViewDetails from "./Pages/ViewDetails";
import ManageBookings from "./Admin/ManageBookings";
import AdminDashboard from "./Pages/AdminDashboard";
import ManageTouristSpots from "./Admin/ManageTouristSpots";
import ManageHotels from "./Admin/ManageHotels";
import ManageRestaurants from "./Admin/ManageRestaurants";
import ManageResorts from "./Admin/ManageResorts";
import MyTrips from "./Pages/MyTrips";
import ManageTrips from "./Admin/ManageTrips";
import CreateTrip from "./Admin/CreateTrip";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import AdminLogin from "./Admin/AdminLogin";
import Profile from "./Pages/Profile";
import EditTrip from "./Admin/EditTrip";
import AdminProtectedRoute from "./Admin/AdminProtectedRoute";
import ViewTrip from "./Pages/ViewTrip";

function AppContent() {

    const location = useLocation();

    const isAdminPage =
        location.pathname.startsWith("/admin-dashboard") ||
        location.pathname.startsWith("/manage-tourist-spots") ||
        location.pathname.startsWith("/manage-hotels") ||
        location.pathname.startsWith("/manage-restaurants") ||
        location.pathname.startsWith("/manage-resorts") ||
        location.pathname.startsWith("/manage-bookings") ||
        location.pathname.startsWith("/cashbook") ||
        location.pathname.startsWith("/manage-users") ||
        location.pathname.startsWith("/create-trip") ||
        location.pathname.startsWith("/manage-trips") ||
        location.pathname.startsWith("/edit-trip");

    return (
        <>

            {!isAdminPage && <Navbar />}

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/about"
                    element={<About />}
                />

                <Route
                    path="/tourist-spots"
                    element={<TouristSpots />}
                />

                <Route
                    path="/hotels"
                    element={<Hotels />}
                />

                <Route
                    path="/restaurants"
                    element={<Restaurants />}
                />

                <Route
                    path="/resorts"
                    element={<Resorts />}
                />

                <Route
                    path="/search"
                    element={<Search />}
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/travel-information"
                    element={<TravelInformation />}
                />

                <Route
                    path="/view-details"
                    element={<ViewDetails />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/view-trip/:id"
                    element={<ViewTrip />}
                />

                <Route
                    path="/my-trips"
                    element={<MyTrips />}
                />

                <Route
                    path="/admin-dashboard"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/manage-tourist-spots"
                    element={
                        <AdminProtectedRoute>
                            <ManageTouristSpots />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/manage-hotels"
                    element={
                        <AdminProtectedRoute>
                            <ManageHotels />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/manage-bookings"
                    element={
                        <AdminProtectedRoute>
                            <ManageBookings />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/cashbook"
                    element={
                        <AdminProtectedRoute>
                            <Cashbook />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/manage-restaurants"
                    element={
                        <AdminProtectedRoute>
                            <ManageRestaurants />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/manage-users"
                    element={
                        <AdminProtectedRoute>
                            <ManageUsers />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/manage-resorts"
                    element={
                        <AdminProtectedRoute>
                            <ManageResorts />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/create-trip"
                    element={
                        <AdminProtectedRoute>
                            <CreateTrip />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/manage-trips"
                    element={
                        <AdminProtectedRoute>
                            <ManageTrips />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/edit-trip/:id"
                    element={
                        <AdminProtectedRoute>
                            <EditTrip />
                        </AdminProtectedRoute>
                    }
                />

            </Routes>

        </>
    );
}

function App() {

    return (
        <BrowserRouter>

            <AppContent />

        </BrowserRouter>
    );
}

export default App;