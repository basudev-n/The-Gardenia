import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, PhoneCall } from 'lucide-react';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = location.state?.name || 'there';
  const intent = location.state?.intent || 'site visit';

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_40%),linear-gradient(180deg,#f7f4ea_0%,#ffffff_100%)] px-4 py-12">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-[0_20px_80px_rgba(15,23,42,0.1)] md:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Thank You</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">Thank you, {name}!</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Thank you for showing interest in The Gardenia, Ghangapatna. Our property expert will reach out to you soon!
        </p>

        <p className="mt-3 text-sm text-slate-500">
          We have received your request for <span className="font-semibold text-slate-900">{intent.replace(/-/g, ' ')}</span>.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => navigate('/')} className="rounded-full bg-emerald-700 px-7 py-6 text-base font-semibold text-white hover:bg-emerald-800">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button asChild variant="outline" className="rounded-full border-emerald-200 px-7 py-6 text-base font-semibold text-emerald-700 hover:bg-emerald-50">
            <a href="tel:+919999999999">
              <PhoneCall className="mr-2 h-4 w-4" />
              Call Us
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;