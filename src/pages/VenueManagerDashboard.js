import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function VenueManagerDashboard({ isVenueManager, onRegisterAsVenueManager }) {
  const [venues, setVenues] = useState([]);
  const [newVenue, setNewVenue] = useState({
    name: "",
    description: "",
    media: [{ url: "", alt: "" }],
    price: 0,
    maxGuests: 0,
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: 0,
      lng: 0,
    },
  });
  const [error, setError] = useState("");
  const [isCreatingVenue, setIsCreatingVenue] = useState(false);

  const fetchVenues = async () => {
    const token = localStorage.getItem("authToken");
    const apiKey = process.env.REACT_APP_API_KEY;
    const username = localStorage.getItem("username");

    if (!token || !apiKey || !username) {
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    };

    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/profiles/${username}/venues?_bookings=true`,
        {
          headers,
        },
      );
      const data = await response.json();
      setVenues(data.data);
    } catch (err) {
      console.error("Failed to fetch venues:", err);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [section, key] = name.split(".");
      setNewVenue((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setNewVenue((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleCreateVenue = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const apiKey = process.env.REACT_APP_API_KEY;

    if (!token || !apiKey) {
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
      "Content-Type": "application/json",
    };

    const payload = {
      name: newVenue.name,
      description: newVenue.description,
      media: newVenue.media.filter((media) => media.url !== ""),
      price: Number(newVenue.price),
      maxGuests: Number(newVenue.maxGuests),
      meta: newVenue.meta,
      location: newVenue.location,
    };

    try {
      await fetch("https://v2.api.noroff.dev/holidaze/venues", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      fetchVenues();
      setNewVenue({
        name: "",
        description: "",
        media: [{ url: "", alt: "" }],
        price: 0,
        maxGuests: 0,
        meta: {
          wifi: false,
          parking: false,
          breakfast: false,
          pets: false,
        },
        location: {
          address: "",
          city: "",
          zip: "",
          country: "",
          continent: "",
          lat: 0,
          lng: 0,
        },
      });
      setIsCreatingVenue(false);
    } catch (err) {
      setError(
        "Failed to create venue. Please check the input data and try again.",
      );
    }
  };

  const handleDeleteVenue = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this venue?",
    );
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem("authToken");
    const apiKey = process.env.REACT_APP_API_KEY;

    if (!token || !apiKey) {
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    };

    try {
      await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
        method: "DELETE",
        headers,
      });
      fetchVenues();
    } catch (err) {
      console.error("Failed to delete venue:", err);
    }
  };

  const handleDeregister = async () => {
    const confirmDeregister = window.confirm(
      "Are you sure you want to de-register as a venue manager? This will delete all your venues.",
    );
    if (!confirmDeregister) {
      return;
    }

    const token = localStorage.getItem("authToken");
    const apiKey = process.env.REACT_APP_API_KEY;
    const username = localStorage.getItem("username");

    if (!token || !apiKey || !username) {
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    };

    try {
      // Delete all venues
      await Promise.all(
        venues.map((venue) =>
          fetch(`https://v2.api.noroff.dev/holidaze/venues/${venue.id}`, {
            method: "DELETE",
            headers,
          }),
        ),
      );
      // Update user profile to remove venue manager status
      await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${username}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          venueManager: false,
        }),
      });
      // Reload to reflect changes
      window.location.reload();
    } catch (err) {
      console.error("Failed to deregister as venue manager:", err);
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>Venue Manager Dashboard</h2>
      {isVenueManager ? (
        <>
          <h3>My Venues</h3>
          {venues.length > 0 ? (
            <ul className="venue-list">
              {venues.map((venue) => (
                <li key={venue.id} className="venue-item">
                  <div className="venue-details">
                    <span>
                      Venue: <Link to={`/venue/${venue.id}`}>{venue.name}</Link>
                    </span>
                    <span>Description: {venue.description}</span>
                  </div>
                  <div className="venue-actions">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteVenue(venue.id)}
                    >
                      Delete
                    </button>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id={`dropdownMenuButton-${venue.id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Bookings
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby={`dropdownMenuButton-${venue.id}`}
                      >
                        {venue.bookings && venue.bookings.length > 0 ? (
                          venue.bookings.map((booking) => (
                            <li key={booking.id} className="dropdown-item">
                              <div>
                                <strong>From:</strong>{" "}
                                {new Date(
                                  booking.dateFrom,
                                ).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>To:</strong>{" "}
                                {new Date(booking.dateTo).toLocaleDateString()}
                              </div>
                              <div>
                                <strong>Guests:</strong> {booking.guests}
                              </div>
                              <div>
                                <strong>Customer:</strong>{" "}
                                <Link to={`/profile/${booking.customer.name}`}>
                                  {booking.customer.name}
                                </Link>
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="dropdown-item">No bookings</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no venues.</p>
          )}
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary mt-3"
              onClick={() => setIsCreatingVenue(!isCreatingVenue)}
            >
              {isCreatingVenue ? "Hide" : "Create New Venue"}
            </button>
            <button
              className="deregisterbtn btn btn-warning mt-3 ms-2"
              onClick={handleDeregister}
            >
              De-register as Venue Manager
            </button>
          </div>
          {isCreatingVenue && (
            <form onSubmit={handleCreateVenue} className="mt-3">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={newVenue.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={newVenue.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={newVenue.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="maxGuests" className="form-label">
                  Max Guests
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="maxGuests"
                  name="maxGuests"
                  value={newVenue.maxGuests}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mediaUrl" className="form-label">
                  Media URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mediaUrl"
                  name="media[0].url"
                  value={newVenue.media[0].url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mediaAlt" className="form-label">
                  Media Alt Text
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mediaAlt"
                  name="media[0].alt"
                  value={newVenue.media[0].alt}
                  onChange={handleInputChange}
                />
              </div>
              <h4>Meta</h4>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="wifi"
                  name="meta.wifi"
                  checked={newVenue.meta.wifi}
                  onChange={handleInputChange}
                />
                <label htmlFor="wifi" className="form-check-label">
                  WiFi
                </label>
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="parking"
                  name="meta.parking"
                  checked={newVenue.meta.parking}
                  onChange={handleInputChange}
                />
                <label htmlFor="parking" className="form-check-label">
                  Parking
                </label>
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="breakfast"
                  name="meta.breakfast"
                  checked={newVenue.meta.breakfast}
                  onChange={handleInputChange}
                />
                <label htmlFor="breakfast" className="form-check-label">
                  Breakfast
                </label>
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="pets"
                  name="meta.pets"
                  checked={newVenue.meta.pets}
                  onChange={handleInputChange}
                />
                <label htmlFor="pets" className="form-check-label">
                  Pets
                </label>
              </div>
              <h4>Location</h4>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="location.address"
                  value={newVenue.location.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="city"
                  name="location.city"
                  value={newVenue.location.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="zip" className="form-label">
                  Zip
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="zip"
                  name="location.zip"
                  value={newVenue.location.zip}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="country" className="form-label">
                  Country
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="country"
                  name="location.country"
                  value={newVenue.location.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="continent" className="form-label">
                  Continent
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="continent"
                  name="location.continent"
                  value={newVenue.location.continent}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lat" className="form-label">
                  Latitude
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="lat"
                  name="location.lat"
                  value={newVenue.location.lat}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lng" className="form-label">
                  Longitude
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="lng"
                  name="location.lng"
                  value={newVenue.location.lng}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Create Venue
              </button>
            </form>
          )}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </>
      ) : (
        <div className="text-center mt-3">
          <p>Register as a venue manager to create and manage your venues.</p>
          <button
            className="btn btn-primary"
            onClick={onRegisterAsVenueManager}
          >
            Register as Venue Manager
          </button>
        </div>
      )}
    </div>
  );
}

export default VenueManagerDashboard;
