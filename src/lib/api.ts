export type WindDay = {
  date: string;
  avgWindSpeed: number;
  minWindSpeed: number;
  maxWindSpeed: number;
  windDirection: number;
  windDirectionLabel: string;
  windDirectionArrow: string;
  isWeekend: boolean;
  dayName: string;
  recommendation: string;
  threeHourDetails: { time: string; speed: number; direction: number; directionLabel: string; directionArrow: string }[];
};

const ZANDVOORT_LAT = 52.3745;
const ZANDVOORT_LNG = 4.5305;

const getCardinalDirection = (deg: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((deg % 360 + 360) % 360) / 22.5) % 16;
  return directions[index];
};

const getDirectionArrow = (deg: number): string => {
  const heading = ((deg + 180) % 360 + 360) % 360; // heading from direction
  if (heading >= 337.5 || heading < 22.5) return '↑';
  if (heading < 67.5) return '↗';
  if (heading < 112.5) return '→';
  if (heading < 157.5) return '↘';
  if (heading < 202.5) return '↓';
  if (heading < 247.5) return '↙';
  if (heading < 292.5) return '←';
  return '↖';
};

const mpsToKnots = (mps: number): number => Number((mps * 1.9438).toFixed(1));

export async function fetchWindData(): Promise<WindDay[]> {
  try {
    const response = await fetch('/api/wind');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to load wind data from proxy: ${response.status} ${errorText}`);
    }

    const json = await response.json();
    const timeseries = json.properties?.timeseries || [];

    const dailyData: Record<string, {
      speeds: number[];
      directions: number[];
      details: { time: string; speed: number; direction: number }[];
    }> = {};

    timeseries.forEach((entry: any) => {
      const time = entry.time;
      const details = entry.data?.instant?.details;
      if (!details || details.wind_speed === undefined) return;

      const speedKn = mpsToKnots(details.wind_speed);
      const direction = details.wind_from_direction || 0;

      const localDate = new Date(time).toLocaleDateString('en-CA', { timeZone: 'Europe/Amsterdam' });

      if (!dailyData[localDate]) {
        dailyData[localDate] = { speeds: [], directions: [], details: [] };
      }

      dailyData[localDate].speeds.push(speedKn);
      dailyData[localDate].directions.push(direction);
      dailyData[localDate].details.push({ time, speed: speedKn, direction });
    });

    const windDays: WindDay[] = Object.entries(dailyData).map(([dateStr, data]) => {
      const date = new Date(`${dateStr}T00:00:00`);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const daytimeDetails = data.details.filter((item) => {
        const hour = Number(new Date(item.time).toLocaleTimeString('en-GB', { timeZone: 'Europe/Amsterdam', hour: '2-digit', hour12: false }).split(':')[0]);
        return hour >= 10 && hour <= 19;
      });

      const avgWindSpeed = daytimeDetails.length > 0
        ? daytimeDetails.reduce((sum, item) => sum + item.speed, 0) / daytimeDetails.length
        : 0;

      const minWindSpeed = daytimeDetails.length > 0 ? Math.min(...daytimeDetails.map(d => d.speed)) : 0;
      const maxWindSpeed = daytimeDetails.length > 0 ? Math.max(...daytimeDetails.map(d => d.speed)) : 0;
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
        .filter((item) => {
          const localHour = Number(
            new Date(item.time).toLocaleTimeString('en-GB', {
              timeZone: 'Europe/Amsterdam',
              hour: '2-digit',
              hour12: false,
            }).split(':')[0]
          );
          return localHour % 3 === 0; // start at 0h (0,3,6,9,12,15,18,21)
        })
        .map((item) => ({
          time: item.time,
          speed: item.speed,
          direction: item.direction,
          directionLabel: getCardinalDirection(item.direction),
          directionArrow: getDirectionArrow(item.direction),
        }));

      return {
        date: dateStr,
        avgWindSpeed: Math.round(avg * 10) / 10,
        minWindSpeed: Math.round(minWindSpeed * 10) / 10,
        maxWindSpeed: Math.round(maxWindSpeed * 10) / 10,
        windDirection: Math.round(averageDirection),
        windDirectionLabel: getCardinalDirection(averageDirection),
        windDirectionArrow: getDirectionArrow(averageDirection),
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
