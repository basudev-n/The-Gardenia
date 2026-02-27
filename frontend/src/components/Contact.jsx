import React, { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  PhoneCall
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { handleContactSubmit, handleSiteVisit } from '../mock/data';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
  preferredDate: '',
  preferredTime: ''
};

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [preferredContact, setPreferredContact] = useState('phone');

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.name.trim()) nextErrors.name = 'Please enter your full name';
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      nextErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.message.trim().length > 300) {
      nextErrors.message = 'Message should be 300 characters or fewer';
    }

    if (formData.preferredDate && formData.preferredDate < today) {
      nextErrors.preferredDate = 'Visit date cannot be in the past';
    }

    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast({
        title: 'Please review your details',
        description: 'A few fields need attention before submitting.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const payload = { ...formData, preferredContact };
      const result = handleContactSubmit(payload);

      if (formData.preferredDate && formData.preferredTime) {
        handleSiteVisit({
          ...payload,
          date: formData.preferredDate,
          time: formData.preferredTime
        });
      }

      if (result.success) {
        toast({
          title: 'Thank you for your interest!',
          description: 'Our team will contact you within 24 hours.'
        });
        setFormData(initialFormData);
        setPreferredContact('phone');
      }

      setIsSubmitting(false);
    }, 900);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-20 bg-gradient-to-b from-white via-emerald-50 to-white">
      <div className="absolute -top-14 -left-14 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-lime-200/40 blur-3xl" aria-hidden="true" />

      <div className="container relative mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-2 text-sm font-semibold text-emerald-700 mb-5">
            <Sparkles className="w-4 h-4" />
            Priority Response Desk Open
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch Today</h2>
          <p className="text-lg text-gray-600 mb-2">
            Schedule a visit or reach out to us. Our team is here to help you find your dream home.
          </p>
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span>Limited Units Available - Act Fast!</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-emerald-100 p-8 md:p-10">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Send us a message</h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Avg. response: 2 hours
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label>Preferred Contact Method</Label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferredContact('phone')}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      preferredContact === 'phone'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-emerald-200'
                    }`}
                  >
                    <PhoneCall className="inline w-4 h-4 mr-2" />
                    Phone Call
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredContact('email')}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      preferredContact === 'email'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-emerald-200'
                    }`}
                  >
                    <MessageSquare className="inline w-4 h-4 mr-2" />
                    Email Reply
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredDate">Preferred Visit Date</Label>
                  <Input
                    id="preferredDate"
                    name="preferredDate"
                    type="date"
                    min={today}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="mt-2"
                  />
                  {errors.preferredDate && <p className="text-xs text-red-600 mt-1">{errors.preferredDate}</p>}
                </div>

                <div>
                  <Label htmlFor="preferredTime">Preferred Time</Label>
                  <Input
                    id="preferredTime"
                    name="preferredTime"
                    type="time"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="message">Message</Label>
                  <span className="text-xs text-gray-500">{formData.message.length}/300</span>
                </div>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={300}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-2"
                  placeholder="Tell us about your requirements..."
                />
                {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 group"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2 inline" />
                    Schedule My Free Site Visit
                    <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-gray-500 mt-2">🔒 Your information is 100% secure and confidential</p>
            </form>
          </div>

          <div className="space-y-5">
            {[
              {
                icon: Phone,
                title: 'Phone (Toll-Free)',
                body: ['1800 890 0428'],
                cta: 'tel:18008900428',
                ctaLabel: 'Call now'
              },
              {
                icon: Mail,
                title: 'Email',
                body: ['info@thegardenia.com', 'sales@thegardenia.com'],
                cta: 'mailto:info@thegardenia.com',
                ctaLabel: 'Send email'
              },
              {
                icon: Clock,
                title: 'Office Hours',
                body: ['Monday - Saturday: 9:00 AM - 7:00 PM', 'Sunday: 10:00 AM - 5:00 PM']
              },
              {
                icon: MapPin,
                title: 'Sales Office',
                body: ['Ghangapatna, P.O. - Kantabada, P.S. - Chandaka, Bhubaneswar, Khurda - 752054'],
                cta: 'https://maps.google.com',
                ctaLabel: 'Open in maps'
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-md p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      {item.body.map((line) => (
                        <p key={line} className="text-gray-600 text-sm leading-relaxed">
                          {line}
                        </p>
                      ))}
                      {item.cta && (
                        <a
                          href={item.cta}
                          target={item.cta.startsWith('http') ? '_blank' : undefined}
                          rel={item.cta.startsWith('http') ? 'noreferrer' : undefined}
                          className="inline-flex items-center mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          {item.ctaLabel}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
