import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxMeetings } from '../../src/algorithms/dp/dp-attend-3/impl.ts';

test('attend 经典', () => {
  assert.equal(
    maxMeetings([
      { start: 1, end: 3 },
      { start: 2, end: 5 },
      { start: 4, end: 6 },
      { start: 6, end: 8 },
      { start: 5, end: 7 },
    ]),
    3,
  );
});
test('attend 空', () => {
  assert.equal(maxMeetings([]), 0);
});
test('attend 全重叠', () => {
  assert.equal(
    maxMeetings([
      { start: 1, end: 5 },
      { start: 1, end: 5 },
      { start: 1, end: 5 },
    ]),
    1,
  );
});
