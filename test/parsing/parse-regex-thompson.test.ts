import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFromAst,
  lit,
  cat,
  star,
  or_,
} from '../../src/algorithms/parsing/parse-regex-thompson/impl.ts';

test('thompson 单字', () => {
  const n = buildFromAst(lit('a'));
  assert.equal(n.states, 2);
  assert.equal(n.edges.length, 1);
});
test('thompson 或', () => {
  const n = buildFromAst(or_(lit('a'), lit('b')));
  assert.ok(n.states >= 6);
});
test('thompson 星', () => {
  const n = buildFromAst(star(lit('a')));
  assert.ok(n.states >= 4);
});
test('thompson 串接', () => {
  const n = buildFromAst(cat(lit('a'), lit('b')));
  assert.equal(n.states, 4);
});
