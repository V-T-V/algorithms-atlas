import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LinkedListStack,
  linkedListStack,
} from '../../src/algorithms/ds/linked-list-stack/impl.ts';

test('linkedListStack 弹出序列为输入的逆序（LIFO）', () => {
  assert.deepEqual(linkedListStack([1, 2, 3]), [3, 2, 1]);
  assert.deepEqual(linkedListStack([5, 2, 8, 1, 9, 3]), [3, 9, 1, 8, 2, 5]);
});

test('LinkedListStack 基本压栈/弹栈', () => {
  const s = new LinkedListStack();
  assert.equal(s.isEmpty(), true);
  s.push(1);
  s.push(2);
  s.push(3);
  assert.equal(s.size, 3);
  assert.equal(s.peek(), 3);
  assert.equal(s.pop(), 3);
  assert.equal(s.pop(), 2);
  assert.equal(s.pop(), 1);
  assert.equal(s.pop(), undefined); // 空
  assert.equal(s.isEmpty(), true);
});

test('LinkedListStack toArray 反映栈底→栈顶', () => {
  const s = new LinkedListStack();
  for (const v of [7, 8, 9]) s.push(v);
  assert.deepEqual(s.toArray(), [7, 8, 9]); // 9 在栈顶（末尾）
});

test('LinkedListStack 空栈 peek/pop 返回 undefined', () => {
  const s = new LinkedListStack();
  assert.equal(s.peek(), undefined);
  assert.equal(s.pop(), undefined);
});

test('linkedListStack 钩子被调用（push/pop 次数匹配）', () => {
  const pushed: number[] = [];
  const popped: number[] = [];
  linkedListStack([10, 20, 30], {
    onPush: (v) => pushed.push(v),
    onPop: (v) => popped.push(v),
  });
  assert.deepEqual(pushed, [10, 20, 30]);
  assert.deepEqual(popped, [30, 20, 10]); // 逆序弹出
});

test('linkedListStack 空 / 单元素', () => {
  assert.deepEqual(linkedListStack([]), []);
  assert.deepEqual(linkedListStack([42]), [42]);
});
