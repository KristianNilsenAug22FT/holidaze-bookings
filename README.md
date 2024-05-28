# Holidaze Booking Application

Holidaze is a modern front-end accommodation booking application developed to facilitate booking holidays at various venues. This project covers both the customer-facing and admin-facing sides of the website. Users can browse and book holidays at different venues, while registered venue managers can create, manage, and oversee bookings at their venues.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Testing](#testing)

## Project Overview

Holidaze is built using React and interacts with a backend API to manage all booking and venue data. The application has two main components:

1. **Customer-Facing Side**: Allows users to browse, search, and book venues.
2. **Admin-Facing Side**: Allows venue managers to register, create, and manage their venues and associated bookings.

## Features

### Customer-Facing Side

- Browse and search for venues.
- View detailed information about each venue, including images, description, facilities, and location.
- Make bookings for available dates.
- Register and log in to manage personal bookings.

### Admin-Facing Side

- Register as a venue manager.
- Create, update, and delete venues.
- Manage bookings for their venues.
- View and manage all venues and bookings through a user-friendly dashboard.

## Setup and Installation

### Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn (>= 1.x)

### Obtaining an API Key

- Information on how to get an API key can be found i the Noroff API Documentation

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd holidaze-bookings
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add your environment variables:

   ```env
   REACT_APP_API_URL=https://v2.api.noroff.dev
   REACT_APP_API_KEY=your-api-key-here
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes. Your app is ready to be deployed!

### `npm run eject`

Note: this is a one-way operation. Once you `eject`, you can't go back! This command will remove the single build dependency from your project.

## Project Structure

```plaintext
holidaze-bookings/
├── public/
│ ├── \_redirects
│ ├── 404.html
│ ├── favicon.ico
│ ├── index.html
│ ├── logo192.png
│ ├── logo512.png
│ ├── manifest.json
│ └── robots.txt
├── src/
│ ├── assets/
│ │ ├── images/
│ │ │ └── placeholder.png
│ │ └── styles/
│ │ └── styles.css
│ ├── components/
│ │ ├── common/
│ │ │ ├── Footer.js
│ │ │ └── Header.js
│ │ ├── forms/
│ │ │ └── BookingForm.js
│ │ ├── layout/
│ │ │ └── Layout.js
│ │ └── widget/
│ │ └── AvailabilityCalendar.js
│ ├── pages/
│ │ ├── HomePage.js
│ │ ├── Login.js
│ │ ├── Profile.js
│ │ ├── UserProfile.js
│ │ ├── VenueDetail.js
│ │ └── VenueManagerDashboard.js
│ ├── App.css
│ ├── App.js
│ ├── App.test.js
│ ├── index.css
│ ├── index.js
│ ├── logo.svg
│ ├── reportWebVitals.js
│ └── setupTests.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## API Integration

The application interacts with the Holidaze API to manage bookings and venues. Ensure you have the correct API key set up in your `.env` file.

## Testing

Run the test suite using the following command:

```bash
npm test
```
