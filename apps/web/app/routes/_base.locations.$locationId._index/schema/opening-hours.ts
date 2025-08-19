import type { SchemaContext } from "./types";

export function generateOpeningHours(context: SchemaContext): string[] | undefined {
  const { location } = context;
  
  if (!location.hours) {
    return undefined;
  }

  return Object.entries(location.hours).map(([day, hours]) => {
    const dayAbbrev = day.substring(0, 2);
    
    if (hours.toLowerCase().includes('sunrise') || hours.toLowerCase().includes('sunset')) {
      return `${dayAbbrev} 06:00-20:00`; // Default hours for sunrise-sunset
    }
    
    // Convert "6:00 AM - 10:00 PM" to "06:00-22:00" format
    const timeMatch = hours.match(/(\d{1,2}:\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      const [, startTime, startPeriod, endTime, endPeriod] = timeMatch;
      const formatTime = (time: string, period: string) => {
        let [hour] = time.split(':').map(Number);
        const minute = parseInt(time.split(':')[1]);
        if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
        if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      };
      return `${dayAbbrev} ${formatTime(startTime, startPeriod)}-${formatTime(endTime, endPeriod)}`;
    }
    
    return `${dayAbbrev} 06:00-20:00`; // Fallback
  });
}