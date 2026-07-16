import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gcd, gcdAll } from '../../src/algorithms/misc/gcd-iterative-misc/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/gcd-iterative-misc/trace.ts';

test('gcd 基本值', () => {
  assert.equal(gcd(12, 8), 4);
  assert.equal(gcd(54, 24), 6);
  assert.equal(gcd(252, 105), 21);
  assert.equal(gcd(1071, 462), 21);
});

test('gcd 与 0', () => {
  assert.equal(gcd(5, 0), 5);
  assert.equal(gcd(0, 5), 5);
  assert.equal(gcd(0, 0), 0);
});

test('gcd 与自身', () => {
  assert.equal(gcd(7, 7), 7);
});

test('gcd 互质', () => {
  assert.equal(gcd(7, 13), 1);
  assert.equal(gcd(17, 19), 1);
});

test('gcd 负数取绝对值', () => {
  assert.equal(gcd(-12, 8), 4);
  assert.equal(gcd(-12, -8), 4);
  assert.equal(gcd(12, -8), 4);
});

test('gcd 结果非负', () => {
  assert.ok(gcd(-54, -24) >= 0);
});

test('gcd 交换律', () => {
  assert.equal(gcd(54, 24), gcd(24, 54));
});

test('gcd 非整数抛错', () => {
  assert.throws(() => gcd(1.5, 3));
  assert.throws(() => gcd(6, 2.5));
});

test('gcdAll 多个数', () => {
  assert.equal(gcdAll([12, 18, 24]), 6);
  assert.equal(gcdAll([48, 64, 16]), 16);
  assert.equal(gcdAll([7]), 7);
});

test('gcdAll 空数组抛错', () => {
  assert.throws(() => gcdAll([]));
});

test('gcd 钩子：onStep 与 onResult 触发', () => {
  let steps = 0;
  let result = 0;
  gcd(252, 105, {
    onStep: () => steps++,
    onResult: (g) => (result = g),
  });
  assert.ok(steps >= 2);
  assert.equal(result, 21);
});

test('gcd 迭代次数 O(log)', () => {
  let steps = 0;
  gcd(1000000, 999999, { onStep: () => steps++ });
  // GCD 相邻斐波那契数是最坏情况；这里应远小于 min(a,b)
  assert.ok(steps <= 50);
});

test('buildTrace 含 aux，末帧含 GCD', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === 'GCD');
  assert.ok(c, '末帧应含 GCD');
});
