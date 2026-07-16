import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  kuhnMatching,
  kuhnMatchingResult,
} from '../../src/algorithms/network/kuhn-matching/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/network/kuhn-matching/trace.ts';

test('kuhn 完美匹配（4 左 4 右）', () => {
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
  assert.equal(kuhnMatching(4, 4, edges), 4);
});

test('kuhn 需要让路（增广）的场景', () => {
  // L0-R0, L1-R0, L1-R1：L0 占 R0，L1 需让 L0 让出 R0
  const edges = [
    { from: 0, to: 0 },
    { from: 1, to: 0 },
    { from: 1, to: 1 },
  ];
  assert.equal(kuhnMatching(2, 2, edges), 2);
});

test('kuhn 无法匹配所有（最大匹配 < 左点数）', () => {
  // L0, L1 只能连到同一个 R0
  const edges = [
    { from: 0, to: 0 },
    { from: 1, to: 0 },
  ];
  assert.equal(kuhnMatching(2, 1, edges), 1);
});

test('kuhn 空图匹配为 0', () => {
  assert.equal(kuhnMatching(3, 3, []), 0);
});

test('kuhn 单边匹配', () => {
  assert.equal(kuhnMatching(1, 1, [{ from: 0, to: 0 }]), 1);
});

test('kuhn 返回匹配对结果', () => {
  const pairs = kuhnMatchingResult(2, 2, [
    { from: 0, to: 0 },
    { from: 1, to: 1 },
  ]);
  assert.deepEqual(
    pairs.sort((a, b) => a.left - b.left),
    [
      { left: 0, right: 0 },
      { left: 1, right: 1 },
    ],
  );
});

test('kuhn 钩子 onResult 与 onDone', () => {
  const results: boolean[] = [];
  let done = -1;
  kuhnMatching(
    3,
    3,
    [
      { from: 0, to: 0 },
      { from: 1, to: 0 },
      { from: 2, to: 2 },
    ],
    {
      onResult: (_u, m) => results.push(m),
      onDone: (s) => (done = s),
    },
  );
  assert.equal(done, 2);
  // L0 占 R0；L1 只能连 R0 但 R0 已被占且 L0 无可让，故失败；L2 占 R2 成功。
  assert.deepEqual(results, [true, false, true]);
});

test('kuhn 越界边被忽略', () => {
  assert.equal(
    kuhnMatching(2, 2, [
      { from: 0, to: 0 },
      { from: 5, to: 5 }, // 越界
    ]),
    1,
  );
});

test('kuhn 较大随机用固定布局仍确定', () => {
  // 3 左 3 右完全二分图，必为 3
  const edges: Array<{ from: number; to: number }> = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) edges.push({ from: i, to: j });
  assert.equal(kuhnMatching(3, 3, edges), 3);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note!.zh.includes('最大匹配'));
});
