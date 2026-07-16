import { test } from 'node:test';
import assert from 'node:assert/strict';
import { burstBalloons } from '../../src/algorithms/dp/burst-balloons/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/burst-balloons/trace.ts';

test('burst-balloons 经典用例', () => {
  // [3,1,5,8] -> 戳 1 (3*1*5=15) -> 戳 5 (3*5*8=120) -> 戳 3 (1*3*8=24) -> 戳 8 (1*8*1=8) = 167
  assert.equal(burstBalloons([3, 1, 5, 8]), 167);
  assert.equal(burstBalloons([1, 5]), 10);
  assert.equal(burstBalloons([9]), 9);
});

test('burst-balloons 边界', () => {
  assert.equal(burstBalloons([]), 0);
});

test('burst-balloons 钩子被调用', () => {
  let choices = 0;
  let fills = 0;
  burstBalloons([3, 1, 5, 8], {
    onChooseLast: () => choices++,
    onFillCell: () => fills++,
  });
  assert.ok(choices > 0, '应枚举最后戳的气球');
  assert.ok(fills > 0, '应填若干 dp 单元');
});

test('burst-balloons buildTrace 产出帧且末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.note?.zh.includes('最大硬币数'));
  assert.equal(last.aux?.[0]?.role, 'final');
});
