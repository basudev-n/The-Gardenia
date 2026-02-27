import React, { useState } from 'react';
import { Waves, Trees, Dumbbell, Users, Shield, Baby, Car, Film, Heart, Coffee, Armchair, Sparkles, Circle, Disc, Droplets, Gamepad2, Laptop, BedDouble, Gamepad, Sun, Wind, Activity, Bath, Home, School, Stethoscope, Building, Landmark, Gem, TowerControl, Leaf } from 'lucide-react';
import { mockData } from '../mock/data';

const iconMap = {
  Waves, Trees, Dumbbell, Users, Shield, Baby, Car, Film, Heart, Coffee,
  Armchair, Sparkles, Circle, Disc, Droplets, Gamepad2, Laptop, BedDouble,
  Gamepad, Sun, Wind, Activity, Bath, Home, School, Stethoscope, Building
};

// Group regular amenities into categories
const categories = [
  {
    label: "Wellness & Fitness",
    icons: ["Dumbbell", "Heart", "Armchair", "Sparkles", "Droplets", "Activity", "Bath"],
  },
  {
    label: "Recreation & Fun",
    icons: ["Film", "Circle", "Disc", "Gamepad2", "Gamepad", "Baby", "Waves"],
  },
  {
    label: "Work & Social",
    icons: ["Users", "Coffee", "Laptop", "BedDouble", "Sun", "Wind"],
  },
  {
    label: "Services & Safety",
    icons: ["Shield", "Car", "Home", "School", "Stethoscope", "Building"],
  },
];

const Amenities = () => {
  const { amenities } = mockData;
  const featuredAmenities = amenities.filter(a => a.featured);
  const regularAmenities = amenities.filter(a => !a.featured);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredAmenities = activeCategory === "All"
    ? regularAmenities
    : regularAmenities.filter(a => {
        const cat = categories.find(c => c.label === activeCategory);
        return cat?.icons.includes(a.icon);
      });

  return (
    <section id="amenities" className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-emerald-600 font-semibold text-sm tracking-widest uppercase mb-3">Lifestyle</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            World-Class Amenities
          </h2>
          <p className="text-lg text-gray-500">
            28+ premium facilities designed for comfort, wellness, and entertainment
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {[
            {
              number: "28+",
              label: "Premium Amenities",
              subtitle: "Curated for leisure and wellness",
              icon: Landmark,
            },
            {
              number: "252",
              label: "Luxury Homes",
              subtitle: "Thoughtfully crafted residences",
              icon: Gem,
            },
            {
              number: "2",
              label: "Iconic Towers",
              subtitle: "Skyline-defining architecture",
              icon: TowerControl,
            },
            {
              number: "∞",
              label: "Lifestyle Value",
              subtitle: "Comfort that grows with you",
              icon: Leaf,
            },
          ].map((stat, i) => {
            const StatIcon = stat.icon;

            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-emerald-100/80 bg-white/90 p-6 shadow-[0_10px_35px_rgba(16,185,129,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,185,129,0.16)]"
              >
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-emerald-100/70 transition-colors duration-300 group-hover:bg-emerald-200/80" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-4xl font-bold leading-none text-emerald-600">{stat.number}</p>
                    <p className="mt-3 text-base font-semibold text-gray-900">{stat.label}</p>
                    <p className="mt-1 text-sm text-gray-500">{stat.subtitle}</p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                    <StatIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Amenities — Big Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {featuredAmenities.map((amenity) => {
            const IconComponent = iconMap[amenity.icon];
            return (
              <div
                key={amenity.id}
                className="group relative overflow-hidden rounded-3xl shadow-xl h-96 cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={amenity.image}
                  alt={amenity.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Top badge */}
                <div className="absolute top-5 left-5">
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                    Featured
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                      {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{amenity.name}</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{amenity.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {["All", ...categories.map(c => c.label)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:text-emerald-600 border border-gray-200 hover:border-emerald-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Regular Amenities Grid */}
        <div className="flex flex-wrap justify-center gap-4">
          {filteredAmenities.map((amenity) => {
            const IconComponent = iconMap[amenity.icon];
            return (
              <div
                key={amenity.id}
                className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex items-start gap-4 w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)]"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 transition-colors duration-300">
                  {IconComponent && (
                    <IconComponent className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors duration-300">
                    {amenity.name}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{amenity.description}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Amenities;
