import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscAddBinary2 } from '../../src/algorithms/misc/misc-add-binary-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-add-binary-2/trace.ts';
test('add binary 11+1=100', () => {
  assert.equal(miscAddBinary2('11', '1'), '100');
});
test('add binary 1010+1011=10101', () => {
  assert.equal(miscAddBinary2('1010', '1011'), '10101');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
