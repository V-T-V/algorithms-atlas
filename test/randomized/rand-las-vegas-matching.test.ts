import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lasVegasMatching,
  makeRng,
} from '../../src/algorithms/randomized/rand-las-vegas-matching/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-las-vegas-matching/trace.ts';

test('rand-las-vegas-matching 完美匹配', () => {
  const m = lasVegasMatching(
    3,
    3,
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    makeRng(1),
  );
  assert.equal(m.size, 3);
});

test('rand-las-vegas-matching 无解', () => {
  const m = lasVegasMatching(
    3,
    2,
    [
      [0, 0],
      [1, 1],
      [2, 0],
    ],
    makeRng(1),
  );
  assert.equal(m.size, 2);
});

test('rand-las-vegas-matching 匹配有效（一一对应）', () => {
  const m = lasVegasMatching(
    4,
    4,
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 2],
      [3, 3],
    ],
    makeRng(2),
  );
  const rs = new Set(m.values());
  assert.equal(rs.size, m.size);
});

test('rand-las-vegas-matching trace', () => {
  assert.ok(buildTrace().length > 2);
});
