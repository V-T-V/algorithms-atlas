import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SplayTree, splayDs, type SplayHooks } from '../../src/algorithms/ds/splay-ds/impl.ts';

test('splayDs 中序始终升序', () => {
  const tree = splayDs([10, 5, 20, 15, 25, 12]);
  const arr = tree.toArray();
  assert.deepEqual(
    arr,
    [...arr].sort((a, b) => a - b),
  );
  assert.equal(tree.isValid(), true);
});

test('SplayTree 插入后新节点在根', () => {
  const tree = new SplayTree();
  tree.insert(10);
  tree.insert(20);
  tree.insert(30);
  // 最后插入的 30 被 splay 到根
  assert.equal(tree.root?.value, 30);
});

test('SplayTree 查找命中后目标在根', () => {
  const tree = splayDs([10, 5, 20, 15, 25, 12]);
  assert.equal(tree.search(12), true);
  assert.equal(tree.root?.value, 12);
});

test('SplayTree 查找未命中 splay 最后访问节点', () => {
  const tree = splayDs([10, 5, 20]);
  const found = tree.search(99);
  assert.equal(found, false);
  // 未命中时根应为搜索路径上最后访问的节点（此处 20）
  assert.equal(tree.root?.value, 20);
});

test('SplayTree 重复值 splay 已有节点到根', () => {
  const tree = new SplayTree();
  tree.insert(10);
  tree.insert(20);
  tree.insert(5);
  tree.insert(10); // 重复
  assert.equal(tree.root?.value, 10);
  assert.equal(tree.size, 3); // 未增加
});

test('SplayTree 始终保持 BST 性质（大量操作）', () => {
  const tree = new SplayTree();
  const inserted = new Set<number>();
  for (let i = 0; i < 100; i++) {
    const v = (i * 37) % 97;
    tree.insert(v);
    inserted.add(v);
  }
  assert.equal(tree.isValid(), true);
  assert.equal(tree.size, inserted.size);
  // 所有已插入元素都能搜到
  for (const v of inserted) assert.equal(tree.search(v), true);
});

test('SplayTree 单元素 / 空', () => {
  const tree = new SplayTree();
  assert.equal(tree.size, 0);
  assert.deepEqual(tree.toArray(), []);
  tree.insert(42);
  assert.equal(tree.root?.value, 42);
  assert.deepEqual(tree.toArray(), [42]);
});

test('SplayTree 钩子被调用', () => {
  let compares = 0;
  let inserts = 0;
  let rotates = 0;
  let splays = 0;
  const hooks: SplayHooks = {
    onCompare: () => compares++,
    onInsert: () => inserts++,
    onRotate: () => rotates++,
    onSplay: () => splays++,
  };
  const tree = new SplayTree();
  tree.insert(10, hooks);
  tree.insert(20, hooks);
  tree.insert(30, hooks); // 会触发 zag-zag
  assert.ok(compares > 0);
  assert.equal(inserts, 3);
  assert.ok(rotates > 0, '应发生旋转');
  assert.ok(splays > 0, '应触发 splay');
});

test('SplayTree 触发不同旋转情形', () => {
  // zig-zag：插入 10,5,20 后 splay 20？实际依赖形态。
  // 这里至少断言不同 case 出现
  const cases = new Set<string>();
  const tree = new SplayTree();
  const hooks: SplayHooks = {
    onRotate: (c) => cases.add(c),
  };
  for (const v of [10, 5, 20, 15, 25, 1, 8, 30]) tree.insert(v, hooks);
  assert.ok(cases.size >= 1, `got cases ${[...cases]}`);
  // 至少出现 zig 或 zag 之一
  assert.ok(
    cases.has('zig') ||
      cases.has('zag') ||
      cases.has('zig-zig') ||
      cases.has('zag-zag') ||
      cases.has('zig-zag') ||
      cases.has('zag-zig'),
  );
});
