import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zhangHagerLineSearch } from '../../src/algorithms/optimization/opt-line-search-zhang/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-line-search-zhang/trace.ts';
test('Zhang-Hager 收敛到 3', () => {
  const r = zhangHagerLineSearch(
    (x) => (x - 3) * (x - 3),
    (x) => 2 * (x - 3),
    0,
    100,
  );
  assert.ok(Math.abs(r.x - 3) < 0.5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
