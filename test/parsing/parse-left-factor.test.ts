import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leftFactor } from '../../src/algorithms/parsing/parse-left-factor/impl.ts';

test('left-factor if-then-else', () => {
  const r = leftFactor({
    head: 'S',
    alts: [
      ['if', 'c', 'then', 'S'],
      ['if', 'c', 'then', 'S', 'else', 'S'],
    ],
  });
  assert.equal(r.changed, true);
  assert.equal(r.rules.length, 2);
  assert.equal(r.rules[1]!.head, 'S"');
});
test('left-factor 无公共前缀不变', () => {
  const r = leftFactor({ head: 'S', alts: [['a'], ['b']] });
  assert.equal(r.changed, false);
});
