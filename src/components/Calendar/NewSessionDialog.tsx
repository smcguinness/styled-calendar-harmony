import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";

interface NewSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlot: { start: Date; end: Date } | null;
  onBook: (sessionData: {
    studentName: string;
    lessonType: string;
    start: Date;
    end: Date;
  }) => void;
}

export const NewSessionDialog = ({
  open,
  onOpenChange,
  selectedSlot,
  onBook,
}: NewSessionDialogProps) => {
  const [studentName, setStudentName] = useState("");
  const [lessonType, setLessonType] = useState("");

  if (!selectedSlot) return null;

  const handleBook = () => {
    onBook({
      studentName,
      lessonType,
      start: selectedSlot.start,
      end: selectedSlot.end,
    });
    setStudentName("");
    setLessonType("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book New Session</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Student Name</label>
            <Input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter student name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Lesson Type</label>
            <Select value={lessonType} onValueChange={setLessonType}>
              <SelectTrigger>
                <SelectValue placeholder="Select lesson type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-sm">
                {format(selectedSlot.start, "MMMM d, yyyy")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="text-sm">
                {format(selectedSlot.start, "h:mm a")} -{" "}
                {format(selectedSlot.end, "h:mm a")}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBook}
            disabled={!studentName || !lessonType}
          >
            Book Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};