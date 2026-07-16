import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shortestProcessingTime } from '../../src/algorithms/scheduling/shortest-remaining-time/impl.ts';
import { buildTrace } from '../../src/algorithms/scheduling/shortest-remaining-time/trace.ts';

test('shortestProcessingTime 选最短 burst', () => {
  const r = shortestProcessingTime([
    { id: 'P1', arrival: 0, burst: 7 },
    { id: 'P2', arrival: 0, burst: 4 },
    { id: 'P3', arrival: 0, burst: 1 },
  ]);
  // 全 t=0 到达 → P3(1) → P2(4) → P1(7)
  assert.deepEqual(
    r.stats.map((s) => s.id),
    ['P3', 'P2', 'P1'],
  );
});

test('shortestProcessingTime 非抢占：不中断', () => {
  const r = shortestProcessingTime([
    { id: 'P1', arrival: 0, burst: 5 },
    { id: 'P2', arrival: 1, burst: 1 },
  ]);
  // P1 先开始（t=0），即使 P2 burst 更短也不抢占
  const p1 = r.stats.find((s) => s.id === 'P1')!;
  assert.equal(p1.start, 0);
  assert.equal(p1.completion, 5);
  const p2 = r.stats.find((s) => s.id === 'P2')!;
  assert.equal(p2.start, 5);
});

test('shortestProcessingTime 最小化平均等待（同时到达）', () => {
  const r = shortestProcessingTime([
    { id: 'A', arrival: 0, burst: 3 },
    { id: 'B', arrival: 0, burst: 1 },
    { id: 'C', arrival: 0, burst: 2 },
  ]);
  // 顺序 B(1)→C(2)→A(3)：等待 0,1,3 → 均 4/3
  assert.ok(r.avgWait <= 2);
});

test('shortestProcessingTime CPU 空闲跳到下个到达', () => {
  const r = shortestProcessingTime([
    { id: 'A', arrival: 0, burst: 2 },
    { id: 'B', arrival: 5, burst: 1 },
  ]);
  const b = r.stats.find((s) => s.id === 'B')!;
  assert.equal(b.start, 5);
  assert.equal(b.wait, 0);
});

test('shortestProcessingTime 平局按到达再按 id', () => {
  const r = shortestProcessingTime([
    { id: 'Z', arrival: 0, burst: 2 },
    { id: 'A', arrival: 0, burst: 2 },
  ]);
  assert.deepEqual(
    r.stats.map((s) => s.id),
    ['A', 'Z'],
  );
});

test('shortestProcessingTime 空输入', () => {
  const r = shortestProcessingTime([]);
  assert.deepEqual(r.stats, []);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
