import { test } from 'node:test';
import assert from 'node:assert/strict';
import { babyStepGiantStep } from '../../src/algorithms/misc/misc-baby-giant/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-baby-giant/trace.ts';
test('2^x≡3 mod 5 => x=3', () => {
  assert.equal(babyStepGiantStep(2, 3, 5), 3);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
