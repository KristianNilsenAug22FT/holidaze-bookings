import React, { useState, useEffect } from "react";
import AvailabilityCalendar from "../widget/AvailabilityCalendar";

function BookingForm({ venueId, onBookingSuccess }) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [maxGuests, setMaxGuests] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${venueId}`,
          {
            headers: {
              "X-Noroff-API-Key": process.env.REACT_APP_API_KEY,
            },
          },
        );
        const data = await response.json();
        setMaxGuests(data.data.maxGuests);
      } catch (error) {
        console.error("Failed to fetch venue details", error);
      }
    };

    fetchVenue();
  }, [venueId]);

  const handleDateChange = (date) => {
    if (Array.isArray(date)) {
      setDateFrom(date[0].toISOString().split("T")[0]);
      setDateTo(date[1].toISOString().split("T")[0]);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");
    if (guests > maxGuests) {
      setMessage(
        `The maximum number of guests for this venue is ${maxGuests}.`,
      );
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      const apiKey = process.env.REACT_APP_API_KEY;
      if (!token || !apiKey) {
        setMessage("You must be logged in to make a booking.");
        return;
      }
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify({
            dateFrom,
            dateTo,
            guests,
            venueId,
          }),
        },
      );
      if (response.ok) {
        setMessage("Booking successful!");
        onBookingSuccess();
      } else {
        setMessage("Booking failed. Please try again.");
      }
    } catch (error) {
      setMessage("Booking failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleBooking}>
      <AvailabilityCalendar venueId={venueId} onDateChange={handleDateChange} />
      <div className="mb-3 numberofguests">
        <label htmlFor="guests" className="form-label">
          Number of guests
        </label>
        <input
          type="number"
          className="form-control"
          id="guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          required
          min="1"
          max={maxGuests}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Book Now
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </form>
  );
}

export default BookingForm;
