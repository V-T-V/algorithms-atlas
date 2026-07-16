import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sattoloCycle,
  isSingleCycle,
} from '../../src/algorithms/randomized/rand-shuffle-sattolo-2/impl.ts';

test('sattoloCycle 结果是单环', () => {
  for (let n = 1; n <= 20; n++) {
    const a = sattoloCycle(n);
    assert.ok(isSingleCycle(a), `n=${n} 不是单环: ${a}`);
  }
});

test('sattoloCycle 长度不变', () => {
  const a = sattoloCycle(10);
  assert.equal(a.length, 10);
  // 是 0..n-1 的排列
  const sorted = [...a].sort((x, y) => x - y);
  assert.deepEqual(
    sorted,
    Array.from({ length: 10 }, (_, i) => i),
  );
});

test('sattoloCycle 确定性（同种子）', () => {
  const a = sattoloCycle(8);
  const b = sattoloCycle(8);
  assert.deepEqual(a, b);
});

test('sattoloCycle 空数组', () => {
  assert.deepEqual(sattoloCycle(0), []);
});

test('isSingleCycle 检测', () => {
  // [1,2,0] 是单环：0→1→2→0
  assert.equal(isSingleCycle([1, 2, 0]), true);
  // [0,1,2] 是三个自环，非单环
  assert.equal(isSingleCycle([0, 1, 2]), false);
  // [1,0,2] 有自环 2，非单环
  assert.equal(isSingleCycle([1, 0, 2]), false);
});
