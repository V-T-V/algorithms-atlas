import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rotate } from '../../src/algorithms/bitwise/rotate/impl.ts';

test('rotate 基本行为', () => {
  assert.equal(rotate(0x12345678, 8), 0x34567812);
  assert.equal(rotate(0x12345678, 0), 0x12345678);
  assert.equal(rotate(0x12345678, 32), 0x12345678); // 32 归 0
  assert.equal(rotate(1, 1), 2);
  assert.equal(rotate(0x80000000, 1), 1); // 最高位左移回绕到最低位
});

test('rotate 负位移 = 循环右移', () => {
  assert.equal(rotate(0x12345678, -8), 0x78123456);
  assert.equal(rotate(0x12345678, 8), rotate(0x12345678, -24));
});

test('rotate 循环 32 次回到原值', () => {
  const x = 0xdeadbeef;
  let cur = x >>> 0;
  for (let i = 0; i < 32; i++) cur = rotate(cur, 1);
  assert.equal(cur, x >>> 0);
});

test('rotate 与左移+右移组合一致', () => {
  for (let r = 0; r < 32; r++) {
    const x = 0x12345678;
    const expected = ((x << r) | (x >>> (32 - r))) >>> 0;
    assert.equal(rotate(x, r), expected, `r=${r}`);
  }
});

test('rotate 钩子被调用', () => {
  let called = 0;
  const r = rotate(0x12345678, 40, {
    onRotate: (norm, res) => {
      called++;
      assert.equal(norm, 8); // 40 % 32 = 8
      assert.equal(res, 0x34567812);
    },
  });
  assert.equal(r, 0x34567812);
  assert.equal(called, 1);
});
