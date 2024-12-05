import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coach } from "@/types/calendar";

interface CoachSelectorProps {
  coaches: Coach[];
  selectedCoachId: string | null;
  onCoachSelect: (coachId: string | null) => void;
}

// Import the color generation function from Calendar.tsx
const generateCoachColor = (coachId: string): string => {
  const baseColors = [
    { h: 200, s: 75, l: 45 }, // Blue
    { h: 340, s: 65, l: 47 }, // Pink/Red
    { h: 150, s: 65, l: 40 }, // Green
    { h: 270, s: 65, l: 45 }, // Purple
    { h: 25, s: 75, l: 45 },  // Orange
    { h: 190, s: 70, l: 42 }, // Teal
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
          <SelectItem value="all" className="flex items-center gap-2">
            All Coaches
          </SelectItem>
          {coaches.map((coach) => (
            <SelectItem 
              key={coach.id} 
              value={coach.id}
              className="flex items-center gap-2"
            >
              <div 
                className="w-3 h-3 rounded-full inline-block" 
                style={{ backgroundColor: generateCoachColor(coach.id) }}
              />
              {coach.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};