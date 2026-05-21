import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockData } from '@/mock/data';
import { isValidIndianPhone, normalizeIndianPhone, submitLead } from '@/lib/leadSubmission';
import LandingLocationSection from './LandingLocationSection';
import LandingFloorPlansSection from './LandingFloorPlansSection';
import LandingGallerySection from './LandingGallerySection';
import { ArrowRight, CheckCircle2, Dumbbell, Home, MapPin, Sparkles, Waves, Trees, Shield, Baby, Film, Heart, Coffee, X } from 'lucide-react';

const reasons = [
  'Near Bhubaneswar New City Township',
  '45+ Amenities',
  'Prime Location connecting Bhubaneswar, Cuttack and Khordha in 30 mins',
  'High Property Appreciation',
  'Close to Schools, Colleges & Hospitals',
  'Premium & Pollution-free Surrounding',
  '100% Vastu Compliant',
  '100 Ft Road Connectivity',
  'RERA and SBI Approved'
];

const amenities = [
  { name: 'Swimming Pool', icon: Waves, tone: 'from-cyan-50 to-white' },
  { name: 'State of Art Gym', icon: Dumbbell, tone: 'from-emerald-50 to-white' },
  { name: 'Clubhouse', icon: Home, tone: 'from-amber-50 to-white' },
  { name: 'Banquet Hall', icon: Sparkles, tone: 'from-rose-50 to-white' },
  { name: 'Kids Play Area', icon: Baby, tone: 'from-sky-50 to-white' },
  { name: 'Mini Theater', icon: Film, tone: 'from-slate-50 to-white' },
  { name: 'Business Lounge', icon: Coffee, tone: 'from-orange-50 to-white' },
  { name: 'Wellness Spa', icon: Heart, tone: 'from-pink-50 to-white' },
  { name: 'Indoor Games Room', icon: Shield, tone: 'from-violet-50 to-white' },
  { name: 'Cricket Practice Court', icon: Trees, tone: 'from-lime-50 to-white' }
];

const initialFormState = { name: '', phone: '+91' };

