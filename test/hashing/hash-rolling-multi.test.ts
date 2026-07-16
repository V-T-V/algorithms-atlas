import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  rollingHash,
  rollingHashBrute,
} from '../../src/algorithms/hashing/hash-rolling-multi/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/hashing/hash-rolling-multi/trace.ts';

test('rolling 确定性', () => {
  assert.equal(rollingHash('abrabadabra', 3), rollingHash('abrabadabra', 3));
});
test('rolling 与暴力一致', () => {
  const input = 'abrabadabra';
  // 滚动到末尾位置时与暴力重算等价
  const windowSize = 3;
  const endPos = input.length - windowSize;
  assert.equal(rollingHash(input, windowSize), rollingHashBrute(input, windowSize, endPos));
});
test('rolling 窗口大于输入返回 0', () => {
  assert.equal(rollingHash('ab', 5), 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
