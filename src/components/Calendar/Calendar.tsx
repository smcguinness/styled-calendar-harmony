import { Calendar as BigCalendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
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

// Sample coaches data - replace with your actual coaches data
const coaches: Coach[] = [
  { id: "1", name: "John Doe", title: "Senior Coach" },
  { id: "2", name: "Jane Smith", title: "Life Coach" },
  { id: "3", name: "Mike Johnson", title: "Career Coach" },
];

// Sample events - replace with your actual events
const sampleEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Coaching Session with John",
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    coachId: "1",
  },
  {
    id: 2,
    title: "Career Planning with Mike",
    start: new Date(new Date().setHours(new Date().getHours() + 2)),
    end: new Date(new Date().setHours(new Date().getHours() + 3)),
    coachId: "3",
  },
];

export const Calendar = () => {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  // Filter events based on selected coach
  const filteredEvents = selectedCoachId
    ? sampleEvents.filter((event) => event.coachId === selectedCoachId)
    : sampleEvents;

  console.log("Selected Coach ID:", selectedCoachId);
  console.log("Filtered Events:", filteredEvents);

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
        className="calendar-custom"
      />
    </div>
  );
};