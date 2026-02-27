import React from 'react';
import { Check, BedDouble, Bath, Crown } from 'lucide-react';
import { Button } from './ui/button';

const plans = [
  {
    id: 1,
    type: "2 BHK",
    area: "1,250 sq. ft.*",
    price: "₹79 Lakh onwards",
    bedrooms: "2",
    bathrooms: "2",
    features: ["Spacious living & dining", "Private balcony", "Modular kitchen", "Covered parking"],
    penthouse: false,
  },
  {
    id: 2,
    type: "3 BHK",
    area: "1,750 sq. ft.*",
    price: "₹95 Lakh*",
    bedrooms: "3",
    bathrooms: "3",
    features: ["Master suite with walk-in closet", "Large balcony", "Servant quarters", "2 covered parkings"],
    penthouse: false,
    popular: true,
  },
  {
    id: 3,
    type: "4 BHK",
    area: "2,400 sq. ft.*",
    price: "₹1.3 Cr",
    bedrooms: "4",
    bathrooms: "4",
    features: ["Expansive living spaces", "Double balconies", "Home office room", "2 covered parkings"],
    penthouse: false,
  },
  {
    id: 4,
    type: "5 BHK Penthouse",
    area: "4,800 sq. ft.*",
    price: "₹1.8 Cr",
    bedrooms: "5",
    bathrooms: "6",
    features: [
      "Private rooftop terrace",
      "360° panoramic views",
      "Private plunge pool",
      "Smart home automation",
      "3 reserved parkings",
      "Dedicated concierge",
    ],
    penthouse: true,
  },
];

const FloorPlans = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const regularPlans = plans.filter(p => !p.penthouse);
  const penthouse = plans.find(p => p.penthouse);

  return (
    <section id="floor-plans" className="py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-emerald-600 font-semibold text-sm tracking-widest uppercase mb-3">Residences</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Floor Plans & Pricing
          </h2>
          <p className="text-lg text-gray-500">
            252 homes across 2 iconic towers — crafted for every lifestyle
          </p>
        </div>

        {/* Regular Plans — 3 cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {regularPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular
                  ? 'shadow-xl border-2 border-emerald-500'
                  : 'shadow-md border border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="bg-emerald-600 text-white text-center py-2 text-xs font-bold tracking-widest uppercase">
                  Most Popular
                </div>
              )}

              <div className="p-7">
                {/* Type & Area */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.type}</h3>
                  <div className="inline-flex items-center mt-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">
                    {plan.area}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-emerald-600">{plan.price}</p>
                </div>

                {/* Beds & Baths */}
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BedDouble className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">{plan.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bath className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium">{plan.bathrooms} Baths</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={scrollToContact}
                  className={`w-full rounded-xl py-5 font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-lg ${
                    plan.popular
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  Request Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Penthouse Card — Full width premium */}
        {penthouse && (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white">
            
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-400 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative p-10 md:p-14">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">

                {/* Left: Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-yellow-400/20 flex items-center justify-center">
                      <Crown className="w-5 h-5 text-yellow-400" />
                    </div>
                    <span className="text-yellow-400 font-semibold text-sm tracking-widest uppercase">Exclusive Penthouse</span>
                  </div>

                  <h3 className="text-4xl md:text-5xl font-bold mb-3">{penthouse.type}</h3>

                  <div className="inline-flex items-center bg-white/10 text-emerald-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                    {penthouse.area}
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Starting from</p>
                    <p className="text-4xl font-bold text-emerald-400">{penthouse.price}</p>
                  </div>

                  <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <BedDouble className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium">{penthouse.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Bath className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium">{penthouse.bathrooms} Bathrooms</span>
                    </div>
                  </div>
                </div>

                {/* Right: Features + CTA */}
                <div className="flex-1">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {penthouse.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={scrollToContact}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/40"
                  >
                    Enquire About Penthouse
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footnote */}
        <p className="text-center text-xs text-gray-400 mt-8">
          * Carpet area as per RERA. Prices are indicative and subject to change. Please contact us for latest pricing and availability.
        </p>
      </div>
    </section>
  );
};

export default FloorPlans;