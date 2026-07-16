import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ppmStar, toCodePoints } from '../../src/algorithms/compression/ppm-star/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/compression/ppm-star/trace.ts';

test('ppm-star 概率在 (0,1]', () => {
  const { steps } = ppmStar('AABABC');
  for (const s of steps) {
    assert.ok(s.probability > 0 && s.probability <= 1, `非法概率 ${s.probability}`);
    assert.ok(s.bits >= 0);
  }
});

test('ppm-star 首个符号必退避到 order=-1', () => {
  const { steps } = ppmStar('ABC');
  assert.equal(steps[0]!.order, -1);
});

test('ppm-star 重复符号编码概率递增（信息量递减）', () => {
  const { steps } = ppmStar('AAAAA');
  // 跳过首符号（未见，p=1，bits=0）；从第二个起，重复符号的编码 bits 应单调不增
  const tail = steps.slice(1);
  for (let i = 1; i < tail.length; i++) {
    assert.ok(
      tail[i]!.bits <= tail[i - 1]!.bits + 1e-9,
      `bits 应递减：第 ${i + 1} 个 ${tail[i]!.bits} > 第 ${i} 个 ${tail[i - 1]!.bits}`,
    );
  }
  // 最后一个重复符号的 bits 应严格小于第二个（信息量确实在减少）
  assert.ok(
    tail[tail.length - 1]!.bits < tail[0]!.bits,
    `末符号 bits ${tail[tail.length - 1]!.bits} 应小于第二个 ${tail[0]!.bits}`,
  );
});

test('ppm-star 空输入', () => {
  const { steps, totalBits } = ppmStar('');
  assert.deepEqual(steps, []);
  assert.equal(totalBits, 0);
});

test('ppm-star totalBits = sum(bits)', () => {
  const { steps, totalBits } = ppmStar('AABABC');
  const sum = steps.reduce((a, s) => a + s.bits, 0);
  assert.ok(Math.abs(sum - totalBits) < 1e-9);
});

test('ppm-star toCodePoints', () => {
  assert.deepEqual(toCodePoints('AB'), [65, 66]);
});

test('ppm-star 钩子被调用', () => {
  const preds: number[] = [];
  ppmStar('AAB', 2, { onPredict: (p) => preds.push(p) });
  assert.equal(preds.length, 3);
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
});
