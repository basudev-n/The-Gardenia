import React from 'react';
import { mockData } from '@/mock/data';


const LandingFloorPlansSection = ({ onOpenLeadModal }) => {
  const { floorPlans } = mockData;

  return (
    <>
      <div id="pricing" />
      <section id="floor-plans" className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-6 mb-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Residences</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Pricing</h2>
          
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="mb-4 flex items-center justify-end">
          <button
            onClick={() => onOpenLeadModal && onOpenLeadModal('brochure')}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-700 transition"
          >
            Download Brochure
          </button>
        </div>
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr className="bg-white/70">
              <th className="px-4 py-3 text-sm font-medium text-slate-700">Type</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-700">Area</th>
              <th className="px-4 py-3 text-sm font-medium text-slate-700">Price</th>
            </tr>
          </thead>
          <tbody>
            {floorPlans.map((plan) => (
              <tr key={plan.id} className="border-t border-slate-200 even:bg-slate-50">
                <td className="px-4 py-3 align-top text-sm font-semibold text-slate-900">{plan.type}</td>
                <td className="px-4 py-3 align-top text-sm text-slate-700">{plan.area}</td>
                <td className="px-4 py-3 align-top text-sm text-slate-700">{plan.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        <a href="/floor-plan.pdf" download className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white hover:bg-emerald-700">
          Download Floor Plan
        </a>
      </div>
    </section>
    </>
  );
};

export default LandingFloorPlansSection;
