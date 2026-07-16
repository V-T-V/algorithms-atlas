import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crt, sunzi } from '../../src/algorithms/misc/chinese-remainder-impl/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/misc/chinese-remainder-impl/trace.ts';

test('crt 经典物不知数 x≡2(mod3),x≡3(mod5),x≡2(mod7)=23', () => {
  const { x, modulus } = crt([
    { remainder: 2, modulus: 3 },
    { remainder: 3, modulus: 5 },
    { remainder: 2, modulus: 7 },
  ]);
  assert.equal(x, 23);
  assert.equal(modulus, 105);
});

test('crt 解满足所有同余', () => {
  const { x } = crt([
    { remainder: 1, modulus: 5 },
    { remainder: 2, modulus: 7 },
    { remainder: 3, modulus: 11 },
  ]);
  assert.equal(x % 5, 1);
  assert.equal(x % 7, 2);
  assert.equal(x % 11, 3);
});

test('crt 单条同余', () => {
  const { x, modulus } = crt([{ remainder: 4, modulus: 9 }]);
  assert.equal(x, 4);
  assert.equal(modulus, 9);
});

test('crt 两条同余', () => {
  const { x, modulus } = crt([
    { remainder: 2, modulus: 3 },
    { remainder: 3, modulus: 5 },
  ]);
  assert.equal(x % 3, 2);
  assert.equal(x % 5, 3);
  assert.equal(modulus, 15);
});

test('crt 解在 [0, M) 范围', () => {
  const { x, modulus } = crt([
    { remainder: 4, modulus: 5 },
    { remainder: 5, modulus: 7 },
    { remainder: 6, modulus: 11 },
  ]);
  assert.ok(x >= 0 && x < modulus);
});

test('crt 非法模数抛错', () => {
  assert.throws(() => crt([{ remainder: 1, modulus: 0 }]));
  assert.throws(() => crt([{ remainder: 1, modulus: -3 }]));
});

test('crt 空数组抛错', () => {
  assert.throws(() => crt([]));
});

test('crt 负余数归一化', () => {
  const { x } = crt([{ remainder: -1, modulus: 5 }]);
  assert.equal(x, 4); // -1 mod 5 = 4
});

test('crt 不互质且无解抛错', () => {
  // x≡0 (mod 4), x≡1 (mod 6): GCD(4,6)=2, diff=1 不被 2 整除 → 无解
  assert.throws(() =>
    crt([
      { remainder: 0, modulus: 4 },
      { remainder: 1, modulus: 6 },
    ]),
  );
});

test('sunzi 物不知数', () => {
  assert.equal(sunzi(2, 3, 2), 23);
});

test('crt 钩子：onMerge 与 onResult 触发', () => {
  let merges = 0;
  let resultX = 0;
  crt(
    [
      { remainder: 2, modulus: 3 },
      { remainder: 3, modulus: 5 },
      { remainder: 2, modulus: 7 },
    ],
    {
      onMerge: () => merges++,
      onResult: (x) => (resultX = x),
    },
  );
  assert.equal(merges, 2);
  assert.equal(resultX, 23);
});

test('buildTrace 含 aux，末帧含解 x', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '解 x');
  assert.ok(c, '末帧应含解 x');
});
