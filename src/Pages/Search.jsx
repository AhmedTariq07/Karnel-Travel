import API_URL from "../api";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Search() {

    // =====================================================
    // URL PARAMETERS
    // =====================================================

    const [searchParams] = useSearchParams();

    const urlDestination = searchParams.get("destination") || "";
    const urlType = searchParams.get("type") || "";


    // =====================================================
    // FORM STATE
    // =====================================================

    const [searchType, setSearchType] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [searchRating, setSearchRating] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");


    // =====================================================
    // API DATA
    // =====================================================

    const [allData, setAllData] = useState({
        touristSpots: [],
        hotels: [],
        restaurants: [],
        resorts: []
    });

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD ALL DATA
    // =====================================================

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    touristSpotsResponse,
                    hotelsResponse,
                    restaurantsResponse,
                    resortsResponse
                ] = await Promise.all([

                    fetch(`${API_URL}/api/TouristSpots`),

                    fetch(`${API_URL}/api/Hotels`),

                    fetch(`${API_URL}/api/Restaurants`),

                    fetch(`${API_URL}/api/Resorts`)

                ]);


                if (
                    !touristSpotsResponse.ok ||
                    !hotelsResponse.ok ||
                    !restaurantsResponse.ok ||
                    !resortsResponse.ok
                ) {
                    throw new Error("Failed to load search data.");
                }


                const touristSpots =
                    await touristSpotsResponse.json();

                const hotels =
                    await hotelsResponse.json();

                const restaurants =
                    await restaurantsResponse.json();

                const resorts =
                    await resortsResponse.json();


                console.log("Tourist Spots:", touristSpots);
                console.log("Hotels:", hotels);
                console.log("Restaurants:", restaurants);
                console.log("Resorts:", resorts);


                setAllData({
                    touristSpots,
                    hotels,
                    restaurants,
                    resorts
                });

                setLoading(false);

            } catch (err) {

                console.error("Search API Error:", err);

                setError(
                    "Unable to load search data."
                );

                setLoading(false);
            }
        };


        fetchData();

    }, []);


    // =====================================================
    // PRE-FILL FROM HOME SEARCH
    // =====================================================

    useEffect(() => {

        if (urlDestination) {
            setSearchLocation(urlDestination);
        }

        if (urlType) {

            const normalizedType =
                urlType.toLowerCase();

            if (
                normalizedType === "tourist spots" ||
                normalizedType === "tourist-spot" ||
                normalizedType === "tourist-spots"
            ) {
                setSearchType("tourist-spots");
            }

            else if (
                normalizedType === "hotel" ||
                normalizedType === "hotels"
            ) {
                setSearchType("hotels");
            }

            else if (
                normalizedType === "restaurant" ||
                normalizedType === "restaurants"
            ) {
                setSearchType("restaurants");
            }

            else if (
                normalizedType === "resort" ||
                normalizedType === "resorts"
            ) {
                setSearchType("resorts");
            }
        }

    }, [urlDestination, urlType]);


    // =====================================================
    // CONVERT PRICE TO NUMBER
    // =====================================================

    const getPriceNumber = (price) => {

        if (price === null || price === undefined) {
            return null;
        }

        const number =
            parseFloat(
                String(price).replace(/[^0-9.]/g, "")
            );

        return isNaN(number) ? null : number;
    };


    // =====================================================
    // SEARCH
    // =====================================================

    const handleSearch = (e) => {

        e.preventDefault();

        let data = [];


        // =================================================
        // SELECT CATEGORY
        // =================================================

        if (searchType === "tourist-spots") {

            data = allData.touristSpots.map((item) => ({
                ...item,
                type: "tourist-spot"
            }));

        }

        else if (searchType === "hotels") {

            data = allData.hotels.map((item) => ({
                ...item,
                type: "hotel"
            }));

        }

        else if (searchType === "restaurants") {

            data = allData.restaurants.map((item) => ({
                ...item,
                type: "restaurant"
            }));

        }

        else if (searchType === "resorts") {

            data = allData.resorts.map((item) => ({
                ...item,
                type: "resort"
            }));

        }

        else {

            data = [
                ...allData.touristSpots.map((item) => ({
                    ...item,
                    type: "tourist-spot"
                })),

                ...allData.hotels.map((item) => ({
                    ...item,
                    type: "hotel"
                })),

                ...allData.restaurants.map((item) => ({
                    ...item,
                    type: "restaurant"
                })),

                ...allData.resorts.map((item) => ({
                    ...item,
                    type: "resort"
                }))
            ];
        }


        // =================================================
        // LOCATION FILTER
        // =================================================

        if (searchLocation) {

            data = data.filter((item) => {

                if (!item.location) {
                    return false;
                }

                return item.location
                    .toLowerCase()
                    .includes(
                        searchLocation.toLowerCase()
                    );
            });
        }


        // =================================================
        // KEYWORD FILTER
        // =================================================

        if (searchKeyword.trim()) {

            const keyword =
                searchKeyword
                    .trim()
                    .toLowerCase();

            data = data.filter((item) => {

                const name =
                    item.name?.toLowerCase() || "";

                const location =
                    item.location?.toLowerCase() || "";

                const description =
                    item.description?.toLowerCase() || "";

                return (
                    name.includes(keyword) ||
                    location.includes(keyword) ||
                    description.includes(keyword)
                );
            });
        }


        // =================================================
        // PRICE FILTER
        // =================================================

        if (minPrice || maxPrice) {

            data = data.filter((item) => {

                // Tourist spots don't have Price
                if (item.type === "tourist-spot") {
                    return true;
                }

                const price =
                    getPriceNumber(item.price);

                // Cannot filter unknown prices
                if (price === null) {
                    return false;
                }

                if (
                    minPrice &&
                    price < Number(minPrice)
                ) {
                    return false;
                }

                if (
                    maxPrice &&
                    price > Number(maxPrice)
                ) {
                    return false;
                }

                return true;
            });
        }


        // =================================================
        // RATING FILTER
        // =================================================

        if (searchRating) {

            data = data.filter((item) => {

                if (
                    item.rating === null ||
                    item.rating === undefined
                ) {
                    return false;
                }

                return Number(item.rating) >=
                    Number(searchRating);
            });
        }


        // =================================================
        // SAVE RESULTS
        // =================================================

        setResults(data);
    };


    // =====================================================
    // RESET
    // =====================================================

    const handleReset = () => {

        setSearchType("");
        setSearchLocation("");
        setMinPrice("");
        setMaxPrice("");
        setSearchRating("");
        setSearchKeyword("");

        setResults([]);
    };


    // =====================================================
    // RESULT ICON
    // =====================================================

    const getIcon = (type) => {

        if (type === "hotel") {
            return "bi-building-fill";
        }

        if (type === "restaurant") {
            return "bi-shop";
        }

        if (type === "resort") {
            return "bi-house-heart-fill";
        }

        return "bi-geo-alt-fill";
    };


    // =====================================================
    // RESULT TYPE NAME
    // =====================================================

    const getTypeName = (type) => {

        if (type === "hotel") {
            return "Hotel";
        }

        if (type === "restaurant") {
            return "Restaurant";
        }

        if (type === "resort") {
            return "Resort";
        }

        return "Tourist Spot";
    };


    // =====================================================
    // VIEW DETAILS LINK
    // =====================================================

    const getDetailsLink = (item) => {

        return `/view-details?type=${item.type}&id=${item.id}`;
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (
        <>

            {/* =====================================================
                 SEARCH HERO
                 ===================================================== */}

            <section className="search-hero">

                <div className="search-hero-overlay"></div>

                <div className="container">

                    <div className="search-hero-content">

                        <span>
                            <i className="bi bi-compass-fill"></i>
                            EXPLORE PAKISTAN
                        </span>

                        <h1>
                            Find Your
                            <strong>Perfect Place</strong>
                        </h1>

                        <p>
                            Search for tourist spots, hotels,
                            restaurants and resorts across Pakistan.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                 SEARCH SECTION
                 ===================================================== */}

            <section className="search-section">

                <div className="container">

                    <div className="search-heading text-center">

                        <span>
                            SEARCH PAKISTAN
                        </span>

                        <h2>
                            Find What You Need
                        </h2>

                        <p>
                            Select your preferences and find
                            the perfect place for your journey.
                        </p>

                    </div>


                    {/* =================================================
                         SEARCH BOX
                         ================================================= */}

                    <div className="search-box">

                        <form
                            id="searchForm"
                            onSubmit={handleSearch}
                        >

                            <div className="row g-4">


                                {/* ================= TYPE ================= */}

                                <div className="col-md-6">

                                    <label className="form-label">

                                        <i className="bi bi-grid-fill"></i>

                                        Search For

                                    </label>

                                    <select
                                        id="searchType"
                                        name="searchType"
                                        className="form-select"
                                        value={searchType}
                                        onChange={(e) =>
                                            setSearchType(e.target.value)
                                        }
                                    >

                                        <option value="">
                                            All Types
                                        </option>

                                        <option value="tourist-spots">
                                            Tourist Spot
                                        </option>

                                        <option value="hotels">
                                            Hotel
                                        </option>

                                        <option value="restaurants">
                                            Restaurant
                                        </option>

                                        <option value="resorts">
                                            Resort
                                        </option>

                                    </select>

                                </div>


                                {/* ================= LOCATION ================= */}

                                <div className="col-md-6">

                                    <label className="form-label">

                                        <i className="bi bi-geo-alt-fill"></i>

                                        Location

                                    </label>

                                    <select
                                        id="searchLocation"
                                        name="searchLocation"
                                        className="form-select"
                                        value={searchLocation}
                                        onChange={(e) =>
                                            setSearchLocation(e.target.value)
                                        }
                                    >

                                        <option value="">
                                            All Locations
                                        </option>

                                        <option value="Islamabad">
                                            Islamabad
                                        </option>

                                        <option value="Lahore">
                                            Lahore
                                        </option>

                                        <option value="Karachi">
                                            Karachi
                                        </option>

                                        <option value="Hunza">
                                            Hunza
                                        </option>

                                        <option value="Skardu">
                                            Skardu
                                        </option>

                                        <option value="Murree">
                                            Murree
                                        </option>

                                        <option value="Swat">
                                            Swat
                                        </option>

                                        <option value="Naran">
                                            Naran
                                        </option>

                                        <option value="Gwadar">
                                            Gwadar
                                        </option>

                                    </select>

                                </div>


                                {/* ================= MIN PRICE ================= */}

                                <div className="col-md-4">

                                    <label className="form-label">

                                        <i className="bi bi-cash-stack"></i>

                                        Minimum Price

                                    </label>

                                    <input
                                        id="minPrice"
                                        name="minPrice"
                                        type="number"
                                        className="form-control"
                                        placeholder="PKR"
                                        min="0"
                                        value={minPrice}
                                        onChange={(e) =>
                                            setMinPrice(e.target.value)
                                        }
                                    />

                                </div>


                                {/* ================= MAX PRICE ================= */}

                                <div className="col-md-4">

                                    <label className="form-label">

                                        <i className="bi bi-wallet2"></i>

                                        Maximum Price

                                    </label>

                                    <input
                                        id="maxPrice"
                                        name="maxPrice"
                                        type="number"
                                        className="form-control"
                                        placeholder="PKR"
                                        min="0"
                                        value={maxPrice}
                                        onChange={(e) =>
                                            setMaxPrice(e.target.value)
                                        }
                                    />

                                </div>


                                {/* ================= RATING ================= */}

                                <div className="col-md-4">

                                    <label className="form-label">

                                        <i className="bi bi-star-fill"></i>

                                        Quality

                                    </label>

                                    <select
                                        id="searchRating"
                                        name="searchRating"
                                        className="form-select"
                                        value={searchRating}
                                        onChange={(e) =>
                                            setSearchRating(e.target.value)
                                        }
                                    >

                                        <option value="">
                                            Any Rating
                                        </option>

                                        <option value="5">
                                            5 Star
                                        </option>

                                        <option value="4">
                                            4 Star & Above
                                        </option>

                                        <option value="3">
                                            3 Star & Above
                                        </option>

                                    </select>

                                </div>


                                {/* ================= KEYWORD ================= */}

                                <div className="col-12">

                                    <label className="form-label">

                                        <i className="bi bi-search"></i>

                                        Keyword

                                    </label>

                                    <input
                                        id="searchKeyword"
                                        name="searchKeyword"
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter destination, hotel or restaurant"
                                        value={searchKeyword}
                                        onChange={(e) =>
                                            setSearchKeyword(e.target.value)
                                        }
                                    />

                                </div>


                                {/* ================= BUTTONS ================= */}

                                <div className="col-12">

                                    <div className="search-buttons">

                                        <button
                                            type="submit"
                                            className="search-main-btn"
                                        >

                                            <i className="bi bi-search"></i>

                                            Search

                                        </button>


                                        <button
                                            type="button"
                                            className="search-reset-btn"
                                            id="resetSearch"
                                            onClick={handleReset}
                                        >

                                            <i className="bi bi-arrow-counterclockwise"></i>

                                            Reset

                                        </button>

                                    </div>

                                </div>

                            </div>

                        </form>

                    </div>


                    {/* =================================================
                         LOADING
                         ================================================= */}

                    {loading && (

                        <div className="search-result text-center">

                            <p>
                                Loading places...
                            </p>

                        </div>

                    )}


                    {/* =================================================
                         ERROR
                         ================================================= */}

                    {!loading && error && (

                        <div className="search-result text-center">

                            <p className="text-danger">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* =================================================
                         RESULTS
                         ================================================= */}

                    {!loading &&
                        !error &&
                        results.length > 0 && (

                            <div className="search-result">

                                <div className="row g-4">

                                    {results.map((item) => (

                                        <div
                                            className="col-lg-4 col-md-6"
                                            key={`${item.type}-${item.id}`}
                                        >

                                            <div className="info-card">

                                                {/* IMAGE */}

                                                <div className="card-image">

                                                    {item.image ? (

                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                        />

                                                    ) : (

                                                        <div className="text-center p-5">
                                                            No Image
                                                        </div>

                                                    )}

                                                </div>


                                                {/* BODY */}

                                                <div className="card-body">

                                                    <div className="card-icon">

                                                        <i
                                                            className={`bi ${getIcon(item.type)}`}
                                                        ></i>

                                                    </div>


                                                    <h4>
                                                        {item.name}
                                                    </h4>


                                                    <p>

                                                        <strong>
                                                            Type:
                                                        </strong>

                                                        {" "}

                                                        {getTypeName(item.type)}

                                                        <br />


                                                        <strong>
                                                            Location:
                                                        </strong>

                                                        {" "}

                                                        {item.location || "Not available"}


                                                        <br />


                                                        {item.price && (

                                                            <>

                                                                <strong>
                                                                    Price:
                                                                </strong>

                                                                {" "}

                                                                {item.price}

                                                                <br />

                                                            </>

                                                        )}


                                                        {item.rating !== null &&
                                                            item.rating !== undefined && (

                                                                <>

                                                                    <strong>
                                                                        Rating:
                                                                    </strong>

                                                                    {" "}

                                                                    {item.rating}

                                                                </>

                                                            )}

                                                    </p>


                                                    {item.description && (

                                                        <p>
                                                            {item.description}
                                                        </p>

                                                    )}


                                                    <Link
                                                        to={getDetailsLink(item)}
                                                        className="read-more"
                                                    >
                                                        View Details →
                                                    </Link>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        )}


                    {/* =================================================
                         NO RESULTS
                         ================================================= */}

                    {!loading &&
                        !error &&
                        results.length === 0 && (

                            <div className="search-result text-center">

                                <p>
                                    No results found. Select your preferences and click Search.
                                </p>

                            </div>

                        )}

                </div>

            </section>


            {/* =====================================================
                 QUICK SEARCH
                 ===================================================== */}

            <section className="quick-search-section">

                <div className="container">

                    <div className="search-heading text-center">

                        <span>
                            QUICK SEARCH
                        </span>

                        <h2>
                            Explore By Category
                        </h2>

                    </div>


                    <div className="row g-4">

                        <div className="col-lg-3 col-md-6">

                            <Link
                                to="/tourist-spots"
                                className="quick-card"
                            >

                                <i className="bi bi-geo-alt-fill"></i>

                                <h4>
                                    Tourist Spots
                                </h4>

                            </Link>

                        </div>


                        <div className="col-lg-3 col-md-6">

                            <Link
                                to="/hotels"
                                className="quick-card"
                            >

                                <i className="bi bi-building-fill"></i>

                                <h4>
                                    Hotels
                                </h4>

                            </Link>

                        </div>


                        <div className="col-lg-3 col-md-6">

                            <Link
                                to="/restaurants"
                                className="quick-card"
                            >

                                <i className="bi bi-shop"></i>

                                <h4>
                                    Restaurants
                                </h4>

                            </Link>

                        </div>


                        <div className="col-lg-3 col-md-6">

                            <Link
                                to="/resorts"
                                className="quick-card"
                            >

                                <i className="bi bi-house-heart-fill"></i>

                                <h4>
                                    Resorts
                                </h4>

                            </Link>

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

export default Search;
