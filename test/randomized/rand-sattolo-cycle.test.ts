import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sattoloCycle,
  makeRng,
  isSingleCycle,
} from '../../src/algorithms/randomized/rand-sattolo-cycle/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-sattolo-cycle/trace.ts';

test('rand-sattolo-cycle 生成单一循环', () => {
  for (let trial = 0; trial < 20; trial++) {
    const a = sattoloCycle(10, makeRng(trial));
    assert.ok(isSingleCycle(a), `trial ${trial}: ${a}`);
  }
});

test('rand-sattolo-cycle 确定性', () => {
  assert.deepEqual(sattoloCycle(8, makeRng(5)), sattoloCycle(8, makeRng(5)));
});

test('rand-sattolo-cycle 包含所有元素', () => {
  const a = sattoloCycle(12, makeRng(3));
  assert.deepEqual(
    [...a].sort((x, y) => x - y),
    Array.from({ length: 12 }, (_, i) => i),
  );
});

test('rand-sattolo-cycle 边界 n=1,2', () => {
  assert.deepEqual(sattoloCycle(1, makeRng(1)), [0]);
  const a2 = sattoloCycle(2, makeRng(1));
  assert.ok(isSingleCycle(a2));
});

test('rand-sattolo-cycle isSingleCycle 判定', () => {
  assert.equal(isSingleCycle([1, 2, 0]), true); // 单循环
  assert.equal(isSingleCycle([0, 1, 2]), false); // 三个不动点
});

test('rand-sattolo-cycle trace', () => {
  assert.ok(buildTrace().length > 2);
});
