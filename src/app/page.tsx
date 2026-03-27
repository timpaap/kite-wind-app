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

  const kiteDays = windData.filter((day) => day.maxWindSpeed >= 15);
  const firstDay = windData[0];
  const currentDirection = firstDay?.windDirectionLabel ?? '-';
  const currentDirectionNumeric = firstDay?.windDirection ?? 0;

  const handleExport = () => {
    if (kiteDays.length === 0) {
      alert('No suitable kite days to export');
      return;
    }
    exportToICS(kiteDays);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(144,205,255,0.5),_rgba(190,225,255,0.15)_60%,_rgba(235,245,255,0.3))] p-6 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">🪁 Kite Wind App</h1>
          <p className="text-lg text-blue-700">Zandvoort aan Zee • 7-Day Forecast</p>
        </div>

        {/* Stats */}
        {!loading && windData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-4 text-center">
              <p className="text-gray-600 text-sm font-medium mb-1">Kite Days</p>
              <p className="text-3xl font-bold text-green-600">{kiteDays.length}</p>
            </div>
            <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-4 text-center">
              <p className="text-gray-600 text-sm font-medium mb-1">Avg Peak Wind</p>
              <p className="text-3xl font-bold text-blue-600">
                {(
                  windData.reduce((sum, day) => sum + day.maxWindSpeed, 0) /
                  windData.length
                ).toFixed(1)}{' '}
                kn
              </p>
            </div>
            <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-4 text-center">
              <p className="text-gray-600 text-sm font-medium mb-1">Max Wind</p>
              <p className="text-3xl font-bold text-orange-600">
                {Math.max(...windData.map((d) => d.maxWindSpeed)).toFixed(1)} kn
              </p>
            </div>
            <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-4 text-center">
              <p className="text-gray-600 text-sm font-medium mb-1">Wind Direction</p>
              <p className="text-3xl font-bold text-blue-700">{currentDirection}</p>
              <p className="text-xs text-gray-500 mt-1">{currentDirectionNumeric}°</p>
            </div>
          </div>
        )}

        {/* Export Button */}
        {!loading && windData.length > 0 && (
          <div className="text-center mb-8">
            <button
              onClick={handleExport}
              disabled={kiteDays.length === 0}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              📅 Export Kite Days to Apple Calendar
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-blue-700">Loading wind data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Wind Cards */}
        {!loading && windData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {windData.map((day) => (
              <WindCard key={day.date} day={day} />
            ))}
          </div>
        )}

        {/* Legend */}
        {!loading && windData.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Kite Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold text-blue-900">10m² Kite</p>
                <p className="text-gray-600">15-22 knots</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-semibold text-purple-900">RRD 7m²</p>
                <p className="text-gray-600">19-27 knots</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <p className="font-semibold text-red-900">RRD 5m²</p>
                <p className="text-gray-600">22-35 knots</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
