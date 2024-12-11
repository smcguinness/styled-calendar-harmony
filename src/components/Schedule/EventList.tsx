import { Card, CardContent } from "@/components/ui/card";
import { CalendarEvent } from "@/types/calendar";
import { DateTime } from "luxon";

// Reuse the sample events generation function from Calendar component
const generateSampleEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const startOfWeekDate = DateTime.now().startOf('week').toJSDate();
  let eventId = 1;

  const coaches = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Mike Johnson" },
  ];

  coaches.forEach(coach => {
    for (let i = 0; i < 10; i++) {
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

  return events.sort((a, b) => b.start.getTime() - a.start.getTime());
};

export const EventList = () => {
  const events = generateSampleEvents();

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.studentName}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {DateTime.fromJSDate(event.start).toFormat("LLL dd, yyyy")}
                </p>
                <p className="text-sm text-gray-500">
                  {DateTime.fromJSDate(event.start).toFormat("h:mm a")} -{" "}
                  {DateTime.fromJSDate(event.end).toFormat("h:mm a")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};