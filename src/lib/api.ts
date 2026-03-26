export type WindDay = {
  date: string;
  avgWindSpeed: number;
  maxWindSpeed: number;
  isWeekend: boolean;
  dayName: string;
  recommendation: string;
};

const ZANDVOORT_LAT = 52.3745;
const ZANDVOORT_LNG = 4.5305;

export async function fetchWindData(): Promise<WindDay[]> {
  try {
    const url = new URL('https://archive-api.open-meteo.com/v1/archive');
    
    const today = new Date();
    const endDate = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    // Using forecast API instead of archive
    const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
    forecastUrl.searchParams.append('latitude', ZANDVOORT_LAT.toString());
    forecastUrl.searchParams.append('longitude', ZANDVOORT_LNG.toString());
    forecastUrl.searchParams.append('hourly', 'wind_speed_10m');
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

    // Group data by day and calculate averages for daytime (9-18)
    const dailyData: Record<string, number[]> = {};
    
    times.forEach((time: string, index: number) => {
      const date = new Date(time);
      const dateStr = date.toISOString().split('T')[0];
      const hour = date.getHours();
      
      // Only collect data between 9:00 and 18:00
      if (hour >= 9 && hour <= 18) {
        if (!dailyData[dateStr]) {
          dailyData[dateStr] = [];
        }
        dailyData[dateStr].push(windSpeeds[index]);
      }
    });

    // Convert to WindDay format
    const windDays: WindDay[] = Object.entries(dailyData).map(([dateStr, speeds]) => {
      const date = new Date(dateStr + 'T00:00:00');
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const avgWindSpeed = speeds.length > 0 
        ? speeds.reduce((a, b) => a + b, 0) / speeds.length 
        : 0;
      
      const maxWindSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      let recommendation = '';
      if (avgWindSpeed >= 22) {
        recommendation = 'RRD 5m²';
      } else if (avgWindSpeed >= 19) {
        recommendation = 'RRD 7m²';
      } else if (avgWindSpeed >= 15) {
        recommendation = '10m² Kite';
      } else {
        recommendation = 'Not ideal';
      }

      return {
        date: dateStr,
        avgWindSpeed: Math.round(avgWindSpeed * 10) / 10,
        maxWindSpeed: Math.round(maxWindSpeed * 10) / 10,
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
