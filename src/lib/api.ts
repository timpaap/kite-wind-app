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

const mpsToKnots = (mps: number): number => Number((mps * 1.9438).toFixed(1));

export async function fetchWindData(): Promise<WindDay[]> {
  try {
    const forecastUrl = new URL('https://api.met.no/weatherapi/locationforecast/2.0/compact');
    forecastUrl.searchParams.append('lat', ZANDVOORT_LAT.toString());
    forecastUrl.searchParams.append('lon', ZANDVOORT_LNG.toString());

    const response = await fetch(forecastUrl.toString(), {
      headers: {
        'User-Agent': 'kite-wind-app (your-email@example.com)',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch wind data from Yr.no');
    }

    const json = await response.json();
    const timeseries = json.properties?.timeseries || [];

    const dailyData: Record<string, {
      speeds: number[];
      gusts: number[];
      directions: number[];
      details: { time: string; speed: number; gust: number; direction: number }[];
    }> = {};

    timeseries.forEach((entry: any) => {
      const time = entry.time;
      const details = entry.data?.instant?.details;
      if (!details || details.wind_speed === undefined) return;

      const speedKn = mpsToKnots(details.wind_speed);
      const gustKn = mpsToKnots(details.wind_speed_of_gust || 0);
      const direction = details.wind_from_direction || 0;

      const localDate = new Date(time).toLocaleDateString('en-CA', { timeZone: 'Europe/Amsterdam' });

      if (!dailyData[localDate]) {
        dailyData[localDate] = { speeds: [], gusts: [], directions: [], details: [] };
      }

      dailyData[localDate].speeds.push(speedKn);
      dailyData[localDate].gusts.push(gustKn);
      dailyData[localDate].directions.push(direction);
      dailyData[localDate].details.push({ time, speed: speedKn, gust: gustKn, direction });
    });

    const windDays: WindDay[] = Object.entries(dailyData).map(([dateStr, data]) => {
      const date = new Date(`${dateStr}T00:00:00`);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const daytimeDetails = data.details.filter((item) => {
        const hour = Number(new Date(item.time).toLocaleTimeString('en-GB', { timeZone: 'Europe/Amsterdam', hour: '2-digit', hour12: false }).split(':')[0]);
        return hour >= 9 && hour <= 18;
      });

      const avgWindSpeed = daytimeDetails.length > 0
        ? daytimeDetails.reduce((sum, item) => sum + item.speed, 0) / daytimeDetails.length
        : 0;

      const maxWindSpeed = data.speeds.length > 0 ? Math.max(...data.speeds) : 0;
      const maxGustSpeed = data.gusts.length > 0 ? Math.max(...data.gusts) : 0;
      const averageDirection = data.directions.length > 0
        ? data.directions.reduce((sum, d) => sum + d, 0) / data.directions.length
        : 0;

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      let recommendation = 'Not ideal';
      const avg = Math.round(avgWindSpeed * 10) / 10;
      if (avg >= 22) recommendation = 'RRD 5m²';
      else if (avg >= 19) recommendation = 'RRD 7m²';
      else if (avg >= 15) recommendation = '10m² Kite';

      const threeHourDetails = data.details
        .filter((item) => Number(new Date(item.time).toLocaleTimeString('en-GB', { timeZone: 'Europe/Amsterdam', hour: '2-digit', hour12: false }).split(':')[0]) % 3 === 0)
        .map((item) => ({
          time: item.time,
          speed: item.speed,
          gust: item.gust,
          direction: item.direction,
          directionLabel: getCardinalDirection(item.direction),
        }));

      return {
        date: dateStr,
        avgWindSpeed: Math.round(avg * 10) / 10,
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
