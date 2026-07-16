import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Circle, CircleData } from '../../src/algorithms/design/design-private-class-data/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-private-class-data/trace.ts';
test('circle 面积', () => {
  const c = new Circle(new CircleData(2, 'blue'));
  assert.equal(c.area(), Math.PI * 4);
});
test('private-data trace 非空', () => assert.ok(buildTrace().length > 0));
