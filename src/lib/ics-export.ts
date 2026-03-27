import { WindDay } from './api';

export function exportToICS(kiteDays: WindDay[]): void {
  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kite Wind App//Zandvoort Forecast//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Kite Days - Zandvoort
X-WR-TIMEZONE:Europe/Amsterdam
X-WR-CALDESC:Kite days forecast for Zandvoort aan Zee
`;

  kiteDays.forEach((day) => {
    const [year, month, dayNum] = day.date.split('-');
    
    // Create all-day event
    const startDate = `${year}${month}${dayNum}`;
    const endDate = `${year}${month}${parseInt(dayNum) + 1}`;
    
    // Create unique ID
    const uid = `kite-day-${day.date}@kitewindapp.local`;
    
    icsContent += `BEGIN:VEVENT
UID:${uid}
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
CREATED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
LAST-MODIFIED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:🪁 Kite Day - ${day.recommendation} (${day.maxWindSpeed}kn)
DESCRIPTION:Perfect for kiteboarding at Zandvoort aan Zee\nPeak wind: ${day.maxWindSpeed} knots\nDaytime average: ${day.avgWindSpeed} knots\nRecommended kite: ${day.recommendation}
LOCATION:Zandvoort aan Zee, Netherlands
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
  });

  icsContent += `END:VCALENDAR`;

  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kite-days-${new Date().toISOString().split('T')[0]}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportWeekendToICS(kiteDays: WindDay[]): void {
  const weekendDays = kiteDays.filter(day => day.isWeekend);
  
  if (weekendDays.length === 0) {
    alert('No suitable weekend kite days to export');
    return;
  }

  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kite Wind App//Weekend Kite Days//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Weekend Kite Days - Zandvoort
X-WR-TIMEZONE:Europe/Amsterdam
X-WR-CALDESC:Weekend kite days forecast for Zandvoort aan Zee
`;

  weekendDays.forEach((day) => {
    const [year, month, dayNum] = day.date.split('-');
    
    // Create all-day event
    const startDate = `${year}${month}${dayNum}`;
    const endDate = `${year}${month}${parseInt(dayNum) + 1}`;
    
    // Create unique ID
    const uid = `weekend-kite-day-${day.date}@kitewindapp.local`;
    
    icsContent += `BEGIN:VEVENT
UID:${uid}
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
CREATED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
LAST-MODIFIED:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:🪁 Weekend Kite Day - ${day.recommendation} (${day.maxWindSpeed}kn)
DESCRIPTION:Perfect weekend for kiteboarding at Zandvoort aan Zee\nPeak wind: ${day.maxWindSpeed} knots\nDaytime average: ${day.avgWindSpeed} knots\nRecommended kite: ${day.recommendation}
LOCATION:Zandvoort aan Zee, Netherlands
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
  });

  icsContent += `END:VCALENDAR`;

  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `weekend-kite-days-${new Date().toISOString().split('T')[0]}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
