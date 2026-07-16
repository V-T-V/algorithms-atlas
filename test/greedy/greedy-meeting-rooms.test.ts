import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMeetingRooms } from '../../src/algorithms/greedy/greedy-meeting-rooms/impl.ts';

test('greedy-meeting-rooms 有冲突', () => {
  assert.equal(
    greedyMeetingRooms([
      { start: 0, end: 30 },
      { start: 5, end: 10 },
      { start: 15, end: 20 },
    ]),
    false,
  );
});

test('greedy-meeting-rooms 无冲突', () => {
  assert.equal(
    greedyMeetingRooms([
      { start: 7, end: 10 },
      { start: 2, end: 4 },
    ]),
    true,
  );
});

test('greedy-meeting-rooms 空或单会议为 true', () => {
  assert.equal(greedyMeetingRooms([]), true);
  assert.equal(greedyMeetingRooms([{ start: 1, end: 2 }]), true);
});
