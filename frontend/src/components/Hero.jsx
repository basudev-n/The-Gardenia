import React, { useState } from 'react';
import { ArrowRight, MapPin, Download, Calendar, X, CheckCircle, Phone, User, Home } from 'lucide-react';
import { Button } from './ui/button';
import { mockData } from '../mock/data';

const PREFERENCES = ['2 BHK', '3 BHK', '3.5 BHK', '5 BHK Penthouse'];

const Hero = () => {
  const { hero } = mockData;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', preference: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Please fill in your name and phone number.');
      return;
    }
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/brochure-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Submission failed');

      setSubmitted(true);

      // Auto-trigger brochure download after short delay
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = '/brochure.pdf'; // Place your PDF in frontend/public/brochure.pdf
        link.download = 'The-Gardenia-Brochure.pdf';
        link.click();
      }, 1000);

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
    setForm({ name: '', phone: '', preference: '' });
    setError('');
  };

  return (
    <>
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.heroImage}
            alt="The Gardenia"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/92 via-gray-900/70 to-gray-900/40" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl">

            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-4 py-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-medium text-sm">{hero.location}</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              {hero.title}
            </h1>

            <p className="text-2xl md:text-3xl text-emerald-400 font-semibold mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {hero.subtitle}
            </p>

            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              {hero.description}
            </p>

            {/* Price Tag */}
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 mb-10 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
              <p className="text-sm text-gray-300 mb-1">Starting from</p>
              <p className="text-4xl font-bold text-white">{hero.startingPrice}</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-14 duration-700 delay-500">
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-600/50 hover:scale-105 group"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Book Your Site Visit — Free!
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              <Button
                onClick={() => setShowModal(true)}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-2xl group bg-transparent"
              >
                <Download className="mr-2 w-5 h-5" />
                Get e-Brochure
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-10 flex flex-wrap gap-6 animate-in fade-in duration-700 delay-600">
              {[
                { value: '252', label: 'Limited Units' },
                { value: '28+', label: 'Premium Amenities' },
                { value: '✓', label: 'RERA Approved' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm">{item.value}</span>
                  </div>
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Lead Gate Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-8 py-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Get Your Free Brochure</h3>
              </div>
              <p className="text-emerald-100 text-sm">
                Complete floor plans, pricing & amenity details — delivered instantly.
              </p>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Preference */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Apartment Preference</label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="preference"
                        value={form.preference}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none bg-white text-gray-600"
                      >
                        <option value="">Select preference (optional)</option>
                        {PREFERENCES.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download Brochure Now
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    🔒 Your information is safe. No spam, ever.
                  </p>
                </form>
              ) : (
                /* Success State */
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-9 h-9 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Thank you, {form.name.split(' ')[0]}!</h4>
                  <p className="text-gray-500 text-sm mb-4">
                    Your brochure is downloading automatically. Our team will be in touch soon!
                  </p>
                  <p className="text-xs text-gray-400 mb-6">If the download didn't start,
                    <a href="/brochure.pdf" download="The-Gardenia-Brochure.pdf" className="text-emerald-600 font-semibold ml-1">click here</a>.
                  </p>
                  <button
                    onClick={closeModal}
                    className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-xl font-medium text-sm transition-all"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;