import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  segmentCollinear,
  type Point,
} from '../../src/algorithms/geometry/geo-segment-collinear/impl.ts';

const P = (x: number, y: number): Point => ({ x, y });

test('segmentCollinear 共线且重叠', () => {
  const r = segmentCollinear(P(0, 0), P(6, 0), P(4, 0), P(9, 0));
  assert.equal(r.collinear, true);
  assert.equal(r.overlap, true);
});

test('segmentCollinear 共线但不重叠', () => {
  const r = segmentCollinear(P(0, 0), P(2, 0), P(5, 0), P(8, 0));
  assert.equal(r.collinear, true);
  assert.equal(r.overlap, false);
});

test('segmentCollinear 不共线', () => {
  const r = segmentCollinear(P(0, 0), P(4, 0), P(2, 1), P(2, 5));
  assert.equal(r.collinear, false);
  assert.equal(r.overlap, false);
});

test('segmentCollinear 端点相接视为重叠', () => {
  const r = segmentCollinear(P(0, 0), P(2, 0), P(2, 0), P(5, 0));
  assert.equal(r.collinear, true);
  assert.equal(r.overlap, true);
});

test('segmentCollinear 垂直线段共线', () => {
  const r = segmentCollinear(P(0, 0), P(0, 4), P(0, 3), P(0, 8));
  assert.equal(r.collinear, true);
  assert.equal(r.overlap, true);
});
