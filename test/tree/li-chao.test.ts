import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LiChaoTree,
  liChao,
  type Line,
  type LiChaoHooks,
} from '../../src/algorithms/tree/li-chao/impl.ts';

function bruteMax(lines: Line[], x: number): number {
  let best = -Infinity;
  for (const ln of lines) {
    const v = ln.m * x + ln.b;
    if (v > best) best = v;
  }
  return best;
}

test('li-chao 单条直线查询', () => {
  const t = new LiChaoTree(-5, 5);
  t.insert({ m: 2, b: 1 });
  assert.equal(t.query(0), 1);
  assert.equal(t.query(3), 7);
  assert.equal(t.query(-2), -3);
});

test('li-chao 多条直线与暴力一致', () => {
  const lines: Line[] = [
    { m: 1, b: 0 },
    { m: -1, b: 4 },
    { m: 0, b: 2 },
    { m: 2, b: -3 },
  ];
  const t = new LiChaoTree(-10, 10);
  for (const ln of lines) t.insert(ln);
  for (let x = -10; x <= 10; x++) {
    assert.equal(t.query(x), bruteMax(lines, x), `x=${x}`);
  }
});

test('li-chao 插入顺序无关', () => {
  const lines: Line[] = [
    { m: 1, b: 0 },
    { m: -1, b: 4 },
    { m: 0, b: 2 },
    { m: 3, b: -5 },
    { m: -2, b: 8 },
  ];
  const shuffled = [...lines].reverse();
  const t1 = new LiChaoTree(-8, 8);
  for (const ln of lines) t1.insert(ln);
  const t2 = new LiChaoTree(-8, 8);
  for (const ln of shuffled) t2.insert(ln);
  for (let x = -8; x <= 8; x++) {
    assert.equal(t1.query(x), t2.query(x), `x=${x}`);
    assert.equal(t1.query(x), bruteMax(lines, x), `brute x=${x}`);
  }
});

test('li-chao 便捷封装批量查询', () => {
  const result = liChao(
    -5,
    5,
    [
      { m: 1, b: 0 },
      { m: -1, b: 4 },
    ],
    [-4, 0, 4],
  );
  // x=-4: max(-4, 8)=8；x=0: max(0,4)=4；x=4: max(4, 0)=4
  assert.deepEqual(result, [8, 4, 4]);
});

test('li-chao hooks 被触发', () => {
  const inserts: Line[] = [];
  const compares: number[] = [];
  const querySteps: number[] = [];
  const hooks: LiChaoHooks = {
    onInsert: (ln) => inserts.push(ln),
    onCompare: (l, _r) => compares.push(l),
    onQueryStep: (l) => querySteps.push(l),
  };
  const t = new LiChaoTree(-5, 5, hooks);
  t.insert({ m: 1, b: 0 });
  t.insert({ m: -1, b: 4 });
  assert.equal(inserts.length, 2);
  // 至少发生一次中点比较
  assert.ok(compares.length >= 1);
  t.query(0);
  assert.ok(querySteps.length > 0);
});

test('li-chao 大量随机直线与暴力完全一致', () => {
  const lines: Line[] = [];
  for (let i = 0; i < 30; i++) {
    lines.push({
      m: Math.floor(Math.random() * 21) - 10,
      b: Math.floor(Math.random() * 41) - 20,
    });
  }
  const t = new LiChaoTree(-20, 20);
  for (const ln of lines) t.insert(ln);
  for (let x = -20; x <= 20; x++) {
    assert.equal(t.query(x), bruteMax(lines, x), `x=${x}`);
  }
});
