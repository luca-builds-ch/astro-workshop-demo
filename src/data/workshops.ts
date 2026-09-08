export const TOPICS = {
  papier: 'Paper',
  holz: 'Wood',
  reparieren: 'Repair',
} as const;

export interface Workshop {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly topic: keyof typeof TOPICS;
  readonly startUtc: string;
  readonly feeChf: number;
}

// Same fixed instant and seven invented records as the WordPress seed fixture.
export const DEMO_NOW = '2026-09-08T16:30:00Z';
export const DISPLAY_ZONE = 'Europe/Zurich';
export const workshops: readonly Workshop[] = [
  { id: 'notizbuch', title: 'Hand-bound notebook', description: 'Fold, stitch and bind a small notebook with paper and linen thread.', topic: 'papier', startUtc: '2026-09-08T17:00:00Z', feeChf: 35 },
  { id: 'reparieren', title: 'Clothing repairs', description: 'Replace a button and mend a torn seam with a needle and thread.', topic: 'reparieren', startUtc: '2026-09-08T17:45:00Z', feeChf: 0 },
  { id: 'stiftehalter', title: 'Wooden pencil holder', description: 'Shape, sand and oil a simple wooden pencil holder by hand.', topic: 'holz', startUtc: '2026-09-09T16:30:00Z', feeChf: 45 },
  { id: 'falten', title: 'Paper folding', description: 'Learn basic folds to make paper boats and cranes.', topic: 'papier', startUtc: '2026-09-10T16:30:00Z', feeChf: 25 },
  { id: 'lieblingsstueck', title: 'Wood restoration', description: 'Sand and refinish a small wooden object.', topic: 'reparieren', startUtc: '2026-09-11T16:30:00Z', feeChf: 30 },
  { id: 'ablage', title: 'Wooden tray', description: 'Build a small tray while learning about materials and hand tools.', topic: 'holz', startUtc: '2026-09-13T16:30:00Z', feeChf: 55 },
  { id: 'vergangen', title: 'A past sample workshop', description: 'This completed workshop must not appear in the upcoming programme.', topic: 'papier', startUtc: '2026-09-08T16:29:00Z', feeChf: 15 },
];

export function utcInstant(value: string): number {
  const timestamp = Date.parse(value);
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)
      || !Number.isFinite(timestamp)
      || new Date(timestamp).toISOString() !== value.replace('Z', '.000Z')) {
    throw new Error(`Expected a valid UTC date with seconds and Z: ${value}`);
  }
  return timestamp;
}

export function matchesTopic(topic: string, selected: string): boolean {
  return selected === 'all' || topic === selected;
}

export function upcomingWorkshops(
  records: readonly Workshop[],
  selected = 'all',
  now = utcInstant(DEMO_NOW),
): Workshop[] {
  if (!Number.isFinite(now)) throw new Error('The cutoff must be a finite instant.');
  return records
    .filter((workshop) => utcInstant(workshop.startUtc) >= now && matchesTopic(workshop.topic, selected))
    .sort((a, b) => utcInstant(a.startUtc) - utcInstant(b.startUtc));
}

export function workshopDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: DISPLAY_ZONE, day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(utcInstant(value));
}
