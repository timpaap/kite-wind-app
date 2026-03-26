'use client';

import { WindDay } from '@/lib/api';

interface WindCardProps {
  day: WindDay;
}

export default function WindCard({ day }: WindCardProps) {
  const isGoodDay = day.avgWindSpeed >= 15;
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

      {/* Wind Speed */}
      <div className="mb-4">
        <p className="text-xs text-gray-600 mb-1">Average Wind</p>
        <p className={`text-3xl font-bold ${getWindSpeedColor(day.avgWindSpeed)}`}>
          {day.avgWindSpeed}
          <span className="text-lg ml-1">kn</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max: {day.maxWindSpeed} kn
        </p>
      </div>

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
