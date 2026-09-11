import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Pages/ManageTouristSpots.css";
import API_URL from "../api";

function ManageHotels() {
    const navigate = useNavigate();

    // =====================================================
    // DATA
    // =====================================================

    const [hotels, setHotels] = useState([]);
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
        price: "",
        rating: "",
        totalRooms: "",
        availableRooms: "",
        discountPercent: "",
        offerText: "",
        image: null
    });

    // =====================================================
    // IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {
        if (!image) {
            return "";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return image;
    };

    // =====================================================
    // LOAD HOTELS
    // =====================================================

    const loadHotels = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/Hotels`
            );

            if (!response.ok) {
                throw new Error("Failed to load hotels");
            }

            const data = await response.json();

            console.log("Hotels from API:", data);

            setHotels(data);
        } catch (error) {
            console.error(
                "Load Hotels Error:",
                error
            );

            setMessage(
                "Unable to load hotels."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // CHECK ADMIN LOGIN
    // =====================================================

    useEffect(() => {
        const token =
            localStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin-login");
            return;
        }

        loadHotels();
    }, [navigate]);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =====================================================
    // HANDLE IMAGE
    // =====================================================

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setFormData((previous) => ({
                ...previous,
                image: null
            }));

            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage(
                "Image size must be 5 MB or less."
            );

            e.target.value = "";

            setFormData((previous) => ({
                ...previous,
                image: null
            }));

            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setMessage(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            e.target.value = "";

            setFormData((previous) => ({
                ...previous,
                image: null
            }));

            return;
        }

        setMessage("");

        setFormData((previous) => ({
            ...previous,
            image: file
        }));
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
            totalRooms: "",
            availableRooms: "",
            discountPercent: "",
            offerText: "",
            image: null
        });

        setEditingId(null);
    };

    // =====================================================
    // EDIT HOTEL
    // =====================================================

    const editHotel = (hotel) => {
        console.log(
            "Editing hotel:",
            hotel
        );

        setEditingId(hotel.id);

        setFormData({
            name: hotel.name || "",
            location: hotel.location || "",
            description: hotel.description || "",
            price: hotel.price || "",
            rating: hotel.rating ?? "",
            totalRooms: hotel.totalRooms ?? "",
            availableRooms:
                hotel.availableRooms ?? "",
            discountPercent:
                hotel.discountPercent ?? "",
            offerText:
                hotel.offerText || "",
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
        setShowForm(false);
        setMessage("");
    };

    // =====================================================
    // SAVE HOTEL
    // =====================================================

    const saveHotel = async (e) => {
        e.preventDefault();

        const token =
            localStorage.getItem("adminToken");

        if (!token) {
            navigate("/admin-login");
            return;
        }

        // =================================================
        // VALIDATE ROOMS
        // =================================================

        const totalRooms =
            formData.totalRooms !== ""
                ? parseInt(
                    formData.totalRooms,
                    10
                )
                : 0;

        const availableRooms =
            formData.availableRooms !== ""
                ? parseInt(
                    formData.availableRooms,
                    10
                )
                : 0;

        const discountPercent =
            formData.discountPercent !== ""
                ? parseFloat(
                    formData.discountPercent
                )
                : 0;

        if (totalRooms < 0) {
            setMessage(
                "Total rooms cannot be negative."
            );
            return;
        }

        if (availableRooms < 0) {
            setMessage(
                "Available rooms cannot be negative."
            );
            return;
        }

        if (availableRooms > totalRooms) {
            setMessage(
                "Available rooms cannot be greater than total rooms."
            );
            return;
        }

        if (
            discountPercent < 0 ||
            discountPercent > 100
        ) {
            setMessage(
                "Discount must be between 0 and 100."
            );
            return;
        }

        try {

            // =================================================
            // EDIT HOTEL
            // =================================================

            if (editingId !== null) {

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

                if (formData.rating !== "") {
                    data.append(
                        "rating",
                        parseFloat(
                            formData.rating
                        )
                    );
                }

                data.append(
                    "totalRooms",
                    totalRooms
                );

                data.append(
                    "availableRooms",
                    availableRooms
                );

                data.append(
                    "discountPercent",
                    discountPercent
                );

                data.append(
                    "offerText",
                    formData.offerText.trim()
                );

                // =================================================
                // NEW IMAGE
                // =================================================

                if (formData.image) {
                    data.append(
                        "image",
                        formData.image
                    );
                }

                console.log(
                    "Updating hotel:",
                    editingId
                );

                const response = await fetch(
                    `${API_URL}/api/Hotels/${editingId}`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        },

                        body: data
                    }
                );

                const responseText =
                    await response.text();

                let responseData = {};

                try {
                    responseData =
                        responseText
                            ? JSON.parse(
                                responseText
                            )
                            : {};
                } catch {
                    responseData = {};
                }

                console.log(
                    "Update response:",
                    responseData
                );

                if (!response.ok) {
                    setMessage(
                        responseData.message ||
                        "Failed to update hotel."
                    );

                    return;
                }

                setMessage(
                    "Hotel updated successfully."
                );

                resetForm();

                setShowForm(false);

                await loadHotels();

                return;
            }

            // =================================================
            // ADD HOTEL
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

            // =================================================
            // RATING
            // =================================================

            if (formData.rating !== "") {
                data.append(
                    "rating",
                    parseFloat(
                        formData.rating
                    )
                );
            }

            // =================================================
            // ROOM AVAILABILITY
            // =================================================

            data.append(
                "totalRooms",
                totalRooms
            );

            data.append(
                "availableRooms",
                availableRooms
            );

            // =================================================
            // DISCOUNT
            // =================================================

            data.append(
                "discountPercent",
                discountPercent
            );

            // =================================================
            // OFFER
            // =================================================

            data.append(
                "offerText",
                formData.offerText || ""
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

            const response = await fetch(
                `${API_URL}/api/Hotels`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: data
                }
            );

            const responseText =
                await response.text();

            let responseData = {};

            try {
                responseData =
                    responseText
                        ? JSON.parse(
                            responseText
                        )
                        : {};
            } catch {
                responseData = {};
            }

            console.log(
                "Add response:",
                responseData
            );

            if (!response.ok) {
                setMessage(
                    responseData.message ||
                    "Failed to add hotel."
                );

                return;
            }

            setMessage(
                "Hotel added successfully."
            );

            resetForm();

            setShowForm(false);

            await loadHotels();

        } catch (error) {
            console.error(
                "Hotel Error:",
                error
            );

            setMessage(
                "Unable to save hotel."
            );
        }
    };

    // =====================================================
    // DELETE HOTEL
    // =====================================================

    const deleteHotel = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this hotel?"
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
                `${API_URL}/api/Hotels/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const responseText =
                await response.text();

            let data = {};

            try {
                data =
                    responseText
                        ? JSON.parse(
                            responseText
                        )
                        : {};
            } catch {
                data = {};
            }

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Delete failed."
                );

                return;
            }

            setMessage(
                data.message ||
                "Hotel and image deleted successfully."
            );

            await loadHotels();

        } catch (error) {
            console.error(
                "Delete Hotel Error:",
                error
            );

            setMessage(
                "Unable to delete hotel."
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

            {/* HEADER */}

            <div className="manage-header">

                <div>
                    <h1>
                        Manage Hotels
                    </h1>

                    <p>
                        Add, edit and delete hotels
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

            {/* CONTENT */}

            <div className="manage-content">

                {/* TOP */}

                <div className="manage-top">

                    <h2>
                        Hotels
                    </h2>

                    <button
                        className="add-button"
                        onClick={() => {

                            if (editingId !== null) {
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
                                : "+ Add Hotel"
                        }
                    </button>

                </div>

                {/* MESSAGE */}

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

                {/* ADD / EDIT FORM */}

                {showForm && (

                    <div className="add-tourist-form">

                        <h3>
                            {editingId !== null
                                ? "Edit Hotel"
                                : "Add New Hotel"
                            }
                        </h3>

                        <form
                            onSubmit={saveHotel}
                        >

                            <div className="form-group">

                                <label>
                                    Hotel Name
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
                                    placeholder="Enter hotel name"
                                    required
                                />

                            </div>

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
                                    placeholder="Enter hotel location"
                                />

                            </div>

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
                                    placeholder="Enter hotel description"
                                    rows="5"
                                />

                            </div>

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
                                    placeholder="Example: PKR 15,000 per night"
                                />

                            </div>

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

                            <div className="form-group">

                                <label>
                                    Total Rooms
                                </label>

                                <input
                                    type="number"
                                    name="totalRooms"
                                    value={
                                        formData.totalRooms
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: 100"
                                    min="0"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Available Rooms
                                </label>

                                <input
                                    type="number"
                                    name="availableRooms"
                                    value={
                                        formData.availableRooms
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: 25"
                                    min="0"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Discount Percentage
                                </label>

                                <input
                                    type="number"
                                    name="discountPercent"
                                    value={
                                        formData.discountPercent
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: 15"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Offer Text
                                </label>

                                <input
                                    type="text"
                                    name="offerText"
                                    value={
                                        formData.offerText
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Weekend Special - 15% Off"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Hotel Image
                                </label>

                                <input
                                    type="file"
                                    name="image"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    onChange={
                                        handleImageChange
                                    }
                                />

                                <small>
                                    {editingId !== null
                                        ? "Leave empty to keep the existing image. Select a new image to replace it."
                                        : "Allowed: JPG, JPEG, PNG, WEBP — Maximum 5 MB"
                                    }
                                </small>

                            </div>

                            <button
                                type="submit"
                                className="save-button"
                            >
                                {editingId !== null
                                    ? "Update Hotel"
                                    : "Save Hotel"
                                }
                            </button>

                        </form>

                    </div>
                )}

                {/* LOADING / TABLE */}

                {loading ? (

                    <p className="loading">
                        Loading hotels...
                    </p>

                ) : hotels.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No Hotels Found
                        </h3>

                        <p>
                            Add your first hotel.
                        </p>

                    </div>

                ) : (

                    <div className="tourist-table-wrapper">

                        <table className="tourist-table">

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Rooms</th>
                                    <th>Discount</th>
                                    <th>Offer</th>
                                    <th>Image</th>
                                    <th>Rating</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {hotels.map(
                                    (hotel) => (

                                        <tr
                                            key={
                                                hotel.id
                                            }
                                        >

                                            <td>
                                                {
                                                    hotel.id
                                                }
                                            </td>

                                            <td>
                                                {
                                                    hotel.name
                                                }
                                            </td>

                                            <td>
                                                {
                                                    hotel.location ||
                                                    "-"
                                                }
                                            </td>

                                            <td className="description-cell">

                                                {
                                                    hotel.description ||
                                                    "-"
                                                }

                                            </td>

                                            <td>
                                                {
                                                    hotel.price ||
                                                    "-"
                                                }
                                            </td>

                                            <td>

                                                <strong>
                                                    {
                                                        hotel.availableRooms ??
                                                        0
                                                    }
                                                </strong>

                                                {" / "}

                                                {
                                                    hotel.totalRooms ??
                                                    0
                                                }

                                            </td>

                                            <td>

                                                {
                                                    Number(
                                                        hotel.discountPercent
                                                    ) > 0
                                                        ? `${hotel.discountPercent}% OFF`
                                                        : "-"
                                                }

                                            </td>

                                            <td>

                                                {
                                                    hotel.offerText ||
                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                {hotel.image ? (

                                                    <img
                                                        src={
                                                            getImageUrl(
                                                                hotel.image
                                                            )
                                                        }
                                                        alt={
                                                            hotel.name
                                                        }
                                                        className="spot-image"
                                                        onError={(e) => {
                                                            console.error(
                                                                "Hotel image failed:",
                                                                e.currentTarget.src
                                                            );
                                                        }}
                                                    />

                                                ) : (

                                                    <span>
                                                        No Image
                                                    </span>

                                                )}

                                            </td>

                                            <td>

                                                {
                                                    hotel.rating ??
                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            editHotel(
                                                                hotel
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            deleteHotel(
                                                                hotel.id
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

export default ManageHotels;
