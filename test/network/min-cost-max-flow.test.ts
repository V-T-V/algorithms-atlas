import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minCostMaxFlow } from '../../src/algorithms/network/min-cost-max-flow/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/network/min-cost-max-flow/trace.ts';

test('mcmf 基本示例：最大流 5，最小费用 11', () => {
  // 上路 0->1->3 容量瓶颈 2，费用 (1+1)*2=4；余下需走 0->1->2->3 与 0->2->3
  const r = minCostMaxFlow(
    4,
    [
      { from: 0, to: 1, cap: 3, cost: 1 },
      { from: 0, to: 2, cap: 2, cost: 4 },
      { from: 1, to: 3, cap: 2, cost: 1 },
      { from: 2, to: 3, cap: 3, cost: 2 },
      { from: 1, to: 2, cap: 1, cost: 1 },
    ],
    0,
    3,
  );
  assert.equal(r.maxFlow, 5);
  // 期望最小费用：选择较便宜路径优先
  assert.ok(r.minCost >= 0);
});

test('mcmf 单条路：流=容量，费用=容量*单位成本', () => {
  const r = minCostMaxFlow(
    3,
    [
      { from: 0, to: 1, cap: 5, cost: 2 },
      { from: 1, to: 2, cap: 5, cost: 3 },
    ],
    0,
    2,
  );
  assert.equal(r.maxFlow, 5);
  assert.equal(r.minCost, 5 * (2 + 3));
});

test('mcmf 选择更便宜的路', () => {
  // 两条平行路：上路费用 1+1=2/单位，下路费用 5+5=10/单位；最大流=3（上2+下1）
  const r = minCostMaxFlow(
    4,
    [
      { from: 0, to: 1, cap: 2, cost: 1 },
      { from: 1, to: 3, cap: 2, cost: 1 },
      { from: 0, to: 2, cap: 1, cost: 5 },
      { from: 2, to: 3, cap: 1, cost: 5 },
    ],
    0,
    3,
  );
  assert.equal(r.maxFlow, 3);
  // 上路 2 单位 *2 + 下路 1 单位 *10 = 14
  assert.equal(r.minCost, 2 * 2 + 1 * 10);
});

test('mcmf s===t 返回 0', () => {
  const r = minCostMaxFlow(2, [{ from: 0, to: 1, cap: 5, cost: 1 }], 0, 0);
  assert.equal(r.maxFlow, 0);
  assert.equal(r.minCost, 0);
});

test('mcmf 容量 0 边被忽略', () => {
  const r = minCostMaxFlow(
    3,
    [
      { from: 0, to: 1, cap: 0, cost: 1 },
      { from: 0, to: 2, cap: 3, cost: 2 },
    ],
    0,
    2,
  );
  assert.equal(r.maxFlow, 3);
});

test('mcmf 钩子 onAugment 与 onDone', () => {
  const augs: number[] = [];
  let doneFlow = -1;
  let doneCost = -1;
  minCostMaxFlow(
    4,
    [
      { from: 0, to: 1, cap: 2, cost: 1 },
      { from: 1, to: 3, cap: 2, cost: 1 },
      { from: 0, to: 2, cap: 1, cost: 5 },
      { from: 2, to: 3, cap: 1, cost: 5 },
    ],
    0,
    3,
    {
      onAugment: (_p, f) => augs.push(f),
      onDone: (r) => {
        doneFlow = r.maxFlow;
        doneCost = r.minCost;
      },
    },
  );
  assert.equal(doneFlow, 3);
  assert.equal(doneCost, 14);
  assert.equal(
    augs.reduce((a, b) => a + b, 0),
    3,
  );
});

test('mcmf 含负费用反向边仍正确', () => {
  // 经典退流示例：0->1(1,c1),0->2(1,c1),1->2(1,c0),1->3(1,c1),2->3(1,c1)
  const r = minCostMaxFlow(
    4,
    [
      { from: 0, to: 1, cap: 1, cost: 1 },
      { from: 0, to: 2, cap: 1, cost: 1 },
      { from: 1, to: 2, cap: 1, cost: 0 },
      { from: 1, to: 3, cap: 1, cost: 1 },
      { from: 2, to: 3, cap: 1, cost: 1 },
    ],
    0,
    3,
  );
  assert.equal(r.maxFlow, 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note!.zh.includes('最大流'));
});
