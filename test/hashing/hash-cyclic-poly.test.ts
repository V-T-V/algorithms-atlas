import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cyclicPoly, cyclicPolyBrute } from '../../src/algorithms/hashing/hash-cyclic-poly/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/hashing/hash-cyclic-poly/trace.ts';

test('cyclic 确定性', () => {
  assert.equal(cyclicPoly('abrabadabra', 3), cyclicPoly('abrabadabra', 3));
});
test('cyclic 与暴力一致', () => {
  const input = 'abrabadabra';
  const windowSize = 3;
  const endPos = input.length - windowSize;
  assert.equal(cyclicPoly(input, windowSize), cyclicPolyBrute(input, windowSize, endPos));
});
test('cyclic 窗口大于输入返回 0', () => {
  assert.equal(cyclicPoly('ab', 5), 0n);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
