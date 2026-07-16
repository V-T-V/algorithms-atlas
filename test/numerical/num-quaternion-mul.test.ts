import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qMul, qNorm } from '../../src/algorithms/numerical/num-quaternion-mul/impl.ts';
test('单位四元数相乘', () => {
  assert.deepEqual(qMul({ w: 1, x: 0, y: 0, z: 0 }, { w: 1, x: 0, y: 0, z: 0 }), {
    w: 1,
    x: 0,
    y: 0,
    z: 0,
  });
});
test('模', () => {
  assert.ok(Math.abs(qNorm({ w: 1, x: 2, y: 2, z: 2 }) - Math.sqrt(13)) < 1e-9);
});
