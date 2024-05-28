import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../src/assets/styles/styles.css"; // Your styles file

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
