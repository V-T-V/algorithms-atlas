import { test } from 'node:test';
import assert from 'node:assert/strict';
import { circulation, feasibleCirculation } from '../../src/algorithms/network/circulation/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/network/circulation/trace.ts';

test('circulation 简单环可行', () => {
  assert.equal(
    circulation(3, [
      { from: 0, to: 1, lo: 1, hi: 3 },
      { from: 1, to: 2, lo: 2, hi: 4 },
      { from: 2, to: 0, lo: 1, hi: 3 },
    ]),
    true,
  );
});

test('circulation 下界过紧不可行', () => {
  // 0->1 lo=5 hi=5, 1->0 lo=1 hi=3：节点 0 出 5 入最多 3，不平衡
  assert.equal(
    circulation(2, [
      { from: 0, to: 1, lo: 5, hi: 5 },
      { from: 1, to: 0, lo: 1, hi: 3 },
    ]),
    false,
  );
});

test('circulation 两条平行边可行', () => {
  assert.equal(
    circulation(2, [
      { from: 0, to: 1, lo: 1, hi: 2 },
      { from: 1, to: 0, lo: 1, hi: 2 },
    ]),
    true,
  );
});

test('circulation 下界 = 上界（强制流量）', () => {
  // 3 节点环，每条边恰好 2
  assert.equal(
    circulation(3, [
      { from: 0, to: 1, lo: 2, hi: 2 },
      { from: 1, to: 2, lo: 2, hi: 2 },
      { from: 2, to: 0, lo: 2, hi: 2 },
    ]),
    true,
  );
});

test('circulation 单节点恒可行', () => {
  assert.equal(circulation(1, []), true);
});

test('circulation n<=0 可行', () => {
  assert.equal(circulation(0, []), true);
});

test('circulation 非法边（hi<lo）不可行', () => {
  assert.equal(circulation(2, [{ from: 0, to: 1, lo: 5, hi: 3 }]), false);
});

test('circulation 较大可行（固定布局）', () => {
  // 4 节点环
  assert.equal(
    circulation(4, [
      { from: 0, to: 1, lo: 1, hi: 5 },
      { from: 1, to: 2, lo: 1, hi: 5 },
      { from: 2, to: 3, lo: 1, hi: 5 },
      { from: 3, to: 0, lo: 1, hi: 5 },
    ]),
    true,
  );
});

test('circulation 钩子触发', () => {
  let demand = -1;
  let result = null as boolean | null;
  circulation(
    3,
    [
      { from: 0, to: 1, lo: 1, hi: 3 },
      { from: 1, to: 2, lo: 2, hi: 4 },
      { from: 2, to: 0, lo: 1, hi: 3 },
    ],
    {
      onSuperGraph: (_ss, _tt, t) => (demand = t),
      onResult: (ok) => (result = ok),
    },
  );
  assert.ok(demand >= 0);
  assert.equal(result, true);
});

test('feasibleCirculation 返回各边流量满足守恒', () => {
  const flows = feasibleCirculation(3, [
    { from: 0, to: 1, lo: 1, hi: 3 },
    { from: 1, to: 2, lo: 2, hi: 4 },
    { from: 2, to: 0, lo: 1, hi: 3 },
  ]);
  assert.ok(flows !== null);
  // 验证守恒
  const inDeg = new Array(3).fill(0);
  const outDeg = new Array(3).fill(0);
  for (const f of flows!) {
    outDeg[f.from] += f.flow;
    inDeg[f.to] += f.flow;
  }
  for (let i = 0; i < 3; i++) assert.equal(inDeg[i], outDeg[i]);
});

test('feasibleCirculation 不可行返回 null', () => {
  assert.equal(
    feasibleCirculation(2, [
      { from: 0, to: 1, lo: 5, hi: 5 },
      { from: 1, to: 0, lo: 1, hi: 3 },
    ]),
    null,
  );
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note!.zh.includes('完成'));
});
