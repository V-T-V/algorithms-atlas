import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extendSeeds, substream } from '../../src/algorithms/randomized/rand-seed-extend/impl.ts';

test('extendSeeds 数量正确', () => {
  const s = extendSeeds(42n, 5);
  assert.equal(s.length, 5);
});

test('extendSeeds 各子种子不同', () => {
  const s = extendSeeds(0n, 10);
  const set = new Set(s);
  assert.equal(set.size, 10);
});

test('extendSeeds 确定性', () => {
  const a = extendSeeds(123n, 4);
  const b = extendSeeds(123n, 4);
  assert.deepEqual(a, b);
});

test('extendSeeds 不同主种子产生不同子种子', () => {
  const a = extendSeeds(1n, 3);
  const b = extendSeeds(2n, 3);
  assert.notDeepEqual(a, b);
});

test('substream 互不重叠', () => {
  const s0 = substream(999n, 0, 10);
  const s1 = substream(999n, 1, 10);
  // 两个子流不应有交集（极大概率）
  const set0 = new Set(s0);
  let overlap = 0;
  for (const v of s1) if (set0.has(v)) overlap++;
  assert.equal(overlap, 0);
});
