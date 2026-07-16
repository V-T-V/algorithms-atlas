import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proximalGradient } from '../../src/algorithms/optimization/opt-proximal-grad/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-proximal-grad/trace.ts';
test('近端梯度产生稀疏', () => {
  const w = proximalGradient([[1, 0.01]], [1], 5, 0.1, 100);
  assert.ok(w.length === 2);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
