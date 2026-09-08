export const TOPICS = {
  papier: 'Papier',
  holz: 'Holz',
  reparieren: 'Reparieren',
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
  { id: 'notizbuch', title: 'Papier mit Charakter', description: 'Ein kleines Notizbuch binden — vom ersten Falz bis zur letzten Naht.', topic: 'papier', startUtc: '2026-09-08T17:00:00Z', feeChf: 35 },
  { id: 'reparieren', title: 'Reparieren statt ersetzen', description: 'Knöpfe, Nähte und kleine Alltagsdinge: gemeinsam wieder brauchbar machen.', topic: 'reparieren', startUtc: '2026-09-08T17:45:00Z', feeChf: 0 },
  { id: 'stiftehalter', title: 'Holz, ganz unkompliziert', description: 'Ein schlichter Stiftehalter, selbst geschliffen und von Hand geölt.', topic: 'holz', startUtc: '2026-09-09T16:30:00Z', feeChf: 45 },
  { id: 'falten', title: 'Falten mit Ruhe', description: 'Aus einem Blatt Papier werden Formen mit Ecken, Kanten und Persönlichkeit.', topic: 'papier', startUtc: '2026-09-10T16:30:00Z', feeChf: 25 },
  { id: 'lieblingsstueck', title: 'Lieblingsstück gerettet', description: 'Einem alten Holzgegenstand mit einfachen Mitteln neues Leben geben.', topic: 'reparieren', startUtc: '2026-09-11T16:30:00Z', feeChf: 30 },
  { id: 'ablage', title: 'Ein Platz für Kleinigkeiten', description: 'Eine kleine Ablage bauen. Material verstehen und Werkzeuge kennenlernen.', topic: 'holz', startUtc: '2026-09-13T16:30:00Z', feeChf: 55 },
  { id: 'vergangen', title: 'Vergangener Beispieltermin', description: 'Dieser abgeschlossene Workshop darf im kommenden Programm nicht erscheinen.', topic: 'papier', startUtc: '2026-09-08T16:29:00Z', feeChf: 15 },
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
  return new Intl.DateTimeFormat('de-CH', {
    timeZone: DISPLAY_ZONE, day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).format(utcInstant(value));
}
