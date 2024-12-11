import { Calendar as BigCalendar, luxonLocalizer, View, SlotInfo } from "react-big-calendar";
import { DateTime } from "luxon";
import { useState } from "react";
import { CustomToolbar } from "./CustomToolbar";
import { CoachSelector } from "./CoachSelector";
import { Coach, CalendarEvent } from "@/types/calendar";
import { Toggle } from "@/components/ui/toggle";
import { SessionDialog } from "./SessionDialog";
import { NewSessionDialog } from "./NewSessionDialog";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useToast } from "@/components/ui/use-toast";

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
  const [useResourceView, setUseResourceView] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showNewSessionDialog, setShowNewSessionDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const { toast } = useToast();

  const filteredEvents = selectedCoachId
    ? sampleEvents.filter((event) => event.coachId === selectedCoachId)
    : sampleEvents;

  const resources = coaches.map(coach => ({
    id: coach.id,
    title: coach.name,
  }));

  const isTimeBlocked = (start: Date, end: Date, coachId: string): boolean => {
    const coach = coaches.find(c => c.id === coachId);
    if (!coach || !coach.availability) return true;

    const startTime = DateTime.fromFormat(coach.availability.start, "HH:mm");
    const endTime = DateTime.fromFormat(coach.availability.end, "HH:mm");
    const timeStart = DateTime.fromJSDate(start);
    const timeEnd = DateTime.fromJSDate(end);

    const compareStart = DateTime.fromObject({
      hour: timeStart.hour,
      minute: timeStart.minute,
    });
    const compareEnd = DateTime.fromObject({
      hour: timeEnd.hour,
      minute: timeEnd.minute,
    });

    if (compareStart < startTime || compareEnd > endTime) {
      return true;
    }

    if (coach.blockedTimes) {
      return coach.blockedTimes.some(
        blocked =>
          timeStart < DateTime.fromJSDate(blocked.end) && 
          timeEnd > DateTime.fromJSDate(blocked.start)
      );
    }

    return false;
  };

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

  const slotPropGetter = (date: Date, resourceId?: string) => {
    const coachToCheck = resourceId || selectedCoachId;
    
    if (!coachToCheck) return {};

    const coach = coaches.find(c => c.id === coachToCheck);
    if (!coach) return {};

    const isBlocked = isTimeBlocked(
      date,
      new Date(date.getTime() + 30 * 60000),
      coachToCheck
    );

    return {
      className: isBlocked ? 'blocked-time' : '',
      style: isBlocked ? {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        cursor: 'not-allowed',
        border: 'none',
      } : {},
    };
  };

  const eventsWithResource = filteredEvents.map(event => ({
    ...event,
    resourceId: event.coachId,
  }));

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

    if (isTimeBlocked(slotInfo.start as Date, slotInfo.end as Date, selectedCoachId)) {
      toast({
        title: "Time slot not available",
        description: "This time slot is outside of coach availability or is blocked",
        variant: "destructive",
      });
      return;
    }

    setSelectedSlot({
      start: slotInfo.start as Date,
      end: slotInfo.end as Date,
    });
    setShowNewSessionDialog(true);
  };

  const handleReschedule = (event: CalendarEvent) => {
    console.log("Reschedule session:", event);
    setShowEventDialog(false);
    toast({
      title: "Reschedule requested",
      description: "Reschedule functionality to be implemented",
    });
  };

  const handleCancel = (event: CalendarEvent) => {
    console.log("Cancel session:", event);
    setShowEventDialog(false);
    toast({
      title: "Session cancelled",
      description: "The session has been cancelled successfully",
    });
  };

  const handleBookSession = (sessionData: {
    studentName: string;
    lessonType: string;
    start: Date;
    end: Date;
  }) => {
    console.log("Book new session:", sessionData);
    setShowNewSessionDialog(false);
    toast({
      title: "Session booked",
      description: "The new session has been booked successfully",
    });
  };

  return (
    <div className="h-[800px] p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-4 mb-4">
        <CoachSelector
          coaches={coaches}
          selectedCoachId={selectedCoachId}
          onCoachSelect={setSelectedCoachId}
        />
        {!selectedCoachId && (
          <Toggle
            pressed={useResourceView}
            onPressedChange={setUseResourceView}
            className={`ml-4 px-4 py-2 text-sm font-medium transition-colors
              ${useResourceView 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'hover:bg-muted bg-transparent border border-input'
              }`}
            aria-label="Toggle resource view"
          >
            Group by Coach
          </Toggle>
        )}
      </div>
      <BigCalendar
        localizer={localizer}
        events={eventsWithResource}
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
        slotPropGetter={slotPropGetter}
        className="calendar-custom"
        resources={useResourceView && !selectedCoachId ? resources : undefined}
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
        selectable
        onSelectEvent={handleEventClick}
        onSelectSlot={handleSelectSlot}
      />
      <SessionDialog
        event={selectedEvent}
        open={showEventDialog}
        onOpenChange={setShowEventDialog}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />
      <NewSessionDialog
        open={showNewSessionDialog}
        onOpenChange={setShowNewSessionDialog}
        selectedSlot={selectedSlot}
        onBook={handleBookSession}
      />
    </div>
  );
};
