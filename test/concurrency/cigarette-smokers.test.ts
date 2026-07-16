import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  simulateSmokers,
  pickSmoker,
  SMOKER_HAS,
} from '../../src/algorithms/concurrency/cigarette-smokers/impl.ts';
import {
  buildTrace,
  DEFAULT_OFFERS,
} from '../../src/algorithms/concurrency/cigarette-smokers/trace.ts';

test('smokers 放 T+P → 抽烟者 2（有 M）行动', () => {
  assert.equal(pickSmoker(['tobacco', 'paper']), 2);
});

test('smokers 放 T+M → 抽烟者 1（有 P）行动', () => {
  assert.equal(pickSmoker(['tobacco', 'matches']), 1);
});

test('smokers 放 P+M → 抽烟者 0（有 T）行动', () => {
  assert.equal(pickSmoker(['paper', 'matches']), 0);
});

test('smokers 每轮行动者拥有第三种原料', () => {
  const steps = simulateSmokers(DEFAULT_OFFERS);
  for (const s of steps) {
    const offered = new Set(s.offer);
    assert.ok(!offered.has(s.has), '行动者拥有的原料不应在桌上');
  }
});

test('smokers 钩子 onOffer/onSmoke/onFinish', () => {
  const offers: Array<[string, string]> = [];
  const smokers: number[] = [];
  const finishes: number[] = [];
  simulateSmokers(
    [
      ['tobacco', 'paper'],
      ['paper', 'matches'],
    ],
    {
      onOffer: (o) => offers.push([o[0], o[1]]),
      onSmoke: (s) => smokers.push(s),
      onFinish: (s) => finishes.push(s),
    },
  );
  assert.equal(offers.length, 2);
  assert.deepEqual(smokers, [2, 0]);
  assert.deepEqual(finishes, [2, 0]);
});

test('smokers 空序列无步骤', () => {
  assert.equal(simulateSmokers([]).length, 0);
});

test('smokers 步骤数 = offer 数', () => {
  assert.equal(simulateSmokers(DEFAULT_OFFERS).length, DEFAULT_OFFERS.length);
});

test('smokers SMOKER_HAS 正确映射', () => {
  assert.equal(SMOKER_HAS[0], 'tobacco');
  assert.equal(SMOKER_HAS[1], 'paper');
  assert.equal(SMOKER_HAS[2], 'matches');
});

test('smokers 多轮相同 offer 都正确', () => {
  const steps = simulateSmokers([
    ['tobacco', 'paper'],
    ['tobacco', 'paper'],
  ]);
  assert.equal(steps[0]!.smoker, 2);
  assert.equal(steps[1]!.smoker, 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_OFFERS);
  assert.ok(frames.length >= 3);
});
