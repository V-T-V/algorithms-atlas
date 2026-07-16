import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intervalGraphColor } from '../../src/algorithms/greedy/greedy-interval-graph-color/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-interval-graph-color/trace.ts';
test('最大重叠即色数', () => {
  assert.equal(
    intervalGraphColor([
      [1, 4],
      [2, 5],
      [3, 6],
    ]),
    3,
  );
});
test('不相交区间只需 1 色', () => {
  assert.equal(
    intervalGraphColor([
      [1, 2],
      [3, 4],
    ]),
    1,
  );
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
