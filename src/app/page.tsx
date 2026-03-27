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
    <main className="min-h-screen bg-[#f8f9fa] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🪁 Kite Wind App</h1>
          <p className="text-lg text-gray-600">Zandvoort aan Zee • 7-Day Forecast</p>
        </div>

        {/* Stats */}
        {!loading && windData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500 text-sm font-medium mb-2">Kite Days</p>
              <p className="text-3xl font-bold text-gray-900">{kiteDays.length}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500 text-sm font-medium mb-2">Avg Peak Wind</p>
              <p className="text-3xl font-bold text-gray-900">
                {(
                  windData.reduce((sum, day) => sum + day.maxWindSpeed, 0) /
                  windData.length
                ).toFixed(1)}{' '}
                kn
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500 text-sm font-medium mb-2">Max Wind</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.max(...windData.map((d) => d.maxWindSpeed)).toFixed(1)} kn
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500 text-sm font-medium mb-2">Wind Direction</p>
              <p className="text-3xl font-bold text-gray-900">{currentDirection}</p>
              <p className="text-sm text-gray-500 mt-1">{currentDirectionNumeric}°</p>
            </div>
          </div>
        )}

        {/* Export Button */}
        {!loading && windData.length > 0 && (
          <div className="text-center mb-12">
            <button
              onClick={handleExport}
              disabled={kiteDays.length === 0}
              className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-8 rounded-lg transition"
            >
              📅 Export Kite Days to Apple Calendar
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Loading wind data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Wind Cards */}
        {!loading && windData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {windData.map((day) => (
              <WindCard key={day.date} day={day} />
            ))}
          </div>
        )}

        {/* Legend */}
        {!loading && windData.length > 0 && (
          <div className="mt-16 bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Kite Recommendations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="font-medium text-gray-900">10m² Kite</p>
                <p className="text-gray-500 text-sm">15-22 knots</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="font-medium text-gray-900">RRD 7m²</p>
                <p className="text-gray-500 text-sm">19-27 knots</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="font-medium text-gray-900">RRD 5m²</p>
                <p className="text-gray-500 text-sm">22-35 knots</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