const LandingPage = () => {
  const navigate = useNavigate();
  const heroImage = mockData.hero.heroImage;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIntent, setActiveIntent] = useState('book-site-visit');
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ctaLabel = useMemo(() => {
    const labels = {
      'book-site-visit': 'Book Site Visit',
      brochure: 'Download Brochure',
      'floor-plan': 'Download Floor Plan',
      details: 'Get Detailed Info',
      contact: 'Get In Touch'
    };
    return labels[activeIntent] || 'Book Site Visit';
  }, [activeIntent]);

  const openLeadModal = (intent) => {
    setActiveIntent(intent);
    setIsModalOpen(true);
  };

  const closeLeadModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setErrors({});
    setFormData(initialFormState);
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Name is required';
    if (!formData.phone.trim()) nextErrors.phone = 'Contact number is required';
    else if (!isValidIndianPhone(formData.phone)) nextErrors.phone = 'Enter a valid +91 number with exactly 10 digits';
    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await submitLead('/api/landing-lead', {
        name: formData.name.trim(),
        phone: normalizeIndianPhone(formData.phone),
        intent: activeIntent,
        source: 'landing-page'
      });
      setIsModalOpen(false);
      setFormData(initialFormState);
      navigate('/thank-you', { state: { name: formData.name.trim(), intent: activeIntent } });
    } catch (err) {
      setErrors({ form: err.message || 'Unable to submit right now' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ea] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/40 bg-white/95 backdrop-blur-md shadow-sm transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <a href="/" aria-label="The Gardenia home" className="flex items-center gap-3">
            <img src={logo} alt="The Gardenia - Ghangapatna, Bhubaneswar" className="h-7 md:h-9 lg:h-10 w-auto" />
            <span className="sr-only">The Gardenia</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation" />

          <div className="hidden items-center gap-3 md:flex">
            <Button onClick={() => openLeadModal('book-site-visit')} className="rounded-full bg-emerald-700 text-white hover:bg-emerald-800 px-5 py-2 md:px-6 md:py-3 shadow-sm hover:shadow-md transition">
              Book Site Visit
            </Button>
          </div>

          <div className="md:hidden">
            <Button onClick={() => openLeadModal('book-site-visit')} className="rounded-full bg-emerald-700 text-white px-4 py-2 shadow-sm">Book Site Visit</Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[60svh] md:min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImage} alt="The Gardenia Bhubaneswar" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1f1a]/95 via-[#0d1f1a]/70 to-[#0d1f1a]/25" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#f7f4ea] to-transparent" />
          </div>

          <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 py-16 lg:px-8">
            <div className="max-w-4xl text-white">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                <MapPin className="h-4 w-4 text-emerald-300" />
                Ghangapatna, Bhubaneswar
              </div>

              <h1 className="max-w-4xl text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight tracking-tight">Bhubaneswar’s Next Big Address</h1>

              <p className="mt-5 max-w-2xl text-xl text-white/85 md:text-2xl">2, 3, 4 BHKs Homes & Penthouses.</p>

              <div className="mt-10">
                <Button onClick={() => openLeadModal('book-site-visit')} size="lg" className="rounded-full bg-emerald-500 px-7 py-7 text-base font-semibold text-white hover:bg-emerald-600">
                  Book Site Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] lg:grid-cols-1 lg:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Peaceful Living</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">Peaceful Living at New Bhubaneswar’s Prime Location</h2>
              <p className="mt-3 text-base leading-6 text-slate-600 max-w-3xl">Experience modern living with premium 2, 3 & 4 BHK homes and penthouses. Located near the upcoming Bhubaneswar New City township.</p>
            </div>
          </div>
        </section>

        <section id="why" className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="rounded-[2rem] bg-[#10261f] p-6 text-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] lg:p-8">
            <h2 className="text-2xl font-semibold md:text-4xl">Why Choose The Gardenia?</h2>
            <ul className="mt-4 space-y-2 text-sm md:text-base">
              {reasons.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-300 flex-shrink-0" />
                  <span className="leading-6">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Button onClick={() => openLeadModal('contact')} className="rounded-full bg-white px-6 py-3 text-base font-semibold text-[#10261f] hover:bg-emerald-50">Get In Touch</Button>
            </div>
          </div>
        </section>

        <section id="amenities" className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/70 bg-[linear-gradient(180deg,#f8f6ef_0%,#f3f0e6_100%)] shadow-[0_24px_90px_rgba(15,23,42,0.08)]">
            <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl" />
            <div className="pointer-events-none absolute right-[-5rem] top-20 h-72 w-72 rounded-full bg-white/80 blur-3xl" />

            <div className="relative grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
              <div className="flex flex-col justify-between gap-8">
                <div className="max-w-2xl space-y-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">World Class Amenities</p>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                    A lifestyle built around comfort, leisure, and everyday ease.
                  </h2>
                  <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg">
                    From wellness to recreation, every shared space is designed to feel polished, welcoming, and genuinely useful for residents.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                    <p className="text-3xl font-semibold text-emerald-700">45+</p>
                    <p className="mt-1 text-sm font-medium text-slate-600">Premium amenities across the campus</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/80 bg-white/85 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                    <p className="text-3xl font-semibold text-slate-900">10</p>
                    <p className="mt-1 text-sm font-medium text-slate-600">Featured lifestyle spaces highlighted below</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/80 bg-[#10261f] p-4 text-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Curated experience</p>
                    <p className="mt-2 text-sm leading-6 text-white/85">Designed to feel more like a private club than a typical apartment project.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-2">
                {amenities.map((item, index) => {
                  const Icon = item.icon;
                  const featured = index < 2;
                  return (
                    <div
                      key={item.name}
                      className={`group relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-gradient-to-br ${item.tone} p-4 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)] ${featured ? 'sm:col-span-2' : ''}`}
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-amber-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 ring-1 ring-emerald-100 transition-transform duration-300 group-hover:scale-105">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base font-semibold text-slate-900 md:text-lg">{item.name}</h3>
                            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                              {featured ? 'Featured' : 'Amenity'}
                            </span>
                          </div>
                          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
                            {featured
                              ? 'Set in a premium common area with generous proportions and an elevated finish.'
                              : 'Thoughtful shared spaces that make daily living feel more complete.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <LandingFloorPlansSection onOpenLeadModal={openLeadModal} />
        <LandingLocationSection onOpenLeadModal={openLeadModal} />
        <LandingGallerySection />
      </main>

      <footer className="border-t border-white/60 bg-white px-4 py-12 text-sm text-slate-600 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p>© The Gardenia, Bhubaneswar. All rights reserved.</p>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg rounded-[2rem] bg-white shadow-[0_24px_100px_rgba(15,23,42,0.25)]">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Schedule Site Visit</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">{ctaLabel}</h3>
              </div>
              <button type="button" onClick={closeLeadModal} className="rounded-full border border-slate-200 p-2 text-slate-500 hover:bg-slate-50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="space-y-5 px-6 py-6" onSubmit={handleSubmit} noValidate>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" className="mt-2 rounded-2xl border-slate-200" />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Contact Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91XXXXXXXXXX" className="mt-2 rounded-2xl border-slate-200" />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {errors.form && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>}

              <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-emerald-700 py-6 text-base font-semibold text-white hover:bg-emerald-800 disabled:opacity-70">{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
