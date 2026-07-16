import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lcm, lcmAll } from '../../src/algorithms/misc/lcm-calc/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/lcm-calc/trace.ts';

test('lcm 基本值', () => {
  assert.equal(lcm(4, 6), 12);
  assert.equal(lcm(12, 18), 36);
  assert.equal(lcm(5, 7), 35);
  assert.equal(lcm(21, 6), 42);
});

test('lcm 与 0 返回 0', () => {
  assert.equal(lcm(0, 5), 0);
  assert.equal(lcm(5, 0), 0);
  assert.equal(lcm(0, 0), 0);
});

test('lcm 与自身', () => {
  assert.equal(lcm(7, 7), 7);
});

test('lcm 互质等于乘积', () => {
  assert.equal(lcm(7, 13), 91);
  assert.equal(lcm(8, 9), 72);
});

test('lcm 负数取绝对值', () => {
  assert.equal(lcm(-4, 6), 12);
  assert.equal(lcm(-4, -6), 12);
  assert.equal(lcm(4, -6), 12);
});

test('lcm 结果是 a 与 b 的公倍数', () => {
  for (const [a, b] of [
    [12, 18],
    [7, 13],
    [21, 6],
    [100, 75],
  ] as const) {
    const l = lcm(a, b);
    assert.equal(l % a, 0, `${l} 不是 ${a} 的倍数`);
    assert.equal(l % b, 0, `${l} 不是 ${b} 的倍数`);
  }
});

test('lcm 是最小公倍数（无更小正公倍数）', () => {
  const l = lcm(12, 18);
  for (let k = 1; k < l; k++) {
    assert.ok(!(k % 12 === 0 && k % 18 === 0), `${k} 是更小公倍数`);
  }
});

test('lcm 非整数抛错', () => {
  assert.throws(() => lcm(1.5, 3));
  assert.throws(() => lcm(6, 2.5));
});

test('lcm 交换律', () => {
  assert.equal(lcm(12, 18), lcm(18, 12));
});

test('lcmAll 多个数', () => {
  assert.equal(lcmAll([4, 6, 8]), 24);
  assert.equal(lcmAll([3, 5, 7]), 105);
  assert.equal(lcmAll([6]), 6);
});

test('lcmAll 空数组抛错', () => {
  assert.throws(() => lcmAll([]));
});

test('lcm 钩子：onGcd 与 onResult 触发', () => {
  let gcdCalled = false;
  let result = 0;
  lcm(12, 18, {
    onGcd: () => (gcdCalled = true),
    onResult: (_a, _b, l) => (result = l),
  });
  assert.equal(gcdCalled, true);
  assert.equal(result, 36);
});

test('buildTrace 含 aux，末帧含 LCM', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === 'LCM');
  assert.ok(c, '末帧应含 LCM');
});
