import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prufer, pruferDecode, type GraphInput } from '../../src/algorithms/graph/prufer/impl.ts';

test('prufer 经典示例', () => {
  // 路径 1-2-3-4 的 Prufer 编码：删 1 记 2，删 2 记 3 → [2,3]？
  // n=4, 删 n-2=2 次。叶子：1（邻2）→记2；之后 2 变叶子（邻3）→记3。
  // 但删 1 后剩 2-3-4，2 度=1（原连1、3，删1后只连3）→ 是叶子 → 记 3。
  // 结果 [2,3]
  const g: GraphInput = {
    n: 4,
    edges: [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
    ],
  };
  assert.deepEqual(prufer(g).code, [2, 3]);
});

test('prufer 星形', () => {
  // 中心 1 连 2,3,4。每次删最小叶子：删2记1，删3记1 → [1,1]
  const g: GraphInput = {
    n: 4,
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
    ],
  };
  assert.deepEqual(prufer(g).code, [1, 1]);
});

test('prufer 编码-解码互逆', () => {
  const g: GraphInput = {
    n: 7,
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 5, to: 7 },
    ],
  };
  const { code } = prufer(g);
  const edges = pruferDecode(code);
  // 重建的边集合（无序）应与原边集合一致
  const norm = (es: Array<{ from: number; to: number }>): string[] =>
    es.map((e) => [e.from, e.to].sort((a, b) => a - b).join('-')).sort();
  assert.deepEqual(norm(edges), norm([...g.edges]));
  assert.equal(edges.length, 6);
});

test('prufer n=2 空序列', () => {
  const g: GraphInput = { n: 2, edges: [{ from: 1, to: 2 }] };
  assert.deepEqual(prufer(g).code, []);
  // 解码空序列 → 单条边 {1,2}
  assert.deepEqual(
    pruferDecode([]).map((e) => [e.from, e.to].sort((a, b) => a - b)),
    [[1, 2]],
  );
});

test('prufer 钩子被调用', () => {
  const deletes: Array<{ leaf: number; neighbor: number }> = [];
  let codeCalled = false;
  const g: GraphInput = {
    n: 4,
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
    ],
  };
  prufer(g, {
    onDeleteLeaf: (leaf, neighbor) => deletes.push({ leaf, neighbor }),
    onCode: () => {
      codeCalled = true;
    },
  });
  assert.equal(deletes.length, 2);
  assert.deepEqual(deletes, [
    { leaf: 2, neighbor: 1 },
    { leaf: 3, neighbor: 1 },
  ]);
  assert.ok(codeCalled);
});
