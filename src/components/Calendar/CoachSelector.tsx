import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coach } from "@/types/calendar";

interface CoachSelectorProps {
  coaches: Coach[];
  selectedCoachId: string | null;
  onCoachSelect: (coachId: string | null) => void;
}

export const CoachSelector = ({ coaches, selectedCoachId, onCoachSelect }: CoachSelectorProps) => {
  return (
    <div className="mb-4">
      <Select
        value={selectedCoachId || "all"}
        onValueChange={(value) => onCoachSelect(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a coach" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Coaches</SelectItem>
          {coaches.map((coach) => (
            <SelectItem key={coach.id} value={coach.id}>
              {coach.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};