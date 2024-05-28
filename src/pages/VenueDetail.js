import React, { useState, useEffect, useCallback } from "react";
import BookingForm from "../components/forms/BookingForm";
import { useParams, Link } from "react-router-dom";
import placeholder from "../assets/images/placeholder.png";

function VenueDetail() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchVenue = useCallback(async () => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true`,
        {
          headers: {
            "X-Noroff-API-Key": apiKey,
          },
        },
      );
      const data = await response.json();
      setVenue(data.data);
    } catch (error) {
      console.error("Failed to fetch venue:", error);
    }
  }, [id]);

  const fetchBookings = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const apiKey = process.env.REACT_APP_API_KEY;
      await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        },
      );
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
    fetchVenue();
    fetchBookings();
  }, [fetchVenue, fetchBookings]);

  const handleBookingSuccess = () => {
    fetchBookings();
    setMessage("Booking successful!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleImageError = (e) => {
    e.target.src = placeholder;
  };

  if (!venue) {
    return <div>Loading...</div>;
  }

  return (
    <div className="venue-container">
      <h1 className="venue-title">{venue.name}</h1>
      <p className="venue-description">{venue.description}</p>
      {venue.media && venue.media.length > 0 ? (
        <img
          src={venue.media[0].url}
          alt={venue.name}
          className="venue-image"
          onError={handleImageError}
        />
      ) : (
        <img
          src={placeholder}
          alt={venue.name}
          className="venue-image"
          onError={handleImageError}
        />
      )}
      <div className="venue-details-section">
        <div className="venue-info">
          <h3>Venue details</h3>
          <span>
            <strong>Price:</strong> ${venue.price}
          </span>
          <span>
            <strong>Max Guests:</strong> {venue.maxGuests}
          </span>
          <span>
            <strong>Rating:</strong> {venue.rating}
          </span>
          <span>
            <strong>Created:</strong>{" "}
            {new Date(venue.created).toLocaleDateString()}
          </span>
          <span>
            <strong>Updated:</strong>{" "}
            {new Date(venue.updated).toLocaleDateString()}
          </span>
          {venue.owner && (
            <span>
              <strong>Owner:</strong>{" "}
              <Link to={`/profile/${venue.owner.name}`}>
                {venue.owner.name}
              </Link>
            </span>
          )}
        </div>
        <div className="venue-meta">
          <h3>Facilities</h3>
          <span>
            <strong>WiFi:</strong> {venue.meta.wifi ? "Yes" : "No"}
          </span>
          <span>
            <strong>Parking:</strong> {venue.meta.parking ? "Yes" : "No"}
          </span>
          <span>
            <strong>Breakfast:</strong> {venue.meta.breakfast ? "Yes" : "No"}
          </span>
          <span>
            <strong>Pets:</strong> {venue.meta.pets ? "Yes" : "No"}
          </span>
        </div>
        <div className="venue-location">
          <h3>Location</h3>
          <span>
            <strong>Address:</strong> {venue.location.address}
          </span>
          <span>
            <strong>City:</strong> {venue.location.city}
          </span>
          <span>
            <strong>Zip:</strong> {venue.location.zip}
          </span>
          <span>
            <strong>Country:</strong> {venue.location.country}
          </span>
          <span>
            <strong>Continent:</strong> {venue.location.continent}
          </span>
          <span>
            <strong>Latitude:</strong> {venue.location.lat}
          </span>
          <span>
            <strong>Longitude:</strong> {venue.location.lng}
          </span>
        </div>
      </div>
      {message && <div className="alert alert-success mt-3">{message}</div>}
      <div className="book-now-section">
        {isLoggedIn ? (
          <>
            <h2 className="book-now-title">Book Now</h2>
            <BookingForm venueId={id} onBookingSuccess={handleBookingSuccess} />
          </>
        ) : (
          <div className="alert alert-warning mt-3">
            Please log in to make a booking.
          </div>
        )}
      </div>
    </div>
  );
}

export default VenueDetail;
