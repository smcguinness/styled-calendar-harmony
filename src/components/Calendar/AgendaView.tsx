
import { CalendarEvent } from "@/types/calendar";
import { DateTime } from "luxon";
import { Card } from "@/components/ui/card";
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

  return (
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([date, { dayName, day, events }]) => (
          <div key={date} className="flex gap-4">
            <div className="flex flex-col items-center w-16">
              <div className="text-sm font-medium text-gray-500">{dayName}</div>
              <div className="text-2xl font-bold text-blue-600">{day}</div>
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
                  <Card 
                    key={event.id}
                    className="relative overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: borderColor }}
                    />
                    <div className="p-4 pl-6">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="text-sm text-gray-600">
                          {startTime}
                          <br />
                          {endTime}
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <div>{duration} minutes</div>
                        {event.studentName && (
                          <div>{event.studentName}</div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
