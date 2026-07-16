import { test } from 'node:test';
import assert from 'node:assert/strict';
import { linearProbingAnalysis } from '../../src/algorithms/hashing/hash-linear-probe-analysis/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-linear-probe-analysis/trace.ts';
test('线性探查平均次数为正', () => {
  const r = linearProbingAnalysis(16, [1, 2, 3, 4]);
  assert.ok(r.avg >= 1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
