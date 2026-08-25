import React, { useEffect } from "react";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import LandingPage from "@/pages/LandingPage";
import ThankYouPage from "@/pages/ThankYouPage";
import { initializeMetaPixel } from "@/lib/metaPixel";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

function MetaPixelTracker() {
  const location = useLocation();
  useEffect(() => {
    initializeMetaPixel();
  }, [location.pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <MetaPixelTracker />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;