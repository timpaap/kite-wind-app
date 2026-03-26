export type WindDay = {
  date: string;
  avgWindSpeed: number;
  maxWindSpeed: number;
  maxGustSpeed: number;
  isWeekend: boolean;
  dayName: string;
  recommendation: string;
};

const ZANDVOORT_LAT = 52.3745;
const ZANDVOORT_LNG = 4.5305;

export async function fetchWindData(): Promise<WindDay[]> {
  try {
    const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
    forecastUrl.searchParams.append('latitude', ZANDVOORT_LAT.toString());
    forecastUrl.searchParams.append('longitude', ZANDVOORT_LNG.toString());
    // Fetch both wind speed and gusts for accurate comparison
    forecastUrl.searchParams.append('hourly', 'wind_speed_10m,wind_gusts_10m');
    forecastUrl.searchParams.append('forecast_days', '7');
    forecastUrl.searchParams.append('timezone', 'Europe/Amsterdam');
    forecastUrl.searchParams.append('wind_speed_unit', 'kn');

    const response = await fetch(forecastUrl.toString());
    
    if (!response.ok) {
      throw new Error('Failed to fetch wind data');
    }

    const data = await response.json();
    const hourly = data.hourly;
    const times = hourly.time;
    const windSpeeds = hourly.wind_speed_10m;
    const windGusts = hourly.wind_gusts_10m;

    // Group data by day
    const dailyData: Record<string, { speeds: number[]; gusts: number[] }> = {};
    
    times.forEach((time: string, index: number) => {
      const date = new Date(time);
      const dateStr = date.toISOString().split('T')[0];
      const hour = date.getHours();
      
      // Collect all data for the day
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { speeds: [], gusts: [] };
      }
      
      dailyData[dateStr].speeds.push(windSpeeds[index]);
      dailyData[dateStr].gusts.push(windGusts[index] || 0);
      
      // Also collect daytime-specific data
    });

    // Convert to WindDay format
    const windDays: WindDay[] = Object.entries(dailyData).map(([dateStr, data]) => {
      const date = new Date(dateStr + 'T00:00:00');
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Calculate daytime (9-18) averages
      const daytimeHours = times
        .filter((time: string, idx: number) => {
          const t = new Date(time);
          const d = t.toISOString().split('T')[0];
          const h = t.getHours();
          return d === dateStr && h >= 9 && h <= 18;
        })
        .map((time: string) => new Date(time).getHours());
      
      const daytimeIndices = times
        .map((time: string, idx: number) => {
          const t = new Date(time);
          const d = t.toISOString().split('T')[0];
          const h = t.getHours();
          return d === dateStr && h >= 9 && h <= 18 ? idx : -1;
        })
        .filter((idx: number) => idx !== -1);
      
      const daytimeSpeeds = daytimeIndices.map((idx: number) => windSpeeds[idx]);
      
      const avgWindSpeed = daytimeSpeeds.length > 0 
        ? daytimeSpeeds.reduce((a: number, b: number) => a + b, 0) / daytimeSpeeds.length 
        : 0;
      
      // Max wind speed during the entire day (best for comparison with other apps)
      const maxWindSpeed = data.speeds.length > 0 ? Math.max(...data.speeds) : 0;
      
      // Max gust speed during the entire day
      const maxGustSpeed = data.gusts.length > 0 ? Math.max(...data.gusts) : 0;
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Recommendation based on max wind (more realistic for kiteboarding)
      let recommendation = '';
      if (maxWindSpeed >= 22) {
        recommendation = 'RRD 5m²';
      } else if (maxWindSpeed >= 19) {
        recommendation = 'RRD 7m²';
      } else if (maxWindSpeed >= 15) {
        recommendation = '10m² Kite';
      } else {
        recommendation = 'Not ideal';
      }

      return {
        date: dateStr,
        avgWindSpeed: Math.round(avgWindSpeed * 10) / 10,
        maxWindSpeed: Math.round(maxWindSpeed * 10) / 10,
        maxGustSpeed: Math.round(maxGustSpeed * 10) / 10,
        isWeekend,
        dayName,
        recommendation,
      };
    });

    return windDays.slice(0, 7);
  } catch (error) {
    console.error('Error fetching wind data:', error);
    throw error;
  }
}
