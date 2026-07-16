import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parity } from '../../src/algorithms/bitwise/parity/impl.ts';

// 参考实现：popcount mod 2
const refParity = (x: number): number => {
  let c = 0;
  let v = x >>> 0;
  while (v) {
    c ^= v & 1;
    v >>>= 1;
  }
  return c;
};

test('parity 基本行为', () => {
  assert.equal(parity(0), 0);
  assert.equal(parity(1), 1);
  assert.equal(parity(7), 1); // 111 -> 3 个 1 -> 奇
  assert.equal(parity(12), 0); // 1100 -> 2 个 1 -> 偶
});

test('parity 255 共 8 个 1 为偶', () => {
  assert.equal(parity(255), 0);
});

test('parity 与逐位参考一致（含大数）', () => {
  const samples = [0, 1, 2, 3, 7, 12, 255, 256, 1023, 65535, 123456789, 0xffffffff];
  for (const x of samples) assert.equal(parity(x), refParity(x), `x=${x}`);
});

test('parity 仅返回 0 或 1', () => {
  for (let x = 0; x < 5000; x++) {
    const r = parity(x);
    assert.ok(r === 0 || r === 1);
  }
});

test('parity 钩子被调用 5 次', () => {
  let calls = 0;
  const r = parity(100, { onFold: () => calls++ });
  assert.equal(r, refParity(100));
  assert.equal(calls, 5);
});
