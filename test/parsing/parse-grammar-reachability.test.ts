import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeReachability } from '../../src/algorithms/parsing/parse-grammar-reachability/impl.ts';

test('reachability 找出不可达', () => {
  const r = analyzeReachability(
    [
      { head: 'S', syms: ['A', 'B'] },
      { head: 'A', syms: ['x'] },
      { head: 'B', syms: ['A'] },
      { head: 'C', syms: ['y'] },
    ],
    'S',
  );
  assert.ok(r.reachable.has('S') && r.reachable.has('A') && r.reachable.has('B'));
  assert.deepEqual(r.unreachable, ['C']);
});
