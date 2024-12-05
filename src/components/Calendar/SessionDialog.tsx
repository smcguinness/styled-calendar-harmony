import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar";
import { format } from "date-fns";

interface SessionDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (event: CalendarEvent) => void;
  onCancel: (event: CalendarEvent) => void;
}

export const SessionDialog = ({
  event,
  open,
  onOpenChange,
  onReschedule,
  onCancel,
}: SessionDialogProps) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-sm">{format(event.start, "MMMM d, yyyy")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="text-sm">
                {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Title</p>
            <p className="text-sm">{event.title}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Student</p>
            <p className="text-sm">{event.studentName}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onReschedule(event)}
            className="mr-2"
          >
            Reschedule
          </Button>
          <Button
            variant="destructive"
            onClick={() => onCancel(event)}
          >
            Cancel Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};