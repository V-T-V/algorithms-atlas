import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isPerfectNumber,
  properDivisors,
  sumProperDivisors,
} from '../../src/algorithms/misc/perfect-number-check/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/perfect-number-check/trace.ts';

test('isPerfectNumber 已知完全数', () => {
  assert.equal(isPerfectNumber(6), true);
  assert.equal(isPerfectNumber(28), true);
  assert.equal(isPerfectNumber(496), true);
  assert.equal(isPerfectNumber(8128), true);
});

test('isPerfectNumber 非完全数', () => {
  assert.equal(isPerfectNumber(1), false);
  assert.equal(isPerfectNumber(2), false);
  assert.equal(isPerfectNumber(10), false);
  assert.equal(isPerfectNumber(12), false);
  assert.equal(isPerfectNumber(27), false);
  assert.equal(isPerfectNumber(100), false);
});

test('isPerfectNumber 非法输入抛错', () => {
  assert.throws(() => isPerfectNumber(0));
  assert.throws(() => isPerfectNumber(-6));
  assert.throws(() => isPerfectNumber(6.5));
});

test('isPerfectNumber 1 不是完全数', () => {
  assert.equal(isPerfectNumber(1), false);
});

test('properDivisors 正确', () => {
  assert.deepEqual(properDivisors(6), [1, 2, 3]);
  assert.deepEqual(properDivisors(28), [1, 2, 4, 7, 14]);
  assert.deepEqual(properDivisors(1), []);
  assert.deepEqual(properDivisors(12), [1, 2, 3, 4, 6]);
});

test('sumProperDivisors 正确', () => {
  assert.equal(sumProperDivisors(6), 6);
  assert.equal(sumProperDivisors(28), 28);
  assert.equal(sumProperDivisors(12), 16);
});

test('isPerfectNumber 与朴素实现一致', () => {
  for (let n = 1; n <= 1000; n++) {
    assert.equal(isPerfectNumber(n), sumProperDivisors(n) === n, `n=${n}`);
  }
});

test('isPerfectNumber 钩子触发 onDivisor 与 onResult', () => {
  let divs = 0;
  let result = false;
  isPerfectNumber(28, {
    onDivisor: () => divs++,
    onResult: (_n, _s, ok) => (result = ok),
  });
  assert.ok(divs >= 1);
  assert.equal(result, true);
});

test('isPerfectNumber 确定性', () => {
  assert.equal(isPerfectNumber(496), isPerfectNumber(496));
});

test('buildTrace 含 aux，末帧含结论', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '结论');
  assert.ok(c, '末帧应含结论');
});
