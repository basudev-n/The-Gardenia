import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockData } from '@/mock/data';
import { isValidIndianPhone, normalizeIndianPhone, submitLead } from '@/lib/leadSubmission';
import LandingGallerySection from './LandingGallerySection';
import LandingLocationSection from './LandingLocationSection';
import LandingFloorPlansSection from './LandingFloorPlansSection';
import {
  ArrowRight,
  Bath,
  Building2,
  CheckCircle2,
  Dumbbell,
  GraduationCap,
  HeartHandshake,
  Home,
  Hospital,
  MapPin,
  Menu,
  Mic2,
  PartyPopper,
  Phone,
  School,
  ShieldCheck,
  Sparkles,
  Trees,
  Waves,
  X
} from 'lucide-react';

const heroHighlights = ['28+ Lifestyle Amenities', '79 Lacs Onwards*', '2, 3, 4 BHK Homes & Penthouses'];

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
  { name: 'Swimming Pool', icon: Waves },
  { name: 'State of Art Gym', icon: Dumbbell },
  { name: 'Clubhouse', icon: Building2 },
  { name: 'Banquet Hall', icon: PartyPopper },
  { name: 'Kids Play Area', icon: Home },
  { name: 'Mini Theater', icon: Mic2 },
  { name: 'Business Lounge', icon: HeartHandshake },
  { name: 'Wellness Spa', icon: Bath },
  { name: 'Indoor Games Room', icon: Sparkles }
];

const pricing = [
  { type: '2 BHK', area: '1250 Sq Ft.', price: '79 Lacs*' },
  { type: '3 BHK', area: '1750 Sq Ft.', price: '95 Lacs*' },
  { type: '4 BHK', area: '2400 Sq Ft.', price: '1.3 Cr' },
  { type: '5 BHK Penthouse', area: '4800 Sq Ft.', price: '1.8 Cr*' }
];

const initialFormState = {
  name: '',
  phone: '+91'
};

