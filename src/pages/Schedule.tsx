import { useState } from "react";
import { Calendar } from "@/components/Calendar/Calendar";
import { EventList } from "@/components/Schedule/EventList";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarDays, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Settings, BellRing, Cog } from "lucide-react";

type ViewMode = "calendar" | "list";

export default function Schedule() {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Schedule</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <BellRing className="h-4 w-4" />
            SUBSCRIBE
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            SETTINGS
          </Button>
          <Button className="bg-[#002A5C]">BOOK A STUDENT</Button>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b">
        <span className="text-sm font-medium text-gray-500">View as:</span>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && setViewMode(value as ViewMode)}
          className="mb-4"
        >
          <ToggleGroupItem
            value="calendar"
            aria-label="Calendar View"
            className={`p-2 ${
              viewMode === "calendar"
                ? "border-b-2 border-[#002A5C] text-[#002A5C]"
                : "text-gray-500"
            }`}
            title="Calendar View"
          >
            <CalendarDays className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="list"
            aria-label="List View"
            className={`p-2 ${
              viewMode === "list"
                ? "border-b-2 border-[#002A5C] text-[#002A5C]"
                : "text-gray-500"
            }`}
            title="List View"
          >
            <List className="h-5 w-5" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === "calendar" ? <Calendar /> : <EventList />}
    </div>
  );
}