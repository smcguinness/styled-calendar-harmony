
import { Coach } from "@/types/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoachListProps {
  coaches: Coach[];
  selectedCoachId: string | null;
  onCoachSelect: (coachId: string | null) => void;
  calculateBookedHours: (coachId: string) => number;
  generateCoachColor: (coachId: string) => string;
}

export const CoachList = ({
  coaches,
  selectedCoachId,
  onCoachSelect,
  calculateBookedHours,
  generateCoachColor,
}: CoachListProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">Coaches</h3>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="space-y-4">
          <div
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
              selectedCoachId === null
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onCoachSelect(null)}
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="font-medium">All Coaches</span>
            </div>
          </div>
          {coaches.map((coach) => {
            const hours = calculateBookedHours(coach.id);
            const backgroundColor = generateCoachColor(coach.id);
            
            return (
              <div
                key={coach.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedCoachId === coach.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onCoachSelect(coach.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor }}
                  />
                  <div>
                    <div className="font-medium">{coach.name}</div>
                    <div className="text-sm text-gray-500">{coach.title}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {hours}h
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
