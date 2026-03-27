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

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* Date Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {day.date}
          </p>
          <p className="text-lg font-semibold text-gray-900">{day.dayName}</p>
        </div>
        {day.isWeekend && (
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
            Weekend
          </span>
        )}
      </div>

      {/* Wind Speed */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Peak Wind Speed</p>
        <p className="text-3xl font-bold text-gray-900">
          {day.maxWindSpeed}
          <span className="text-lg ml-1 text-gray-600">kn</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Wind: {day.minWindSpeed.toFixed(1)} - {day.maxWindSpeed.toFixed(1)} kn
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Daytime avg: {day.avgWindSpeed} kn
        </p>
        <p className="text-sm text-gray-600 mt-2 font-medium">
          Direction: {day.windDirectionArrow} {day.windDirectionLabel} ({day.windDirection}°)
        </p>
      </div>

      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full py-2 px-4 mb-6 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
      >
        {expanded ? 'Hide 3h Details' : 'Show 3h Details'}
      </button>

      {expanded && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">3-hour breakdown</h3>
          <div className="space-y-2 text-sm text-gray-700">
            {day.threeHourDetails.map((entry) => (
              <div key={entry.time} className="flex justify-between items-center">
                <span>{new Date(entry.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                <span>{entry.speed.toFixed(1)} kn</span>
                <span className="text-gray-600">
                  {entry.directionArrow} {entry.directionLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Condition Indicator */}
      <div className="mb-6">
        {isGoodDay ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Good for kiting!
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Light winds
          </span>
        )}
      </div>

      {/* Kite Recommendation */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-2">Recommended</p>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
          {day.recommendation}
        </span>
      </div>
    </div>
  );
}
}
