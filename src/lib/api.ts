export type WindDay = {
  date: string;
  avgWindSpeed: number;
  maxWindSpeed: number;
  maxGustSpeed: number;
  windDirection: number;
  windDirectionLabel: string;
  isWeekend: boolean;
  dayName: string;
  recommendation: string;
  threeHourDetails: { time: string; speed: number; gust: number; direction: number; directionLabel: string }[];
};

const ZANDVOORT_LAT = 52.3745;
const ZANDVOORT_LNG = 4.5305;

const getCardinalDirection = (deg: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((deg % 360 + 360) % 360) / 22.5) % 16;
  return directions[index];
};

export async function fetchWindData(): Promise<WindDay[]> {
  try {
    const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
    forecastUrl.searchParams.append('latitude', ZANDVOORT_LAT.toString());
    forecastUrl.searchParams.append('longitude', ZANDVOORT_LNG.toString());
    forecastUrl.searchParams.append('hourly', 'wind_speed_10m,wind_gusts_10m,winddirection_10m');
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
    const windDirections = hourly.winddirection_10m;

    const dailyData: Record<string, { speeds: number[]; gusts: number[]; directions: number[]; details: { time: string; speed: number; gust: number; direction: number }[] }> = {};

    times.forEach((time: string, index: number) => {
      const date = new Date(time);
      const dateStr = date.toISOString().split('T')[0];

      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { speeds: [], gusts: [], directions: [], details: [] };
      }

      const speed = windSpeeds[index];
      const gust = windGusts[index] || 0;
      const direction = windDirections[index] || 0;

      dailyData[dateStr].speeds.push(speed);
      dailyData[dateStr].gusts.push(gust);
      dailyData[dateStr].directions.push(direction);
      dailyData[dateStr].details.push({ time, speed, gust, direction });
    });

    const windDays: WindDay[] = Object.entries(dailyData).map(([dateStr, data]) => {
      const date = new Date(`${dateStr}T00:00:00`);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const daytimeDetails = data.details.filter((item) => {
        const hour = new Date(item.time).getHours();
        return hour >= 9 && hour <= 18;
      });

      const avgWindSpeed = daytimeDetails.length > 0
        ? daytimeDetails.reduce((a, b) => a + b.speed, 0) / daytimeDetails.length
        : 0;

      const maxWindSpeed = data.speeds.length > 0 ? Math.max(...data.speeds) : 0;
      const maxGustSpeed = data.gusts.length > 0 ? Math.max(...data.gusts) : 0;

      const averageDirection = data.directions.length > 0
        ? data.directions.reduce((acc, d) => acc + d, 0) / data.directions.length
        : 0;

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

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

      const threeHourDetails = data.details
        .filter((item) => new Date(item.time).getHours() % 3 === 0)
        .map((item) => ({
          time: item.time,
          speed: item.speed,
          gust: item.gust,
          direction: item.direction,
          directionLabel: getCardinalDirection(item.direction),
        }));

      return {
        date: dateStr,
        avgWindSpeed: Math.round(avgWindSpeed * 10) / 10,
        maxWindSpeed: Math.round(maxWindSpeed * 10) / 10,
        maxGustSpeed: Math.round(maxGustSpeed * 10) / 10,
        windDirection: Math.round(averageDirection),
        windDirectionLabel: getCardinalDirection(averageDirection),
        isWeekend,
        dayName,
        recommendation,
        threeHourDetails,
      };
    });

    return windDays.slice(0, 7);
  } catch (error) {
    console.error('Error fetching wind data:', error);
    throw error;
  }
}
