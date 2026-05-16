import { Link } from 'react-router-dom';
import { Search, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            <SparklesIcon /> Free AI-Powered Matching
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight">
            Find government schemes you <span className="text-indigo-600">actually qualify for</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Answer 10 questions. We search 1,000+ central and state schemes instantly using advanced AI to find your perfect matches.
          </p>
          <div className="mt-10">
            <Link 
              to="/check" 
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Check My Eligibility
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-800 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-center text-sm md:text-base font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-indigo-400" size={20} />
              1,000+ Schemes
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-indigo-400" size={20} />
              28 States
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-indigo-400" size={20} />
              Free Forever
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-indigo-400" size={20} />
              No Login Required
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800">Why use SchemeFinder?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Zero Cost</h3>
              <p className="text-slate-600">No registration, no fees. Ever. We believe accessing government benefits should be completely free.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Comprehensive</h3>
              <p className="text-slate-600">Central + all major state schemes in one place. We constantly update our database with new programs.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Instant AI Matching</h3>
              <p className="text-slate-600">Our advanced AI understands complex government criteria and matches you in under 10 seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-16">How it works</h2>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-xl text-slate-800 mb-2">Fill your profile</h3>
                <p className="text-slate-600">Takes less than 2 minutes. We only ask what's necessary.</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-xl text-slate-800 mb-2">We search 1,000+ schemes</h3>
                <p className="text-slate-600">Our engine cross-references your details with thousands of criteria instantly.</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-600 text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-xl text-slate-800 mb-2">See your matches</h3>
                <p className="text-slate-600">Get a clear list of schemes you qualify for, with direct links to apply.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
             <Link 
              to="/check" 
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              Start Your Search Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
