// TypeScript types for parsed day plan data (from day{n}_plan.html)

export interface PhotoRefLink {
  text: string;
  href: string;
  style: 'default' | 'teal' | 'amber' | 'red' | 'blue';
}

export interface AlertItem {
  variant: 'warn' | 'tip' | 'note';
  text: string;
}

export interface TicketItem {
  text: string;
}

export interface Step {
  dotColor: 'accent' | 'teal' | 'gold' | 'blue' | 'gray';
  label: string;
  title: string;
  body: string;
  alerts: AlertItem[];
  tickets: TicketItem[];
  photoRefs: { label: string; desc: string; links: PhotoRefLink[] }[];
}

export interface InfoRow {
  label: string;
  value: string;
}

export interface FacilityTag {
  label: string;
  type: 'thrill' | 'relax' | 'must';
}

export interface FacilityItem {
  name: string;
  tags: FacilityTag[];
  note: string;
}

export type ContentBlock =
  | { kind: 'info-card'; variant: 'accent' | 'teal' | 'gold' | 'blue' | 'amber' | 'red'; rows: InfoRow[] }
  | { kind: 'steps'; items: Step[] }
  | { kind: 'alert'; variant: 'warn' | 'tip' | 'note'; text: string }
  | { kind: 'ticket'; text: string }
  | { kind: 'menu'; header: string; items: { name: string; note: string }[] }
  | { kind: 'checklist'; items: string[] }
  | { kind: 'photo-ref'; label: string; desc: string; links: PhotoRefLink[] }
  | { kind: 'facility-grid'; items: FacilityItem[] }
  | { kind: 'highlight'; title: string; body: string };

export interface DaySection {
  num: string;
  title: string;
  timeRange: string;
  mapQuery?: string;
  blocks: ContentBlock[];
}

export interface TimelineEntry {
  time: string;
  event: string;
  dotColor: 'accent' | 'gold' | 'teal' | 'blue' | 'muted';
}

export interface DayPlan {
  day: number;
  title: string;
  subtitle: string;
  tags: string[];
  timeline: TimelineEntry[];
  sections: DaySection[];
}
