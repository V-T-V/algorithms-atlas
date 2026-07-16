import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eggDrop } from '../../src/algorithms/dp/egg-drop/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/egg-drop/trace.ts';

test('egg-drop 经典值', () => {
  // 1 个鸡蛋只能线性试：n 层要 n 次
  assert.equal(eggDrop(1, 100), 100);
  // 2 个鸡蛋、100 层：14 次（三角数 14*15/2=105>=100）
  assert.equal(eggDrop(2, 100), 14);
  // 3 个鸡蛋、100 层：9 次
  assert.equal(eggDrop(3, 100), 9);
});

test('egg-drop 边界', () => {
  assert.equal(eggDrop(2, 0), 0);
  assert.equal(eggDrop(2, 1), 1);
  assert.equal(eggDrop(5, 1), 1);
});

test('egg-drop 单调性：鸡蛋越多，次数不增', () => {
  for (let n = 1; n <= 200; n += 7) {
    const prev = eggDrop(1, n);
    for (let k = 2; k <= 8; k++) {
      const cur = eggDrop(k, n);
      assert.ok(cur <= prev, `eggDrop(${k},${n})=${cur} 应 <= ${prev}`);
    }
  }
});

test('egg-drop 钩子被调用', () => {
  let steps = 0;
  let found = 0;
  eggDrop(2, 100, {
    onStep: () => steps++,
    onFound: () => found++,
  });
  assert.ok(steps > 0);
  assert.equal(found, 1);
});

test('egg-drop buildTrace 产出帧且末帧为 final', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
