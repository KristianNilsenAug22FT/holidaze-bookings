import React from 'react';

function Footer() {
    return (
        <footer className="bg-dark text-white p-3 mt-auto">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} Holidaze. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
