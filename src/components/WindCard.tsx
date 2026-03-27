'use client';

import { useState } from 'react';
import { WindDay } from '@/lib/api';

interface WindCardProps {
  day: WindDay;
}

export default function WindCard({ day }: WindCardProps) {
  const [expanded, setExpanded] = useState(false);
  // Use max wind speed for determining if it's a good day (matches other weather apps)
  const isGoodDay = day.maxWindSpeed >= 15;
  const backgroundColor = day.isWeekend && isGoodDay ? 'bg-green-100 border-green-500' : 'bg-white';
  const borderColor = day.isWeekend && isGoodDay ? 'border-2' : 'border';

  const getKiteColor = (recommendation: string): string => {
    switch (recommendation) {
      case 'RRD 5m²':
        return 'text-red-600 bg-red-50';
      case 'RRD 7m²':
        return 'text-purple-600 bg-purple-50';
      case '10m² Kite':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getWindSpeedColor = (speed: number): string => {
    if (speed >= 25) return 'text-red-600 font-bold';
    if (speed >= 20) return 'text-orange-600 font-bold';
    if (speed >= 15) return 'text-green-600 font-bold';
    return 'text-blue-600';
  };

  return (
    <div
      className={`${backgroundColor} ${borderColor} border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition`}
    >
      {/* Date Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {day.date}
          </p>
          <p className="text-lg font-bold text-gray-800">{day.dayName}</p>
        </div>
        {day.isWeekend && (
          <span className="text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-semibold">
            Weekend
          </span>
        )}
      </div>

      {/* Wind Speed - Now showing Peak/Max Wind as primary */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-1">Peak Wind Speed</p>
        <p className={`text-3xl font-bold ${getWindSpeedColor(day.maxWindSpeed)}`}>
          {day.maxWindSpeed}
          <span className="text-lg ml-1">kn</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Wind: {day.minWindSpeed.toFixed(1)} - {day.maxWindSpeed.toFixed(1)} kn
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Gusts: {day.minGustSpeed.toFixed(1)} - {day.maxGustSpeed.toFixed(1)} kn
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Daytime avg: {day.avgWindSpeed} kn
        </p>
        <p className="text-xs text-blue-700 font-semibold mt-1">
          Direction: {day.windDirectionArrow} {day.windDirectionLabel} ({day.windDirection}°)
        </p>
      </div>

      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full py-2 px-4 mb-4 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        {expanded ? 'Hide 3h Details' : 'Show 3h Details'}
      </button>

      {expanded && (
        <div className="bg-blue-50/25 rounded-xl p-3 border border-blue-200 mb-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">3-hour breakdown</h3>
          <div className="space-y-2 text-xs text-blue-900 font-medium">
            {day.threeHourDetails.map((entry) => (
              <div key={entry.time} className="flex justify-between items-center gap-1">
                <span>{new Date(entry.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>{entry.speed.toFixed(1)} kn</span>
                <span className="text-gray-700">
                  {entry.directionArrow} {entry.directionLabel}
                </span>
                <span className="text-blue-700">gust {entry.gust.toFixed(1)} kn</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Condition Indicator */}
      <div className="mb-4">
        {isGoodDay ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2 rounded">
            <span className="text-lg">✅</span>
            <span className="text-sm font-semibold text-green-700">
              Good for kiting!
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded">
            <span className="text-lg">❌</span>
            <span className="text-sm font-semibold text-gray-600">
              Light winds
            </span>
          </div>
        )}
      </div>

      {/* Kite Recommendation */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-2 font-medium">Recommended</p>
        <div className={`px-3 py-2 rounded font-semibold text-sm ${getKiteColor(day.recommendation)}`}>
          {day.recommendation}
        </div>
      </div>
    </div>
  );
}
