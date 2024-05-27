import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function AvailabilityCalendar({ venueId, onDateChange }) {
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDates, setSelectedDates] = useState(null);

    useEffect(() => {
        const fetchAvailableDates = async () => {
            try {
                const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${venueId}?_bookings=true`);
                const data = await response.json();
                const bookings = data.data.bookings;
                const bookedDates = bookings.map(booking => ({
                    start: new Date(booking.dateFrom).setHours(0, 0, 0, 0),
                    end: new Date(booking.dateTo).setHours(23, 59, 59, 999)
                }));
                setAvailableDates(bookedDates);
                console.log('Fetched available dates:', bookedDates);
            } catch (error) {
                console.error('Failed to fetch available dates', error);
            }
        };

        fetchAvailableDates();
    }, [venueId]);

    const isTileDisabled = ({ date }) => {
        return (
            date < new Date().setHours(0, 0, 0, 0) || // Disable past dates
            availableDates.some(booking => date >= booking.start && date <= booking.end)
        );
    };

    const isValidDateRange = (dateRange) => {
        if (dateRange.length !== 2) return false;
        const [start, end] = dateRange;

        for (const booking of availableDates) {
            if (
                (start <= booking.end && end >= booking.start)
            ) {
                console.log('Invalid date range due to overlap:', start, end, booking);
                return false;
            }
        }
        return true;
    };

    const handleDateChange = (date) => {
        if (Array.isArray(date)) {
            const normalizedStartDate = new Date(date[0]).setHours(0, 0, 0, 0);
            const normalizedEndDate = new Date(date[1]).setHours(23, 59, 59, 999);
            const normalizedDateRange = [normalizedStartDate, normalizedEndDate];

            console.log('Selected date range:', normalizedDateRange);

            if (isValidDateRange(normalizedDateRange)) {
                setSelectedDates(date);
                onDateChange(date);
            } else {
                alert('The selected dates overlap with existing bookings or are invalid.');
                setSelectedDates(null);
                onDateChange(null);
            }
        }
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handleDateChange}
                value={selectedDates}
                tileDisabled={isTileDisabled}
                selectRange
            />
        </div>
    );
}

export default AvailabilityCalendar;
