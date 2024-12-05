import { ToolbarProps, NavigateAction } from "react-big-calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const CustomToolbar = (props: ToolbarProps) => {
  const { onNavigate, onView, view, label } = props;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate("PREV")}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate("NEXT")}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNavigate("TODAY")}
          className="ml-2"
        >
          Today
        </Button>
        <h2 className="text-lg font-semibold ml-4">{label}</h2>
      </div>
      <div className="flex gap-2">
        <Button
          variant={view === "month" ? "default" : "outline"}
          onClick={() => onView("month")}
          className="h-8"
        >
          Month
        </Button>
        <Button
          variant={view === "week" ? "default" : "outline"}
          onClick={() => onView("week")}
          className="h-8"
        >
          Week
        </Button>
        <Button
          variant={view === "day" ? "default" : "outline"}
          onClick={() => onView("day")}
          className="h-8"
        >
          Day
        </Button>
      </div>
    </div>
  );
};