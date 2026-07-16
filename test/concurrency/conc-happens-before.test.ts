import { test } from 'node:test';
import assert from 'node:assert/strict';
import { happensBefore } from '../../src/algorithms/concurrency/conc-happens-before/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-happens-before/trace.ts';
test('hb 传递闭包', () => {
  const r = happensBefore(
    [1, 2, 3],
    [
      { a: 1, b: 2, kind: 'po' },
      { a: 2, b: 3, kind: 'po' },
    ],
  );
  assert.equal(r[0]![2], true);
});
test('hb trace 非空', () => assert.ok(buildTrace().length >= 2));
