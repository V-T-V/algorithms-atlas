import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shannonFano } from '../../src/algorithms/compression/shannon-fano/impl.ts';

test('shannon-fano：banana 频率分配编码', () => {
  const r = shannonFano([
    { symbol: 'a', freq: 3 },
    { symbol: 'n', freq: 2 },
    { symbol: 'b', freq: 1 },
  ]);
  assert.equal(r.codes.size, 3);
  assert.equal(r.codes.get('a'), '00');
  assert.equal(r.codes.get('n'), '01');
  assert.equal(r.codes.get('b'), '1');
});

test('shannon-fano：单符号编码为空串', () => {
  const r = shannonFano([{ symbol: 'x', freq: 5 }]);
  assert.equal(r.codes.get('x'), '');
});
