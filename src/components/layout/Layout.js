import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";

function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
