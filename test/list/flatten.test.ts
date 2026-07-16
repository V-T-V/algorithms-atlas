import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMultiList,
  multiListToArray,
  flatten,
} from '../../src/algorithms/list/flatten/impl.ts';

test('flatten 展平', () => {
  // 结构（节点下标 = 值-1）：
  //   顶层链: 1 -> 2 -> 3 -> 4      (节点 4 的 next=null，因为节点 5 是某 child)
  //   1.child -> 5(值5) -> 6(值6) -> 7(值7)   (7.next=null，因为 8 是 child)
  //   6.child -> 8(值8) -> 9(值9)             (独立子链)
  // values=[1,2,3,4,5,6,7,8,9]
  // childIndex: [0]=4(值5 是节点1的child), [5]=7(值8 是节点6的child)
  const { head } = buildMultiList([1, 2, 3, 4, 5, 6, 7, 8, 9], [4, -1, -1, -1, -1, 7, -1, -1, -1]);
  // 深度优先展平：
  //  1 -> 遇 child(5): 1->5, 压栈 [2,3,4]
  //  5 -> 6 -> 遇 child(8): 6->8, 压栈 [7]
  //  8 -> 9 (next=null) 弹出 7: 9->7 (7.next=null)
  //  7 (next=null) 弹出 2: 7->2->3->4
  //  结果：1,5,6,8,9,7,2,3,4
  const result = flatten(head);
  assert.deepEqual(multiListToArray(result), [1, 5, 6, 8, 9, 7, 2, 3, 4]);
});

test('flatten 无 child', () => {
  const { head } = buildMultiList([1, 2, 3], [-1, -1, -1]);
  assert.deepEqual(multiListToArray(flatten(head)), [1, 2, 3]);
});

test('flatten 边界', () => {
  assert.equal(flatten(null), null);
});

test('flatten 钩子', () => {
  let children = 0;
  const { head } = buildMultiList([1, 2, 3, 4], [2, -1, -1, -1]);
  flatten(head, { onChild: () => children++ });
  assert.equal(children, 1);
});
