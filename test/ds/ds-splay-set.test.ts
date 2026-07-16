import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SplaySet } from '../../src/algorithms/ds/ds-splay-set/impl.ts';

test('SplaySet insert + search', () => {
  const s = new SplaySet();
  for (const v of [5, 2, 8, 1, 9, 3]) s.insert(v);
  assert.equal(s.search(5), true);
  assert.equal(s.search(1), true);
  assert.equal(s.search(9), true);
  assert.equal(s.search(4), false);
});

test('SplaySet inorder 升序', () => {
  const s = new SplaySet();
  const vals = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  for (const v of vals) s.insert(v);
  assert.deepEqual(
    s.inorder(),
    [...vals].sort((a, b) => a - b),
  );
});

test('SplaySet 重复插入', () => {
  const s = new SplaySet();
  assert.equal(s.insert(5), true);
  assert.equal(s.insert(5), false);
  assert.equal(s.size, 1);
});

test('SplaySet delete', () => {
  const s = new SplaySet();
  for (const v of [5, 2, 8, 1, 9]) s.insert(v);
  assert.equal(s.delete(5), true);
  assert.equal(s.search(5), false);
  assert.equal(s.delete(5), false);
  assert.equal(s.size, 4);
});

test('SplaySet 连续删除后仍有序', () => {
  const s = new SplaySet();
  for (const v of [5, 2, 8, 1, 9, 3, 7]) s.insert(v);
  s.delete(2);
  s.delete(8);
  s.delete(5);
  assert.deepEqual(s.inorder(), [1, 3, 7, 9]);
});

test('SplaySet 频繁访问', () => {
  const s = new SplaySet();
  for (let i = 0; i < 20; i++) s.insert(i);
  for (let k = 0; k < 100; k++) s.search(k % 20);
  assert.equal(s.search(10), true);
  assert.deepEqual(
    s.inorder(),
    Array.from({ length: 20 }, (_, i) => i),
  );
});

test('SplaySet 与 Set 对照', () => {
  const s = new SplaySet();
  const ref = new Set<number>();
  const ops = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  for (const v of ops) {
    s.insert(v);
    ref.add(v);
  }
  assert.equal(s.size, ref.size);
  for (const v of ref) assert.equal(s.search(v), true);
  const arr = [...ref];
  for (let i = 0; i < arr.length / 2; i++) {
    s.delete(arr[i]!);
    ref.delete(arr[i]!);
  }
  assert.equal(s.size, ref.size);
  assert.deepEqual(
    s.inorder(),
    [...ref].sort((a, b) => a - b),
  );
});

test('SplaySet 空集合操作', () => {
  const s = new SplaySet();
  assert.equal(s.search(1), false);
  assert.equal(s.delete(1), false);
  assert.equal(s.size, 0);
});
