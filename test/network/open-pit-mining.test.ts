import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  openPitMining,
  type MineInput,
} from '../../src/algorithms/network/open-pit-mining/impl.ts';
import { buildTrace } from '../../src/algorithms/network/open-pit-mining/trace.ts';

test('opm 空输入利润为 0', () => {
  const r = openPitMining({ cols: 0, depths: [], weights: [] });
  assert.equal(r.maxProfit, 0);
  assert.equal(r.mined.length, 0);
});

test('opm 全负权：利润 0，不挖', () => {
  const input: MineInput = {
    cols: 1,
    depths: [3],
    weights: [-1, -2, -3],
  };
  const r = openPitMining(input);
  assert.equal(r.maxProfit, 0);
  assert.equal(r.mined.length, 0);
});

test('opm 单正块在地表：挖它', () => {
  const input: MineInput = {
    cols: 1,
    depths: [1],
    weights: [5],
  };
  const r = openPitMining(input);
  assert.equal(r.maxProfit, 5);
  assert.ok(r.mined.includes(0));
});

test('opm 深正块 + 负上块：净正则全挖', () => {
  const input: MineInput = {
    cols: 1,
    depths: [2],
    weights: [-2, 8],
  };
  const r = openPitMining(input);
  assert.equal(r.maxProfit, 6);
  assert.ok(r.mined.includes(0));
  assert.ok(r.mined.includes(1));
});

test('opm 深正块 + 极负上块：净负全不挖', () => {
  const input: MineInput = {
    cols: 1,
    depths: [2],
    weights: [-100, 8],
  };
  const r = openPitMining(input);
  assert.equal(r.maxProfit, 0);
  assert.equal(r.mined.length, 0);
});

test('opm 挖深层必须挖上层（依赖约束）', () => {
  const input: MineInput = {
    cols: 2,
    depths: [2, 2],
    weights: [-2, 8, 5, -1],
  };
  const r = openPitMining(input);
  const mined = new Set(r.mined);
  assert.ok(mined.has(0));
  assert.ok(mined.has(1));
  assert.ok(mined.has(2));
  if (mined.has(1)) assert.ok(mined.has(0));
});

test('opm 利润 = 正权和 − 最小割（不变式）', () => {
  const input: MineInput = {
    cols: 3,
    depths: [3, 3, 3],
    weights: [5, -2, 8, 3, -1, 6, -1, 4, 7],
  };
  const r = openPitMining(input);
  assert.equal(r.maxProfit, r.positiveSum - r.minCut);
});

test('opm 同输入结果可复现', () => {
  const input: MineInput = {
    cols: 2,
    depths: [2, 2],
    weights: [3, -1, 4, 2],
  };
  const r1 = openPitMining(input);
  const r2 = openPitMining(input);
  assert.equal(r1.maxProfit, r2.maxProfit);
  assert.deepEqual(r1.mined, r2.mined);
});

test('opm buildTrace 生成非空帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 0);
});

test('opm buildTrace 首帧显示矿体，末帧给出结果', () => {
  const frames = buildTrace();
  const first = frames[0]!;
  const last = frames[frames.length - 1]!;
  assert.ok(first.note?.zh.includes('矿体'));
  assert.ok(last.note?.zh.includes('完成'));
});

test('opm buildTrace 含建图帧', () => {
  const frames = buildTrace();
  const allZh = frames.map((f) => f.note?.zh ?? '').join('\n');
  assert.ok(allZh.includes('建闭合子图网络'));
});
