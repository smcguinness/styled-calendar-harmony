
import { CalendarEvent } from "@/types/calendar";
import { DateTime } from "luxon";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AgendaViewProps {
  events: CalendarEvent[];
  generateCoachColor: (coachId: string) => string;
}

export const AgendaView = ({ events, generateCoachColor }: AgendaViewProps) => {
  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const date = DateTime.fromJSDate(event.start).toFormat('LLL dd');
    const dayName = DateTime.fromJSDate(event.start).toFormat('ccc').toUpperCase();
    const day = DateTime.fromJSDate(event.start).toFormat('dd');
    
    if (!acc[date]) {
      acc[date] = {
        dayName,
        day,
        events: []
      };
    }
    acc[date].events.push(event);
    return acc;
  }, {} as Record<string, { dayName: string; day: string; events: CalendarEvent[] }>);

  // Sort events within each day by start time
  Object.values(groupedEvents).forEach(group => {
    group.events.sort((a, b) => a.start.getTime() - b.start.getTime());
  });

  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="space-y-8 py-4">
        {Object.entries(groupedEvents).map(([date, { dayName, day, events }]) => (
          <div key={date} className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="text-sm font-medium text-gray-600">{dayName}</div>
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
                {day}
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {events.map((event) => {
                const startTime = DateTime.fromJSDate(event.start).toFormat('h:mm a');
                const endTime = DateTime.fromJSDate(event.end).toFormat('h:mm a');
                const duration = DateTime.fromJSDate(event.end).diff(
                  DateTime.fromJSDate(event.start),
                  'minutes'
                ).minutes;
                const borderColor = generateCoachColor(event.coachId);
                
                return (
                  <div 
                    key={event.id}
                    className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{ backgroundColor: borderColor }}
                    />
                    <div className="p-4 pl-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900 text-base">
                            {event.title}
                          </h3>
                          <div className="text-sm text-gray-500 flex items-center gap-3">
                            <span>{duration} minutes</span>
                            {event.studentName && (
                              <span>{event.studentName}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 text-right font-medium">
                          <div>{startTime}</div>
                          <div>{endTime}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
