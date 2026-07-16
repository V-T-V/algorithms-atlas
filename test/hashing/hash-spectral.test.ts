import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashSpectral } from '../../src/algorithms/hashing/hash-spectral/impl.ts';
import { buildTrace } from '../../src/algorithms/hashing/hash-spectral/trace.ts';
test('spectral 确定性', () => {
  assert.equal(hashSpectral('a'), hashSpectral('a'));
});
test('spectral 不同输入不同', () => {
  assert.notEqual(hashSpectral('a'), hashSpectral('b'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});
