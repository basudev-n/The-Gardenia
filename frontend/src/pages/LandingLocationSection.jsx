import React from 'react';
import { mockData } from '@/mock/data';
import { MapPin, Clock } from 'lucide-react';

const nearbyPlaces = [
  { name: 'Sparsh Hospital', distance: '04 mins' },
  { name: 'Sum & Sum Ultimate Hospitals', distance: '05 mins' },
  { name: 'IIIT Bhubaneswar', distance: '04 mins' },
  { name: 'Birla Global University', distance: '04 mins' },
  { name: 'International Management Institute', distance: '04 mins' },
  { name: 'DAV Public School, Kalinga Nagar', distance: '08 mins' },
  { name: 'KV School, Kalinga Nagar', distance: '08 mins' },
  { name: 'Airport & Railway Station', distance: '30 Mins' }
];

const LandingLocationSection = ({ onOpenLeadModal }) => {
  const { location } = mockData;

  return (
    <>
      <div id="connectivity" />
      <section id="location" className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Connectivity</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Prime Location, Perfect Connectivity</h2>
        </div>

        <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Nearby</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 rounded-3xl border border-slate-100">
            {nearbyPlaces.map((place) => (
              <div key={place.name} className="flex items-center justify-between px-5 py-4">
                <p className="text-sm font-medium text-slate-800">{place.name}</p>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{place.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingLocationSection;
