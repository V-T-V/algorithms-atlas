import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isRotation,
  rotationOffsets,
} from '../../src/algorithms/string/string-rotate-check/impl.ts';

test('isRotation 真', () => {
  assert.equal(isRotation('abcde', 'cdeab'), true);
  assert.equal(isRotation('abcde', 'abcde'), true); // 旋转 0
  assert.equal(isRotation('aaaa', 'aaaa'), true);
});

test('isRotation 假', () => {
  assert.equal(isRotation('abcde', 'abced'), false);
  assert.equal(isRotation('abc', 'abcd'), false); // 长度不同
  assert.equal(isRotation('abc', 'abd'), false);
});

test('isRotation 空串', () => {
  assert.equal(isRotation('', ''), true);
  assert.equal(isRotation('a', ''), false);
});

test('isRotation 单字符', () => {
  assert.equal(isRotation('a', 'a'), true);
  assert.equal(isRotation('a', 'b'), false);
});

test('rotationOffsets', () => {
  // 'aaaa' 的每个旋转都得到 'aaaa'，偏移 0,1,2,3
  assert.deepEqual(
    rotationOffsets('aaaa', 'aaaa').sort((a, b) => a - b),
    [0, 1, 2, 3],
  );
  // 'abcabc' rotate? 但 s1===s2 时仅找 len-1 个（不重复）
  assert.deepEqual(rotationOffsets('abcde', 'cdeab'), [2]);
  assert.deepEqual(rotationOffsets('abc', 'xyz'), []);
});

test('isRotation 与朴素对照', () => {
  const naive = (s1: string, s2: string): boolean => {
    if (s1.length !== s2.length) return false;
    return (s1 + s1).includes(s2);
  };
  for (const [a, b] of [
    ['hello', 'llohe'],
    ['hello', 'hello'],
    ['hello', 'elloh'],
    ['hello', 'ohell'],
    ['hello', 'world'],
  ] as const) {
    assert.equal(isRotation(a, b), naive(a, b), `${a},${b}`);
  }
});
