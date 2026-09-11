import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Pages/ManageTouristSpots.css";
import API_URL from "../api";

function ManageResorts() {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [resorts, setResorts] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        price: "",
        description: "",
        rating: "",
        totalRooms: "",
        availableRooms: ""
    });

    const [image, setImage] = useState(null);


    // =====================================================
    // GET TOKEN
    // =====================================================

    const token = localStorage.getItem("adminToken");


    // =====================================================
    // LOAD RESORTS
    // =====================================================

    useEffect(() => {
        fetchResorts();
    }, []);


    const fetchResorts = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/Resorts`
            );

            if (!response.ok) {
                throw new Error("Failed to load resorts");
            }

            const data = await response.json();

            setResorts(data);
        }
        catch (error) {
            console.error(error);

            setMessage("Unable to load resorts.");
        }
        finally {
            setLoading(false);
        }
    };


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // =====================================================
    // HANDLE IMAGE
    // =====================================================

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };


    // =====================================================
    // ADD RESORT
    // =====================================================

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!token) {
            setMessage("Admin login required.");
            return;
        }

        const totalRooms = Number(formData.totalRooms);
        const availableRooms = Number(formData.availableRooms);

        if (totalRooms < 0) {
            setMessage("Total rooms cannot be negative.");
            return;
        }

        if (availableRooms < 0) {
            setMessage("Available rooms cannot be negative.");
            return;
        }

        if (availableRooms > totalRooms) {
            setMessage(
                "Available rooms cannot be greater than total rooms."
            );
            return;
        }

        try {
            const data = new FormData();

            data.append("name", formData.name);
            data.append("location", formData.location);
            data.append("price", formData.price);
            data.append("description", formData.description);

            if (formData.rating !== "") {
                data.append("rating", formData.rating);
            }

            data.append("totalRooms", totalRooms);
            data.append("availableRooms", availableRooms);

            if (image) {
                data.append("image", image);
            }


            const response = await fetch(
                `${API_URL}/api/Resorts`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: data
                }
            );


            if (!response.ok) {
                const errorData =
                    await response.json().catch(() => null);

                throw new Error(
                    errorData?.message ||
                    "Failed to add resort"
                );
            }


            setMessage("Resort added successfully.");

            resetForm();

            fetchResorts();
        }
        catch (error) {
            console.error(error);

            setMessage(error.message);
        }
    };


    // =====================================================
    // EDIT RESORT
    // =====================================================

    const handleEdit = (resort) => {
        setEditingId(resort.id);

        setFormData({
            name: resort.name || "",
            location: resort.location || "",
            price: resort.price || "",
            description: resort.description || "",
            rating: resort.rating ?? "",
            totalRooms: resort.totalRooms ?? 0,
            availableRooms: resort.availableRooms ?? 0
        });

        setImage(null);

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =====================================================
    // UPDATE RESORT
    // =====================================================

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!token) {
            setMessage("Admin login required.");
            return;
        }

        const totalRooms = Number(formData.totalRooms);
        const availableRooms = Number(formData.availableRooms);

        if (totalRooms < 0) {
            setMessage("Total rooms cannot be negative.");
            return;
        }

        if (availableRooms < 0) {
            setMessage("Available rooms cannot be negative.");
            return;
        }

        if (availableRooms > totalRooms) {
            setMessage(
                "Available rooms cannot be greater than total rooms."
            );
            return;
        }

        try {
            const updateData = {
                id: editingId,
                name: formData.name,
                location: formData.location,
                price: formData.price,
                description: formData.description,

                rating:
                    formData.rating === ""
                        ? null
                        : Number(formData.rating),

                totalRooms: totalRooms,
                availableRooms: availableRooms
            };


            const response = await fetch(
                `${API_URL}/api/Resorts/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(updateData)
                }
            );


            if (!response.ok) {
                const errorData =
                    await response.json().catch(() => null);

                throw new Error(
                    errorData?.message ||
                    "Failed to update resort"
                );
            }


            setMessage("Resort updated successfully.");

            resetForm();

            fetchResorts();
        }
        catch (error) {
            console.error(error);

            setMessage(error.message);
        }
    };


    // =====================================================
    // DELETE RESORT
    // =====================================================

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resort?"
        );

        if (!confirmDelete) {
            return;
        }

        if (!token) {
            setMessage("Admin login required.");
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/api/Resorts/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {
                const errorData =
                    await response.json().catch(() => null);

                throw new Error(
                    errorData?.message ||
                    "Failed to delete resort"
                );
            }


            setMessage("Resort deleted successfully.");

            fetchResorts();
        }
        catch (error) {
            console.error(error);

            setMessage(error.message);
        }
    };


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {
        setFormData({
            name: "",
            location: "",
            price: "",
            description: "",
            rating: "",
            totalRooms: "",
            availableRooms: ""
        });

        setImage(null);

        setEditingId(null);

        setShowForm(false);
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {
        localStorage.removeItem("adminToken");

        navigate("/admin-login");
    };


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

        return `${API_URL}${
            image.startsWith("/") ? "" : "/"
        }${image}`;
    };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <div className="manage-tourist-spots">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="manage-header">

                <div>
                    <h1>Manage Resorts</h1>

                    <p>
                        Add, edit and delete resort information
                    </p>
                </div>


                <div className="manage-header-buttons">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/admin-dashboard")
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

                    <h2>Resorts</h2>


                    {!showForm && (
                        <button
                            className="add-button"
                            onClick={() => {
                                setShowForm(true);
                                setMessage("");
                            }}
                        >
                            + Add Resort
                        </button>
                    )}

                </div>


                {/* =================================================
                    MESSAGE
                ================================================= */}

                {message && (
                    <div className="manage-message">
                        {message}
                    </div>
                )}


                {/* =================================================
                    FORM
                ================================================= */}

                {showForm && (

                    <form
                        className="add-tourist-form"
                        onSubmit={
                            editingId
                                ? handleUpdate
                                : handleAdd
                        }
                    >

                        <h3>
                            {editingId
                                ? "Edit Resort"
                                : "Add New Resort"}
                        </h3>


                        {/* NAME */}

                        <div className="form-group">

                            <label>
                                Resort Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter resort name"
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
                                value={formData.location}
                                onChange={handleChange}
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
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="e.g. PKR 15,000 / night"
                            />

                        </div>


                        {/* TOTAL ROOMS */}

                        <div className="form-group">

                            <label>
                                Total Rooms
                            </label>

                            <input
                                type="number"
                                name="totalRooms"
                                value={formData.totalRooms}
                                onChange={handleChange}
                                placeholder="e.g. 20"
                                min="0"
                                step="1"
                                required
                            />

                        </div>


                        {/* AVAILABLE ROOMS */}

                        <div className="form-group">

                            <label>
                                Available Rooms
                            </label>

                            <input
                                type="number"
                                name="availableRooms"
                                value={formData.availableRooms}
                                onChange={handleChange}
                                placeholder="e.g. 15"
                                min="0"
                                step="1"
                                required
                            />

                        </div>


                        {/* RATING */}

                        <div className="form-group">

                            <label>
                                Rating
                            </label>

                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                placeholder="e.g. 4.5"
                                min="0"
                                max="5"
                                step="0.1"
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter resort description"
                                rows="5"
                            />

                        </div>


                        {/* IMAGE */}

                        <div className="form-group">

                            <label>
                                Resort Image
                            </label>

                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleImageChange}
                            />

                            {editingId && (
                                <small>
                                    Leave empty to keep the
                                    existing image.
                                </small>
                            )}

                        </div>


                        {/* BUTTONS */}

                        <div className="action-buttons">

                            <button
                                type="submit"
                                className="save-button"
                            >
                                {editingId
                                    ? "Update Resort"
                                    : "Save Resort"}
                            </button>


                            <button
                                type="button"
                                className="delete-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>
                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (
                    <div className="loading">
                        Loading resorts...
                    </div>
                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading && resorts.length === 0 && (

                    <div className="empty-state">

                        <p>
                            No resorts found.
                        </p>

                    </div>
                )}


                {/* =================================================
                    TABLE
                ================================================= */}

                {!loading && resorts.length > 0 && (

                    <div className="tourist-table-wrapper">

                        <table className="tourist-table">

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Price</th>
                                    <th>Rooms</th>
                                    <th>Rating</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>


                            <tbody>

                                {resorts.map((resort) => (

                                    <tr key={resort.id}>

                                        <td>
                                            {resort.id}
                                        </td>


                                        <td>

                                            {resort.image ? (

                                                <img
                                                    src={getImageUrl(
                                                        resort.image
                                                    )}
                                                    alt={resort.name}
                                                    className="spot-image"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
                                                    }}
                                                />

                                            ) : (
                                                "No Image"
                                            )}

                                        </td>


                                        <td>
                                            {resort.name}
                                        </td>


                                        <td>
                                            {resort.location || "-"}
                                        </td>


                                        <td>
                                            {resort.price || "-"}
                                        </td>


                                        <td>
                                            {resort.availableRooms ?? 0}
                                            {" / "}
                                            {resort.totalRooms ?? 0}
                                        </td>


                                        <td>
                                            {resort.rating ?? "-"}
                                        </td>


                                        <td className="description-cell">
                                            {resort.description || "-"}
                                        </td>


                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            resort
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            resort.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}

export default ManageResorts;
