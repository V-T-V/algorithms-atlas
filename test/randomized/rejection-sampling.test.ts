import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  sampleOne,
  sampleMany,
  acceptanceRate,
  makeRng,
} from '../../src/algorithms/randomized/rejection-sampling/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/rejection-sampling/trace.ts';

test('rejection-sampling sampleOne 返回有效下标', () => {
  const rng = makeRng(1);
  const x = sampleOne([1, 2, 3, 2, 1], rng);
  assert.ok(x >= 0 && x < 5);
});

test('rejection-sampling 采样分布近似密度比例', () => {
  const density = [1, 2, 3, 4, 5, 4, 3, 2, 1];
  const rng = makeRng(7);
  const counts = sampleMany(density, 20000, rng);
  const total = counts.reduce((a, b) => a + b, 0);
  const sumDensity = density.reduce((a, b) => a + b, 0);
  // 检查中点（密度最大）频率最高
  const midFreq = counts[4]! / total;
  const expectedMid = density[4]! / sumDensity;
  assert.ok(
    Math.abs(midFreq - expectedMid) < 0.03,
    `中点频率 ${midFreq.toFixed(3)} 偏离期望 ${expectedMid.toFixed(3)}`,
  );
});

test('rejection-sampling 均匀密度产生近似均匀分布', () => {
  const density = [5, 5, 5, 5];
  const rng = makeRng(11);
  const counts = sampleMany(density, 8000, rng);
  // 每个应接近 25%
  for (const c of counts) {
    const freq = c / 8000;
    assert.ok(freq > 0.2 && freq < 0.3, `频率 ${freq} 偏离 0.25`);
  }
});

test('rejection-sampling 零密度项永不被采样', () => {
  const density = [0, 0, 5, 0, 0];
  const rng = makeRng(3);
  const counts = sampleMany(density, 1000, rng);
  assert.equal(counts[2], 1000);
  assert.equal(counts[0], 0);
});

test('rejection-sampling 全零密度抛错', () => {
  assert.throws(() => sampleOne([0, 0, 0]));
});

test('rejection-sampling 空数组抛错', () => {
  assert.throws(() => sampleOne([]));
});

test('rejection-sampling 负密度抛错', () => {
  assert.throws(() => sampleOne([1, -1, 2]));
});

test('rejection-sampling 接受率 ∈ (0,1]', () => {
  const density = [1, 2, 3, 2, 1];
  const rate = acceptanceRate(density, 5000, makeRng(99));
  assert.ok(rate > 0 && rate <= 1, `接受率 ${rate} 越界`);
});

test('rejection-sampling makeRng 确定性', () => {
  const a = makeRng(5);
  const b = makeRng(5);
  assert.equal(a(), b());
});

test('rejection-sampling 钩子 onTry/onAccept/onReject 触发', () => {
  let tries = 0;
  let accepts = 0;
  let rejects = 0;
  const rng = makeRng(13);
  sampleMany([1, 3, 1], 50, rng, {
    onTry: () => tries++,
    onAccept: () => accepts++,
    onReject: () => rejects++,
  });
  assert.equal(accepts, 50);
  assert.ok(tries >= 50);
  assert.ok(rejects >= 0);
  assert.equal(tries, accepts + rejects);
});

test('rejection-sampling 单点密度（峰值）总被接受', () => {
  const density = [0, 0, 10, 0, 0];
  const rng = makeRng(2);
  // 由于其他位置密度为0，只会接受 x=2
  for (let i = 0; i < 100; i++) {
    assert.equal(sampleOne(density, rng), 2);
  }
});

test('buildTrace 含 bars，末帧含总采样', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.bars, '首帧含 bars');
  const last = frames[frames.length - 1]!;
  const tot = last.aux!.find((e) => e.label === '总采样');
  assert.ok(tot, '末帧应含总采样');
  assert.ok(Number(tot!.value) > 0);
});
