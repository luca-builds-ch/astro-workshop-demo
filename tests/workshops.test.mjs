import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_NOW, workshops, upcomingWorkshops, utcInstant, workshopDate } from '../src/data/workshops.ts';

test('same WordPress fixture: six upcoming, sorted; inclusive cutoff keeps a workshop starting now', () => {
  const reversed = [...workshops].reverse();
  const snapshot = JSON.stringify(reversed);
  const visible = upcomingWorkshops(reversed);
  assert.deepEqual(visible.map(({ id }) => id), ['notizbuch', 'reparieren', 'stiftehalter', 'falten', 'lieblingsstueck', 'ablage']);
  assert.equal(JSON.stringify(reversed), snapshot, 'filter must not mutate the source order');
  const boundary = { ...workshops[0], id: 'exact-cutoff', startUtc: DEMO_NOW };
  assert.equal(upcomingWorkshops([boundary]).length, 1);
  assert.equal(upcomingWorkshops([boundary], 'all', utcInstant(DEMO_NOW) + 1).length, 0);
});

test('topic filters retain two matching future workshops and allow a real empty state', () => {
  for (const topic of ['papier', 'holz', 'reparieren']) {
    const visible = upcomingWorkshops(workshops, topic);
    assert.equal(visible.length, 2);
    assert.ok(visible.every((record) => record.topic === topic));
  }
  assert.deepEqual(upcomingWorkshops(workshops, 'keramik'), []);
  assert.deepEqual(upcomingWorkshops(workshops, 'unknown'), []);
  assert.equal(upcomingWorkshops(workshops, 'all').length, 6);
});

test('UTC storage rejects missing zones and impossible dates; explicit Zurich display handles DST', () => {
  assert.throws(() => utcInstant('2026-09-08T18:30:00'), /valid UTC/);
  assert.throws(() => utcInstant('2026-02-30T18:30:00Z'), /valid UTC/);
  assert.throws(() => upcomingWorkshops(workshops, 'all', NaN), /finite instant/);
  assert.equal(utcInstant(DEMO_NOW), Date.parse('2026-09-08T18:30:00+02:00'));
  assert.match(workshopDate('2026-09-08T17:00:00Z'), /19:00/);
  const first = '2030-10-27T00:30:00Z';
  const second = '2030-10-27T01:30:00Z';
  assert.equal(workshopDate(first), workshopDate(second), 'the repeated local minute has two distinct instants');
  const records = [{ ...workshops[0], id: 'later', startUtc: second }, { ...workshops[0], id: 'earlier', startUtc: first }];
  assert.deepEqual(upcomingWorkshops(records, 'all', utcInstant(first)).map(({ id }) => id), ['earlier', 'later']);
  assert.deepEqual(upcomingWorkshops(records, 'all', utcInstant(first) + 1).map(({ id }) => id), ['later']);
});
