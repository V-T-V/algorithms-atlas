import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  extGcd,
  solveDiophantine,
} from '../../src/algorithms/misc/extended-euclidean-misc-impl/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/misc/extended-euclidean-misc-impl/trace.ts';

test('extGcd 满足 Bézout 恒等式 a*x + b*y = gcd', () => {
  for (const [a, b] of [
    [240, 46],
    [54, 24],
    [1071, 462],
    [7, 13],
    [100, 75],
  ] as const) {
    const { gcd: g, x, y } = extGcd(a, b);
    assert.equal(a * x + b * y, g, `a=${a},b=${b} Bézout 不满足`);
  }
});

test('extGcd gcd 正确', () => {
  assert.equal(extGcd(240, 46).gcd, 2);
  assert.equal(extGcd(54, 24).gcd, 6);
  assert.equal(extGcd(7, 13).gcd, 1);
});

test('extGcd 已知系数', () => {
  // GCD(240,46)=2, 240*(-9)+46*47 = -2160+2162 = 2
  const r = extGcd(240, 46);
  assert.equal(r.gcd, 2);
  assert.equal(240 * r.x + 46 * r.y, 2);
});

test('extGcd 与 0', () => {
  // GCD(a,0)=a, a*1 + 0*0 = a
  const r = extGcd(5, 0);
  assert.equal(r.gcd, 5);
  assert.equal(r.x, 1);
  assert.equal(r.y, 0);
});

test('extGcd 负数', () => {
  const r = extGcd(-240, 46);
  assert.equal(r.gcd, 2);
  assert.equal(-240 * r.x + 46 * r.y, 2);
});

test('extGcd 非整数抛错', () => {
  assert.throws(() => extGcd(1.5, 3));
});

test('extGcd 确定性', () => {
  assert.deepEqual(extGcd(54, 24), extGcd(54, 24));
});

test('solveDiophantine 有解', () => {
  // 4x + 6y = 2：GCD=2 整除 2，有解
  const r = solveDiophantine(4, 6, 2);
  assert.ok(r !== null);
  assert.equal(4 * r.x + 6 * r.y, 2);
});

test('solveDiophantine 无解（c 不是 GCD 倍数）', () => {
  // 4x + 6y = 1：GCD=2 不整除 1
  assert.equal(solveDiophantine(4, 6, 1), null);
});

test('solveDiophantine 验证多个', () => {
  for (const [a, b, c] of [
    [3, 5, 8],
    [10, 6, 14],
    [7, 13, 100],
  ] as const) {
    const r = solveDiophantine(a, b, c);
    if (r !== null) {
      assert.equal(a * r.x + b * r.y, c);
    }
  }
});

test('extGcd 钩子：onStep 与 onResult 触发', () => {
  let steps = 0;
  let resultGcd = 0;
  extGcd(240, 46, {
    onStep: () => steps++,
    onResult: (r) => (resultGcd = r.gcd),
  });
  assert.ok(steps >= 2);
  assert.equal(resultGcd, 2);
});

test('buildTrace 含 aux，末帧含 Bézout 验证', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === 'Bézout 验证');
  assert.ok(c, '末帧应含 Bézout 验证');
});
