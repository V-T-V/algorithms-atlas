import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEven, isOdd } from '../../src/algorithms/recursion/mutual-recursion/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/mutual-recursion/trace.ts';

test('isEven/isOdd 基线', () => {
  assert.equal(isEven(0), true);
  assert.equal(isOdd(0), false);
});

test('isEven 小偶数', () => {
  assert.equal(isEven(2), true);
  assert.equal(isEven(4), true);
});

test('isOdd 小奇数', () => {
  assert.equal(isOdd(1), true);
  assert.equal(isOdd(3), true);
});

test('isEven 与 isOdd 互补', () => {
  for (let n = 0; n <= 20; n++) {
    assert.notEqual(isEven(n), isOdd(n), `n=${n}`);
  }
});

test('isEven 与 % 一致', () => {
  for (let n = 0; n <= 30; n++) {
    assert.equal(isEven(n), n % 2 === 0, `n=${n}`);
  }
});

test('isEven 非法输入抛错', () => {
  assert.throws(() => isEven(-1));
  assert.throws(() => isOdd(1.5));
});

test('isEven 钩子触发互调', () => {
  const fns: string[] = [];
  isEven(3, { onEnter: (fn) => fns.push(fn) });
  // 应交替出现 isEven/isOdd
  assert.ok(fns.includes('isEven'));
  assert.ok(fns.includes('isOdd'));
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
