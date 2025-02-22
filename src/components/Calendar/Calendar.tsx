import { Calendar as BigCalendar, luxonLocalizer, View, SlotInfo } from "react-big-calendar";
import { DateTime, Settings } from "luxon";
import { useState } from "react";
import { CustomToolbar } from "./CustomToolbar";
import { CoachList } from "./CoachList";
import { Coach, CalendarEvent } from "@/types/calendar";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { SessionDialog } from "./SessionDialog";
import { NewSessionDialog } from "./NewSessionDialog";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useToast } from "@/components/ui/use-toast";

// Set default locale for Luxon
Settings.defaultLocale = "en-US";

// Use the built-in luxonLocalizer
const localizer = luxonLocalizer(DateTime);

// Sample coaches data with availability
const coaches: Coach[] = [
  {
    id: "1",
    name: "John Doe",
    title: "Senior Coach",
    availability: { start: "08:00", end: "16:00" },
    blockedTimes: [
      {
        start: DateTime.now().set({ hour: 10, minute: 0 }).toJSDate(),
        end: DateTime.now().set({ hour: 12, minute: 0 }).toJSDate(),
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    title: "Life Coach",
    availability: { start: "08:00", end: "16:00" },
  },
  {
    id: "3",
    name: "Mike Johnson",
    title: "Career Coach",
    availability: { start: "08:00", end: "16:00" },
  },
];

// Function to generate a color based on coach ID
const generateCoachColor = (coachId: string): string => {
  const baseColors = [
    { h: 200, s: 75, l: 45 },
    { h: 340, s: 65, l: 47 },
    { h: 150, s: 65, l: 40 },
    { h: 270, s: 65, l: 45 },
    { h: 25, s: 75, l: 45 },
    { h: 190, s: 70, l: 42 },
  ];

  let hash = 0;
  for (let i = 0; i < coachId.length; i++) {
    hash = coachId.charCodeAt(i) + ((hash << 5) - hash);
  }

  const baseColor = baseColors[Math.abs(hash) % baseColors.length];
  const hueOffset = (hash % 30) - 15;
  const saturationOffset = (hash % 10) - 5;

  const h = (baseColor.h + hueOffset + 360) % 360;
  const s = Math.max(60, Math.min(80, baseColor.s + saturationOffset));
  const l = baseColor.l;

  return `hsl(${h}, ${s}%, ${l}%)`;
};

const generateSampleEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const startOfWeekDate = DateTime.now().startOf('week').toJSDate();
  let eventId = 1;

  coaches.forEach(coach => {
    for (let i = 0; i < 50; i++) {
      const dayOffset = Math.floor(Math.random() * 7);
      const hour = 9 + Math.floor(Math.random() * 7);
      const minute = Math.floor(Math.random() * 4) * 15;

      const start = DateTime.fromJSDate(startOfWeekDate)
        .plus({ days: dayOffset })
        .set({ hour, minute })
        .toJSDate();

      const durationInMinutes = [30, 60, 90, 120][Math.floor(Math.random() * 4)];
      const end = DateTime.fromJSDate(start).plus({ minutes: durationInMinutes }).toJSDate();

      events.push({
        id: eventId++,
        title: `Session with ${coach.name}`,
        start,
        end,
        coachId: coach.id,
        studentName: `Student ${eventId}`,
      });
    }
  });

  return events;
};

// Generate sample events
const sampleEvents = generateSampleEvents();

export const Calendar = () => {
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const { toast } = useToast();

  // Function to get the dates to highlight in the date picker
  const getSelectedDates = () => {
    if (view === "week") {
      const start = DateTime.fromJSDate(date).startOf("week");
      const dates = Array.from({ length: 7 }, (_, i) => 
        start.plus({ days: i }).toJSDate()
      );
      return dates;
    }
    return [date];
  };

  // Function to check if a date is today
  const isToday = (day: Date) => {
    return DateTime.fromJSDate(day).hasSame(DateTime.now(), "day");
  };

  const filteredEvents = selectedCoachId
    ? sampleEvents.filter((event) => event.coachId === selectedCoachId)
    : sampleEvents;

  const eventStyleGetter = (event: CalendarEvent) => {
    const backgroundColor = generateCoachColor(event.coachId);
    return {
      style: {
        backgroundColor,
        border: 'none',
        borderRadius: '4px',
        color: '#fff',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
        fontWeight: '500',
        cursor: 'pointer',
      },
    };
  };

  const calculateBookedHours = (coachId: string): number => {
    const viewStart = DateTime.fromJSDate(date).startOf(view);
    const viewEnd = DateTime.fromJSDate(date).endOf(view);
    
    const coachEvents = sampleEvents.filter(event => 
      event.coachId === coachId &&
      DateTime.fromJSDate(event.start) >= viewStart &&
      DateTime.fromJSDate(event.end) <= viewEnd
    );

    const totalMinutes = coachEvents.reduce((acc, event) => {
      const duration = DateTime.fromJSDate(event.end).diff(
        DateTime.fromJSDate(event.start),
        'minutes'
      ).minutes;
      return acc + duration;
    }, 0);

    return Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal place
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (!selectedCoachId) {
      toast({
        title: "Please select a coach",
        description: "You must select a coach before booking a session",
      });
      return;
    }

    setSelectedSlot({
      start: slotInfo.start as Date,
      end: slotInfo.end as Date,
    });
    setShowNewSessionDialog(true);
  };

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6 h-[800px] p-4 bg-white rounded-lg shadow">
      <div className="space-y-6">
        <DatePicker
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="border rounded-lg"
          modifiers={{
            selected: getSelectedDates(),
            today: [new Date()],
          }}
          modifiersStyles={{
            selected: {
              backgroundColor: "var(--primary)",
              color: "white",
            },
            today: {
              border: "2px solid var(--primary)",
              color: "var(--primary)",
            },
          }}
        />
        <CoachList
          coaches={coaches}
          selectedCoachId={selectedCoachId}
          onCoachSelect={setSelectedCoachId}
          calculateBookedHours={calculateBookedHours}
          generateCoachColor={generateCoachColor}
        />
      </div>
      
      <div>
        <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          views={['week', 'day']}
          date={date}
          onNavigate={setDate}
          components={{
            toolbar: CustomToolbar,
          }}
          eventPropGetter={eventStyleGetter}
          className="calendar-custom"
          selectable
          onSelectEvent={handleEventClick}
          onSelectSlot={handleSelectSlot}
        />
      </div>

      <SessionDialog
        event={selectedEvent}
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        onReschedule={() => {}}
        onCancel={() => {}}
      />
      <NewSessionDialog
        open={showNewSessionDialog}
        onOpenChange={setShowNewSessionDialog}
        selectedSlot={selectedSlot}
        onBook={() => {}}
      />
    </div>
  );
};
