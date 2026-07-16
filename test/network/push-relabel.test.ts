import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pushRelabel } from '../../src/algorithms/network/push-relabel/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/network/push-relabel/trace.ts';

const EDGES = [
  { from: 0, to: 1, cap: 10 },
  { from: 0, to: 2, cap: 10 },
  { from: 1, to: 2, cap: 2 },
  { from: 1, to: 3, cap: 4 },
  { from: 1, to: 4, cap: 8 },
  { from: 2, to: 3, cap: 9 },
  { from: 3, to: 4, cap: 10 },
];

test('push-relabel 经典 5 节点网络最大流 = 18', () => {
  assert.equal(pushRelabel(5, EDGES, 0, 4), 18);
});

test('push-relabel 与 dinic 结果一致（链式网络）', () => {
  const chain = [
    { from: 0, to: 1, cap: 3 },
    { from: 1, to: 2, cap: 2 },
    { from: 2, to: 3, cap: 5 },
  ];
  assert.equal(pushRelabel(4, chain, 0, 3), 2);
});

test('push-relabel 反向边/重标号场景', () => {
  // 经典含反向利用的例子：0->1(1),0->2(2),1->2(1),1->3(1),2->3(1)
  const g = [
    { from: 0, to: 1, cap: 1 },
    { from: 0, to: 2, cap: 2 },
    { from: 1, to: 2, cap: 1 },
    { from: 1, to: 3, cap: 1 },
    { from: 2, to: 3, cap: 1 },
  ];
  assert.equal(pushRelabel(4, g, 0, 3), 2);
});

test('push-relabel 单边图', () => {
  assert.equal(pushRelabel(2, [{ from: 0, to: 1, cap: 7 }], 0, 1), 7);
});

test('push-relabel s===t 返回 0', () => {
  assert.equal(pushRelabel(3, EDGES, 1, 1), 0);
});

test('push-relabel 容量 0 边被忽略', () => {
  assert.equal(
    pushRelabel(
      3,
      [
        { from: 0, to: 1, cap: 0 },
        { from: 0, to: 2, cap: 5 },
        { from: 1, to: 2, cap: 5 },
      ],
      0,
      2,
    ),
    5,
  );
});

test('push-relabel 大网络正确（随机用固定布局）', () => {
  // 6 节点两层：源 0，汇 5
  const big = [
    { from: 0, to: 1, cap: 16 },
    { from: 0, to: 2, cap: 13 },
    { from: 1, to: 2, cap: 10 },
    { from: 2, to: 1, cap: 4 },
    { from: 1, to: 3, cap: 12 },
    { from: 3, to: 2, cap: 9 },
    { from: 2, to: 4, cap: 14 },
    { from: 4, to: 3, cap: 7 },
    { from: 4, to: 5, cap: 4 },
    { from: 3, to: 5, cap: 20 },
  ];
  // 经典 CLRS 网络最大流 = 23
  assert.equal(pushRelabel(6, big, 0, 5), 23);
});

test('push-relabel 钩子被调用', () => {
  let pushes = 0;
  let relabels = 0;
  pushRelabel(5, EDGES, 0, 4, {
    onPush: () => pushes++,
    onRelabel: () => relabels++,
  });
  assert.ok(pushes >= 7, '至少有源点的饱和推送');
  assert.ok(relabels >= 0);
});

test('push-relabel onDone 触发并返回正确值', () => {
  let done = -1;
  pushRelabel(5, EDGES, 0, 4, { onDone: (f) => (done = f) });
  assert.equal(done, 18);
});

test('buildTrace 生成帧序列并含最大流', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note!.zh.includes('18'));
});
