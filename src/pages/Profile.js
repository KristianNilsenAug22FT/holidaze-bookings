import React, { useState, useEffect } from 'react';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import VenueManagerDashboard from './VenueManagerDashboard';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(''); // Ensure this is used in the component
    const [success, setSuccess] = useState('');
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [updatedDateFrom, setUpdatedDateFrom] = useState('');
    const [updatedDateTo, setUpdatedDateTo] = useState('');
    const [updatedGuests, setUpdatedGuests] = useState(1);
    const [maxGuests, setMaxGuests] = useState(null);
    const [guestWarning, setGuestWarning] = useState('');
    const [activeTab, setActiveTab] = useState('bookings'); // Active tab state

    const [updatedBio, setUpdatedBio] = useState('');
    const [updatedAvatarUrl, setUpdatedAvatarUrl] = useState('');
    const [updatedAvatarAlt, setUpdatedAvatarAlt] = useState('');
    const [updatedBannerUrl, setUpdatedBannerUrl] = useState('');
    const [updatedBannerAlt, setUpdatedBannerAlt] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('authToken');
        const apiKey = process.env.REACT_APP_API_KEY;
        const username = localStorage.getItem('username');

        if (!token || !apiKey || !username) {
            setError('User is not logged in');
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey
        };

        try {
            const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${username}?_bookings=true&_venues=true`, {
                headers
            });
            const data = await response.json();
            setProfile(data.data);
            setUpdatedBio(data.data.bio || '');
            setUpdatedAvatarUrl(data.data.avatar?.url || '');
            setUpdatedAvatarAlt(data.data.avatar?.alt || '');
            setUpdatedBannerUrl(data.data.banner?.url || '');
            setUpdatedBannerAlt(data.data.banner?.alt || '');
            console.log('Fetched profile:', data.data);
        } catch (err) {
            setError('Failed to fetch profile');
            console.error('Failed to fetch profile:', err);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) {
            return;
        }

        const token = localStorage.getItem('authToken');
        const apiKey = process.env.REACT_APP_API_KEY;

        const headers = {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey
        };

        try {
            await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${bookingId}`, {
                method: 'DELETE',
                headers
            });
            setSuccess('Booking deleted successfully');
            fetchProfile();
        } catch (err) {
            setError('Failed to delete booking');
            console.error('Failed to delete booking:', err);
        }
    };

    const handleEditBooking = async (booking) => {
        setEditingBooking(booking);
        setUpdatedDateFrom(booking.dateFrom);
        setUpdatedDateTo(booking.dateTo);
        setUpdatedGuests(booking.guests);

        try {
            const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${booking.venue.id}`);
            const data = await response.json();
            setMaxGuests(data.data.maxGuests);
            console.log('Fetched venue details:', data.data);
        } catch (error) {
            console.error('Failed to fetch venue details', error);
        }
    };

    const handleUpdateBooking = async (bookingId) => {
        if (updatedGuests > maxGuests) {
            setGuestWarning(`The maximum number of guests for this venue is ${maxGuests}.`);
            return;
        }

        const token = localStorage.getItem('authToken');
        const apiKey = process.env.REACT_APP_API_KEY;

        const headers = {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey,
            'Content-Type': 'application/json'
        };

        try {
            const response = await fetch(`https://v2.api.noroff.dev/holidaze/bookings/${bookingId}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    dateFrom: updatedDateFrom,
                    dateTo: updatedDateTo,
                    guests: parseInt(updatedGuests, 10)
                })
            });
            const data = await response.json();
            console.log('Update booking response:', data);
            setSuccess('Booking updated successfully');
            setGuestWarning('');
            fetchProfile();
            setEditingBooking(null);
        } catch (err) {
            setError('Failed to update booking');
            console.error('Failed to update booking:', err);
        }
    };

    const handleDateChange = (date) => {
        console.log('Date range change:', date);
        if (Array.isArray(date)) {
            setUpdatedDateFrom(date[0].toISOString().split('T')[0]);
            setUpdatedDateTo(date[1].toISOString().split('T')[0]);
        }
    };

    const cancelEdit = () => {
        setEditingBooking(null);
        setGuestWarning('');
    };

    const registerAsVenueManager = async () => {
        const token = localStorage.getItem('authToken');
        const apiKey = process.env.REACT_APP_API_KEY;
        const username = localStorage.getItem('username');

        const headers = {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey,
            'Content-Type': 'application/json'
        };

        try {
            await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${username}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    venueManager: true
                })
            });
            setSuccess('You are now registered as a venue manager!');
            fetchProfile();
        } catch (err) {
            setError('Failed to register as venue manager');
            console.error('Failed to register as venue manager:', err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        const apiKey = process.env.REACT_APP_API_KEY;
        const username = localStorage.getItem('username');

        const headers = {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': apiKey,
            'Content-Type': 'application/json'
        };

        const payload = {
            bio: updatedBio,
            avatar: {
                url: updatedAvatarUrl,
                alt: updatedAvatarAlt
            },
            banner: {
                url: updatedBannerUrl,
                alt: updatedBannerAlt
            }
        };

        try {
            const response = await fetch(`https://v2.api.noroff.dev/holidaze/profiles/${username}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            setSuccess('Profile updated successfully');
            setProfile(data.data);
            setEditingProfile(false);
            fetchProfile();
        } catch (err) {
            setError('Failed to update profile');
            console.error('Failed to update profile:', err);
        }
    };

    const renderBookings = () => (
        <>
            <h2>My Bookings</h2>
            {profile?.bookings && profile.bookings.length > 0 ? (
                <ul className="booking-list">
                    {profile.bookings.map(booking => (
                        booking && booking.venue ? (
                            <li key={booking.id} className="booking-item">
                                <div className="booking-details">
                                    <span>From: {new Date(booking.dateFrom).toLocaleDateString()}</span>
                                    <span>To: {new Date(booking.dateTo).toLocaleDateString()}</span>
                                    <span>Guests: {booking.guests}</span>
                                    <span>Venue: <a href={`/venue/${booking.venue.id}`}>{booking.venue.name}</a></span>
                                    <div className="booking-actions">
                                        <button className="btn btn-primary" onClick={() => handleEditBooking(booking)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteBooking(booking.id)}>Delete</button>
                                    </div>
                                </div>
                                {editingBooking && editingBooking.id === booking.id && (
                                    <div className="edit-booking-form">
                                        <h3>Editing Booking for {booking.venue.name}</h3>
                                        <AvailabilityCalendar venueId={booking.venue.id} onDateChange={handleDateChange} />
                                        <label htmlFor="updatedGuests">Guests</label>
                                        <input
                                            type="number"
                                            id="updatedGuests"
                                            value={updatedGuests}
                                            onChange={(e) => setUpdatedGuests(e.target.value)}
                                            min="1"
                                        />
                                        {guestWarning && <div className="alert alert-warning">{guestWarning}</div>}
                                        <button className="btn btn-success" onClick={() => handleUpdateBooking(booking.id)}>Save</button>
                                        <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                                    </div>
                                )}
                            </li>
                        ) : null
                    ))}
                </ul>
            ) : (
                <p>You have no bookings.</p>
            )}
        </>
    );

    const renderVenues = () => (
        <>
            <VenueManagerDashboard
                isVenueManager={profile?.venueManager}
                onRegisterAsVenueManager={registerAsVenueManager}
            />
        </>
    );

    const renderProfileEditForm = () => (
        <form onSubmit={handleUpdateProfile} className="edit-profile-form">
            <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                    id="bio"
                    value={updatedBio}
                    onChange={(e) => setUpdatedBio(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="avatarUrl">Avatar URL</label>
                <input
                    type="text"
                    id="avatarUrl"
                    value={updatedAvatarUrl}
                    onChange={(e) => setUpdatedAvatarUrl(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="avatarAlt">Avatar Alt Text</label>
                <input
                    type="text"
                    id="avatarAlt"
                    value={updatedAvatarAlt}
                    onChange={(e) => setUpdatedAvatarAlt(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="bannerUrl">Banner URL</label>
                <input
                    type="text"
                    id="bannerUrl"
                    value={updatedBannerUrl}
                    onChange={(e) => setUpdatedBannerUrl(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label htmlFor="bannerAlt">Banner Alt Text</label>
                <input
                    type="text"
                    id="bannerAlt"
                    value={updatedBannerAlt}
                    onChange={(e) => setUpdatedBannerAlt(e.target.value)}
                    className="form-control"
                />
            </div>
            <button type="submit" className="btn btn-success">Save Changes</button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingProfile(false)}>Cancel</button>
        </form>
    );

    return (
        <div className="container">
            <div className="profile-header">
                {profile?.banner && <img src={profile.banner.url} alt={profile.banner.alt} className="banner" />}
                <div className="profile-info">
                    {profile?.avatar && <img src={profile.avatar.url} alt={profile.avatar.alt} className="avatar" />}
                    <div className="profile-details">
                        <h1>{profile?.name}'s Profile</h1>
                        <p>Email: {profile?.email}</p>
                        <p>Bio: {profile?.bio}</p>
                        <button className="profilebtn btn btn-primary" onClick={() => setEditingProfile(true)}>Edit Profile</button>
                    </div>
                </div>
            </div>
            {editingProfile && renderProfileEditForm()}
            <nav className="nav-tabs">
                <button className={`tab ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>My Bookings</button>
                <button className={`tab ${activeTab === 'venues' ? 'active' : ''}`} onClick={() => setActiveTab('venues')}>My Venues</button>
            </nav>
            <div className="tab-content">
                {activeTab === 'bookings' ? renderBookings() : renderVenues()}
            </div>
            {success && <div className="alert alert-success mt-3">{success}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>} {/* Add error message display */}
        </div>
    );
}

export default Profile;
