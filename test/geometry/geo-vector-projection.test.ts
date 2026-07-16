import { test } from 'node:test';
import assert from 'node:assert/strict';
import { project } from '../../src/algorithms/geometry/geo-vector-projection/impl.ts';
test('投影 到 x 轴', () => {
  const r = project({ x: 3, y: 4 }, { x: 1, y: 0 });
  assert.equal(r.coeff, 3);
  assert.deepEqual(r.vec, { x: 3, y: 0 });
});
test('投影 零向量报错', () => {
  assert.throws(() => project({ x: 1, y: 1 }, { x: 0, y: 0 }), RangeError);
});
test('投影 自投影系数1', () => {
  const r = project({ x: 2, y: 0 }, { x: 2, y: 0 });
  assert.equal(r.coeff, 1);
});
