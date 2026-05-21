import React from 'react';
import { Button } from '@/components/ui/button';
import { mockData } from '@/mock/data';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

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
      <section id="location" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Connectivity</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Prime Location, Perfect Connectivity</h2>
          <p className="mt-4 text-lg text-slate-600">Strategically located with excellent connectivity to all major destinations</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] lg:p-8">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Nearby</p>
                <p className="mt-2 text-base text-slate-600">Key healthcare, education and transit access around the project.</p>
              </div>
            </div>

            <div className="mt-8 divide-y divide-slate-100 rounded-3xl border border-slate-100">
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

            <div className="mt-8 rounded-3xl bg-emerald-600 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">Address</p>
              <p className="mt-3 text-sm leading-7 text-emerald-50">{location.address}</p>
            </div>

            <div className="mt-8">
              <Button onClick={() => onOpenLeadModal?.('details')} className="rounded-full bg-emerald-700 px-7 py-6 text-base font-semibold text-white hover:bg-emerald-800">
                Get Detailed Info
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
            <iframe
              src={location.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '560px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Gardenia Location Map"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingLocationSection;
