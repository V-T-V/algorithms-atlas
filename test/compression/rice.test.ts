import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rice, inverseRice } from '../../src/algorithms/compression/rice/impl.ts';

test('rice：k=4 时单值编码', () => {
  // m = 2^4 = 16；zig-zag 编码后 q 部分一元码 + r 部分定长
  assert.equal(rice([0], 4).bits, '00000');
  assert.equal(rice([1], 4).bits, '00010');
  assert.equal(rice([16], 4).bits, '1100000');
});

test('rice 往返：inverseRice 还原', () => {
  const data = [0, 1, 16, -1, 255];
  const r = rice(data, 4);
  assert.deepEqual(inverseRice(r.bits, data.length, 4), data);
});

test('rice：非法 k 抛错', () => {
  assert.throws(() => rice([0], -1));
});
