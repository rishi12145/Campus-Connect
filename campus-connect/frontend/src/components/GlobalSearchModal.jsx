import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { Search, X, ArrowRight, BookOpen, Bell, SearchCode, Bus, FolderArchive, MessageSquare, Compass, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim()) {
      const res = storageService.searchAll(query);
      setResults(res.results);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelect = (link) => {
    onClose();
    setQuery('');
    navigate(link);
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'Announcement': return <Bell className="w-4 h-4 text-[#B7F34A]" />;
      case 'Resource': return <FolderArchive className="w-4 h-4 text-emerald-400" />;
      case 'Discussion': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'Lost & Found': return <SearchCode className="w-4 h-4 text-amber-400" />;
      case 'Explore Location': return <Compass className="w-4 h-4 text-purple-400" />;
      case 'Academic Class': return <Calendar className="w-4 h-4 text-[#B7F34A]" />;
      default: return <BookOpen className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm"
        />

        {/* Search Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-campus-lg shadow-elevated border border-[#EEEEEC] overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-[#EEEEEC] bg-white">
            <Search className="w-5 h-5 text-[#777777] shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across timetable, notes, notices, lost items, places... (Press Esc to close)"
              className="w-full px-3 py-1 text-sm bg-transparent outline-none text-[#111111] placeholder:text-[#777777]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-[#777777] hover:text-[#111111] rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1 ml-2 text-[10px] font-mono text-[#777777] bg-[#EEEEEC] px-2 py-0.5 rounded">
              ESC
            </div>
          </div>

          {/* Quick Suggestions when empty */}
          {!query && (
            <div className="p-6">
              <h4 className="text-xs font-bold text-[#777777] uppercase tracking-wider mb-3">
                Quick Search Suggestions
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  'Software Engineering',
                  'Mid-Sem Timetable',
                  'Milton Bottle',
                  'Library Hours',
                  'Computing Lab',
                  'Ghoghla Shuttle'
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="text-xs font-medium text-[#111111] bg-[#EEEEEC] hover:bg-[#D8D8D5] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query && (
            <div className="max-h-96 overflow-y-auto divide-y divide-[#EEEEEC] p-2">
              {results.length === 0 ? (
                <div className="p-8 text-center text-sm text-[#777777]">
                  No matching results found for "{query}". Try searching for subject names, room numbers, or notices.
                </div>
              ) : (
                results.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(item.link)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8F8F6] cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center shrink-0">
                        {getResultIcon(item.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                            {item.type}
                          </span>
                        </div>
                        <h5 className="text-sm font-semibold text-[#111111] group-hover:text-black">
                          {item.title}
                        </h5>
                        <p className="text-xs text-[#777777]">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#777777] group-hover:text-[#111111] transition-transform group-hover:translate-x-1" />
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footer */}
          <div className="p-3 border-t border-[#EEEEEC] bg-[#F8F8F6] flex items-center justify-between text-[11px] text-[#777777] px-4">
            <span>Global search index covers all 8 campus modules</span>
            <span className="font-semibold text-[#111111]">{results.length} result(s) found</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

