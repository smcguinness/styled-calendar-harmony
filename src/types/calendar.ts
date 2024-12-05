export interface Coach {
  id: string;
  name: string;
  title: string;
  availability?: {
    start: string; // Format: "HH:mm"
    end: string; // Format: "HH:mm"
  };
  blockedTimes?: Array<{
    start: Date;
    end: Date;
  }>;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  coachId: string;
  studentName?: string;
}