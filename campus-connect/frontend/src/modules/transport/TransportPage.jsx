import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import {
  Bus,
  Search,
  MapPin,
  Clock,
  Phone,
  Calendar,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Info,
  Car,
  Utensils,
  Cake,
  Printer,
  Film,
  Scissors,
  Gamepad2,
  Navigation,
  Compass,
  Check,
  Copy,
  ExternalLink,
  Sparkles,
  Zap,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TransportPage = () => {
  const [activeTab, setActiveTab] = useState('govt-bus'); // 'govt-bus', 'local-services', 'campus-shuttles'
  const [govtBusDirection, setGovtBusDirection] = useState('diu-to-vanakbara'); // 'diu-to-vanakbara', 'vanakbara-to-diu', 'vanakbara-to-nagoa'
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceCategory, setSelectedServiceCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const govtBusData = storageService.getGovtBusData();
  const localServices = storageService.getLocalServices();

  const loadData = () => {
    setRoutes(storageService.getTransport());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const serviceCategories = [
    'All',
    'Local Autos & Chagdas',
    'Outstation Vans & Cabs',
    'Food Delivery & Restaurants',
    'Bakery & Celebrations',
    'Printing & Xerox',
    'Entertainment & Daily Life',
    'College Coordination'
  ];

  const filteredServices = localServices.filter((srv) => {
    const matchesCategory =
      selectedServiceCategory === 'All' || srv.category === selectedServiceCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.coverage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredRoutes = routes.filter((r) => {
    return (
      r.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.stops && r.stops.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner with Sky Accent */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121212] border border-[#262626] p-6 sm:p-8 text-white shadow-2xl">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/images/campus/campus-sky.jpg')` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40">
                IIITV-ICD Mobility Hub
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Timetable & Contacts
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Campus Transport & Diu Island Transit
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
              Timetables for the official <strong className="text-white">₹10 Government Bus</strong>,
              verified phone directory for <strong className="text-white">Autos, Chagdas, Somnath Vans</strong>,
              hostel food deliveries by <strong className="text-[#B7F34A]">Saddam</strong>, and celebration cakes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="bg-[#1C1C1C] border border-[#333333] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B7F34A] text-[#111111] flex items-center justify-center font-bold">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[#888888] uppercase block">
                  Govt Bus Fare
                </span>
                <span className="text-sm font-black text-white">₹10 Flat Anywhere in Diu</span>
              </div>
            </div>

            <a
              href="tel:9426402875"
              className="bg-[#FF9F43] hover:bg-[#FF8A3D] text-[#111111] font-bold text-xs px-4 py-3 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-[#FF9F43]/20"
            >
              <Phone className="w-4 h-4" />
              <span>Bus In-charge: Asvinbhai (9426402875)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex flex-wrap p-1.5 bg-[#161616] border border-[#262626] rounded-2xl gap-2">
        <button
          onClick={() => setActiveTab('govt-bus')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'govt-bus'
              ? 'bg-[#B7F34A] text-[#111111] shadow-lg shadow-[#B7F34A]/25'
              : 'text-[#AAAAAA] hover:text-white hover:bg-[#202020]'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Government Bus Timetable (Diu – Vanakbara)</span>
        </button>

        <button
          onClick={() => setActiveTab('local-services')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'local-services'
              ? 'bg-[#FF9F43] text-[#111111] shadow-lg shadow-[#FF9F43]/25'
              : 'text-[#AAAAAA] hover:text-white hover:bg-[#202020]'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Local Autos, Chagdas & Student Essentials</span>
        </button>

        <button
          onClick={() => setActiveTab('campus-shuttles')}
          className={`flex-1 min-w-[180px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'campus-shuttles'
              ? 'bg-white text-[#111111] shadow-lg'
              : 'text-[#AAAAAA] hover:text-white hover:bg-[#202020]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Campus Shuttle Routes</span>
        </button>
      </div>

      {/* ================= TAB 1: GOVERNMENT BUS TIMETABLE ================= */}
      {activeTab === 'govt-bus' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Key Rule Highlight Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#B7F34A]/15 via-[#FF9F43]/15 to-[#B7F34A]/10 border border-[#B7F34A]/40 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#B7F34A] text-[#111111] flex items-center justify-center font-bold shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#B7F34A]">
                    Midpoint Location Rule
                  </span>
                  <span className="text-[10px] font-bold bg-[#FF9F43] text-[#111111] px-2 py-0.2 rounded-full">
                    ±10 Min ETA
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#DDDDDD] leading-relaxed">
                  <strong>IIITV-ICD is at Kevdi</strong>, in the middle of Diu town and Vanakbara.
                  Any bus departing from either end (Diu Stand or Vanakbara) reaches college in
                  <span className="text-[#B7F34A] font-bold"> ±10 minutes</span> from departure time!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <span className="text-xs font-semibold text-[#AAAAAA]">Municipal Fare:</span>
              <span className="px-3.5 py-1.5 rounded-xl bg-[#111111] border border-[#333333] text-sm font-extrabold text-[#B7F34A]">
                ₹10 Flat
              </span>
            </div>
          </div>

          {/* Direction Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#262626]">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setGovtBusDirection('diu-to-vanakbara')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  govtBusDirection === 'diu-to-vanakbara'
                    ? 'bg-[#B7F34A] text-[#111111] shadow'
                    : 'bg-[#1C1C1C] text-[#AAAAAA] hover:text-white border border-[#2E2E2E]'
                }`}
              >
                <span>Diu ➔ Vanakbara (Via Kevdi College)</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">
                  {govtBusData.diuToVanakbara.length} trips
                </span>
              </button>

              <button
                onClick={() => setGovtBusDirection('vanakbara-to-diu')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  govtBusDirection === 'vanakbara-to-diu'
                    ? 'bg-[#B7F34A] text-[#111111] shadow'
                    : 'bg-[#1C1C1C] text-[#AAAAAA] hover:text-white border border-[#2E2E2E]'
                }`}
              >
                <span>Vanakbara ➔ Diu (Via Kevdi College)</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">
                  {govtBusData.vanakbaraToDiu.length} trips
                </span>
              </button>

              <button
                onClick={() => setGovtBusDirection('vanakbara-to-nagoa')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  govtBusDirection === 'vanakbara-to-nagoa'
                    ? 'bg-[#FF9F43] text-[#111111] shadow'
                    : 'bg-[#1C1C1C] text-[#AAAAAA] hover:text-white border border-[#2E2E2E]'
                }`}
              >
                <span>Vanakbara ➔ Nagoa Diu</span>
                <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full font-mono">
                  Morning Trip
                </span>
              </button>
            </div>

            <div className="text-xs text-[#888888] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>Real timetable from official municipal schedule</span>
            </div>
          </div>

          {/* Schedule Table/Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(govtBusDirection === 'diu-to-vanakbara'
              ? govtBusData.diuToVanakbara
              : govtBusDirection === 'vanakbara-to-diu'
              ? govtBusData.vanakbaraToDiu
              : govtBusData.vanakbaraToNagoaDiu
            ).map((trip, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                className="bg-[#181818] border border-[#2E2E2E] rounded-2xl p-5 space-y-3.5 hover:border-[#B7F34A] transition-all relative overflow-hidden group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] bg-[#222222] px-2.5 py-0.5 rounded-full">
                    Trip #{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold text-[#FF9F43] bg-[#FF9F43]/10 border border-[#FF9F43]/30 px-2 py-0.5 rounded-full">
                    ₹10 Ticket
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-[10px] font-semibold text-[#888888] uppercase block">
                      Departure
                    </span>
                    <span className="text-xl font-black text-white font-mono">
                      {trip.departure}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-[#B7F34A] uppercase block">
                      Kevdi College ETA
                    </span>
                    <span className="text-xl font-black text-[#B7F34A] font-mono">
                      {trip.collegeEta}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2A2A2A] text-xs">
                  <span className="text-[10px] font-semibold text-[#777777] uppercase block">
                    Route Note:
                  </span>
                  <p className="text-xs font-semibold text-[#CCCCCC] mt-0.5">
                    {trip.note}
                  </p>
                </div>

                <div className="text-[11px] text-[#888888] flex items-center justify-between pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#B7F34A]" />
                    Stops at College Gate
                  </span>
                  <span className="text-[10px] text-[#FF9F43] font-bold">±10 min window</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bus In-Charge Emergency Bar */}
          <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#262626] text-[#B7F34A] flex items-center justify-center font-bold shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="text-white font-bold">Need bus location or running status?</p>
                <p className="text-[#888888]">
                  Call Government Bus In-charge: <strong>Asvinbhai</strong> at <strong>9426402875</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:9426402875"
                className="flex-1 sm:flex-initial btn-lime text-xs px-4 py-2 font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Asvinbhai</span>
              </a>
              <button
                onClick={() => handleCopy('asvin-bus', '9426402875')}
                className="px-3 py-2 rounded-xl bg-[#282828] text-white hover:bg-[#333333] text-xs font-bold flex items-center gap-1 border border-[#3A3A3A]"
              >
                {copiedId === 'asvin-bus' ? <Check className="w-3.5 h-3.5 text-[#B7F34A]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'asvin-bus' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= TAB 2: LOCAL PRIVATE TRANSPORT & STUDENT ESSENTIALS ================= */}
      {activeTab === 'local-services' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Rapido Bike Taxi Notice Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF9F43]/20 via-[#1C1C1C] to-[#1C1C1C] border border-[#FF9F43]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF9F43] text-[#111111] flex items-center justify-center font-bold shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-white">Rapido Bike Taxi Available in Diu!</h4>
                  <span className="text-[10px] font-bold bg-[#FF9F43] text-[#111111] px-2 py-0.2 rounded-full">
                    Mobile App
                  </span>
                </div>
                <p className="text-xs text-[#CCCCCC] leading-relaxed">
                  Rapido operates in Diu for quick 2-wheeler rides to Diu town, Nagoa Beach, and Kevdi.
                  <strong> Note:</strong> Always open your Rapido mobile app first to check available riders nearby before planning late evening trips!
                </p>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626] space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search auto, delivery boy Saddam, cake, print..."
                  className="w-full pl-10 pr-4 py-2 bg-[#202020] border border-[#333333] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
                />
              </div>

              <div className="text-xs text-[#888888]">
                Showing <strong className="text-white">{filteredServices.length}</strong> verified contact(s)
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#262626]">
              {serviceCategories.map((cat) => {
                const isSelected = selectedServiceCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedServiceCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#FF9F43] text-[#111111] shadow'
                        : 'bg-[#222222] text-[#AAAAAA] hover:bg-[#2A2A2A] hover:text-white border border-[#2E2E2E]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contacts Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-[#161616] rounded-3xl border border-[#262626] text-xs text-[#888888]">
                No verified local transport or service contacts matching your search.
              </div>
            ) : (
              filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ y: -3 }}
                  className="bg-[#181818] border border-[#2A2A2A] hover:border-[#FF9F43] rounded-2xl p-5 space-y-4 transition-all shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header with Type & Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#AAAAAA] bg-[#222222] px-2.5 py-1 rounded-lg border border-[#2E2E2E]">
                        {service.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40">
                        {service.badge}
                      </span>
                    </div>

                    {/* Name & Vehicle Type */}
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {service.name}
                      </h3>
                      <p className="text-xs font-medium text-[#FF9F43] mt-0.5">
                        {service.type}
                      </p>
                    </div>

                    {/* Coverage Route Info */}
                    <div className="p-3 rounded-xl bg-[#202020] border border-[#2C2C2C] space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
                        Route & Validity:
                      </span>
                      <p className="font-semibold text-[#E0E0E0] flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B7F34A] shrink-0 mt-0.5" />
                        <span>{service.coverage}</span>
                      </p>
                    </div>

                    {/* Student Notes */}
                    <p className="text-xs text-[#999999] leading-relaxed">
                      {service.notes}
                    </p>
                  </div>

                  {/* Actions / Call & Copy */}
                  <div className="pt-3 border-t border-[#2A2A2A] flex items-center justify-between gap-2">
                    <div className="font-mono text-xs font-bold text-white truncate">
                      {service.phone}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopy(service.id, service.phone)}
                        className="p-2 rounded-xl bg-[#242424] text-[#CCCCCC] hover:text-white hover:bg-[#303030] border border-[#333333] transition-all"
                        title="Copy Phone Number"
                      >
                        {copiedId === service.id ? (
                          <Check className="w-3.5 h-3.5 text-[#B7F34A]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {service.phone.startsWith('+91') || !isNaN(service.phone.replace(/\s+/g, '')) ? (
                        <a
                          href={`tel:${service.phone.replace(/\s+/g, '')}`}
                          className="btn-lime text-xs px-3.5 py-1.5 font-bold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      ) : (
                        <span className="text-[10px] font-bold text-[#AAAAAA] bg-[#222222] px-2.5 py-1.5 rounded-xl border border-[#333333]">
                          In App
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      )}

      {/* ================= TAB 3: CAMPUS SHUTTLE ROUTES ================= */}
      {activeTab === 'campus-shuttles' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Demo Info Banner */}
          <div className="p-4 rounded-2xl bg-[#1C1C1C] border border-[#2E2E2E] flex items-start gap-3">
            <Info className="w-5 h-5 text-[#B7F34A] shrink-0 mt-0.5" />
            <div className="text-xs text-[#CCCCCC] leading-relaxed">
              <strong>Campus Transit Fleets:</strong> The routes below represent the scheduled campus shuttles connecting Education Hub Kevdi with major transit nodes (Diu Bus Stand, Ghoghla, Una Western Railway). Timings subject to academic calendar adjustments.
            </div>
          </div>

          <div className="space-y-4">
            {filteredRoutes.map((route) => (
              <motion.div
                key={route.id}
                whileHover={{ y: -2 }}
                className="p-6 rounded-2xl bg-[#181818] border border-[#2A2A2A] hover:border-[#B7F34A] shadow-xl transition-all space-y-4"
              >
                {/* Route Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2A2A2A]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#242424] text-[#B7F34A] flex items-center justify-center font-bold shrink-0 border border-[#333333]">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{route.routeName}</h3>
                        {route.isDemo && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-[#262626] text-[#AAAAAA] px-2 py-0.5 rounded-full border border-[#3A3A3A]">
                            Demo Route
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#888888]">
                        Bus Registration: <strong className="font-mono text-white">{route.busNumber}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white bg-[#222222] border border-[#333333] px-3 py-1.5 rounded-xl">
                      {route.daysOfOperation}
                    </span>
                  </div>
                </div>

                {/* Source & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#202020] border border-[#2E2E2E] space-y-1">
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                      Origin / Pickup
                    </span>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B7F34A]" />
                      {route.source}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#202020] border border-[#2E2E2E] space-y-1">
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                      Terminus / Drop
                    </span>
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FF9F43]" />
                      {route.destination}
                    </p>
                  </div>
                </div>

                {/* Stops */}
                {route.stops && route.stops.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                      Intermediate Stops & Landmarks:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {route.stops.map((stop, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium bg-[#222222] text-[#CCCCCC] border border-[#2E2E2E] px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B7F34A]" />
                          {stop}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timings, frequency & contact */}
                <div className="pt-3 border-t border-[#2A2A2A] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-[#888888]">
                    <span className="flex items-center gap-1.5 font-semibold text-white">
                      <Clock className="w-3.5 h-3.5 text-[#B7F34A]" />
                      Departures: {route.departureTime}
                    </span>
                    <span>Frequency: {route.frequency}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#888888]">
                      Driver: <strong className="text-white">{route.driverName}</strong>
                    </span>
                    <a
                      href={`tel:${route.driverContact}`}
                      className="btn-lime text-xs px-3.5 py-1.5 font-bold flex items-center gap-1.5"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{route.driverContact}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
