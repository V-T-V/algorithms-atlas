import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPowerOfTwo, modPower2 } from '../../src/algorithms/bitwise/mod-power2/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/bitwise/mod-power2/trace.ts';

test('mod-power2 与 % 一致（2 的幂）', () => {
  for (const [x, n] of [
    [100, 16],
    [255, 64],
    [0, 8],
    [1023, 1024],
    [7, 1],
  ] as const) {
    assert.equal(modPower2(x, n), x % n, `${x} mod ${n}`);
  }
});

test('mod-power2 n=1 总返回 0', () => {
  for (const x of [0, 1, 100, 99999]) assert.equal(modPower2(x, 1), 0);
});

test('mod-power2 非 2 的幂报错', () => {
  assert.throws(() => modPower2(100, 3));
  assert.throws(() => modPower2(100, 0));
  assert.throws(() => modPower2(100, -4));
});

test('mod-power2 负 x 报错', () => {
  assert.throws(() => modPower2(-1, 8));
});

test('mod-power2 isPowerOfTwo', () => {
  for (const [n, expected] of [
    [1, true],
    [2, true],
    [4, true],
    [1024, true],
    [3, false],
    [0, false],
    [6, false],
  ] as const) {
    assert.equal(isPowerOfTwo(n), expected, `${n}`);
  }
});

test('mod-power2 钩子被调用', () => {
  const masks: number[] = [];
  modPower2(100, 16, { onMask: (m) => masks.push(m) });
  assert.deepEqual(masks, [15]);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
