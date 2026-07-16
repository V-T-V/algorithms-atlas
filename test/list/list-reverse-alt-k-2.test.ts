import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildList,
  listToArray,
  reverseAltKGroup,
} from '../../src/algorithms/list/list-reverse-alt-k-2/impl.ts';
import { buildTrace } from '../../src/algorithms/list/list-reverse-alt-k-2/trace.ts';
test('reverseAltKGroup 正确', () => {
  // [1,2,3,4,5,6,7,8] k=2: 组1保持(1,2), 组2反转(4,3), 组3保持(5,6), 组4反转(8,7)
  assert.deepEqual(
    listToArray(reverseAltKGroup(buildList([1, 2, 3, 4, 5, 6, 7, 8]), 2)),
    [1, 2, 4, 3, 5, 6, 8, 7],
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
