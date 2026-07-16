import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  randomSample,
  makeRng,
} from '../../src/algorithms/randomized/rand-random-sampling/impl.ts';
import { buildTrace } from '../../src/algorithms/randomized/rand-random-sampling/trace.ts';

test('rand-random-sampling 返回 k 个', () => {
  const s = randomSample(10, 4, makeRng(1));
  assert.equal(s.length, 4);
  assert.equal(new Set(s).size, 4); // 无重复
});

test('rand-random-sampling 范围正确', () => {
  const s = randomSample(20, 5, makeRng(2));
  for (const x of s) assert.ok(x >= 0 && x < 20);
});

test('rand-random-sampling k>n 抛错', () => {
  assert.throws(() => randomSample(3, 5, makeRng(1)));
});

test('rand-random-sampling k=n 返回全部', () => {
  const s = randomSample(5, 5, makeRng(9));
  assert.equal(new Set(s).size, 5);
});

test('rand-random-sampling 确定性', () => {
  assert.deepEqual(randomSample(10, 3, makeRng(5)), randomSample(10, 3, makeRng(5)));
});

test('rand-random-sampling trace', () => {
  assert.ok(buildTrace().length > 2);
});
