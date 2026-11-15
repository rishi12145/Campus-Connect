import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';
import { Modal } from '../../components/Modal';
import {
  Compass,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Coffee,
  BookOpen,
  Activity,
  Home,
  Info,
  Star,
  Navigation,
  Globe,
  Waves,
  Landmark,
  Trees,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ExplorePage = () => {
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const categories = [
    'All',
    'Historic & Architectural Landmarks',
    'Beaches & Coastal Spots',
    'Temples, Nature & Family Attractions'
  ];

  const loadData = () => {
    setPlaces(storageService.getPlaces());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campus_connect_update', loadData);
    return () => window.removeEventListener('campus_connect_update', loadData);
  }, []);

  const filteredPlaces = places.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.features && p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner with Aerial Sky Background */}
      <div className="relative overflow-hidden rounded-3xl bg-[#121212] border border-[#262626] p-6 sm:p-8 text-white shadow-2xl">
        <div
          className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/images/campus/campus-sky.jpg')` }}
        />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 flex items-center gap-1">
                <Compass className="w-3 h-3" />
                Diu Island & Campus Guide
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FF9F43]/20 text-[#FF9F43] border border-[#FF9F43]/40">
                20 Curated Attractions
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Explore Diu Heritage, Beaches & Wonders
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
              Curated guide for IIITV-ICD students. All 20 Portuguese forts, Blue Flag beaches, sea-side shrines,
              and natural sanctuaries — complete with distances from <strong className="text-white">Kevdi Campus</strong>,
              Google Maps navigation, and authentic traveler ratings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <div className="bg-[#1C1C1C] border border-[#333333] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF9F43] text-[#111111] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[#888888] uppercase block">
                  Starting Point
                </span>
                <span className="text-xs font-black text-white">
                  IIITV-ICD, Education Hub Kevdi
                </span>
              </div>
            </div>

            <div className="bg-[#1C1C1C] border border-[#333333] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B7F34A] text-[#111111] flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[#888888] uppercase block">
                  Transit Tip
                </span>
                <span className="text-xs font-black text-white">
                  ₹10 Govt Bus reaches most spots
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161616] border border-[#262626] space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#777777] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Diu Fort, Nagoa Beach, Naida Caves..."
              className="w-full pl-10 pr-4 py-2 bg-[#202020] border border-[#333333] rounded-xl text-xs text-white placeholder-[#777777] focus:border-[#B7F34A] outline-none"
            />
          </div>

          <div className="text-xs text-[#888888]">
            Showing <strong className="text-white">{filteredPlaces.length}</strong> of {places.length} location(s)
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#262626]">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#B7F34A] text-[#111111] shadow-lg shadow-[#B7F34A]/25'
                    : 'bg-[#222222] text-[#AAAAAA] hover:bg-[#2A2A2A] hover:text-white border border-[#2E2E2E]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Places Grid */}
      <div className="space-y-4">
        {filteredPlaces.length === 0 ? (
          <div className="p-12 text-center bg-[#161616] rounded-3xl border border-[#262626] text-xs text-[#888888]">
            No Diu attractions found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <motion.div
                key={place.id}
                whileHover={{ y: -4 }}
                className="bg-[#181818] rounded-2xl border border-[#2A2A2A] hover:border-[#B7F34A] shadow-xl overflow-hidden transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Container */}
                  <div
                    onClick={() => setSelectedPlace(place)}
                    className="relative aspect-[16/10] bg-[#222222] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      onError={(e) => {
                        e.target.src = '/images/campus/campus-sky.jpg';
                      }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#111111]/90 backdrop-blur-sm text-white border border-[#333333]">
                        {place.category.split('&')[0]}
                      </span>

                      {place.rating && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF9F43] text-[#111111] flex items-center gap-1 shadow">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{place.rating}</span>
                          <span className="text-[9px] opacity-80">({place.reviews})</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom distance pill on photo */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                      <span className="flex items-center gap-1.5 font-semibold bg-black/75 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        <MapPin className="w-3.5 h-3.5 text-[#B7F34A]" />
                        <span>{place.distanceFromKevdi || 'Diu Island'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <h3
                      onClick={() => setSelectedPlace(place)}
                      className="text-base font-bold text-white group-hover:text-[#B7F34A] transition-colors cursor-pointer"
                    >
                      {place.name}
                    </h3>
                    <p className="text-xs text-[#A0A0A0] line-clamp-2 leading-relaxed">
                      {place.description}
                    </p>

                    {/* Feature Chips */}
                    {place.features && place.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {place.features.slice(0, 3).map((feat, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#222222] text-[#B0B0B0] border border-[#2E2E2E]"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 pt-0 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#888888] pt-3 border-t border-[#262626]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#B7F34A]" />
                      <span className="truncate max-w-[170px]">{place.openingHours}</span>
                    </span>

                    <button
                      onClick={() => setSelectedPlace(place)}
                      className="text-xs font-bold text-[#B7F34A] hover:underline"
                    >
                      Quick Info →
                    </button>
                  </div>

                  {/* External Links */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={place.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#242424] hover:bg-[#303030] border border-[#333333] hover:border-[#B7F34A] text-white text-[11px] font-bold py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <Navigation className="w-3 h-3 text-[#B7F34A]" />
                      <span>Directions</span>
                    </a>

                    <a
                      href={place.websiteUrl || place.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#242424] hover:bg-[#303030] border border-[#333333] hover:border-[#FF9F43] text-white text-[11px] font-bold py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all text-center"
                    >
                      <Globe className="w-3 h-3 text-[#FF9F43]" />
                      <span>Official Guide</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Place Detail Modal */}
      <Modal
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        title={selectedPlace?.name || 'Diu Landmark'}
        subtitle={`${selectedPlace?.category} • Distance from Kevdi: ${selectedPlace?.distanceFromKevdi || 'Diu'}`}
      >
        <div className="space-y-4 text-xs">
          {selectedPlace?.imageUrl && (
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-[#222222] relative">
              <img
                src={selectedPlace.imageUrl}
                alt={selectedPlace.name}
                onError={(e) => {
                  e.target.src = '/images/campus/campus-sky.jpg';
                }}
                className="w-full h-full object-cover"
              />
              {selectedPlace.rating && (
                <div className="absolute top-3 right-3 bg-[#FF9F43] text-[#111111] font-bold text-xs px-3 py-1 rounded-full shadow flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {selectedPlace.rating} ({selectedPlace.reviews} Google Reviews)
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#242424] text-white border border-[#333333]">
              Category: {selectedPlace?.category}
            </span>
            <span className="text-[10px] font-bold bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified Diu Destination
            </span>
          </div>

          <p className="text-sm text-[#DDDDDD] leading-relaxed">
            {selectedPlace?.description}
          </p>

          <div className="p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] space-y-2.5">
            <div className="flex items-start gap-2 text-[#AAAAAA]">
              <MapPin className="w-4 h-4 text-[#B7F34A] shrink-0 mt-0.5" />
              <span>
                Location:{' '}
                <strong className="text-white">{selectedPlace?.location}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#AAAAAA]">
              <Clock className="w-4 h-4 text-[#FF9F43] shrink-0" />
              <span>
                Timings:{' '}
                <strong className="text-white">{selectedPlace?.openingHours}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#AAAAAA]">
              <Navigation className="w-4 h-4 text-[#B7F34A] shrink-0" />
              <span>
                Distance from IIITV-ICD:{' '}
                <strong className="text-white">
                  {selectedPlace?.distanceFromKevdi || 'Diu'}
                </strong>
              </span>
            </div>
          </div>

          {selectedPlace?.features && selectedPlace.features.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888] block">
                Key Highlights & Features:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedPlace.features.map((feat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#222222] border border-[#2E2E2E] text-[11px] font-medium text-white"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={selectedPlace?.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lime text-xs font-bold py-2.5 justify-center flex items-center gap-1.5 shadow-lg"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>

            <a
              href={selectedPlace?.websiteUrl || selectedPlace?.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#262626] text-white hover:bg-[#333333] border border-[#3A3A3A] text-xs font-bold justify-center flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#FF9F43]" />
              <span>Visit Official Guide</span>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};
