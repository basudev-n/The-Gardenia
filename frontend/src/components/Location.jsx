import React, { useState } from 'react';
import { MapPin, GraduationCap, Hospital, Plane, School, Trees, Droplets, Landmark, Bus, Train, Clock, ChevronRight } from 'lucide-react';
import { mockData } from '../mock/data';

const iconMap = { GraduationCap, Hospital, Plane, School, Trees, Droplets, Landmark, Bus, Train };

const categories = [
  { key: 'healthcare',  label: 'Healthcare',       icon: Hospital,       color: 'bg-red-50 text-red-500',     activeColor: 'bg-red-500',    dot: 'bg-red-400' },
  { key: 'schools',     label: 'Schools',           icon: School,         color: 'bg-blue-50 text-blue-500',   activeColor: 'bg-blue-500',   dot: 'bg-blue-400' },
  { key: 'education',   label: 'Higher Education',  icon: GraduationCap,  color: 'bg-purple-50 text-purple-500', activeColor: 'bg-purple-500', dot: 'bg-purple-400' },
  { key: 'greenCulture',label: 'Green & Culture',   icon: Trees,          color: 'bg-emerald-50 text-emerald-600', activeColor: 'bg-emerald-500', dot: 'bg-emerald-400' },
  { key: 'transport',   label: 'Transport',         icon: Bus,            color: 'bg-orange-50 text-orange-500', activeColor: 'bg-orange-500', dot: 'bg-orange-400' },
];

const highlights = [
  { icon: School,       label: 'Loyola School',         value: '2 min',  color: 'text-blue-500' },
  { icon: Hospital,     label: 'Nearest Hospital',       value: '4 min',  color: 'text-red-500' },
  { icon: GraduationCap,label: 'IIIT Bhubaneswar',       value: '4 min',  color: 'text-purple-500' },
  { icon: Plane,        label: 'Airport',                value: '30 min', color: 'text-orange-500' },
];

const Location = () => {
  const { location } = mockData;
  const [activeCategory, setActiveCategory] = useState('healthcare');

  const activeCat = categories.find(c => c.key === activeCategory);
  const ActiveIcon = activeCat?.icon;

  return (
    <section id="location" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-emerald-600 font-semibold text-sm tracking-widest uppercase mb-3">Location</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Prime Location</h2>
          <p className="text-lg text-gray-500">Strategically located in Bhubaneswar with excellent connectivity</p>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {highlights.map((h, i) => {
            const H = h.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <H className={`w-5 h-5 ${h.color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{h.value}</p>
                  <p className="text-xs text-gray-500">{h.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Left: Connectivity Panel */}
          <div className="lg:col-span-2 order-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Category Tabs */}
              <div className="p-4 border-b border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Nearby</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const CatIcon = cat.icon;
                    const isActive = activeCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? `${cat.activeColor} text-white shadow-md`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <CatIcon className="w-3 h-3" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Places List */}
              <div className="divide-y divide-gray-50">
                {location.nearby[activeCategory]?.map((place, index) => {
                  const IconComponent = iconMap[place.icon] || ActiveIcon;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${activeCat?.dot} flex-shrink-0`} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-200">
                            {place.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 flex-shrink-0 ml-4">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs font-semibold">{place.distance}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Address Card */}
            <div className="mt-4 bg-emerald-600 rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-200" />
                <div>
                  <p className="font-semibold text-sm mb-1">Address</p>
                  <p className="text-emerald-100 text-sm leading-relaxed">{location.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="lg:col-span-3 order-2">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-[420px] lg:h-[580px]">
              <iframe
                src={location.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The Gardenia Location Map"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Location;