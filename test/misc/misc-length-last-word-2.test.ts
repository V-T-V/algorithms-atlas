import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscLengthLastWord2 } from '../../src/algorithms/misc/misc-length-last-word-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-length-last-word-2/trace.ts';
test('last word "Hello World"=5', () => {
  assert.equal(miscLengthLastWord2('Hello World'), 5);
});
test('last word 含尾空格', () => {
  assert.equal(miscLengthLastWord2('   fly me   to   the moon  '), 4);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
