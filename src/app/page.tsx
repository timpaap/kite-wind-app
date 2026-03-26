'use client';

import { useEffect, useState } from 'react';
import WindCard from '@/components/WindCard';
import { fetchWindData, type WindDay } from '@/lib/api';
import { exportToICS } from '@/lib/ics-export';

export default function Home() {
  const [windData, setWindData] = useState<WindDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchWindData();
        setWindData(data);
      } catch (err) {
        setError('Failed to load wind data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const kiteDays = windData.filter((day) => day.avgWindSpeed >= 15);
  const avgWind = windData.length > 0 
    ? (windData.reduce((sum, day) => sum + day.avgWindSpeed, 0) / windData.length).toFixed(1)
    : 0;
  const maxWind = windData.length > 0 
    ? Math.max(...windData.map((d) => d.avgWindSpeed)).toFixed(1)
    : 0;

  const handleExport = () => {
    if (kiteDays.length === 0) {
      alert('No suitable kite days to export');
      return;
    }
    exportToICS(kiteDays);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628]">
      {/* Wave Animation Header */}
      <div className="relative h-40 bg-gradient-to-b from-[#1a3a52] to-[#0a1628] overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#64c8ff', stopOpacity: 0.4}} />
              <stop offset="100%" style={{stopColor: '#64c8ff', stopOpacity: 0.1}} />
            </linearGradient>
          </defs>
          <path
            d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
            fill="url(#waveGradient)"
            className="wave"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative px-4 md:px-6 pb-20">
        {/* Header */}
        <div className="text-center mb-12 animate-float pt-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            🪁 Kite Winds
          </h1>
          <p className="text-lg md:text-xl text-[#64c8ff] font-light tracking-wide">
            Zandvoort aan Zee
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-[#64c8ff] border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-[#b0d4e3] text-lg">Fetching wind conditions...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/20 border border-red-500/50 backdrop-blur-md rounded-2xl px-6 py-4">
              <p className="text-red-200 font-medium">⚠️ {error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && windData.length > 0 && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Kite Days Stat */}
            <div className="glow-card bg-gradient-to-br from-[#1a4d52] to-[#0d2f35] backdrop-blur-xl border border-[#64c8ff]/20 rounded-2xl p-6 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#64c8ff] rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <p className="text-[#b0d4e3] text-sm font-medium mb-2">🌟 Kite Days</p>
                <p className="text-5xl font-bold text-[#4ade80]">{kiteDays.length}</p>
                <p className="text-xs text-[#64c8ff] mt-2">out of 7 days</p>
              </div>
            </div>

            {/* Average Wind Stat */}
            <div className="glow-card bg-gradient-to-br from-[#1a3a52] to-[#0d2235] backdrop-blur-xl border border-[#64c8ff]/20 rounded-2xl p-6 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#64c8ff] rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <p className="text-[#b0d4e3] text-sm font-medium mb-2">📊 Average Wind</p>
                <p className="text-5xl font-bold text-white">{avgWind}</p>
                <p className="text-xs text-[#64c8ff] mt-2">knots</p>
              </div>
            </div>

            {/* Max Wind Stat */}
            <div className="glow-card bg-gradient-to-br from-[#4d2a1a] to-[#351d0d] backdrop-blur-xl border border-[#64c8ff]/20 rounded-2xl p-6 text-center overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-20 h-20 bg-[#ff9800] rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <p className="text-[#b0d4e3] text-sm font-medium mb-2">⚡ Peak Wind</p>
                <p className="text-5xl font-bold text-[#ff9800]">{maxWind}</p>
                <p className="text-xs text-[#64c8ff] mt-2">knots</p>
              </div>
            </div>
          </div>
        )}

        {/* Export Button */}
        {!loading && windData.length > 0 && (
          <div className="flex justify-center mb-12">
            <button
              onClick={handleExport}
              disabled={kiteDays.length === 0}
              className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                kiteDays.length > 0
                  ? 'bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-black shadow-lg shadow-[#4ade80]/50 hover:shadow-xl hover:shadow-[#4ade80]/70'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              📅 Export Kite Days to Apple Calendar
            </button>
          </div>
        )}

        {/* Wind Cards - Horizontal Scroll on Mobile */}
        {!loading && windData.length > 0 && (
          <div className="max-w-7xl mx-auto mb-12">
            {/* Mobile: Horizontal scroll */}
            <div className="block md:hidden">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                {windData.map((day, idx) => (
                  <div key={day.date} className="flex-shrink-0 w-72 snap-start">
                    <WindCard day={day} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
              {windData.map((day) => (
                <WindCard key={day.date} day={day} />
              ))}
            </div>
          </div>
        )}

        {/* Footer Legend */}
        {!loading && windData.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-[#1a3a52] to-[#0d1f35] backdrop-blur-xl border border-[#64c8ff]/20 rounded-2xl p-8 overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#64c8ff] rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6">⚙️ Kite Recommendations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border-l-4 border-[#60a5fa] pl-4">
                    <p className="font-bold text-white text-lg">10m² Kite</p>
                    <p className="text-[#64c8ff]">15–22 knots</p>
                    <p className="text-xs text-[#b0d4e3] mt-1">Light wind conditions</p>
                  </div>
                  <div className="border-l-4 border-[#a78bfa] pl-4">
                    <p className="font-bold text-white text-lg">RRD 7m²</p>
                    <p className="text-[#64c8ff]">19–27 knots</p>
                    <p className="text-xs text-[#b0d4e3] mt-1">Moderate wind conditions</p>
                  </div>
                  <div className="border-l-4 border-[#f87171] pl-4">
                    <p className="font-bold text-white text-lg">RRD 5m²</p>
                    <p className="text-[#64c8ff]">22–35 knots</p>
                    <p className="text-xs text-[#b0d4e3] mt-1">Strong wind conditions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
