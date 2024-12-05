import { Calendar as BigCalendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useState } from "react";
import { CustomToolbar } from "./CustomToolbar";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
}

export const Calendar = () => {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  // Sample events - replace with your actual events
  const events: CalendarEvent[] = [
    {
      id: 1,
      title: "Sample Event",
      start: new Date(),
      end: new Date(),
    },
  ];

  return (
    <div className="h-[800px] p-4 bg-white rounded-lg shadow">
      <BigCalendar
        localizer={localizer}
        events={events}
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