import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Circle,
  Rectangle,
  AreaVisitor,
  PerimeterVisitor,
  sumVisit,
} from '../../src/algorithms/design/design-visitor/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-visitor/trace.ts';

test('visitor 圆面积', () => {
  const c = new Circle(2);
  assert.equal(c.accept(new AreaVisitor()), Math.PI * 4);
});
test('visitor 矩形周长', () => {
  const r = new Rectangle(3, 4);
  assert.equal(r.accept(new PerimeterVisitor()), 14);
});
test('visitor sumVisit 多形状', () => {
  const shapes = [new Circle(1), new Rectangle(2, 3)];
  const total = sumVisit(shapes, new AreaVisitor());
  assert.equal(total, Math.PI + 6);
});
test('visitor 同一形状不同访问者', () => {
  const r = new Rectangle(5, 6);
  assert.equal(r.accept(new AreaVisitor()), 30);
  assert.equal(r.accept(new PerimeterVisitor()), 22);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
