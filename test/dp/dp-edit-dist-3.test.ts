import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editDistBacktrack } from '../../src/algorithms/dp/dp-edit-dist-3/impl.ts';

test('edit-dist horse→ros', () => {
  const r = editDistBacktrack('horse', 'ros');
  assert.equal(r.distance, 3);
});

test('edit-dist intention→execution', () => {
  assert.equal(editDistBacktrack('intention', 'execution').distance, 5);
});

test('edit-dist 相同串', () => {
  const r = editDistBacktrack('abc', 'abc');
  assert.equal(r.distance, 0);
  assert.equal(r.ops.length, 3);
  assert.ok(r.ops.every((o) => o === 'keep'));
});

test('edit-dist 空串', () => {
  assert.equal(editDistBacktrack('', 'abc').distance, 3);
});
