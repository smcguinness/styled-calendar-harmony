export interface Coach {
  id: string;
  name: string;
  title: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  coachId: string;
}