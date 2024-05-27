import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VenueDetail from './pages/VenueDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';  // Import the new UserProfile component
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    const [globalMessage, setGlobalMessage] = useState('');

    return (
        <Router>
            <Header setGlobalMessage={setGlobalMessage} />
            {globalMessage && <div className="alert alert-success">{globalMessage}</div>}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/venue/:id" element={<VenueDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:username" element={<UserProfile />} />  {/* Add the new route for user profiles */}
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
