import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  toGray,
  fromGray,
  grayCodes,
  grayCodesReflected,
  toBinaryString,
} from '../../src/algorithms/misc/gray-code-generator/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/gray-code-generator/trace.ts';

test('toGray 基本', () => {
  assert.equal(toGray(0), 0); // 000
  assert.equal(toGray(1), 1); // 001
  assert.equal(toGray(2), 3); // 011
  assert.equal(toGray(3), 2); // 010
  assert.equal(toGray(4), 6); // 110
  assert.equal(toGray(5), 7); // 111
  assert.equal(toGray(6), 5); // 101
  assert.equal(toGray(7), 4); // 100
});

test('toGray 与 fromGray 互逆', () => {
  for (let i = 0; i < 1000; i++) {
    assert.equal(fromGray(toGray(i)), i, `i=${i} 不互逆`);
  }
});

test('toGray 非法输入抛错', () => {
  assert.throws(() => toGray(-1));
  assert.throws(() => toGray(1.5));
});

test('fromGray 非法输入抛错', () => {
  assert.throws(() => fromGray(-1));
  assert.throws(() => fromGray(1.5));
});

test('grayCodes 长度为 2ⁿ', () => {
  for (let n = 1; n <= 10; n++) {
    assert.equal(grayCodes(n).length, 1 << n);
  }
});

test('grayCodes 3 位经典序列', () => {
  assert.deepEqual(grayCodes(3), [0, 1, 3, 2, 6, 7, 5, 4]);
});

test('grayCodes 相邻项恰有一位不同', () => {
  for (let n = 2; n <= 8; n++) {
    const codes = grayCodes(n);
    for (let i = 1; i < codes.length; i++) {
      const diff = codes[i]! ^ codes[i - 1]!;
      // diff 应是 2 的幂（恰一位不同）
      assert.equal(diff & (diff - 1), 0, `n=${n}, i=${i}: 相邻项不止一位不同`);
    }
  }
});

test('grayCodes 首尾也仅差一位（循环格雷码性质）', () => {
  for (let n = 2; n <= 8; n++) {
    const codes = grayCodes(n);
    const first = codes[0]!;
    const last = codes[codes.length - 1]!;
    const diff = first ^ last;
    assert.equal(diff & (diff - 1), 0, `n=${n}: 首尾不止一位不同`);
  }
});

test('grayCodes 非法 n 抛错', () => {
  assert.throws(() => grayCodes(0));
  assert.throws(() => grayCodes(21));
  assert.throws(() => grayCodes(1.5));
});

test('grayCodesReflected 与 grayCodes 一致', () => {
  for (let n = 1; n <= 8; n++) {
    assert.deepEqual(grayCodesReflected(n), grayCodes(n), `n=${n}`);
  }
});

test('toBinaryString 指定位数', () => {
  assert.equal(toBinaryString(0, 3), '000');
  assert.equal(toBinaryString(5, 3), '101');
  assert.equal(toBinaryString(7, 3), '111');
  assert.equal(toBinaryString(10, 4), '1010');
});

test('grayCodes 钩子：onCode 触发 2ⁿ 次', () => {
  let count = 0;
  grayCodes(5, { onCode: () => count++ });
  assert.equal(count, 32);
});

test('buildTrace 含 bars 与 aux，末帧含码数', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars, '末帧应含 bars');
  const c = last.aux!.find((e) => e.label === '码数');
  assert.ok(c, '末帧应含码数');
});
