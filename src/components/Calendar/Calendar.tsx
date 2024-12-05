import { Calendar as BigCalendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, setHours, setMinutes } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useState } from "react";
import { CustomToolbar } from "./CustomToolbar";
import { CoachSelector } from "./CoachSelector";
import { Coach, CalendarEvent } from "@/types/calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Sample coaches data
const coaches: Coach[] = [
  { id: "1", name: "John Doe", title: "Senior Coach" },
  { id: "2", name: "Jane Smith", title: "Life Coach" },
  { id: "3", name: "Mike Johnson", title: "Career Coach" },
];

// Function to generate a color based on coach ID
const generateCoachColor = (coachId: string): string => {
  // Predefined base colors that work well with white text
  const baseColors = [
    { h: 200, s: 75, l: 45 }, // Blue
    { h: 340, s: 65, l: 47 }, // Pink/Red
    { h: 150, s: 65, l: 40 }, // Green
    { h: 270, s: 65, l: 45 }, // Purple
    { h: 25, s: 75, l: 45 },  // Orange
    { h: 190, s: 70, l: 42 }, // Teal
  ];

  // Use hash to select a base color and slightly modify it
  let hash = 0;
  for (let i = 0; i < coachId.length; i++) {
    hash = coachId.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Select base color
  const baseColor = baseColors[Math.abs(hash) % baseColors.length];
  
  // Slightly modify the base color to create variation while maintaining readability
  const hueOffset = (hash % 30) - 15; // Small hue variation (-15 to +15)
  const saturationOffset = (hash % 10) - 5; // Small saturation variation (-5 to +5)
  
  const h = (baseColor.h + hueOffset + 360) % 360; // Ensure hue stays in 0-360 range
  const s = Math.max(60, Math.min(80, baseColor.s + saturationOffset)); // Keep saturation in readable range
  const l = baseColor.l; // Keep lightness constant for consistent readability

  return `hsl(${h}, ${s}%, ${l}%)`;
};

const generateSampleEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const startOfWeekDate = startOfWeek(new Date());
  let eventId = 1;

  coaches.forEach(coach => {
    // Generate 50 events for each coach
    for (let i = 0; i < 50; i++) {
      // Random day of the week (0-6)
      const dayOffset = Math.floor(Math.random() * 7);
      // Random hour between 9 and 17 (9 AM to 5 PM)
      const hour = 9 + Math.floor(Math.random() * 9);
      // Random minute (0, 15, 30, 45)
      const minute = Math.floor(Math.random() * 4) * 15;
      
      const start = setMinutes(
        setHours(addDays(startOfWeekDate, dayOffset), hour),
        minute
      );
      
      // Duration between 30 minutes and 2 hours
      const durationInMinutes = [30, 60, 90, 120][Math.floor(Math.random() * 4)];
      const end = new Date(start.getTime() + durationInMinutes * 60000);

      events.push({
        id: eventId++,
        title: `Session with ${coach.name}`,
        start,
        end,
        coachId: coach.id,
      });
    }
  });

  return events;
};

// Generate sample events
const sampleEvents = generateSampleEvents();

export const Calendar = () => {
  const [view, setView] = useState<View>("week"); // Default to week view for better testing
  const [date, setDate] = useState(new Date());
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  // Filter events based on selected coach
  const filteredEvents = selectedCoachId
    ? sampleEvents.filter((event) => event.coachId === selectedCoachId)
    : sampleEvents;

  console.log("Selected Coach ID:", selectedCoachId);
  console.log("Filtered Events:", filteredEvents);

  // Custom event style
  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = generateCoachColor(event.coachId);
    return {
      style: {
        backgroundColor,
        border: 'none',
        borderRadius: '4px',
        color: '#fff',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)', // Increased text shadow for better readability
        fontWeight: '500',
      },
    };
  };

  return (
    <div className="h-[800px] p-4 bg-white rounded-lg shadow">
      <CoachSelector
        coaches={coaches}
        selectedCoachId={selectedCoachId}
        onCoachSelect={setSelectedCoachId}
      />
      <BigCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        components={{
          toolbar: CustomToolbar,
        }}
        eventPropGetter={eventStyleGetter}
        className="calendar-custom"
      />
    </div>
  );
};
