import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StackArray, stackArray } from '../../src/algorithms/ds/stack-array/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/stack-array/trace.ts';

test('stack-array LIFO 顺序', () => {
  const st = new StackArray(8);
  for (const v of [1, 2, 3]) st.push(v);
  assert.equal(st.size, 3);
  assert.equal(st.pop(), 3);
  assert.equal(st.pop(), 2);
  assert.equal(st.pop(), 1);
  assert.equal(st.pop(), undefined);
  assert.equal(st.isEmpty(), true);
});

test('stack-array peek 不影响栈顶', () => {
  const st = new StackArray(8);
  st.push(10);
  st.push(20);
  assert.equal(st.peek(), 20);
  assert.equal(st.size, 2);
  assert.equal(st.peek(), 20);
});

test('stack-array 便利函数返回逆序', () => {
  // push [1,2,3,4] 再全部 pop → [4,3,2,1]
  assert.deepEqual(stackArray([1, 2, 3, 4]), [4, 3, 2, 1]);
  assert.deepEqual(stackArray([]), []);
  assert.deepEqual(stackArray([42]), [42]);
});

test('stack-array 扩容钩子', () => {
  let resizes = 0;
  let last = [0, 0];
  const st = new StackArray(4);
  for (let i = 0; i < 9; i++)
    st.push(i, {
      onResize: (o, n) => {
        resizes++;
        last = [o, n];
      },
    });
  // cap 4->8->16，9 个元素触发 2 次扩容
  assert.equal(resizes, 2);
  assert.deepEqual(last, [8, 16]);
  assert.equal(st.capacity, 16);
});

test('stack-array push/pop 钩子反映 LIFO', () => {
  const pushed: number[] = [];
  const popped: number[] = [];
  const st = new StackArray(8);
  st.push(1, { onPush: (sz, v) => pushed.push(v) });
  st.push(2, { onPush: (sz, v) => pushed.push(v) });
  st.pop({ onPop: (sz, v) => popped.push(v) });
  assert.deepEqual(pushed, [1, 2]);
  assert.deepEqual(popped, [2]); // 先弹 2
});

test('stack-array 空栈 pop 返回 undefined', () => {
  const st = new StackArray(4);
  assert.equal(st.peek(), undefined);
  assert.equal(st.pop(), undefined);
  assert.equal(st.size, 0);
});

test('stack-array buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  // 末帧应是「完成」并带 final 角色
  const last = frames[frames.length - 1]!;
  assert.ok(last.bars!.every((b) => b.role === 'final'));
});
