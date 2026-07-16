import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hillClimb,
  landscape,
} from '../../src/algorithms/ai-search/ais-hill-climbing-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-hill-climbing-search/trace.ts';

test('hill climb 在峰处停止', () => {
  const r = hillClimb(10, 1, 0, 20, 100);
  assert.ok(r.iters < 100);
});
test('hill climb 起点是峰直接 stuck', () => {
  // 在 x=10 附近找峰
  const r = hillClimb(10, 1, 0, 20, 1);
  assert.ok(Number.isFinite(r.val));
});
test('landscape 有限', () => {
  for (let i = 0; i < 30; i++) assert.ok(Number.isFinite(landscape(i)));
});
test('hill climb trace 非空', () => assert.ok(buildTrace().length > 0));
