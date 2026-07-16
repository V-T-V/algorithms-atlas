import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TreapSet } from '../../src/algorithms/ds/ds-treap-set/impl.ts';

test('TreapSet insert + search', () => {
  const t = new TreapSet();
  for (const v of [5, 2, 8, 1, 9, 3]) t.insert(v);
  assert.equal(t.search(5), true);
  assert.equal(t.search(1), true);
  assert.equal(t.search(9), true);
  assert.equal(t.search(4), false);
});

test('TreapSet inorder 升序', () => {
  const t = new TreapSet();
  const vals = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  for (const v of vals) t.insert(v);
  assert.deepEqual(
    t.inorder(),
    [...vals].sort((a, b) => a - b),
  );
});

test('TreapSet 重复插入', () => {
  const t = new TreapSet();
  assert.equal(t.insert(5), true);
  assert.equal(t.insert(5), false);
  assert.equal(t.size, 1);
});

test('TreapSet delete', () => {
  const t = new TreapSet();
  for (const v of [5, 2, 8, 1, 9]) t.insert(v);
  assert.equal(t.delete(5), true);
  assert.equal(t.search(5), false);
  assert.equal(t.delete(5), false);
  assert.equal(t.size, 4);
});

test('TreapSet 删根', () => {
  const t = new TreapSet();
  for (const v of [5, 2, 8, 1, 9, 3, 7]) t.insert(v);
  t.delete(5);
  assert.equal(t.search(5), false);
  assert.deepEqual(t.inorder(), [1, 2, 3, 7, 8, 9]);
});

test('TreapSet min/max', () => {
  const t = new TreapSet();
  for (const v of [5, 2, 8, 1, 9]) t.insert(v);
  assert.equal(t.min(), 1);
  assert.equal(t.max(), 9);
});

test('TreapSet 空 min/max', () => {
  const t = new TreapSet();
  assert.equal(t.min(), undefined);
  assert.equal(t.max(), undefined);
});

test('TreapSet 与 Set 对照（含删除）', () => {
  const t = new TreapSet();
  const ref = new Set<number>();
  const ops = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
  for (const v of ops) {
    t.insert(v);
    ref.add(v);
  }
  assert.equal(t.size, ref.size);
  for (const v of ref) assert.equal(t.search(v), true);
  // 删一半
  const arr = [...ref];
  for (let i = 0; i < arr.length / 2; i++) {
    t.delete(arr[i]!);
    ref.delete(arr[i]!);
  }
  assert.equal(t.size, ref.size);
  assert.deepEqual(
    t.inorder(),
    [...ref].sort((a, b) => a - b),
  );
});

test('TreapSet 全删空', () => {
  const t = new TreapSet();
  for (const v of [1, 2, 3]) t.insert(v);
  t.delete(1);
  t.delete(2);
  t.delete(3);
  assert.equal(t.size, 0);
  assert.deepEqual(t.inorder(), []);
});
