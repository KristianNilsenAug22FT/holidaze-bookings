import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      const apiKey = process.env.REACT_APP_API_KEY;

      if (!token || !apiKey || !username) {
        setError("User is not logged in");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      };

      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}`,
          {
            headers,
          },
        );
        const data = await response.json();
        setProfile(data.data);
        console.log("Fetched profile:", data.data);
      } catch (err) {
        setError("Failed to fetch profile");
        console.error("Failed to fetch profile:", err);
      }
    };

    const fetchVenues = async () => {
      const token = localStorage.getItem("authToken");
      const apiKey = process.env.REACT_APP_API_KEY;

      if (!token || !apiKey || !username) {
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      };

      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${username}/venues`,
          {
            headers,
          },
        );
        const data = await response.json();
        setVenues(data.data);
        console.log("Fetched venues:", data.data);
      } catch (err) {
        console.error("Failed to fetch venues:", err);
      }
    };

    fetchProfile();
    fetchVenues();
  }, [username]);

  return (
    <div className="container">
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {profile ? (
        <div className="profile-container">
          {profile.banner && (
            <img
              src={profile.banner.url}
              alt={profile.banner.alt}
              className="banner"
            />
          )}
          <div className="profile-info">
            {profile.avatar && (
              <img
                src={profile.avatar.url}
                alt={profile.avatar.alt}
                className="avatar"
              />
            )}
            <div className="profile-details">
              <h1>{profile.name}'s Profile</h1>
              <p>Email: {profile.email}</p>
              <p>Bio: {profile.bio}</p>
            </div>
          </div>
          <div className="user-venues">
            <h2>Venues</h2>
            {venues.length > 0 ? (
              <ul className="venue-list">
                {venues.map((venue) => (
                  <li key={venue.id}>
                    <Link to={`/venue/${venue.id}`}>{venue.name}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>This user has no venues.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default UserProfile;
