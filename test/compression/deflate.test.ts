import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deflate, inflate } from '../../src/algorithms/compression/deflate/impl.ts';

test('deflate：abcabc 产生 1 个匹配 token', () => {
  const r = deflate([97, 98, 99, 97, 98, 99]);
  assert.equal(r.tokens.length, 4);
  assert.deepEqual(r.tokens[3], { kind: 'match', length: 3, distance: 3 });
});

test('deflate：无重复输入全为字面量', () => {
  const r = deflate([1, 2, 3]);
  assert.equal(r.tokens.length, 3);
  assert.deepEqual(r.tokens[0], { kind: 'lit', ch: 1 });
});

test('deflate 往返：inflate 还原', () => {
  const data = [97, 98, 99, 97, 98, 99, 100];
  const r = deflate(data);
  assert.deepEqual(inflate(r.tokens), data);
});
