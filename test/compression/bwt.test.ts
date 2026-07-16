import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bwt, inverseBwt } from '../../src/algorithms/compression/bwt/impl.ts';

test('bwt 编码：banana → lastColumn=nnbaaa, primary=3', () => {
  const r = bwt('banana');
  assert.equal(r.lastColumn, 'nnbaaa');
  assert.equal(r.primary, 3);
});

test('bwt 空串/单字符', () => {
  assert.deepEqual(bwt(''), { lastColumn: '', primary: 0 });
  assert.deepEqual(bwt('x'), { lastColumn: 'x', primary: 0 });
});

test('bwt 往返：inverseBwt 还原', () => {
  const r = bwt('banana');
  assert.equal(inverseBwt(r.lastColumn, r.primary), 'banana');
});

test('bwt 钩子被调用', () => {
  let sorts = 0;
  bwt('banana', '', { onSort: () => sorts++ });
  assert.ok(sorts > 0, '应触发排序钩子');
});
