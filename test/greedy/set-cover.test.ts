import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setCover } from '../../src/algorithms/greedy/set-cover/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/greedy/set-cover/trace.ts';

test('setCover 覆盖全集', () => {
  const subsets = [
    [1, 2, 3],
    [2, 4],
    [3, 5],
    [4, 5, 6],
    [1, 6],
  ];
  const universe = [1, 2, 3, 4, 5, 6];
  const { chosen } = setCover(subsets, universe);
  const covered = new Set<number>();
  for (const idx of chosen) for (const e of subsets[idx]!) covered.add(e);
  assert.equal(covered.size, 6);
});

test('setCover 贪心选大子集', () => {
  const { chosen } = setCover([[1], [2], [1, 2, 3]], [1, 2, 3]);
  assert.deepEqual(chosen, [2]);
});

test('setCover 钩子触发', () => {
  let n = 0;
  setCover([[1, 2], [3]], [1, 2, 3], { onPick: () => n++ });
  assert.equal(n, 2);
});

test('buildTrace 含选择数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
});
