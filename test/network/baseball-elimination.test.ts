import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  baseballElimination,
  findAllEliminated,
  type BaseballInput,
} from '../../src/algorithms/network/baseball-elimination/impl.ts';
import { buildTrace } from '../../src/algorithms/network/baseball-elimination/trace.ts';

const SAMPLE: BaseballInput = {
  teams: [
    { name: 'A', wins: 75, remaining: 28 },
    { name: 'B', wins: 71, remaining: 28 },
    { name: 'C', wins: 69, remaining: 28 },
    { name: 'D', wins: 63, remaining: 28 },
  ],
  games: [
    [0, 1, 6, 1],
    [1, 0, 0, 0],
    [6, 0, 0, 1],
    [1, 0, 1, 0],
  ],
};

test('be trivial 淘汰：对手当前胜场 > 候选最大胜场', () => {
  const input: BaseballInput = {
    teams: [
      { name: 'A', wins: 100, remaining: 0 },
      { name: 'B', wins: 50, remaining: 10 },
    ],
    games: [
      [0, 0],
      [0, 0],
    ],
  };
  const r = baseballElimination(input, 1);
  assert.equal(r.eliminated, true);
  assert.equal(r.trivialBy, 0);
});

test('be 样例中 D 被淘汰', () => {
  const r = baseballElimination(SAMPLE, 3);
  assert.equal(r.eliminated, true);
});

test('be 样例中 A（领头）未被淘汰', () => {
  const r = baseballElimination(SAMPLE, 0);
  assert.equal(r.eliminated, false);
});

test('be 未淘汰时 maxFlow == totalGames', () => {
  const r = baseballElimination(SAMPLE, 0);
  if (!r.eliminated) {
    assert.equal(r.maxFlow, r.totalGames);
  }
});

test('be 非平凡淘汰时 certificate 非空', () => {
  const r = baseballElimination(SAMPLE, 3);
  if (r.eliminated && r.trivialBy === undefined) {
    assert.ok(r.certificate);
    assert.ok(r.certificate!.length > 0);
  }
});

test('be findAllEliminated 返回合法索引数组', () => {
  const eliminated = findAllEliminated(SAMPLE);
  assert.ok(Array.isArray(eliminated));
  for (const i of eliminated) {
    assert.ok(i >= 0 && i < SAMPLE.teams.length);
  }
});

test('be 两队 trivial：领先队不被淘汰', () => {
  const input: BaseballInput = {
    teams: [
      { name: 'A', wins: 100, remaining: 0 },
      { name: 'B', wins: 50, remaining: 10 },
    ],
    games: [
      [0, 0],
      [0, 0],
    ],
  };
  const r = baseballElimination(input, 0);
  assert.equal(r.eliminated, false);
});

test('be buildTrace 生成非空帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 0);
});

test('be buildTrace 首帧显示球队，末帧给出结论', () => {
  const frames = buildTrace();
  const first = frames[0]!;
  const last = frames[frames.length - 1]!;
  assert.ok(first.note?.zh.includes('球队数据'));
  assert.ok(last.note?.zh.includes('结论'));
});
