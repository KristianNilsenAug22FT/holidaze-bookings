import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/styles.css";
import { debounce } from "lodash";
import placeholder from "../assets/images/placeholder.png";

function HomePage() {
  const [venues, setVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchVenues(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const fetchVenues = async (page, search) => {
    try {
      const endpoint = search
        ? `${process.env.REACT_APP_API_URL}/holidaze/venues/search`
        : `${process.env.REACT_APP_API_URL}/holidaze/venues`;

      const params = new URLSearchParams({
        limit: itemsPerPage,
        page: page,
      });

      if (search) {
        params.append("q", search);
      }

      const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers: {
          "X-Noroff-API-Key": process.env.REACT_APP_API_KEY,
        },
      });
      const data = await response.json();
      const fetchedVenues = data.data;

      setVenues(fetchedVenues);
      setTotalPages(Math.ceil(data.meta.totalCount / itemsPerPage));
      setNoResults(fetchedVenues.length === 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageError = (e) => {
    e.target.src = placeholder;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to the top when the page changes
  };

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  if (!Array.isArray(venues)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Holidaze Venues</h1>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search for venues..."
        onChange={handleSearchChange}
      />
      {noResults ? (
        <div>No venues match your search query.</div>
      ) : (
        <>
          <div className="row">
            {venues.map((venue) => (
              <div key={venue.id} className="col-md-4 d-flex">
                <Link
                  to={`/venue/${venue.id}`}
                  className="card mb-4 text-decoration-none text-dark"
                >
                  {venue.media && venue.media.length > 0 ? (
                    <img
                      src={venue.media[0].url}
                      className="card-img-top"
                      alt={venue.name}
                      onError={handleImageError}
                    />
                  ) : (
                    <img
                      src={placeholder}
                      className="card-img-top"
                      alt={venue.name}
                      onError={handleImageError}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{venue.name}</h5>
                    <p className="card-text">{venue.description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pagesToShow = 4; // Number of pages to show in the pagination component
  const halfPagesToShow = Math.floor(pagesToShow / 2);

  const startPage = Math.max(1, currentPage - halfPagesToShow);
  const endPage = Math.min(totalPages, currentPage + halfPagesToShow);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(1)}>
            First
          </button>
        </li>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        {startPage > 1 && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )}
        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${page === currentPage ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </button>
          </li>
        ))}
        {endPage < totalPages && (
          <li className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        )}
        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(totalPages)}
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default HomePage;