const LandingPage = () => {
  const navigate = useNavigate();
  const heroImage = mockData.hero.heroImage;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
    setIsModalOpen(true);
  };

  const closeLeadModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);
    setErrors({});
    setFormData(initialFormState);
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Contact number is required';
    } else if (!isValidIndianPhone(formData.phone)) {
      nextErrors.phone = 'Enter a valid +91 number with exactly 10 digits';
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        source: 'landing-page',
        page: 'The Gardenia Landing Page'
      });

      setIsModalOpen(false);
      setFormData(initialFormState);
      setErrors({});
      navigate('/thank-you', {
        state: {
          name: formData.name.trim(),
          intent: activeIntent
        }
      });
    } catch (error) {
      setErrors({ form: error.message || 'Unable to submit right now' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ea] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <a href="/" aria-label="The Gardenia home" className="flex items-center">
            <img src={logo} alt="The Gardenia - Ghangapatna, Bhubaneswar" className="h-8 md:h-10 lg:h-12 w-auto" />
            <span className="sr-only">The Gardenia</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a className="text-sm font-medium text-slate-600 hover:text-slate-900" href="#overview">Overview</a>
            <a className="text-sm font-medium text-slate-600 hover:text-slate-900" href="#why">Why Gardenia</a>
            <a className="text-sm font-medium text-slate-600 hover:text-slate-900" href="#amenities">Amenities</a>
            <a className="text-sm font-medium text-slate-600 hover:text-slate-900" href="#pricing">Pricing</a>
            <a className="text-sm font-medium text-slate-600 hover:text-slate-900" href="#connectivity">Connectivity</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button onClick={() => openLeadModal('brochure')} variant="outline" className="rounded-full border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50">
              Download Brochure
            </Button>
            <Button onClick={() => openLeadModal('book-site-visit')} className="rounded-full bg-emerald-700 text-white hover:bg-emerald-800">
              Book Site Visit
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-3 text-slate-700 md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
            <div className="grid gap-3 text-sm">
              <a href="#overview" onClick={() => setIsMenuOpen(false)}>Overview</a>
              <a href="#why" onClick={() => setIsMenuOpen(false)}>Why Gardenia</a>
              <a href="#amenities" onClick={() => setIsMenuOpen(false)}>Amenities</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <a href="#connectivity" onClick={() => setIsMenuOpen(false)}>Connectivity</a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative min-h-[100svh] overflow-hidden">
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

              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
                Bhubaneswar’s Next Big Address
              </h1>

              <p className="mt-5 max-w-2xl text-xl text-white/85 md:text-2xl">
                2, 3, 4 BHK Homes & Penthouses crafted for peaceful living, modern comfort and long-term appreciation.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {heroHighlights.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button onClick={() => openLeadModal('book-site-visit')} size="lg" className="rounded-full bg-emerald-500 px-7 py-7 text-base font-semibold text-white hover:bg-emerald-600">
                  BOOK SITE VISIT
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button onClick={() => openLeadModal('brochure')} size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 px-7 py-7 text-base font-semibold text-white hover:bg-white hover:text-slate-900">
                  Download Brochure
                </Button>
                <Button onClick={() => openLeadModal('floor-plan')} size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 px-7 py-7 text-base font-semibold text-white hover:bg-white hover:text-slate-900">
                  Download Floor Plan
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ['28+', 'Lifestyle Amenities'],
                  ['79 Lacs*', 'Starting Price'],
                  ['Dec 2029', 'Possession']
                ].map(([value, label]) => (
                  <div key={label} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <p className="text-3xl font-semibold">{value}</p>
                    <p className="mt-1 text-sm text-white/75">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
          <div className="grid gap-8 rounded-[2rem] bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Peaceful Living</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Peaceful Living at New Bhubaneswar’s Prime Location</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Experience modern living with premium 2, 3 & 4 BHK homes and penthouses, complemented by 28+ lifestyle amenities.
                Located at Bhubaneswar’s emerging prime destination, near the upcoming Government planned Bhubaneswar New City township.
                Possession by December 2029.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Project Type', value: 'Luxury Residential' },
                { label: 'Configuration', value: '2 / 3 / 4 BHK + Penthouses' },
                { label: 'Location', value: 'Ghangapatna' },
                { label: 'Possession', value: 'December 2029' }
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">{item.label}</p>
                  <p className="mt-2 text-lg font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="why" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
          <div className="grid gap-8 rounded-[2rem] bg-[#10261f] p-8 text-white shadow-[0_20px_80px_rgba(15,23,42,0.12)] lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Why Choose The Gardenia?</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Reasons that make the project stand out</h2>
              <p className="mt-4 text-white/75">A rare blend of access, serenity and value growth in one address.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {reasons.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <span className="text-sm leading-6 text-white/90">{item}</span>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <Button onClick={() => openLeadModal('contact')} className="rounded-full bg-white px-7 py-6 text-base font-semibold text-[#10261f] hover:bg-emerald-50">
                Get In Touch
              </Button>
            </div>
          </div>
        </section>

        <section id="amenities" className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.75rem] bg-[linear-gradient(180deg,#f4f0e6_0%,#f7f4ea_100%)] shadow-[0_20px_80px_rgba(15,23,42,0.08)] ring-1 ring-white/70">
            <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-white/70 blur-3xl" />

            <div className="grid gap-10 p-8 lg:grid-cols-[1.05fr_0.75fr] lg:gap-12 lg:p-12">
              <div>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 backdrop-blur">
                      Signature Lifestyle
                    </div>
                    <p className="mt-5 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">World Class Amenities</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Designed for everyday ease and premium living</h2>
                    <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                      Curated leisure, wellness and social spaces that make the community feel complete from day one. Every amenity is positioned to feel intentional, calm and elevated.
                    </p>
                  </div>
                  <Button onClick={() => openLeadModal('brochure')} variant="outline" className="hidden rounded-full border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 sm:inline-flex">
                    Download Brochure
                  </Button>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                  {amenities.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.name}
                        className="group relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)] sm:p-5"
                      >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-200 via-emerald-500 to-emerald-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-white text-emerald-700 ring-1 ring-emerald-100 transition-colors group-hover:bg-emerald-600 group-hover:text-white sm:h-14 sm:w-14">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">{item.name}</h3>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-center sm:hidden">
                  <Button onClick={() => openLeadModal('brochure')} className="rounded-full bg-emerald-700 px-7 py-6 text-base font-semibold text-white hover:bg-emerald-800">
                    Download Brochure
                  </Button>
                </div>
              </div>

              <div className="self-start rounded-[2.25rem] bg-[#10261f] p-6 text-white shadow-[0_18px_60px_rgba(16,38,31,0.25)] lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Lifestyle at a Glance</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight">A balanced mix of recreation, wellness and convenience</h3>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                    Premium
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    ['28+', 'Lifestyle amenities planned across the community'],
                    ['Clubhouse', 'A social hub for events, gatherings and downtime'],
                    ['Wellness', 'Spaces that support fitness, play and relaxation']
                  ].map(([title, description], index) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-lg font-semibold text-white">{title}</p>
                        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">0{index + 1}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-white/75">{description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">Community Focus</p>
                    <p className="mt-2 text-sm leading-6 text-white/80">Spaces that encourage both privacy and connection.</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">Design Language</p>
                    <p className="mt-2 text-sm leading-6 text-white/80">Calm, polished and brochure-like in every viewport.</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-white/10 px-4 py-4 text-sm leading-6 text-white/80">
                  The section now reads like a luxury lifestyle booklet, with stronger hierarchy, richer surfaces and more breathing room.
                </div>
              </div>
            </div>
          </div>
        </section>

        

        <LandingGallerySection />

        <LandingFloorPlansSection onOpenLeadModal={openLeadModal} />

        <LandingLocationSection />
      </main>

      <footer className="border-t border-white/60 bg-white px-4 py-12 text-sm text-slate-600 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p>© The Gardenia, Bhubaneswar. All rights reserved.</p>
          <Button onClick={() => openLeadModal('book-site-visit')} className="rounded-full bg-emerald-700 px-6 py-5 text-white hover:bg-emerald-800">
            Book Site Visit
          </Button>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/60 bg-white/95 p-3 backdrop-blur md:hidden">
        <Button onClick={() => openLeadModal('book-site-visit')} className="w-full rounded-full bg-emerald-700 py-6 text-base font-semibold text-white hover:bg-emerald-800">
          Book Site Visit
        </Button>
      </div>

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

              <Button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-emerald-700 py-6 text-base font-semibold text-white hover:bg-emerald-800 disabled:opacity-70">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;