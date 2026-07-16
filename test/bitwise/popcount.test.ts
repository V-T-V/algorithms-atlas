import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  popcount,
  popcountKernighan,
  popcountTable,
  toBinaryString,
} from '../../src/algorithms/bitwise/popcount/impl.ts';

test('popcount 边界与已知值', () => {
  assert.equal(popcount(0), 0);
  assert.equal(popcount(1), 1);
  assert.equal(popcount(2), 1);
  assert.equal(popcount(7), 3); // 111
  assert.equal(popcount(8), 1); // 1000
  assert.equal(popcount(255), 8); // 11111111
  assert.equal(popcount(256), 1); // 100000000
});

test('popcount 两种方法结果一致', () => {
  for (const n of [0, 1, 2, 3, 13, 182, 255, 1023, 65535, 1000000, 0xffff_ffff]) {
    const k = popcountKernighan(n);
    const t = popcountTable(n);
    assert.equal(k, t, `n=${n}: Kernighan=${k} table=${t}`);
    assert.equal(popcount(n), k, `n=${n}: popcount default mismatch`);
  }
});

test('popcount 182 = 5（10110110）', () => {
  // 182 = 0b10110110 → 5 个 1
  assert.equal(popcount(182), 5);
});

test('popcount 拒绝负数和非整数', () => {
  assert.throws(() => popcount(-1), RangeError);
  assert.throws(() => popcount(1.5), RangeError);
  assert.throws(() => popcountKernighan(-5), RangeError);
  assert.throws(() => popcountTable(-5), RangeError);
});

test('toBinaryString 正确', () => {
  assert.equal(toBinaryString(0), '0');
  assert.equal(toBinaryString(1), '1');
  assert.equal(toBinaryString(5), '101');
  assert.equal(toBinaryString(182), '10110110');
  assert.equal(toBinaryString(255), '11111111');
});

test('popcount 2^32 以内验证（与原生对比）', () => {
  for (let i = 0; i < 5000; i++) {
    const expected = i.toString(2).replace(/0/g, '').length;
    assert.equal(popcountKernighan(i), expected, `fail at ${i}`);
    assert.equal(popcountTable(i), expected, `fail at ${i}`);
  }
});

test('popcountKernighan 钩子被调用且次数正确', () => {
  let bits = 0;
  let clears = 0;
  const count = popcountKernighan(182, {
    onBit: () => bits++,
    onClear: () => clears++,
  });
  assert.equal(count, 5);
  assert.equal(bits, 5, 'onBit 应触发 5 次');
  assert.equal(clears, 5, 'onClear 应触发 5 次');
});
