import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciSearch } from '../../src/algorithms/optimization/opt-fibonacci-search/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-fibonacci-search/trace.ts';
test('斐波那契找 (x-3)² 极小', () => {
  const r = fibonacciSearch((x) => (x - 3) * (x - 3), 0, 10, 20);
  assert.ok(Math.abs(r - 3) < 0.1);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
