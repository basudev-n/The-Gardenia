import React from "react";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import AdminDashboard from "@/components/AdminDashboard";
import LandingPage from "@/pages/LandingPage";
import ThankYouPage from "@/pages/ThankYouPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;