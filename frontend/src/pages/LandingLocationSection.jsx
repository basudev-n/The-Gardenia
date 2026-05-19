import React, { useState } from 'react';
import { mockData } from '@/mock/data';
import { Clock, GraduationCap, Hospital, Plane, School, Trees, Droplets, Landmark, Bus, Train, MapPin } from 'lucide-react';

const iconMap = { GraduationCap, Hospital, Plane, School, Trees, Droplets, Landmark, Bus, Train };

const categories = [
  { key: 'healthcare', label: 'Healthcare', icon: Hospital, color: 'bg-red-50 text-red-600', activeColor: 'bg-red-600', dot: 'bg-red-400' },
  { key: 'schools', label: 'Schools', icon: School, color: 'bg-blue-50 text-blue-600', activeColor: 'bg-blue-600', dot: 'bg-blue-400' },
  { key: 'education', label: 'Education', icon: GraduationCap, color: 'bg-purple-50 text-purple-600', activeColor: 'bg-purple-600', dot: 'bg-purple-400' },
  { key: 'greenCulture', label: 'Green & Culture', icon: Trees, color: 'bg-emerald-50 text-emerald-600', activeColor: 'bg-emerald-600', dot: 'bg-emerald-400' },
  { key: 'transport', label: 'Transport', icon: Bus, color: 'bg-orange-50 text-orange-600', activeColor: 'bg-orange-600', dot: 'bg-orange-400' },
];

const LandingLocationSection = () => {
  const { location } = mockData;
  const [activeCategory, setActiveCategory] = useState('healthcare');

  const activeCat = categories.find((c) => c.key === activeCategory);
  const ActiveIcon = activeCat?.icon;

  return (
    <>
      <div id="connectivity" />
      <section id="location" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Location</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Prime Location, Perfect Connectivity</h2>
        <p className="mt-4 text-lg text-slate-600">Strategically located with excellent connectivity to all major destinations</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
            <div className="border-b border-slate-200 p-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-4">Nearby</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const CatIcon = cat.icon;
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isActive ? `${cat.activeColor} text-white shadow-md` : `${cat.color}`
                      }`}
                    >
                      <CatIcon className="w-3 h-3" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {location.nearby[activeCategory]?.map((place, index) => {
                const IconComponent = iconMap[place.icon] || ActiveIcon;
                return (
                  <div key={index} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activeCat?.dot} flex-shrink-0`} />
                      <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-600 transition-colors">{place.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-semibold">{place.distance}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-emerald-600 text-white rounded-b-[2rem] p-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm mb-1">Address</p>
                  <p className="text-emerald-100 text-sm leading-relaxed">{location.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-[2rem] overflow-hidden shadow-[0_20px_80px_rgba(15,23,42,0.08)] border border-slate-200 h-[420px] lg:h-[580px]">
            <iframe src={location.mapEmbed} width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="The Gardenia Location Map" />
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default LandingLocationSection;
