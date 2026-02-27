import React from "react";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Amenities from "@/components/Amenities";
import Gallery from "@/components/Gallery";
import FloorPlans from "@/components/FloorPlans";
import Location from "@/components/Location";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Amenities />
      <Gallery />
      <FloorPlans />
      <Location />
      <Contact />
      <Footer />
      <FloatingCTA />
      <Toaster />
    </div>
  );
}

export default App;
