import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Toaster } from "./components/ui/toaster";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster/>
    </BrowserRouter>
  </StrictMode>
);