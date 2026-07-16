import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  minimalRotation,
  minRotationString,
} from '../../src/algorithms/string/minimal-rotation/impl.ts';

const brute = (s: string): string => {
  if (s.length === 0) return s;
  let best = s;
  for (let i = 1; i < s.length; i++) {
    const rot = s.slice(i) + s.slice(0, i);
    if (rot < best) best = rot;
  }
  return best;
};

test('minimalRotation 基本最小表示', () => {
  assert.equal(minimalRotation('abc'), 0);
  assert.equal(minimalRotation('bca'), 2);
  assert.equal(minimalRotation('cab'), 1);
});

test('minimalRotation 与暴力一致', () => {
  for (const s of ['dacba', 'mississippi', 'abracadabra', 'aaaa', 'cba', 'rotation']) {
    const i = minimalRotation(s);
    assert.equal(s.slice(i) + s.slice(0, i), brute(s), s);
  }
});

test('minRotationString 直接返回', () => {
  assert.equal(minRotationString('bca'), 'abc');
  assert.equal(minRotationString(''), '');
  assert.equal(minRotationString('a'), 'a');
});

test('minimalRotation 钩子', () => {
  let compares = 0;
  minimalRotation('dacba', { onCompare: () => compares++ });
  assert.ok(compares > 0);
});
