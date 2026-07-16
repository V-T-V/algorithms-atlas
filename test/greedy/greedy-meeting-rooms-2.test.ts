import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMeetingRooms2 } from '../../src/algorithms/greedy/greedy-meeting-rooms-2/impl.ts';

test('greedy-meeting-rooms-2 经典用例 = 2', () => {
  assert.equal(
    greedyMeetingRooms2([
      { start: 0, end: 30 },
      { start: 5, end: 10 },
      { start: 15, end: 20 },
    ]),
    2,
  );
});

test('greedy-meeting-rooms-2 全重叠 = n', () => {
  assert.equal(
    greedyMeetingRooms2([
      { start: 1, end: 5 },
      { start: 1, end: 5 },
      { start: 1, end: 5 },
    ]),
    3,
  );
});

test('greedy-meeting-rooms-2 不重叠 = 1', () => {
  assert.equal(
    greedyMeetingRooms2([
      { start: 1, end: 2 },
      { start: 2, end: 3 },
    ]),
    1,
  );
});

test('greedy-meeting-rooms-2 空 = 0', () => {
  assert.equal(greedyMeetingRooms2([]), 0);
});
