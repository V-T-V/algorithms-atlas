import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cdq3d } from '../../src/algorithms/ds/ds-divide-2/impl.ts';

test('cdq 全序', () => {
  const arr = [
    { a: 1, b: 1, c: 1 },
    { a: 2, b: 2, c: 2 },
    { a: 3, b: 3, c: 3 },
  ];
  assert.equal(cdq3d(arr), 3); // (0,1) (0,2) (1,2)
});

test('cdq 乱序', () => {
  const arr = [
    { a: 1, b: 2, c: 1 },
    { a: 2, b: 1, c: 2 },
    { a: 1, b: 1, c: 1 },
  ];
  // 排序后：(1,1,1)(1,2,1)(2,1,2)
  // 对：(0,1)? 1<=1,2<=2,1<=1 ✓
  //     (0,2)? 1<=2,1<=1,1<=2 ✓
  //     (1,2)? 1<=2,2<=1 ✗
  // 共 2
  assert.equal(cdq3d(arr), 2);
});
