import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Pages/ManageTouristSpots.css";
import API_URL from "../api";

function ManageRestaurants() {
    const navigate = useNavigate();

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        description: "",
        price: "",
        rating: "",
        totalSeats: 0,
        availableSeats: 0,
        image: null
    });


    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {
        if (!image) return "";

        let imageUrl = image.replace(/\\/g, "/");

        if (imageUrl.includes("wwwroot/")) {
            imageUrl = imageUrl.substring(
                imageUrl.indexOf("wwwroot/") + 8
            );
        }

        if (
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
        ) {
            return imageUrl;
        }

        if (!imageUrl.startsWith("/")) {
            imageUrl = "/" + imageUrl;
        }

        return `${API_URL}${imageUrl}`;
    };


    // =====================================================
    // LOAD RESTAURANTS
    // =====================================================

    const loadRestaurants = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/Restaurants`
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load restaurants"
                );
            }

            const data = await response.json();

            setRestaurants(data);
        }
        catch (error) {
            console.error(error);

            setMessage(
                "Unable to load restaurants."
            );
        }
        finally {
            setLoading(false);
        }
    };


    // =====================================================
    // CHECK LOGIN
    // =====================================================

    useEffect(() => {
        const token =
            localStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin-login");
            return;
        }

        loadRestaurants();
    }, [navigate]);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // =====================================================
    // HANDLE IMAGE
    // =====================================================

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        setFormData({
            ...formData,
            image: file || null
        });
    };


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {
        setFormData({
            name: "",
            location: "",
            description: "",
            price: "",
            rating: "",
            totalSeats: 0,
            availableSeats: 0,
            image: null
        });

        setEditingId(null);
        setShowForm(false);
    };


    // =====================================================
    // EDIT RESTAURANT
    // =====================================================

    const editRestaurant = (restaurant) => {
        setEditingId(restaurant.id);

        setFormData({
            name: restaurant.name || "",
            location: restaurant.location || "",
            description: restaurant.description || "",
            price: restaurant.price || "",
            rating: restaurant.rating ?? "",
            totalSeats: restaurant.totalSeats ?? 0,
            availableSeats:
                restaurant.availableSeats ?? 0,
            image: null
        });

        setShowForm(true);
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const cancelEdit = () => {
        resetForm();
        setMessage("");
    };


    // =====================================================
    // ADD / UPDATE RESTAURANT
    // =====================================================

    const saveRestaurant = async (e) => {
        e.preventDefault();

        const token =
            localStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin-login");
            return;
        }


        // =================================================
        // VALIDATE SEATS
        // =================================================

        const totalSeats =
            Number(formData.totalSeats);

        const availableSeats =
            Number(formData.availableSeats);


        if (totalSeats < 0) {
            setMessage(
                "Total seats cannot be negative."
            );
            return;
        }


        if (availableSeats < 0) {
            setMessage(
                "Available seats cannot be negative."
            );
            return;
        }


        if (availableSeats > totalSeats) {
            setMessage(
                "Available seats cannot be greater than total seats."
            );
            return;
        }


        try {

            // =================================================
            // UPDATE MODE
            // =================================================

            if (editingId !== null) {

                const response = await fetch(
                    `${API_URL}/api/Restaurants/${editingId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            id: editingId,

                            name:
                                formData.name,

                            location:
                                formData.location,

                            description:
                                formData.description,

                            price:
                                formData.price,

                            rating:
                                formData.rating === ""
                                    ? null
                                    : parseFloat(
                                        formData.rating
                                    ),

                            totalSeats:
                                totalSeats,

                            availableSeats:
                                availableSeats
                        })
                    }
                );


                const responseData =
                    await response.json()
                        .catch(() => ({}));


                if (!response.ok) {
                    setMessage(
                        responseData.message ||
                        "Failed to update restaurant."
                    );

                    return;
                }


                setMessage(
                    "Restaurant updated successfully."
                );

                resetForm();

                loadRestaurants();

                return;
            }


            // =================================================
            // ADD MODE
            // =================================================

            const data = new FormData();

            data.append(
                "name",
                formData.name
            );

            data.append(
                "location",
                formData.location
            );

            data.append(
                "description",
                formData.description
            );

            data.append(
                "price",
                formData.price
            );

            data.append(
                "totalSeats",
                totalSeats
            );

            data.append(
                "availableSeats",
                availableSeats
            );


            if (formData.rating !== "") {
                data.append(
                    "rating",
                    parseFloat(
                        formData.rating
                    )
                );
            }


            if (formData.image) {
                data.append(
                    "image",
                    formData.image
                );
            }


            const response = await fetch(
                `${API_URL}/api/Restaurants`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: data
                }
            );


            const responseData =
                await response.json()
                    .catch(() => ({}));


            if (!response.ok) {
                setMessage(
                    responseData.message ||
                    "Failed to add restaurant."
                );

                return;
            }


            setMessage(
                "Restaurant added successfully."
            );

            resetForm();

            loadRestaurants();
        }
        catch (error) {
            console.error(
                "Restaurant Error:",
                error
            );

            setMessage(
                "Unable to save restaurant."
            );
        }
    };


    // =====================================================
    // DELETE RESTAURANT
    // =====================================================

    const deleteRestaurant = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this restaurant?"
            );


        if (!confirmDelete) {
            return;
        }


        const token =
            localStorage.getItem("adminToken");


        if (!token) {
            navigate("/admin-login");
            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/api/Restaurants/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json()
                    .catch(() => ({}));


            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Delete failed."
                );

                return;
            }


            setMessage(
                "Restaurant deleted successfully."
            );

            loadRestaurants();
        }
        catch (error) {
            console.error(error);

            setMessage(
                "Unable to delete restaurant."
            );
        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {
        localStorage.removeItem(
            "adminToken"
        );

        localStorage.removeItem(
            "adminUsername"
        );

        navigate("/admin-login");
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="manage-tourist-spots">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="manage-header">

                <div>

                    <h1>
                        Manage Restaurants
                    </h1>

                    <p>
                        Add, edit and delete restaurants
                    </p>

                </div>


                <div className="manage-header-buttons">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(
                                "/admin-dashboard"
                            )
                        }
                    >
                        ← Dashboard
                    </button>


                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="manage-content">

                {/* =================================================
                    TOP
                ================================================= */}

                <div className="manage-top">

                    <h2>
                        Restaurants
                    </h2>


                    <button
                        className="add-button"
                        onClick={() => {

                            if (
                                editingId !== null
                            ) {
                                cancelEdit();
                                return;
                            }

                            setShowForm(
                                !showForm
                            );

                            setMessage("");
                        }}
                    >

                        {editingId !== null
                            ? "× Cancel Edit"
                            : showForm
                                ? "× Close Form"
                                : "+ Add Restaurant"
                        }

                    </button>

                </div>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (

                    <div className="manage-message">

                        {message}

                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* =================================================
                    ADD / EDIT FORM
                ================================================= */}

                {showForm && (

                    <div className="add-tourist-form">

                        <h3>

                            {editingId !== null
                                ? "Edit Restaurant"
                                : "Add New Restaurant"
                            }

                        </h3>


                        <form
                            onSubmit={
                                saveRestaurant
                            }
                        >

                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Restaurant Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter restaurant name"
                                    required
                                />

                            </div>


                            {/* LOCATION */}

                            <div className="form-group">

                                <label>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={
                                        formData.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter location"
                                />

                            </div>


                            {/* PRICE */}

                            <div className="form-group">

                                <label>
                                    Price
                                </label>

                                <input
                                    type="text"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Rs. 2000"
                                />

                            </div>


                            {/* TOTAL SEATS */}

                            <div className="form-group">

                                <label>
                                    Total Seats
                                </label>

                                <input
                                    type="number"
                                    name="totalSeats"
                                    value={
                                        formData.totalSeats
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    placeholder="Example: 50"
                                    required
                                />

                            </div>


                            {/* AVAILABLE SEATS */}

                            <div className="form-group">

                                <label>
                                    Available Seats
                                </label>

                                <input
                                    type="number"
                                    name="availableSeats"
                                    value={
                                        formData.availableSeats
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    max={
                                        formData.totalSeats
                                    }
                                    placeholder="Example: 50"
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter restaurant description"
                                    rows="5"
                                />

                            </div>


                            {/* IMAGE */}

                            <div className="form-group">

                                <label>
                                    Restaurant Image
                                </label>


                                {editingId === null && (

                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={
                                            handleImageChange
                                        }
                                    />

                                )}


                                <small>

                                    {editingId !== null
                                        ? "Leave empty to keep the existing image."
                                        : "Allowed: JPG, JPEG, PNG, WEBP — Maximum 5 MB"
                                    }

                                </small>

                            </div>


                            {/* RATING */}

                            <div className="form-group">

                                <label>
                                    Rating
                                </label>

                                <input
                                    type="number"
                                    name="rating"
                                    value={
                                        formData.rating
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: 4.5"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                />

                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                className="save-button"
                            >

                                {editingId !== null
                                    ? "Update Restaurant"
                                    : "Save Restaurant"
                                }

                            </button>

                        </form>

                    </div>

                )}


                {/* =================================================
                    TABLE
                ================================================= */}

                {loading ? (

                    <p className="loading">
                        Loading restaurants...
                    </p>

                ) : restaurants.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No Restaurants Found
                        </h3>

                        <p>
                            Add your first restaurant.
                        </p>

                    </div>

                ) : (

                    <div className="tourist-table-wrapper">

                        <table className="tourist-table">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Location
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Seats
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Image
                                    </th>

                                    <th>
                                        Rating
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {restaurants.map(
                                    (restaurant) => (

                                        <tr
                                            key={
                                                restaurant.id
                                            }
                                        >

                                            <td>
                                                {
                                                    restaurant.id
                                                }
                                            </td>


                                            <td>
                                                {
                                                    restaurant.name
                                                }
                                            </td>


                                            <td>
                                                {
                                                    restaurant.location ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    restaurant.price ||
                                                    "-"
                                                }
                                            </td>


                                            <td>

                                                <span className="fw-bold">

                                                    {
                                                        restaurant.availableSeats ??
                                                        0
                                                    }

                                                    {" / "}

                                                    {
                                                        restaurant.totalSeats ??
                                                        0
                                                    }

                                                </span>

                                            </td>


                                            <td className="description-cell">

                                                {
                                                    restaurant.description ||
                                                    "-"
                                                }

                                            </td>


                                            <td>

                                                {restaurant.image ? (

                                                    <img
                                                        src={
                                                            getImageUrl(
                                                                restaurant.image
                                                            )
                                                        }
                                                        alt={
                                                            restaurant.name
                                                        }
                                                        className="spot-image"
                                                        onError={(e) => {
                                                            e.target.style.display =
                                                                "none";
                                                        }}
                                                    />

                                                ) : (
                                                    "-"
                                                )}

                                            </td>


                                            <td>

                                                {
                                                    restaurant.rating ??
                                                    "-"
                                                }

                                            </td>


                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            editRestaurant(
                                                                restaurant
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteRestaurant(
                                                                restaurant.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default ManageRestaurants;
