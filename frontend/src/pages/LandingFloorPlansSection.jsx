import React from 'react';
import { Button } from '@/components/ui/button';
import { mockData } from '@/mock/data';
import { Check, BedDouble, Bath, Crown, ArrowRight } from 'lucide-react';

const LandingFloorPlansSection = ({ onOpenLeadModal }) => {
  const { floorPlans } = mockData;

  const regularPlans = floorPlans.slice(0, -1);
  const penthouse = floorPlans[floorPlans.length - 1];

  return (
    <>
      <div id="pricing" />
      <section id="floor-plans" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Residences</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Floor Plans & Pricing</h2>
          <p className="mt-4 text-lg text-slate-600">252 homes crafted for every lifestyle</p>
        </div>
        <Button onClick={() => onOpenLeadModal('floor-plan')} variant="outline" className="rounded-full border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 shrink-0">
          Download Floor Plan
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-7 mb-12">
        {regularPlans.map((plan, idx) => {
          const isPopular = idx === 1;
          return (
            <div key={plan.id} className={`relative rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${isPopular ? 'shadow-xl border-2 border-emerald-500 md:scale-105 bg-white' : 'shadow-md border border-slate-200 bg-white'}`}>
              {isPopular && (
                <div className="bg-emerald-600 text-white text-center py-2 text-xs font-bold tracking-widest uppercase">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="mb-7">
                  <h3 className="text-2xl font-bold text-slate-900">{plan.type}</h3>
                  <div className="inline-flex items-center mt-3 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">
                    {plan.area}
                  </div>
                </div>

                <div className="mb-7 pb-7 border-b border-slate-200">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Starting from</p>
                  <p className="text-3xl font-bold text-emerald-600">{plan.price}</p>
                </div>

                <div className="flex gap-5 mb-7">
                  <div className="flex items-center gap-2 text-slate-600">
                    <BedDouble className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">{plan.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Bath className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">{plan.bathrooms} Baths</span>
                  </div>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button onClick={() => onOpenLeadModal('floor-plan')} className={`w-full rounded-full py-6 font-semibold text-sm transition-all ${isPopular ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                  Request Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {penthouse && (
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#0f1f1a] to-[#1a2d28] text-white shadow-2xl border border-white/10">
          <div className="grid md:grid-cols-2 gap-8 p-8 lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
                <Crown className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold">Premium Residence</span>
              </div>

              <h3 className="text-4xl font-bold mb-4">{penthouse.type}</h3>

              <div className="mb-6">
                <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Area</p>
                <p className="text-2xl font-bold">{penthouse.area}</p>
              </div>

              <div className="mb-8">
                <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Price</p>
                <p className="text-4xl font-bold text-emerald-400">{penthouse.price}</p>
              </div>

              <div className="flex gap-6 mb-8">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Bedrooms</p>
                  <p className="text-2xl font-bold">{penthouse.bedrooms}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Bathrooms</p>
                  <p className="text-2xl font-bold">{penthouse.bathrooms}</p>
                </div>
              </div>

              <Button onClick={() => onOpenLeadModal('floor-plan')} className="rounded-full bg-emerald-600 px-8 py-6 text-base font-semibold text-white hover:bg-emerald-700">
                Request Details
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div>
              <ul className="space-y-3.5">
                {penthouse.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/90 text-base leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
    </>
  );
};

export default LandingFloorPlansSection;
