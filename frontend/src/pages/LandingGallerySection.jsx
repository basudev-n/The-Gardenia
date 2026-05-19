import React, { useState, useEffect } from 'react';
import { mockData } from '@/mock/data';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

const LandingGallerySection = () => {
  const { gallery } = mockData;
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', ...new Set(gallery.map((item) => item.category))];

  const filtered = activeFilter === 'All' ? gallery : gallery.filter((item) => item.category === activeFilter);

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

  useEffect(() => {
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
    <section id="gallery" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Gallery</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Visual Tour</h2>
        <p className="mt-4 text-lg text-slate-600">Explore the beauty and elegance of The Gardenia</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              activeFilter === cat
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px]">
        {filtered.map((item, index) => {
          const isFeatured = index === 0 || index === 6;
          return (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className={`group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer ${
                isFeatured ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-white font-bold text-sm mt-0.5">{item.title}</h3>
                  </div>
                  <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button onClick={closeLightbox} className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10">
            <X className="w-5 h-5" />
          </button>

          <button onClick={goPrev} className="absolute left-4 md:left-8 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={filtered[selectedIndex].image} alt={filtered[selectedIndex].title} className="w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="text-center mt-4">
              <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">{filtered[selectedIndex].category}</span>
              <h3 className="text-white font-bold text-xl mt-1">{filtered[selectedIndex].title}</h3>
              <p className="text-gray-500 text-sm mt-1">{selectedIndex + 1} / {filtered.length}</p>
            </div>
          </div>

          <button onClick={goNext} className="absolute right-4 md:right-8 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white z-10">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};

export default LandingGallerySection;
