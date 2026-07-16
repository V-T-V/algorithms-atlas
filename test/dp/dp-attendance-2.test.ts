import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkRecord } from '../../src/algorithms/dp/dp-attendance-2/impl.ts';

test('attendance LC552 n=1', () => {
  assert.equal(checkRecord(1), 3);
});

test('attendance LC552 n=2', () => {
  assert.equal(checkRecord(2), 8);
});

test('attendance LC552 n=3', () => {
  assert.equal(checkRecord(3), 19);
});

test('attendance LC552 n=4', () => {
  assert.equal(checkRecord(4), 43);
});
