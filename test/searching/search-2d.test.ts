import { test } from 'node:test';
import assert from 'node:assert/strict';
import { search2d } from '../../src/algorithms/searching/search-2d/impl.ts';

test('search2d 命中与未命中', () => {
  const m = [
    [1, 3, 5, 7],
    [10, 11, 16, 20],
    [23, 30, 34, 60],
  ];
  assert.deepEqual(search2d(m, 3), [0, 1]);
  assert.deepEqual(search2d(m, 34), [2, 2]);
  assert.deepEqual(search2d(m, 60), [2, 3]);
  assert.deepEqual(search2d(m, 0), [-1, -1]);
  assert.deepEqual(search2d(m, 100), [-1, -1]);
});

test('search2d 边界', () => {
  assert.deepEqual(search2d([], 1), [-1, -1]);
  assert.deepEqual(search2d([[]], 1), [-1, -1]);
  assert.deepEqual(search2d([[5]], 5), [0, 0]);
  assert.deepEqual(search2d([[5]], 3), [-1, -1]);
});

test('search2d 钩子', () => {
  let probes = 0;
  let done: [boolean, number, number] = [false, -1, -1];
  const r = search2d(
    [
      [1, 3, 5],
      [7, 9, 11],
    ],
    9,
    {
      onProbe: () => probes++,
      onDone: (f, row, col) => (done = [f, row, col]),
    },
  );
  assert.deepEqual(r, [1, 1]);
  assert.ok(probes > 0);
  assert.deepEqual(done, [true, 1, 1]);
});
