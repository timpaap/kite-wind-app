'use client';

import { WindDay } from '@/lib/api';

interface WindCardProps {
  day: WindDay;
}

export default function WindCard({ day }: WindCardProps) {
  const isGoodDay = day.avgWindSpeed >= 15;
  const isExcellentDay = day.avgWindSpeed >= 22;

  // Determine wind strength color
  const getWindStrengthColor = (speed: number): { bar: string; text: string } => {
    if (speed >= 25) return { bar: 'bg-red-600', text: 'text-red-400' };
    if (speed >= 22) return { bar: 'bg-orange-500', text: 'text-orange-400' };
    if (speed >= 19) return { bar: 'bg-yellow-500', text: 'text-yellow-400' };
    if (speed >= 15) return { bar: 'bg-green-500', text: 'text-green-400' };
    return { bar: 'bg-gray-600', text: 'text-gray-400' };
  };

  // Get badge details
  const getBadgeDetails = (recommendation: string): { badge: string; background: string; color: string } => {
    switch (recommendation) {
      case 'RRD 5m²':
        return {
          badge: 'RRD 5m²',
          background: 'from-red-600 to-red-500',
          color: 'text-white',
        };
      case 'RRD 7m²':
        return {
          badge: 'RRD 7m²',
          background: 'from-purple-600 to-purple-500',
          color: 'text-white',
        };
      case '10m² Kite':
        return {
          badge: '10m² Kite',
          background: 'from-blue-600 to-blue-500',
          color: 'text-white',
        };
      default:
        return {
          badge: 'Not Ideal',
          background: 'from-gray-600 to-gray-500',
          color: 'text-white',
        };
    }
  };

  const windColor = getWindStrengthColor(day.avgWindSpeed);
  const badgeDetails = getBadgeDetails(day.recommendation);

  // Calculate wind strength percentage for the bar
  const windPercentage = Math.min((day.avgWindSpeed / 35) * 100, 100);

  return (
    <div className="group relative">
      {/* Glass Effect Card */}
      <div
        className={`relative backdrop-blur-xl border rounded-3xl p-6 overflow-hidden transition-all duration-300 transform hover:scale-105 ${
          isGoodDay
            ? 'bg-gradient-to-br from-[#1a4d52]/40 to-[#0d2f35]/40 border-[#4ade80]/30 shadow-lg shadow-[#4ade80]/20'
            : 'bg-gradient-to-br from-[#1a3a52]/30 to-[#0d2235]/30 border-[#64c8ff]/20 shadow-lg shadow-blue-900/20'
        }`}
      >
        {/* Animated background blur effect */}
        <div className="absolute inset-0 opacity-40">
          {isGoodDay && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ade80] rounded-full blur-3xl -mr-16 -mt-16"></div>
          )}
          {!isGoodDay && (
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#64c8ff] rounded-full blur-3xl -ml-16 -mb-16 opacity-30"></div>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header: Date and Weekend Badge */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-[#64c8ff] font-medium tracking-wider">
                {day.date}
              </p>
              <p className="text-xl font-bold text-white mt-1">{day.dayName}</p>
            </div>
            {day.isWeekend && (
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                🎉 Weekend
              </div>
            )}
          </div>

          {/* Large Wind Speed Display */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <p className={`text-6xl font-black ${windColor.text}`}>
                {day.avgWindSpeed}
              </p>
              <p className="text-xl text-[#64c8ff] font-light">knots</p>
            </div>
            <p className="text-xs text-[#b0d4e3] mt-2">
              Max: {day.maxWindSpeed} kn
            </p>
          </div>

          {/* Wind Strength Indicator Bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className={`h-full rounded-full transition-all duration-500 ${windColor.bar}`}
                style={{width: `${windPercentage}%`}}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-[#64c8ff]">Light</span>
              <span className="text-xs text-[#64c8ff]">Strong</span>
            </div>
          </div>

          {/* Condition Status */}
          <div className="mb-6">
            {isGoodDay ? (
              <div className="bg-gradient-to-r from-[#4ade80]/20 to-green-600/10 border border-[#4ade80]/50 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-sm font-bold text-[#4ade80]">Perfect for Kiting!</p>
                  <p className="text-xs text-[#b0d4e3]">Conditions are excellent</p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-gray-600/20 to-gray-700/10 border border-gray-500/50 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">⏸️</span>
                <div>
                  <p className="text-sm font-bold text-gray-300">Wait for More Wind</p>
                  <p className="text-xs text-[#b0d4e3]">Conditions are light</p>
                </div>
              </div>
            )}
          </div>

          {/* Kite Recommendation Badge */}
          <div className="relative pt-4 border-t border-[#64c8ff]/20">
            {isExcellentDay && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="inline-block bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full">
                  ⭐ OPTIMAL
                </span>
              </div>
            )}
            <p className="text-xs text-[#64c8ff] mb-3 font-medium">RECOMMENDED KITE</p>
            <div className={`bg-gradient-to-r ${badgeDetails.background} rounded-2xl px-4 py-3 text-center font-black text-lg ${badgeDetails.color} shadow-lg shadow-black/50`}>
              {badgeDetails.badge}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
