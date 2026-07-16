import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convertToTitle, titleToNumber } from '../../src/algorithms/misc/misc-excel-title/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/misc-excel-title/trace.ts';

test('excel 1 -> A', () => {
  assert.equal(convertToTitle(1), 'A');
});

test('excel 28 -> AB', () => {
  assert.equal(convertToTitle(28), 'AB');
});

test('excel 701 -> ZY', () => {
  assert.equal(convertToTitle(701), 'ZY');
});

test('excel A -> 1', () => {
  assert.equal(titleToNumber('A'), 1);
});

test('excel AB -> 28', () => {
  assert.equal(titleToNumber('AB'), 28);
});

test('excel 往返一致', () => {
  for (let n = 1; n <= 1000; n++) {
    assert.equal(titleToNumber(convertToTitle(n)), n);
  }
});

test('excel 非法抛错', () => {
  assert.throws(() => convertToTitle(0));
  assert.throws(() => titleToNumber('A1'));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
});
