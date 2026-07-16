import { test } from 'node:test';
import assert from 'node:assert/strict';
import { imageSegmentation } from '../../src/algorithms/network/image-segmentation/impl.ts';
import { buildTrace } from '../../src/algorithms/network/image-segmentation/trace.ts';

test('seg 零像素返回空', () => {
  const labels = imageSegmentation({ rows: 0, cols: 0, pixels: [] });
  assert.equal(labels.length, 0);
});

test('seg 前景种子强制标 1', () => {
  const pixels = [220, 230, 60, 50];
  const labels = imageSegmentation({
    rows: 2,
    cols: 2,
    pixels,
    fgSeeds: [0],
    bgSeeds: [3],
    sigma: 30,
    lambda: 2,
  });
  assert.equal(labels[0], 1);
});

test('seg 背景种子强制标 0', () => {
  const pixels = [220, 230, 60, 50];
  const labels = imageSegmentation({
    rows: 2,
    cols: 2,
    pixels,
    fgSeeds: [0],
    bgSeeds: [3],
    sigma: 30,
    lambda: 2,
  });
  assert.equal(labels[3], 0);
});

test('seg 亮块（左上）与暗块（右下）被分开', () => {
  const pixels = [220, 230, 210, 60, 225, 215, 70, 55, 200, 65, 50, 40, 70, 55, 45, 35];
  const labels = imageSegmentation({
    rows: 4,
    cols: 4,
    pixels,
    fgSeeds: [0],
    bgSeeds: [15],
    sigma: 30,
    lambda: 2,
  });
  assert.equal(labels[0], 1);
  assert.equal(labels[15], 0);
});

test('seg 每个像素标签为 0 或 1', () => {
  const pixels = [200, 100, 80, 60];
  const labels = imageSegmentation({
    rows: 2,
    cols: 2,
    pixels,
    fgSeeds: [0],
    bgSeeds: [3],
    sigma: 20,
    lambda: 1,
  });
  for (const l of labels) {
    assert.ok(l === 0 || l === 1);
  }
});

test('seg 无种子也返回合法 0/1 标签', () => {
  const pixels = [200, 100, 90, 60];
  const labels = imageSegmentation({
    rows: 2,
    cols: 2,
    pixels,
    sigma: 25,
    lambda: 1,
  });
  assert.equal(labels.length, 4);
  for (const l of labels) {
    assert.ok(l === 0 || l === 1);
  }
});

test('seg buildTrace 生成非空帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 0);
});

test('seg buildTrace 含建图与最小割帧', () => {
  const frames = buildTrace();
  const allZh = frames.map((f) => f.note?.zh ?? '').join('\n');
  assert.ok(allZh.includes('建图'));
  assert.ok(allZh.includes('最小割'));
});

test('seg buildTrace 末帧报告前景/背景数', () => {
  const frames = buildTrace();
  const last = frames[frames.length - 1]!;
  assert.ok(last.note?.zh.includes('完成'));
});
