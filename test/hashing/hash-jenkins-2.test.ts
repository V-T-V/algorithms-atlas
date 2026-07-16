import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashJenkins2 } from '../../src/algorithms/hashing/hash-jenkins-2/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-jenkins-2/trace.ts';

test('hash-jenkins-2 确定性', () => {
  assert.equal(hashJenkins2('hello'), hashJenkins2('hello'));
});

test('hash-jenkins-2 不同输入不同', () => {
  assert.notEqual(hashJenkins2('hello'), hashJenkins2('world'));
});

test('hash-jenkins-2 32 位无符号范围', () => {
  const h = hashJenkins2('x');
  assert.ok(h >= 0 && h < 2 ** 32);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 3);
});
