import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PhiFast, phiFast } from '../../src/algorithms/randomized/rand-phi-fast/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-phi-fast/trace.ts';

test('rand-phi-fast 在 [0,1)', () => {
  const r = new PhiFast(0);
  for (let i = 0; i < 100; i++) {
    const v = r.next();
    assert.ok(v >= 0 && v < 1);
  }
});

test('rand-phi-fast 确定性', () => {
  assert.deepEqual(phiFast(10, 3), phiFast(10, 3));
});

test('rand-phi-fast 低差异：均匀分布', () => {
  const s = phiFast(1000, 0);
  // 前 1000 个点应均匀覆盖 [0,1)，每 0.1 区间约 100 个
  const bins = new Array(10).fill(0);
  for (const v of s) bins[Math.min(9, Math.floor(v * 10))]!++;
  for (const b of bins) assert.ok(b > 60 && b < 140, `bin=${b}`);
});

test('rand-phi-fast trace', () => {
  assert.ok(buildTrace().length > 2);
});
