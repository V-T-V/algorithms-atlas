import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reflectAboutPoint } from '../../src/algorithms/geometry/geo-reflection-point/impl.ts';
test('关于原点反射', () => {
  assert.deepEqual(reflectAboutPoint({ x: 1, y: 2 }, { x: 0, y: 0 }), { x: -1, y: -2 });
});
