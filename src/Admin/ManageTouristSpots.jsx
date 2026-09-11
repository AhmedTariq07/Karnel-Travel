import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../api";
import "../Pages/ManageTouristSpots.css";

function ManageTouristSpots() {

    const navigate = useNavigate();

    const [touristSpots, setTouristSpots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);

    // =====================================================
    // EDIT MODE
    // =====================================================

    const [editingId, setEditingId] = useState(null);


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        description: "",
        image: null,
        rating: "",
        tourDays: 1,
        price: ""
    });


    // =====================================================
    // LOAD TOURIST SPOTS
    // =====================================================

    const loadTouristSpots = async () => {

        try {

            const response = await fetch(
                `${API_URL}/api/TouristSpots`
            );

            if (!response.ok) {
                throw new Error("Failed to load tourist spots");
            }

            const data = await response.json();

            setTouristSpots(data);

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to load tourist spots."
            );
        }

        setLoading(false);
    };


    // =====================================================
    // CHECK LOGIN + LOAD DATA
    // =====================================================

    useEffect(() => {

        const token =
            localStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin-login");
            return;
        }

        loadTouristSpots();

    }, [navigate]);


    // =====================================================
    // HANDLE FORM INPUT
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

        const file =
            e.target.files[0];

        setFormData({
            ...formData,
            image: file || null
        });
    };


    // =====================================================
    // EDIT TOURIST SPOT
    // =====================================================

    const editTouristSpot = (spot) => {

        setEditingId(spot.id);

        setFormData({
            name: spot.name || "",
            location: spot.location || "",
            description: spot.description || "",
            image: null,
            rating: spot.rating ?? "",
            tourDays: spot.tourDays ?? 1,
            price: spot.price ?? ""
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

        setEditingId(null);

        setFormData({
            name: "",
            location: "",
            description: "",
            image: null,
            rating: "",
            tourDays: 1,
            price: ""
        });

        setShowForm(false);
        setMessage("");
    };


    // =====================================================
    // ADD / UPDATE TOURIST SPOT
    // =====================================================

    const addTouristSpot = async (e) => {

        e.preventDefault();

        const token =
            localStorage.getItem("adminToken");

        try {

            // =================================================
            // VALIDATE TOUR DAYS
            // =================================================

            const tourDays =
                Number(formData.tourDays);

            if (
                !Number.isInteger(tourDays) ||
                tourDays <= 0
            ) {

                setMessage(
                    "Tour duration must be at least 1 day."
                );

                return;
            }


            // =================================================
            // VALIDATE PRICE
            // =================================================

            const price =
                Number(formData.price);

            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                setMessage(
                    "Please enter a valid package price."
                );

                return;
            }


            // =================================================
            // EDIT MODE
            // =================================================

            if (editingId !== null) {

                const response =
                    await fetch(
                        `${API_URL}/api/TouristSpots/${editingId}`,
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

                                image: null,

                                rating:
                                    formData.rating
                                        ? parseFloat(
                                            formData.rating
                                        )
                                        : null,

                                tourDays:
                                    tourDays,

                                price:
                                    price,

                                discountPercent: 20
                            })
                        }
                    );


                const responseData =
                    await response.json();


                if (!response.ok) {

                    setMessage(
                        responseData.message ||
                        "Failed to update tourist spot."
                    );

                    return;
                }


                // =================================================
                // UPDATE SUCCESS
                // =================================================

                setMessage(
                    "Tourist spot updated successfully."
                );

                setEditingId(null);

                setFormData({
                    name: "",
                    location: "",
                    description: "",
                    image: null,
                    rating: "",
                    tourDays: 1,
                    price: ""
                });

                setShowForm(false);

                loadTouristSpots();

                return;
            }


            // =================================================
            // ADD MODE
            // =================================================

            const data =
                new FormData();


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


            // =================================================
            // RATING
            // =================================================

            if (formData.rating) {

                data.append(
                    "rating",
                    parseFloat(
                        formData.rating
                    )
                );
            }


            // =================================================
            // TOUR DAYS
            // =================================================

            data.append(
                "tourDays",
                tourDays
            );


            // =================================================
            // PACKAGE PRICE
            // =================================================

            data.append(
                "price",
                price
            );


            // =================================================
            // IMAGE
            // =================================================

            if (formData.image) {

                data.append(
                    "image",
                    formData.image
                );
            }


            // =================================================
            // SEND ADD REQUEST
            // =================================================

            const response =
                await fetch(
                    `${API_URL}/api/TouristSpots`,
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
                await response.json();


            if (!response.ok) {

                setMessage(
                    responseData.message ||
                    "Failed to add tourist spot."
                );

                return;
            }


            // =================================================
            // ADD SUCCESS
            // =================================================

            setMessage(
                "Tourist spot added successfully."
            );


            // =================================================
            // CLEAR FORM
            // =================================================

            setFormData({
                name: "",
                location: "",
                description: "",
                image: null,
                rating: "",
                tourDays: 1,
                price: ""
            });


            // =================================================
            // CLOSE FORM
            // =================================================

            setShowForm(false);


            // =================================================
            // RELOAD
            // =================================================

            loadTouristSpots();

        } catch (error) {

            console.error(
                "Tourist Spot Error:",
                error
            );

            setMessage(
                "Unable to save tourist spot."
            );
        }
    };


    // =====================================================
    // DELETE TOURIST SPOT
    // =====================================================

    const deleteTouristSpot = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this tourist spot?"
            );

        if (!confirmDelete) {
            return;
        }

        const token =
            localStorage.getItem("adminToken");

        try {

            const response =
                await fetch(
                    `${API_URL}/api/TouristSpots/${id}`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Delete failed."
                );

                return;
            }


            setMessage(
                "Tourist spot deleted successfully."
            );

            loadTouristSpots();

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to delete tourist spot."
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
                        Manage Tourist Spots
                    </h1>

                    <p>
                        Add, edit and delete tourist spots
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
                        Tourist Spots
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
                                : "+ Add Tourist Spot"
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
                                ? "Edit Tourist Spot"
                                : "Add New Tourist Spot"
                            }
                        </h3>


                        <form
                            onSubmit={
                                addTouristSpot
                            }
                        >

                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Name
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
                                    placeholder="Enter tourist spot name"
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
                                    placeholder="Enter description"
                                    rows="5"
                                />

                            </div>


                            {/* TOUR DAYS */}

                            <div className="form-group">

                                <label>
                                    Tour Duration (Days)
                                </label>

                                <input
                                    type="number"
                                    name="tourDays"
                                    value={
                                        formData.tourDays
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1"
                                    step="1"
                                    required
                                />

                                <small>
                                    Admin controls the permanent tour package duration.
                                </small>

                            </div>


                            {/* PACKAGE PRICE */}

                            <div className="form-group">

                                <label>
                                    Package Price (Rs.)
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="Example: 50000"
                                    required
                                />

                                <small>
                                    Enter the original tour package price.
                                </small>

                            </div>


                            {/* DISCOUNT */}

                            <div className="form-group">

                                <label>
                                    Discount
                                </label>

                                <input
                                    type="text"
                                    value="20% OFF"
                                    readOnly
                                    disabled
                                />

                                <small>
                                    Permanent discount. Admin cannot change it.
                                </small>

                            </div>


                            {/* IMAGE */}

                            <div className="form-group">

                                <label>
                                    Tourist Spot Image
                                </label>

                                <input
                                    type="file"
                                    name="image"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={
                                        handleImageChange
                                    }
                                />

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
                                    ? "Update Tourist Spot"
                                    : "Save Tourist Spot"
                                }
                            </button>

                        </form>

                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <p className="loading">
                        Loading tourist spots...
                    </p>

                ) : touristSpots.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No Tourist Spots Found
                        </h3>

                        <p>
                            Add your first tourist spot.
                        </p>

                    </div>

                ) : (

                    /* =================================================
                       TABLE
                    ================================================= */

                    <div className="tourist-table-wrapper">

                        <table className="tourist-table">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Name</th>

                                    <th>Location</th>

                                    <th>Tour Days</th>

                                    <th>Package Price</th>

                                    <th>Discount</th>

                                    <th>Description</th>

                                    <th>Image</th>

                                    <th>Rating</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {touristSpots.map(
                                    (spot) => (

                                        <tr
                                            key={
                                                spot.id
                                            }
                                        >

                                            <td>
                                                {spot.id}
                                            </td>

                                            <td>
                                                {spot.name}
                                            </td>

                                            <td>
                                                {spot.location ||
                                                    "-"
                                                }
                                            </td>

                                            <td>

                                                <span className="fw-bold">

                                                    {spot.tourDays ??
                                                        1
                                                    }{" "}

                                                    {Number(
                                                        spot.tourDays
                                                    ) === 1
                                                        ? "Day"
                                                        : "Days"
                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                <span className="fw-bold">

                                                    Rs.{" "}

                                                    {Number(
                                                        spot.price ??
                                                        0
                                                    ).toLocaleString()}

                                                </span>

                                            </td>

                                            <td>

                                                <span className="fw-bold text-success">
                                                    20% OFF
                                                </span>

                                            </td>

                                            <td className="description-cell">

                                                {spot.description ||
                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                {spot.image ? (

                                                    <img
                                                        src={
                                                            spot.image.startsWith(
                                                                "http://"
                                                            ) ||
                                                            spot.image.startsWith(
                                                                "https://"
                                                            )
                                                                ? spot.image
                                                                : spot.image.startsWith(
                                                                    "/"
                                                                )
                                                                    ? `${API_URL}${spot.image}`
                                                                    : `${API_URL}/${spot.image}`
                                                        }
                                                        alt={
                                                            spot.name
                                                        }
                                                        className="spot-image"
                                                    />

                                                ) : (

                                                    "-"

                                                )}

                                            </td>

                                            <td>

                                                {spot.rating ??
                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    {/* EDIT */}

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            editTouristSpot(
                                                                spot
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteTouristSpot(
                                                                spot.id
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

export default ManageTouristSpots;
