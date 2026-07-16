import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gomoryHuTree, treeBottleneck } from '../../src/algorithms/network/gomory-hu-tree/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/network/gomory-hu-tree/trace.ts';

test('gh 树边数 = n-1', () => {
  const tree = gomoryHuTree(4, [
    { from: 0, to: 1, cap: 3 },
    { from: 1, to: 2, cap: 4 },
    { from: 2, to: 3, cap: 3 },
    { from: 3, to: 0, cap: 4 },
    { from: 0, to: 2, cap: 2 },
  ]);
  assert.equal(tree.length, 3);
});

test('gh 树瓶颈 = 直接最大流最小割（相邻节点）', () => {
  const edges = [
    { from: 0, to: 1, cap: 5 },
    { from: 1, to: 2, cap: 3 },
    { from: 2, to: 3, cap: 4 },
  ];
  const tree = gomoryHuTree(4, edges);
  // 0-1 直接相连，割应 = 5（边 0-1 的容量）
  const b = treeBottleneck(tree, 0, 1);
  assert.equal(b, 5);
});

test('gh 树瓶颈 = 直接最大流最小割（链尾）', () => {
  const edges = [
    { from: 0, to: 1, cap: 5 },
    { from: 1, to: 2, cap: 3 },
    { from: 2, to: 3, cap: 4 },
  ];
  const tree = gomoryHuTree(4, edges);
  // 0-3 最小割 = min(5,3,4) = 3（链路瓶颈在 1-2）
  const b = treeBottleneck(tree, 0, 3);
  assert.equal(b, 3);
});

test('gh 单节点返回空树', () => {
  assert.deepEqual(gomoryHuTree(1, []), []);
});

test('gh 两节点一条边', () => {
  const tree = gomoryHuTree(2, [{ from: 0, to: 1, cap: 7 }]);
  assert.equal(tree.length, 1);
  assert.equal(tree[0]![2], 7);
});

test('gh 树瓶颈 s===t 为 Infinity', () => {
  const tree = gomoryHuTree(3, [
    { from: 0, to: 1, cap: 2 },
    { from: 1, to: 2, cap: 3 },
  ]);
  assert.equal(treeBottleneck(tree, 1, 1), Infinity);
});

test('gh 树瓶颈与直接最小割一致（菱形图）', () => {
  // 菱形：0-1(2), 0-2(3), 1-3(3), 2-3(2)
  // 0-3 两条点不交路径：0-1-3 (瓶颈 min(2,3)=2) 与 0-2-3 (瓶颈 min(3,2)=2)
  // 故最大流(0,3)=最小割(0,3)=4，对应割 {0,2}|{1,3} 切断 0-1(2)+2-3(2)=4
  const edges = [
    { from: 0, to: 1, cap: 2 },
    { from: 0, to: 2, cap: 3 },
    { from: 1, to: 3, cap: 3 },
    { from: 2, to: 3, cap: 2 },
  ];
  const tree = gomoryHuTree(4, edges);
  const b = treeBottleneck(tree, 0, 3);
  assert.equal(b, 4);
});

test('gh 钩子 onFlow 与 onDone', () => {
  const flows: number[] = [];
  let doneCount = -1;
  gomoryHuTree(
    3,
    [
      { from: 0, to: 1, cap: 2 },
      { from: 1, to: 2, cap: 4 },
    ],
    {
      onFlow: (_v, _p, w) => flows.push(w),
      onDone: (t) => (doneCount = t.length),
    },
  );
  assert.equal(doneCount, 2);
  assert.equal(flows.length, 2);
});

test('gh 容量 0 边被忽略', () => {
  const tree = gomoryHuTree(3, [
    { from: 0, to: 1, cap: 0 },
    { from: 0, to: 1, cap: 4 },
    { from: 1, to: 2, cap: 3 },
  ]);
  assert.equal(tree.length, 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note!.zh.includes('Gomory-Hu'));
});
