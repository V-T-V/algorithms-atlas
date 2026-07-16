import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assignCookies } from '../../src/algorithms/greedy/assign-cookies/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/assign-cookies/trace.ts';

test('assignCookies 基本用例', () => {
  assert.equal(assignCookies([1, 2, 3], [1, 1]).count, 1);
  assert.equal(assignCookies([1, 2], [1, 2, 3]).count, 2);
});

test('assignCookies 无饼干', () => {
  assert.equal(assignCookies([1, 2, 3], []).count, 0);
});

test('assignCookies 钩子触发', () => {
  const matches: [number, number][] = [];
  assignCookies([1, 2], [1, 2], { onMatch: (c, s) => matches.push([c, s]) });
  assert.deepEqual(matches, [
    [0, 0],
    [1, 1],
  ]);
});

test('buildTrace 含结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
