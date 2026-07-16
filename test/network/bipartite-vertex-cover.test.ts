import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bipartiteVertexCover,
  isValidCover,
} from '../../src/algorithms/network/bipartite-vertex-cover/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/network/bipartite-vertex-cover/trace.ts';

test('bvc König：覆盖大小 = 最大匹配数', () => {
  const edges = [
    { from: 0, to: 0 },
    { from: 0, to: 1 },
    { from: 1, to: 0 },
    { from: 1, to: 2 },
    { from: 2, to: 1 },
    { from: 2, to: 3 },
    { from: 3, to: 2 },
    { from: 3, to: 3 },
  ];
  const r = bipartiteVertexCover(4, 4, edges);
  assert.equal(r.size, r.matchingSize);
});

test('bvc 覆盖合法：每条边至少一端在覆盖里', () => {
  const edges = [
    { from: 0, to: 0 },
    { from: 1, to: 0 },
    { from: 1, to: 1 },
    { from: 2, to: 2 },
  ];
  const r = bipartiteVertexCover(3, 3, edges);
  assert.ok(isValidCover(3, 3, edges, r.leftCover, r.rightCover));
});

test('bvc 星形图：覆盖大小 = 1', () => {
  // L0 连 R0,R1,R2；其余左点无边
  const edges = [
    { from: 0, to: 0 },
    { from: 0, to: 1 },
    { from: 0, to: 2 },
  ];
  const r = bipartiteVertexCover(1, 3, edges);
  assert.equal(r.size, 1);
  assert.ok(isValidCover(1, 3, edges, r.leftCover, r.rightCover));
});

test('bvc 单边图', () => {
  const r = bipartiteVertexCover(1, 1, [{ from: 0, to: 0 }]);
  assert.equal(r.size, 1);
});

test('bvc 空图覆盖为空', () => {
  const r = bipartiteVertexCover(3, 3, []);
  assert.equal(r.size, 0);
  assert.equal(r.matchingSize, 0);
});

test('bvc 完全二分图 K3,3 覆盖 = 3', () => {
  const edges: Array<{ from: number; to: number }> = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) edges.push({ from: i, to: j });
  const r = bipartiteVertexCover(3, 3, edges);
  assert.equal(r.size, 3);
  assert.ok(isValidCover(3, 3, edges, r.leftCover, r.rightCover));
});

test('bvc 需要增广让路的图覆盖合法', () => {
  // L0-R0, L1-R0, L1-R1
  const edges = [
    { from: 0, to: 0 },
    { from: 1, to: 0 },
    { from: 1, to: 1 },
  ];
  const r = bipartiteVertexCover(2, 2, edges);
  assert.equal(r.size, 2);
  assert.ok(isValidCover(2, 2, edges, r.leftCover, r.rightCover));
});

test('bvc 钩子 onDone 返回正确大小', () => {
  let doneSize = -1;
  bipartiteVertexCover(
    3,
    3,
    [
      { from: 0, to: 0 },
      { from: 1, to: 1 },
      { from: 2, to: 2 },
    ],
    { onDone: (r) => (doneSize = r.size) },
  );
  assert.equal(doneSize, 3);
});

test('bvc 随机较大图覆盖合法（固定布局）', () => {
  // 5 左 4 右，确定性边
  const edges: Array<{ from: number; to: number }> = [
    { from: 0, to: 0 },
    { from: 0, to: 2 },
    { from: 1, to: 1 },
    { from: 2, to: 0 },
    { from: 2, to: 3 },
    { from: 3, to: 2 },
    { from: 4, to: 3 },
  ];
  const r = bipartiteVertexCover(5, 4, edges);
  assert.ok(isValidCover(5, 4, edges, r.leftCover, r.rightCover));
  assert.equal(r.size, r.matchingSize);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note!.zh.includes('最小覆盖'));
});
