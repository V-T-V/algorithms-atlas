import { test } from 'node:test';
import assert from 'node:assert/strict';
import { elasticNet } from '../../src/algorithms/optimization/opt-elastic-net/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-elastic-net/trace.ts';
test('弹性网产生稀疏 w', () => {
  const w = elasticNet(
    [
      [1, 1],
      [2, 2],
    ],
    [1, 2],
    1.0,
    1.0,
    50,
  );
  assert.ok(w.some((v) => Math.abs(v) < 1e-3));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
