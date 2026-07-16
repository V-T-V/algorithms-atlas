import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectAmbiguity } from '../../src/algorithms/parsing/parse-grammar-ambiguity/impl.ts';

test('detect-ambiguity 共享首符', () => {
  const w = detectAmbiguity([{ head: 'S', alts: [['id', '+', 'S'], ['id']] }]);
  assert.equal(w.length, 1);
  assert.equal(w[0]!.rule, 'S');
});
test('detect-ambiguity 左右递归共存', () => {
  const w = detectAmbiguity([{ head: 'A', alts: [['A', '+', 'x'], ['x', '+', 'A'], ['x']] }]);
  assert.ok(w.some((x) => x.reason.includes('left- and right-recursive')));
});
