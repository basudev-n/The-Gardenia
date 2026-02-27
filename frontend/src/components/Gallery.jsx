import React, { useState } from 'react';
import { mockData } from '../mock/data';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const { gallery } = mockData;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...new Set(gallery.map(item => item.category))];

  const filtered = activeFilter === 'All'
    ? gallery
    : gallery.filter(item => item.category === activeFilter);

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goPrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % filtered.length);
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKey = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') setSelectedIndex((p) => (p - 1 + filtered.length) % filtered.length);
      if (e.key === 'ArrowRight') setSelectedIndex((p) => (p + 1) % filtered.length);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, filtered.length]);

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-emerald-600 font-semibold text-sm tracking-widest uppercase mb-3">Gallery</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Visual Gallery</h2>
          <p className="text-lg text-gray-500">
            Explore the beauty and elegance of The Gardenia
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeFilter === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:text-emerald-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {filtered.map((item, index) => {
            // Make first and every 7th item a large featured card
            const isFeatured = index === 0 || index === 6;
            return (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer ${
                  isFeatured ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                    <div>
                      <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">{item.category}</span>
                      <h3 className="text-white font-bold text-sm mt-0.5">{item.title}</h3>
                    </div>
                    <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          <button
            onClick={goPrev}
            className="absolute left-4 md:left-8 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filtered[selectedIndex].image}
              alt={filtered[selectedIndex].title}
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
            <div className="text-center mt-4">
              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                {filtered[selectedIndex].category}
              </span>
              <h3 className="text-white font-bold text-xl mt-1">
                {filtered[selectedIndex].title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {selectedIndex + 1} / {filtered.length}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            className="absolute right-4 md:right-8 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Gallery;