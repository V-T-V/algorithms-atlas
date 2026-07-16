import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscZigzag } from '../../src/algorithms/misc/misc-zigzag/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-zigzag/trace.ts';
test('zigzag PAYPALISHIRING r=3', () => {
  assert.equal(miscZigzag('PAYPALISHIRING', 3), 'PAHNAPLSIIGYIR');
});
test('zigzag r=1 原样返回', () => {
  assert.equal(miscZigzag('ABC', 1), 'ABC');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
