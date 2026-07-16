import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mtf, inverseMtf } from '../../src/algorithms/compression/mtf/impl.ts';

test('mtf：编码输出索引序列', () => {
  assert.deepEqual(mtf([0, 0, 1], 256).encoded, [0, 0, 1]);
});

test('mtf：执行后符号表前移', () => {
  const r = mtf([0, 0, 1], 256);
  assert.equal(r.table[0], 1);
  assert.equal(r.table[1], 0);
});

test('mtf 往返：inverseMtf 还原', () => {
  const data = [72, 72, 73, 72];
  const r = mtf(data, 256);
  assert.deepEqual(inverseMtf(r.encoded, 256), data);
});
