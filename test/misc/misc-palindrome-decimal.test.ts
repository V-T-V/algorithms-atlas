import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palindromeConstruct } from '../../src/algorithms/misc/misc-palindrome-decimal/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-palindrome-decimal/trace.ts';
test('87 能产生回文', () => {
  const r = palindromeConstruct(87, 20);
  const rev = String(r.palindrome).split('').reverse().join('');
  assert.equal(String(r.palindrome), rev);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
